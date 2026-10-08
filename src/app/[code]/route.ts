import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { parseUserAgent, getClientIp } from '@/lib/analytics';
import { RESERVED_ROUTES } from '@/lib/validation';

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  const { code } = params;

  // Don't handle reserved routes
  if (RESERVED_ROUTES.has(code.toLowerCase())) {
    return new NextResponse('Not Found', { status: 404 });
  }

  try {
    const link = await prisma.link.findUnique({
      where: { shortCode: code },
    });

    if (!link || !link.isActive) {
      return NextResponse.redirect(new URL('/?error=not-found', request.url), 302);
    }

    // Record click analytics asynchronously (don't block redirect)
    const enableAnalytics = process.env.ENABLE_ANALYTICS === 'true';
    if (enableAnalytics) {
      const ua = request.headers.get('user-agent');
      const referrer = request.headers.get('referer');
      const ip = getClientIp(request.headers);
      const { device, browser, os } = parseUserAgent(ua);

      // Fire and forget — don't await
      Promise.all([
        prisma.click.create({
          data: {
            linkId: link.id,
            referrer: referrer?.substring(0, 500) || null,
            userAgent: ua?.substring(0, 500) || null,
            ip: ip?.substring(0, 45) || null,
            device,
            browser,
            os,
          },
        }),
        prisma.link.update({
          where: { id: link.id },
          data: {
            clickCount: { increment: 1 },
            lastClickedAt: new Date(),
          },
        }),
      ]).catch((err) => {
        console.error('Analytics recording error:', err);
      });
    }

    // Use 302 (temporary) redirect so destination URLs can be changed later
    return NextResponse.redirect(link.originalUrl, 302);
  } catch (error) {
    console.error('Redirect error:', error);
    return NextResponse.redirect(new URL('/?error=not-found', request.url), 302);
  }
}
