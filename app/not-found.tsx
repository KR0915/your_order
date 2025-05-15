"use client";
import React from 'react';

const foods = ['🍔', '🍕', '🍣', '🍜', '🍦'];

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-yellow-50">
    <br />
    <br />
    <br />
      <h1 className="text-5xl font-bold mb-8">404 - Page Not Found</h1>
      <br />
      <br />
      <br />
      <div className="relative w-full h-64">
        {foods.map((food, idx) => (
          <span
            key={idx}
            className="absolute text-6xl animate-bounce"
            style={{
              left: `${15 + idx * 16}%`,
              animationDelay: `${idx * 200}ms`,
            }}
          >
            {food}
          </span>
        ))}
      </div>
      <p className="mt-8 text-lg">探しているページは見つかりませんでした。</p>
      <br />
    </div>
  );
}
