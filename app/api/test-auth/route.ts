// app/api/test-auth/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "@/app/lib/prisma";

function getJWTSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("Missing JWT_SECRET environment variable");
  }
  return secret;
}

// GET /api/test-auth?email=xxx&password=xxx でテスト可能
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email") || "sato@example.com";
    const password = searchParams.get("password") || "password123";

    console.log(`[TEST-AUTH] Testing with email: ${email}`);

    // 環境変数チェック
    const envCheck = {
      JWT_SECRET: !!process.env.JWT_SECRET,
      DATABASE_URL: !!process.env.DATABASE_URL,
      NODE_ENV: process.env.NODE_ENV,
    };
    console.log('[TEST-AUTH] Environment variables:', envCheck);

    // JWT_SECRET テスト
    try {
      const secret = getJWTSecret();
      console.log('[TEST-AUTH] JWT_SECRET length:', secret.length);
    } catch (jwtSecretError) {
      console.error('[TEST-AUTH] JWT_SECRET Error:', jwtSecretError);
      return NextResponse.json({
        error: "JWT_SECRET failed",
        details: jwtSecretError instanceof Error ? jwtSecretError.message : String(jwtSecretError),
        envCheck
      }, { status: 500 });
    }

    // データベース接続テスト
    try {
      const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true, email: true, hashedPassword: true },
      });
      console.log(`[TEST-AUTH] User found: ${!!user}, hasPassword: ${!!user?.hashedPassword}`);

      if (!user || !user.hashedPassword) {
        return NextResponse.json({
          error: "User not found or no password",
          envCheck,
          userFound: !!user,
          hasPassword: !!user?.hashedPassword
        }, { status: 401 });
      }

      // bcrypt テスト
      try {
        const match = await bcrypt.compare(password, user.hashedPassword);
        console.log('[TEST-AUTH] Password match:', match);

        if (!match) {
          return NextResponse.json({
            error: "Password mismatch",
            envCheck,
            userFound: true,
            hasPassword: true,
            passwordMatch: false
          }, { status: 401 });
        }

        // JWT生成テスト
        try {
          const secret = getJWTSecret();
          const token = jwt.sign({ userId: user.id, email: user.email }, secret, {
            expiresIn: "1d",
          });
          console.log('[TEST-AUTH] JWT token generated successfully, length:', token.length);

          return NextResponse.json({
            success: true,
            message: "All tests passed",
            envCheck,
            userFound: true,
            hasPassword: true,
            passwordMatch: true,
            jwtGenerated: true,
            tokenLength: token.length
          }, { status: 200 });
        } catch (jwtError) {
          console.error('[TEST-AUTH] JWT generation error:', jwtError);
          return NextResponse.json({
            error: "JWT generation failed",
            details: jwtError instanceof Error ? jwtError.message : String(jwtError),
            envCheck,
            userFound: true,
            hasPassword: true,
            passwordMatch: true
          }, { status: 500 });
        }

      } catch (bcryptError) {
        console.error('[TEST-AUTH] bcrypt error:', bcryptError);
        return NextResponse.json({
          error: "bcrypt failed",
          details: bcryptError instanceof Error ? bcryptError.message : String(bcryptError),
          envCheck,
          userFound: true,
          hasPassword: true
        }, { status: 500 });
      }

    } catch (dbError) {
      console.error('[TEST-AUTH] Database error:', dbError);
      return NextResponse.json({
        error: "Database connection failed",
        details: dbError instanceof Error ? dbError.message : String(dbError),
        envCheck
      }, { status: 500 });
    }

  } catch (error) {
    console.error('[TEST-AUTH] General error:', error);
    return NextResponse.json({
      error: "General error",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}