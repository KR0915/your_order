// app/services/pfcService.ts
import { PFCDashboardResponse } from "@/app/types";

const PFC_DASHBOARD_BASE = "/api/pfc-dashboard";

/** PFCダッシュボードデータを取得 */
export async function fetchPFCDashboard(
  startDate: string,
  endDate: string,
  viewType: 'daily' | 'monthly' = 'daily'
): Promise<PFCDashboardResponse> {
  const params = new URLSearchParams({
    startDate,
    endDate,
    viewType
  });
  
  const res = await fetch(`${PFC_DASHBOARD_BASE}?${params}`, {
    method: "GET",
    credentials: "include",
  });
  
  if (!res.ok) {
    throw new Error("PFCダッシュボードデータの取得に失敗しました");
  }
  
  return res.json();
}

/** PFCバランスの比率を計算 */
export function calculatePFCRatio(protein: number, fat: number, carbs: number) {
  // PFCのカロリー換算値
  const proteinCalories = protein * 4; // 1g = 4kcal
  const fatCalories = fat * 9;         // 1g = 9kcal
  const carbsCalories = carbs * 4;     // 1g = 4kcal
  
  const total = proteinCalories + fatCalories + carbsCalories;
  
  if (total === 0) {
    return { proteinRatio: 0, fatRatio: 0, carbsRatio: 0 };
  }
  
  return {
    proteinRatio: Math.round((proteinCalories / total) * 100),
    fatRatio: Math.round((fatCalories / total) * 100),
    carbsRatio: Math.round((carbsCalories / total) * 100),
  };
}

/** PFCバランスの評価 */
export function evaluatePFCBalance(proteinRatio: number, fatRatio: number, carbsRatio: number) {
  // 理想的なPFCバランス（一般的な目安）
  // P: 13-20%, F: 20-30%, C: 50-65%
  const idealProtein = { min: 13, max: 20 };
  const idealFat = { min: 20, max: 30 };
  const idealCarbs = { min: 50, max: 65 };
  
  let status = 'good'; // good, warning, poor
  const issues = [];
  
  if (proteinRatio < idealProtein.min) {
    issues.push('タンパク質が不足気味です');
    status = 'warning';
  } else if (proteinRatio > idealProtein.max) {
    issues.push('タンパク質が過多です');
    status = 'warning';
  }
  
  if (fatRatio < idealFat.min) {
    issues.push('脂質が不足気味です');
    status = 'warning';
  } else if (fatRatio > idealFat.max) {
    issues.push('脂質が過多です');
    status = 'warning';
  }
  
  if (carbsRatio < idealCarbs.min) {
    issues.push('炭水化物が不足気味です');
    status = 'warning';
  } else if (carbsRatio > idealCarbs.max) {
    issues.push('炭水化物が過多です');
    status = 'warning';
  }
  
  if (issues.length >= 2) {
    status = 'poor';
  }
  
  return {
    status,
    issues,
    recommendations: generateRecommendations(proteinRatio, fatRatio, carbsRatio)
  };
}

function generateRecommendations(proteinRatio: number, fatRatio: number, carbsRatio: number): string[] {
  const recommendations = [];
  
  if (proteinRatio < 13) {
    recommendations.push('魚、肉、卵、豆類を増やしましょう');
  } else if (proteinRatio > 20) {
    recommendations.push('タンパク質を少し控えめにして、炭水化物を増やしましょう');
  }
  
  if (fatRatio < 20) {
    recommendations.push('オリーブオイル、ナッツ類、アボカドなどの良質な脂質を取りましょう');
  } else if (fatRatio > 30) {
    recommendations.push('揚げ物や脂肪の多い食品を控えめにしましょう');
  }
  
  if (carbsRatio < 50) {
    recommendations.push('ご飯、パン、芋類などの炭水化物を適量摂取しましょう');
  } else if (carbsRatio > 65) {
    recommendations.push('炭水化物を少し控えて、野菜やタンパク質を増やしましょう');
  }
  
  return recommendations;
}
