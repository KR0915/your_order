// ✅ app/api/gemini/route.ts (API Route側)
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export async function POST(req: Request) {
  const { historyText } = await req.json();

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `あなたは料理提案AIです。以下の質問履歴に基づき、「あなたの今日のご飯は〇〇です！」の形式で答えてください。\n\n${historyText}`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    return NextResponse.json({ text: response.text().trim() });
  } catch (error) {
    console.error("Gemini API error:", error);
    return NextResponse.json({ error: "Gemini API呼び出し失敗" }, { status: 500 });
  }
}