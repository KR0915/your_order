// app/api/user/profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { getUserFromRequest } from "@/app/lib/auth";
import bcrypt from "bcryptjs";

// ユーザープロフィール取得
export async function GET(req: NextRequest) {
  const authUser = await getUserFromRequest(req);
  if (!authUser) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: authUser.id },
    select: { name: true, email: true, hashedPassword: true,targetCal: true },
  });
  if (!user) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  return NextResponse.json({ user }, { status: 200 });
}

// ユーザー情報編集（パスワード変更対応）
export async function PUT(req: NextRequest) {
  const authUser = await getUserFromRequest(req);
  if (!authUser) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { name, email, targetCal, newPassword } = await req.json();
  if (!name || !email || typeof targetCal !== 'number') {
    return NextResponse.json({ error: "invalid input" }, { status: 400 });
  }

  const updateData: { name: string; email: string; targetCal: number; hashedPassword?: string } = { name, email, targetCal };
  if (newPassword && typeof newPassword === "string" && newPassword.length >= 8) {
    updateData.hashedPassword = await bcrypt.hash(newPassword, 10);
  }

  try {
    const updated = await prisma.user.update({
      where: { id: authUser.id },
      data: updateData,
      select: { name: true, email: true, targetCal: true },
    });
    return NextResponse.json({ user: updated }, { status: 200 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'update failed';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

// ユーザー削除 (退会)
export async function DELETE(req: NextRequest) {
  const authUser = await getUserFromRequest(req);
  if (!authUser) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: authUser.id } });
    if (!user) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }

    await prisma.user.delete({ where: { id: authUser.id } });

    const res = NextResponse.json({ message: 'deleted' }, { status: 200 });
    res.headers.set('Set-Cookie', 'auth_token=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax');
    return res;
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'delete failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}