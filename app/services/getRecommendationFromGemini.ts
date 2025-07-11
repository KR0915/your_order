// ✅ app/services/getRecommendationFromGemini.ts (クライアント用)
export async function getRecommendationFromGemini(historyText: string): Promise<string> {
  const res = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ historyText })
  });

  if (!res.ok) throw new Error("Gemini API呼び出し失敗");
  const data = await res.json();
  return data.text;
}
