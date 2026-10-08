import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { validateAlias, isReservedAlias } from '@/lib/validation';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const alias = searchParams.get('alias');

  if (!alias) {
    return NextResponse.json({ available: false, error: 'No alias provided.' }, { status: 400 });
  }

  const validation = validateAlias(alias);
  if (!validation.valid) {
    return NextResponse.json({ available: false, error: validation.error });
  }

  if (isReservedAlias(alias)) {
    return NextResponse.json({ available: false, error: 'This alias is reserved.' });
  }

  const existing = await prisma.link.findUnique({
    where: { shortCode: alias },
  });

  return NextResponse.json({
    available: !existing,
    error: existing ? 'Already taken.' : undefined,
  });
}
