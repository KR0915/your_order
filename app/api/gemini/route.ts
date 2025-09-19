import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  const { historyText } = await req.json();

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `あなたの今日のご飯は〇〇です！の形式で以下の回答履歴を元に提案してください。\n\n${historyText}`;

    const result = await model.generateContent(prompt);
    return NextResponse.json({ text: result.response.text().trim() });
  } catch (error) {
    console.error("Gemini API error:", error);
    return NextResponse.json({ error: "Gemini API呼び出し失敗" }, { status: 500 });
  }
}
