// app/api/consumption/[date]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { getUserFromRequest } from '@/app/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { date: string } }
) {
  // 認証チェック
  const authUser = await getUserFromRequest(req);
  if (!authUser) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const { date } = params;
  // 日付文字列から当日の範囲を生成
  const start = new Date(`${date}T00:00:00.000Z`);
  const end = new Date(`${date}T23:59:59.999Z`);

  // 指定ユーザー・指定日の消費記録を取得
  const recordsWithRecipe = await prisma.consumption.findMany({
    where: {
      userId: authUser.id,
      consumedAt: { gte: start, lte: end },
      quantity: { gt: 0 }, // 量が0より大きいものだけ取得
    },
    include: {
      recipe: {
        select: {
          calorie: true,
          name: true, // レシピ名を取得
        },
      },
    },
    orderBy: { consumedAt: 'asc' },
  });

  const records = recordsWithRecipe.map(r => ({
    id: r.id,
    userId: r.userId,
    recipeId: r.recipeId,
    quantity: r.quantity,
    consumedAt: r.consumedAt,
    recipeName: r.recipe?.name ?? null, // レシピ名を追加
  }));


  // 合計カロリーを計算
  const totalCalories = recordsWithRecipe.reduce(
    (sum, r) => sum + r.quantity * (r.recipe.calorie ?? 0),
    0
  );

  return NextResponse.json({ records, totalCalories });
}
