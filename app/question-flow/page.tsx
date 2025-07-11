'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export interface Option { id: number; text: string; }
export interface Question { id: number; text: string; options: Option[]; }

const questions: Question[] = [
  { id: 1, text: 'お肉が食べたい気分？それとも魚が食べたい気分？', options: [{ id: 1, text: 'お肉！' }, { id: 2, text: '魚！' }] },
  { id: 2, text: '今日は日本料理の気分？それとも外国の料理の気分？', options: [{ id: 3, text: '日本料理' }, { id: 4, text: '外国の料理' }] },
  { id: 3, text: 'あっさりしたものが食べたい？それともこってりしたものが食べたい？', options: [{ id: 5, text: 'あっさり' }, { id: 6, text: 'こってり' }] },
  { id: 4, text: '温かいものが食べたい？それとも冷たいものが食べたい？', options: [{ id: 7, text: '温かいもの' }, { id: 8, text: '冷たいもの' }] },
  { id: 5, text: 'ご飯（主食）はしっかり食べたい？それとも軽めに済ませたい？', options: [{ id: 9, text: 'しっかり食べたい' }, { id: 10, text: '軽めに済ませたい' }] },
  { id: 6, text: '辛いものは好き？それとも苦手？', options: [{ id: 11, text: '辛いものが好き' }, { id: 12, text: '辛いものは苦手' }] }
];

type AnimStage = 'exit' | 'enter' | null;

export default function QuestionFlowPage() {
  const [currentId, setCurrentId] = useState<number>(1);
  const [history, setHistory] = useState<number[]>([]);
  const [animStage, setAnimStage] = useState<AnimStage>(null);
  const [key, setKey] = useState(0);
  const [finalNumber, setFinalNumber] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (finalNumber !== null) {
      router.push(`/question-flow/${finalNumber}`);
    }
  }, [finalNumber, router]);

  const question = questions.find((q) => q.id === currentId);
  if (!question) {
    return <div className="p-8 text-center text-orange-500">質問がありません。</div>;
  }

  const handleSelect = (_: Option, idx: number) => {
    if (animStage) return;
    const newHistory = [...history, idx];
    setHistory(newHistory);
    setAnimStage('exit');

    setTimeout(() => {
      const nextIdx = questions.findIndex((q) => q.id === currentId) + 1;
      const nextQ = questions[nextIdx];
      if (nextQ) {
        setCurrentId(nextQ.id);
        setKey((prev) => prev + 1);
        setAnimStage('enter');
        setTimeout(() => setAnimStage(null), 800);
      } else {
        const num = parseInt(newHistory.join(''), 2) + 1;
        setLoading(true);
        setFinalNumber(num);
        setAnimStage(null);
      }
    }, 800);
  };

  const handleBack = () => {
    if (animStage || history.length === 0) return;
    setAnimStage('exit');
    setTimeout(() => {
      const newHistory = history.slice(0, -1);
      setHistory(newHistory);
      setCurrentId(questions[newHistory.length].id);
      setKey((prev) => prev + 1);
      setAnimStage('enter');
      setTimeout(() => setAnimStage(null), 800);
    }, 800);
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: "url('/images/bg1.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <p className="text-white text-xl font-semibold animate-pulse bg-black bg-opacity-50 p-2 rounded">
          料理を選んでいます...
        </p>
      </div>
    );
  }

  const total = questions.length;
  const progress = Math.min(100, (history.length / total) * 100);

  return (
    <div
      className="relative min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: "url('/images/bg1.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="flex-1 flex items-center justify-center relative z-20">
        <div className="max-w-md w-full px-4">
          <div
            key={key}
            className={`bg-white/80 rounded-2xl shadow-lg p-6 border-2 border-orange-300 transition-transform ease-in-out ${
              animStage === 'exit'
                ? 'animate-slide-exit'
                : animStage === 'enter'
                ? 'animate-slide-enter'
                : ''
            }`}
            style={{ minHeight: 380 }}
          >
            <h1 className="text-2xl font-semibold text-orange-600 mb-4 text-center">
              今日のごはんは？
            </h1>
            <p className="text-lg text-orange-700 mb-4 text-center">
              {question.text}
            </p>
            {/* 選択ボタン */}
            <div className="flex flex-col space-y-4">
              {question.options.map((opt, idx) => (
                <button
                  key={opt.id}
                  onClick={() => handleSelect(opt, idx)}
                  className="w-full py-4 rounded-xl border-2 border-orange-400 bg-orange-100 hover:bg-orange-200 text-orange-700 font-bold text-lg transition shadow-md"
                >
                  {opt.text}
                </button>
              ))}
            </div>
            {/* 戻るボタン（カード下） */}
            {currentId > 1 && (
              <button
                onClick={handleBack}
                className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 text-sm font-semibold rounded shadow hover:bg-gray-300 transition"
              >
                ◀ 前に戻る
              </button>
            )}
          </div>
          {/* ゲージ枠 */}
          <div className="mt-4 bg-white rounded-lg p-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-orange-500 h-2 rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes slideExit {
          0% { transform: translateX(0); opacity: 1; }
          100% { transform: translateX(-100%); opacity: 0; }
        }
        @keyframes slideEnter {
          0% { transform: translateX(100%); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-exit { animation: slideExit 0.8s ease-in-out forwards; }
        .animate-slide-enter { animation: slideEnter 0.8s ease-in-out forwards; }
      `}</style>
    </div>
  );
}
