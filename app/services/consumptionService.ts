// app/lib/api.ts
import { 
  ConsumptionRecord, 
  DailyConsumptionResponse 
} from "@/app/types";


const CONSUMPTION_BASE = "/api/consumption";
// const DIARY_BASE = "/api/diary";

/** 食事を登録する */
export async function createConsumption(
  recipeId: number,
  quantity = 1,
  consumedAt?: string
): Promise<{ record: ConsumptionRecord }> {
  const body = { recipeId, quantity, consumedAt };
  const res = await fetch(CONSUMPTION_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("食事登録に失敗しました");
  return res.json();
}

/** 指定日の食事一覧＋合計カロリーを取得する */
export async function fetchDailyConsumption(
  date: string // 例 "2025-06-13"
): Promise<DailyConsumptionResponse> {
  const res = await fetch(`${CONSUMPTION_BASE}/${date}`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) throw new Error("当日の食事取得に失敗しました");
  return res.json();
}
