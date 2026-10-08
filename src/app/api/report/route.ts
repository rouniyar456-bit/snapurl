import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { reportSchema } from '@/lib/validation';
import { checkRateLimit, rateLimitKey } from '@/lib/rate-limit';
import { getClientIp } from '@/lib/analytics';

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request.headers);
    const rateResult = await checkRateLimit({
      key: rateLimitKey(ip, 'report'),
      windowMs: 3600000, // 1 hour
      maxRequests: 5,
    });

    if (!rateResult.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many reports. Try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { success: false, error: 'Invalid request body.' },
        { status: 400 }
      );
    }

    const parsed = reportSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Please fill in all required fields.' },
        { status: 400 }
      );
    }

    const { linkId, reason, details } = parsed.data;

    const link = await prisma.link.findFirst({ 
      where: { 
        OR: [
          { id: linkId },
          { shortCode: linkId }
        ]
      } 
    });
    if (!link) {
      return NextResponse.json(
        { success: false, error: 'Link not found.' },
        { status: 404 }
      );
    }

    await prisma.report.create({
      data: { linkId, reason, details },
    });

    return NextResponse.json(
      { success: true, message: 'Report submitted. Thank you.' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Report API error:', error);
    return NextResponse.json(
      { success: false, error: 'Something went wrong.' },
      { status: 500 }
    );
  }
}
