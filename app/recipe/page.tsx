'use client';

import type { Recipe } from "@/app/types";

interface RecipePageProps {
  recipe: Recipe;
}

export default function RecipePage({ recipe }: RecipePageProps) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{recipe.name}</h1>
      <p>ID: {recipe.id}</p>
      <p>Combo: {recipe.combo}</p>
      <p>Created: {new Date(recipe.createdAt).toLocaleString()}</p>

      <a
        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(recipe.name)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline mt-4 block"
      >
        Googleマップで「{recipe.name}」を探す
      </a>
    </div>
  );
}
