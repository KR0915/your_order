// app/services/geminiService.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export async function getRecommendationFromGemini(historyText: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  const prompt = `
あなたは料理提案AIです。以下の質問への回答履歴に基づいて、ユーザーに最適な料理名を1つ提案してください。
できるだけ自然な日本語で、「あなたの今日のご飯は〇〇です！」という形式で出力してください。

回答履歴: ${historyText}
`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  return response.text().trim();
}
