// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import prisma from "@/app/lib/prisma";

// JWT_SECRETの取得をランタイムで行う

function getJWTSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("Missing JWT_SECRET environment variable");
  }
  return secret;
}

// POST /api/auth/login
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "invalid input" }, { status: 400 });
    }

    console.log(`[LOGIN] Attempting login for email: ${email}`);

    // email だけ select して余計なフィールド読み込みを防ぐ
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, hashedPassword: true },
    });

    console.log(`[LOGIN] User found: ${!!user}, hasPassword: ${!!user?.hashedPassword}`);

  // ユーザー不在 or hashedPassword=null は認証失敗
  if (!user || !user.hashedPassword) {
    return NextResponse.json({ error: "invalid credentials" }, { status: 401 });
  }

  // パスワード照合
  console.log('[LOGIN] Starting password comparison...');
  try {
    const match = await bcrypt.compare(password, user.hashedPassword);
    console.log('[LOGIN] Password comparison result:', match);
    if (!match) {
      return NextResponse.json({ error: "invalid credentials" }, { status: 401 });
    }
  } catch (bcryptError) {
    console.error('[LOGIN] bcrypt Error:', bcryptError);
    return NextResponse.json(
      { error: "Password comparison failed", details: bcryptError instanceof Error ? bcryptError.message : String(bcryptError) },
      { status: 500 }
    );
  }

  // JWT 発行＋クッキーにセット
  console.log('[LOGIN] About to generate JWT token...');
  
  try {
    const secret = getJWTSecret();
    console.log('[LOGIN] JWT_SECRET obtained successfully');
    
    const token = jwt.sign({ userId: user.id, email: user.email }, secret, {
      expiresIn: "1d",
    });
    console.log('[LOGIN] JWT token generated successfully');
    
    const cookie = serialize("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });
    console.log('[LOGIN] Cookie serialized successfully');

    return NextResponse.json(
      { message: "ok" },
      { status: 200, headers: { "Set-Cookie": cookie } }
    );
  } catch (jwtError) {
    console.error('[LOGIN] JWT Error:', jwtError);
    return NextResponse.json(
      { error: "JWT generation failed", details: jwtError instanceof Error ? jwtError.message : String(jwtError) },
      { status: 500 }
    );
  }
  } catch (error) {
    console.error('[LOGIN] Error:', error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// （任意）GET テスト用
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  const password = searchParams.get("password");

  if (!email || !password) {
    return NextResponse.json({ error: "invalid input" }, { status: 400 });
  }

  // 以下、POST と同じ認証ロジックを流用できます
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, hashedPassword: true },
  });
  if (!user || !user.hashedPassword) {
    return NextResponse.json({ error: "invalid credentials" }, { status: 401 });
  }
  const match = await bcrypt.compare(password, user.hashedPassword);
  if (!match) {
    return NextResponse.json({ error: "invalid credentials" }, { status: 401 });
  }
  const token = jwt.sign({ userId: user.id, email: user.email }, getJWTSecret(), {
    expiresIn: "1d",
  });
  const cookie = serialize("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });
  return NextResponse.json(
    { message: "ok" },
    { status: 200, headers: { "Set-Cookie": cookie } }
  );
}
