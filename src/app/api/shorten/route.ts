import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { validateUrl, shortenUrlSchema, isReservedAlias, validateAlias } from '@/lib/validation';
import { generateUniqueCode } from '@/lib/shortcode';
import { checkRateLimit, rateLimitKey } from '@/lib/rate-limit';
import { getClientIp } from '@/lib/analytics';
import { getSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // ─── Rate Limiting ──────────────────────────────
    const ip = getClientIp(request.headers);
    const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10);
    const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '10', 10);

    const rateResult = await checkRateLimit({
      key: rateLimitKey(ip, 'shorten'),
      windowMs,
      maxRequests,
    });

    if (!rateResult.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "You're moving a little fast. Try again shortly.",
        },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateResult.resetAt.getTime() - Date.now()) / 1000).toString(),
            'X-RateLimit-Remaining': '0',
          },
        }
      );
    }

    // ─── Parse & Validate Body ──────────────────────
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { success: false, error: 'Invalid request body.' },
        { status: 400 }
      );
    }

    const parsed = shortenUrlSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message || 'Invalid input.';
      return NextResponse.json(
        { success: false, error: firstError },
        { status: 400 }
      );
    }

    const { url, customAlias } = parsed.data;

    // ─── Server-side URL Validation ─────────────────
    const validation = validateUrl(url);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    const normalizedUrl = validation.url!;

    // ─── Get Session (optional) ─────────────────────
    const session = await getSession();
    const userId = session?.userId || null;

    // ─── Custom Alias Handling ──────────────────────
    let shortCode: string;

    if (customAlias) {
      const aliasValidation = validateAlias(customAlias);
      if (!aliasValidation.valid) {
        return NextResponse.json(
          { success: false, error: aliasValidation.error },
          { status: 400 }
        );
      }

      if (isReservedAlias(customAlias)) {
        return NextResponse.json(
          { success: false, error: 'This alias is reserved.' },
          { status: 400 }
        );
      }

      const existing = await prisma.link.findUnique({
        where: { shortCode: customAlias },
      });

      if (existing) {
        return NextResponse.json(
          { success: false, error: 'This alias is already taken.' },
          { status: 409 }
        );
      }

      shortCode = customAlias;
    } else {
      // ─── Generate Unique Code ───────────────────
      shortCode = await generateUniqueCode(async (code) => {
        const existing = await prisma.link.findUnique({
          where: { shortCode: code },
        });
        return !!existing;
      });
    }

    // ─── Create Link ────────────────────────────────
    const link = await prisma.link.create({
      data: {
        originalUrl: normalizedUrl,
        shortCode,
        customAlias: !!customAlias,
        userId,
      },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const shortUrl = `${appUrl}/${link.shortCode}`;

    return NextResponse.json(
      {
        success: true,
        shortUrl,
        code: link.shortCode,
        originalUrl: link.originalUrl,
        createdAt: link.createdAt,
      },
      {
        status: 201,
        headers: {
          'X-RateLimit-Remaining': rateResult.remaining.toString(),
        },
      }
    );
  } catch (error) {
    console.error('Shorten API error:', error);
    return NextResponse.json(
      { success: false, error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
