import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/app/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, targetCal } = await req.json();

    // 必須チェック
    if (!name || !email || !password || typeof targetCal !== "number") {
      return NextResponse.json({ error: "invalid input" }, { status: 400 });
    }

    // 重複チェック（id のみ取得）
    const existing = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    if (existing) {
      return NextResponse.json({ error: "duplicate email" }, { status: 409 });
    }

    // パスワードをハッシュ化して保存
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, targetCal, hashedPassword },
      select: { id: true, name: true, email: true },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
