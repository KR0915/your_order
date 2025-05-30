'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { Recipe } from '@/app/types';
import { getRecipeByCombo } from '@/app/services/recipeService';

export default function RecipePage() {
  // useParams() は string | string[] を返すので
  const params = useParams();
  const rawCombo = params.combo;
  // 配列なら最初の要素を、そうでなければそのまま
  const combo = Array.isArray(rawCombo) ? rawCombo[0] : rawCombo;

  const router = useRouter();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getRecipeByCombo(combo)
      .then(setRecipe)
      .catch(err => {
        if (err.message === 'not found') {
          router.replace('/404');
        } else {
          setError(err.message);
        }
      });
  }, [combo, router]);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!recipe) return <p>Loading…</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{recipe.name}</h1>
      <p>ID: {recipe.id}</p>
      <p>Combo: {recipe.combo}</p>
      <p>Created: {new Date(recipe.createdAt).toLocaleString()}</p>
    </div>
  );
}
