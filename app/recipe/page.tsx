'use client';

import { useEffect, useState } from 'react';
import type { Recipe } from "@/app/types";

export default function RecipePage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // レシピデータを取得（サンプルデータ）
    const sampleRecipes: Recipe[] = [
      {
        id: 1,
        name: "チキンカレー",
        combo: "1,2,5,6",
        createdAt: new Date()
      },
      {
        id: 2,
        name: "和風パスタ",
        combo: "3,4,7,8",
        createdAt: new Date()
      },
      {
        id: 3,
        name: "タコライス",
        combo: "2,4,6,8",
        createdAt: new Date()
      }
    ];
    
    setRecipes(sampleRecipes);
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="p-6">レシピを読み込み中...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">レシピ一覧</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {recipes.map(recipe => (
          <div key={recipe.id} className="border rounded-lg p-4 shadow-sm">
            <h2 className="text-xl font-semibold mb-2">{recipe.name}</h2>
            <p className="text-sm text-gray-600">ID: {recipe.id}</p>
            <p className="text-sm text-gray-600">Combo: {recipe.combo}</p>
            <p className="text-sm text-gray-600">
              作成日: {new Date(recipe.createdAt).toLocaleString()}
            </p>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(recipe.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm transition-colors"
            >
              Googleマップで探す
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
