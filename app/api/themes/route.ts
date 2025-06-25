"use server"
import { PrismaClient } from '@/lib/generated/prisma';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const templateName = searchParams.get('name');

  if (!templateName) {
    return NextResponse.json({ error: 'Template name is required ' });
  }

  const theme = await prisma.theme.findUnique({
    where: { name: templateName },
    select: {
      id: true,
      name: true,
      primary: true,
      secondary: true,
      accent: true,
      background: true,
      text: true,
    },
  });

  if (!theme) {
    return NextResponse.json({ error: 'Theme not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, theme });
}
