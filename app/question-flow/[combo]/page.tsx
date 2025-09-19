// ✅ app/question-flow/[combo]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { questions } from '@/app/constants/questions';
import { getRecommendationFromGemini } from '@/app/services/getRecommendationFromGemini';

export default function ResultPage() {
  const router = useRouter();
  const params = useParams();
  const rawCombo = params.combo;
  const combo = Array.isArray(rawCombo) ? rawCombo[0] : rawCombo;

  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const historyText = (() => {
    const bin = parseInt(combo).toString(2).padStart(6, '0');
    return bin
      .split('')
      .map((b, i) => `${questions[i].text} → ${questions[i].options[Number(b)].text}`)
      .join('\n');
  })();

  useEffect(() => {
    getRecommendationFromGemini(historyText)
      .then(setRecommendation)
      .catch(() => setError("Gemini APIの取得に失敗しました"))
      .finally(() => setLoading(false));
  }, [historyText]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat px-4 text-center" style={{ backgroundImage: "url('/images/bg1.jpg')" }}>
      <div className="bg-white bg-opacity-90 p-6 rounded-xl shadow-lg w-full max-w-lg">
        {loading ? (
          <p className="text-orange-600 text-xl animate-pulse">おすすめを考えています...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-orange-700 mb-4">{recommendation}</h1>
            
            {/* マップで探すボタンを追加 */}
            <div className="space-y-3 mt-4">
              <a 
                href={`/map?dish=${encodeURIComponent(recommendation || '')}`} 
                className="inline-block w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                🗺️ 地図でレストランを探す
              </a>
              
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(recommendation || '')}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-block w-full px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                📍 Googleマップで探す
              </a>
            </div>
            
            <button 
              onClick={() => router.push('/question-flow')} 
              className="mt-4 block mx-auto text-sm text-orange-700 underline hover:text-orange-900"
            >
              もう一度やってみる
            </button>
          </>
        )}
      </div>
    </div>
  );
}