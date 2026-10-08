import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { signupSchema } from '@/lib/validation';
import { hashPassword, createSession } from '@/lib/auth';
import { checkRateLimit, rateLimitKey } from '@/lib/rate-limit';
import { getClientIp } from '@/lib/analytics';

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request.headers);
    const rateResult = await checkRateLimit({
      key: rateLimitKey(ip, 'signup'),
      windowMs: 3600000, // 1 hour
      maxRequests: 5,
    });

    if (!rateResult.allowed) {
      return NextResponse.json(
        { success: false, error: "You're moving a little fast. Try again later." },
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

    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message || 'Invalid input.';
      return NextResponse.json(
        { success: false, error: firstError },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;

    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists.' },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        passwordHash,
      },
    });

    await createSession(user.id);

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { success: false, error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
