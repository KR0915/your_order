import { Recipe } from "@/app/types";

export async function getRecipeByCombo(combo: string): Promise<Recipe> {
  const res = await fetch(`/api/recipe/${combo}`);
  if (res.status === 404) throw new Error('not found');
  if (!res.ok) throw new Error(`status: ${res.status}`);
  return res.json();
}