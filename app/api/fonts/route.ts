import { NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const fonts = await prisma.font.findMany({
      select: {
        id: true,
        name: true,
        category: true,
        url: true,
        isDefault: true,
      },
      orderBy: { name: 'asc' },
    });
    return NextResponse.json({ success: true, fonts });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch fonts', error: (error as Error).message }, { status: 500 });
  }
}
