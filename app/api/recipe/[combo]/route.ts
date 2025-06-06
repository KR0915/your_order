// app/api/recipe/[combo]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';  // PrismaClient のインスタンス

export async function GET(
  req: Request,
  { params }: { params: { combo: string } }
) {
  const { combo } = params;
  const recipe = await prisma.recipe.findUnique({
    where: { combo },
  });

  if (!recipe) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(recipe);
}
