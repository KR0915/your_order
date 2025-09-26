// app/lib/auth.ts
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

function getJWTSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("Missing JWT_SECRET environment variable");
  }
  return secret;
}

export async function getUserFromRequest(req: NextRequest) {
  // App Router では req.headers.get でヘッダーを読む
  const cookie = req.headers.get("cookie") ?? "";
  const token = cookie
    .split("; ")
    .find((row) => row.startsWith("auth_token="))
    ?.split("=")[1];

  if (!token) return null;

  try {
    const payload = jwt.verify(token, getJWTSecret()) as { userId: number };
    return { id: payload.userId };
  } catch {
    return null;
  }
}
