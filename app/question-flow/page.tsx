"use client";

import { useState } from 'react';

export interface Option { id: number; text: string; }
export interface Question { id: number; text: string; options: Option[] }

const questions: Question[] = [
  { id: 1, text: 'お肉が食べたい気分？それとも魚が食べたい気分？', options: [ { id: 1, text: 'お肉！' }, { id: 2, text: '魚！' } ] },
  { id: 2, text: '今日は日本料理の気分？それとも外国の料理の気分？', options: [ { id: 3, text: '日本料理' }, { id: 4, text: '外国の料理' } ] },
  { id: 3, text: 'あっさりしたものが食べたい？それともこってりしたものが食べたい？', options: [ { id: 5, text: 'あっさり' }, { id: 6, text: 'こってり' } ] },
  { id: 4, text: '温かいものが食べたい？それとも冷たいものが食べたい？', options: [ { id: 7, text: '温かいもの' }, { id: 8, text: '冷たいもの' } ] },
  { id: 5, text: 'ご飯（主食）はしっかり食べたい？それとも軽めに済ませたい？', options: [ { id: 9, text: 'しっかり食べたい' }, { id: 10, text: '軽めに済ませたい' } ] },
  { id: 6, text: '辛いものは好き？それとも苦手？', options: [ { id: 11, text: '辛いものが好き' }, { id: 12, text: '辛いものは苦手' } ] },
];

type AnimStage = 'exit' | 'enter' | null;

export default function QuestionFlowPage() {
  const [currentId, setCurrentId] = useState<number>(1);
  const [history, setHistory] = useState<number[]>([]);
  const [animStage, setAnimStage] = useState<AnimStage>(null);
  const [key, setKey] = useState(0);
  const [finalNumber, setFinalNumber] = useState<number | null>(null);

  const question = questions.find(q => q.id === currentId);
  if (!question) return <div className="p-8 text-center text-orange-500">質問がありません。</div>;

  const handleSelect = (option: Option, idx: number) => {
    if (animStage) return;
    const newHistory = [...history, idx]; // idx: 0 or 1
    setHistory(newHistory);
    setAnimStage('exit');
    setTimeout(() => {
      const nextIdx = questions.findIndex(q => q.id === currentId) + 1;
      const nextQ = questions[nextIdx];
      if (nextQ) {
        setCurrentId(nextQ.id);
        setKey(prev => prev + 1);
        setAnimStage('enter');
        setTimeout(() => setAnimStage(null), 800);
      } else {
        // ビット列を10進数に変換（1〜64）
        const bin = newHistory.join('');
        const num = parseInt(bin, 2) + 1;
        setFinalNumber(num);
        setAnimStage(null);
      }
    }, 800);
  };

  // 最後に番号を表示
  if (finalNumber !== null) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-100 via-orange-200 to-orange-300 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6 text-center">
          <h2 className="text-2xl font-semibold text-orange-600 mb-4">あなたの番号は</h2>
          <p className="text-5xl font-bold text-orange-700 mb-4">{finalNumber}</p>
          <p className="text-gray-500">（全64通り中の{finalNumber}番目）</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-100 via-orange-200 to-orange-300 flex items-center justify-center overflow-hidden">
      <div
        key={key}
        className={`max-w-md w-full bg-white rounded-2xl shadow-lg p-6 relative border-2 border-orange-300 transition-transform ease-in-out ${
          animStage === 'exit' ? 'animate-slide-exit' : animStage === 'enter' ? 'animate-slide-enter' : ''
        }`}
        style={{ minHeight: 380 }}
      >
        <h1 className="text-2xl font-semibold text-orange-600 mb-4 text-center">今日のごはんは？</h1>
        <p className="text-lg text-orange-700 mb-8 text-center">{question.text}</p>
        <div className="flex flex-col space-y-4 mb-4">
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
        <style jsx>{`
          @keyframes slideExit {
            0% { transform: translateY(0); opacity: 1; }
            100% { transform: translateY(-100%); opacity: 0; }
          }
          @keyframes slideEnter {
            0% { transform: translateY(100%); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
          .animate-slide-exit { animation: slideExit 0.8s ease-in-out forwards; }
          .animate-slide-enter { animation: slideEnter 0.8s ease-in-out forwards; }
        `}</style>
      </div>
    </div>
  );
}