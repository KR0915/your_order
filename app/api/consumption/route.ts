// app/api/consumption/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { getUserFromRequest } from "@/app/lib/auth";

type Body = {
  recipeId: number;
  quantity?: number;
  consumedAt?: string; // ISO 日時文字列
};

export async function POST(req: NextRequest) {
  // 1. 認証チェック
  const authUser = await getUserFromRequest(req);
  if (!authUser) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // 2. リクエストボディをパース
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }

  const { recipeId, quantity = 1, consumedAt } = body;
  if (typeof recipeId !== "number") {
    return NextResponse.json({ error: "recipeId is required and must be a number" }, { status: 400 });
  }

  // 3. 日時の検証／変換
  const consumedDate = consumedAt ? new Date(consumedAt) : new Date();
  if (isNaN(consumedDate.valueOf())) {
    return NextResponse.json({ error: "invalid consumedAt datetime" }, { status: 400 });
  }

  // 4. レコード作成
  const record = await prisma.consumption.create({
    data: {
      userId: authUser.id,
      recipeId,
      quantity,
      consumedAt: consumedDate,
    },
  });

  // 5. レスポンス
  return NextResponse.json({ record }, { status: 201 });
}
