import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { code } = params;

    const link = await prisma.link.findFirst({
      where: { shortCode: code, userId: session.userId },
    });

    if (!link) {
      return NextResponse.json({ success: false, error: 'Link not found.' }, { status: 404 });
    }

    // Get click analytics
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [clicksToday, clicksWeek, clicksMonth, topReferrers, devices, browsers, oses] =
      await Promise.all([
        prisma.click.count({ where: { linkId: link.id, createdAt: { gte: today } } }),
        prisma.click.count({ where: { linkId: link.id, createdAt: { gte: weekAgo } } }),
        prisma.click.count({ where: { linkId: link.id, createdAt: { gte: monthAgo } } }),
        prisma.click.groupBy({
          by: ['referrer'],
          where: { linkId: link.id, referrer: { not: null } },
          _count: true,
          orderBy: { _count: { referrer: 'desc' } },
          take: 10,
        }),
        prisma.click.groupBy({
          by: ['device'],
          where: { linkId: link.id, device: { not: null } },
          _count: true,
          orderBy: { _count: { device: 'desc' } },
        }),
        prisma.click.groupBy({
          by: ['browser'],
          where: { linkId: link.id, browser: { not: null } },
          _count: true,
          orderBy: { _count: { browser: 'desc' } },
        }),
        prisma.click.groupBy({
          by: ['os'],
          where: { linkId: link.id, os: { not: null } },
          _count: true,
          orderBy: { _count: { os: 'desc' } },
        }),
      ]);

    return NextResponse.json({
      success: true,
      link: {
        id: link.id,
        originalUrl: link.originalUrl,
        shortCode: link.shortCode,
        clickCount: link.clickCount,
        lastClickedAt: link.lastClickedAt,
        createdAt: link.createdAt,
      },
      analytics: {
        clicksToday,
        clicksWeek,
        clicksMonth,
        totalClicks: link.clickCount,
        topReferrers: topReferrers.map((r) => ({
          referrer: r.referrer || 'Direct',
          count: r._count,
        })),
        devices: devices.map((d) => ({ device: d.device, count: d._count })),
        browsers: browsers.map((b) => ({ browser: b.browser, count: b._count })),
        operatingSystems: oses.map((o) => ({ os: o.os, count: o._count })),
      },
    });
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { success: false, error: 'Something went wrong.' },
      { status: 500 }
    );
  }
}
