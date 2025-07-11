// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import { serialize } from "cookie";

// POST: 本番用ログアウト
export async function POST() {
  const cookie = serialize("auth_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: -1,
  });
  return NextResponse.json(
    { message: "logged out" },
    {
      status: 200,
      headers: { "Set-Cookie": cookie },
    }
  );
}
