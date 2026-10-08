import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { loginSchema } from '@/lib/validation';
import { verifyPassword, createSession } from '@/lib/auth';
import { checkRateLimit, rateLimitKey } from '@/lib/rate-limit';
import { getClientIp } from '@/lib/analytics';

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request.headers);
    const rateResult = await checkRateLimit({
      key: rateLimitKey(ip, 'login'),
      windowMs: 300000, // 5 minutes
      maxRequests: 10,
    });

    if (!rateResult.allowed) {
      return NextResponse.json(
        { success: false, error: "Too many login attempts. Try again in a few minutes." },
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

    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password.' },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const passwordValid = await verifyPassword(password, user.passwordHash);
    if (!passwordValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    await createSession(user.id);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
