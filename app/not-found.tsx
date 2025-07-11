"use client";
import React from "react";

const foods = ['🍔', '🍕', '🍣', '🍜', '🍦', '🥗', '🍩', '🍰', '🍤', '🍇'];

export default function NotFound() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
      {/* 背景の食べ物アイコン */}
      <div className="absolute inset-0 -z-10">
        {foods.map((food, idx) => (
          <span
            key={idx}
            className="absolute text-[5rem] opacity-20 animate-spin-slow"
            style={{
              top: `${10 + (idx % 5) * 15}%`,
              left: `${10 + (idx * 9) % 80}%`,
              animationDelay: `${idx * 300}ms`,
            }}
          >
            {food}
          </span>
        ))}
        <style>{`
          .animate-spin-slow {
            animation: spin 18s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg);}
            100% { transform: rotate(360deg);}
          }
        `}</style>
      </div>
      <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-xl px-10 py-12 flex flex-col items-center">
        <h1 className="text-6xl font-extrabold text-orange-500 mb-6 drop-shadow-lg">404</h1>
        <p className="text-2xl font-semibold mb-4 text-gray-700">ページが見つかりません</p>
        <p className="mb-8 text-gray-500">お探しのページは存在しないか、移動した可能性があります。</p>
        <a
          href="/"
          className="px-6 py-2 bg-orange-400 text-white rounded-full font-bold shadow hover:bg-orange-500 transition"
        >
          ホームに戻る
        </a>
      </div>
    </div>
  );
}