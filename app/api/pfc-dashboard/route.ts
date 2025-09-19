// app/api/pfc-dashboard/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { getUserFromRequest } from "@/app/lib/auth";

export async function GET(req: NextRequest) {
  // 認証チェック
  const authUser = await getUserFromRequest(req);
  if (!authUser) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // ユーザー情報を取得（目標カロリーなどの情報のため）
  const userInfo = await prisma.user.findUnique({
    where: { id: authUser.id },
  });

  if (!userInfo) {
    return NextResponse.json({ error: "user not found" }, { status: 404 });
  }

  const { searchParams } = new URL(req.url);
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const viewType = searchParams.get('viewType') || 'daily'; // 'daily' or 'monthly'

  if (!startDate || !endDate) {
    return NextResponse.json({ error: "startDate and endDate are required" }, { status: 400 });
  }

  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // 終了日の最後まで含める

    // 指定期間の消費データを取得（レシピのPFC情報も含む）
    const consumptions = await prisma.consumption.findMany({
      where: {
        userId: authUser.id,
        consumedAt: {
          gte: start,
          lte: end,
        },
      },
      include: {
        recipe: true,
      },
      orderBy: {
        consumedAt: 'asc',
      },
    });

    if (viewType === 'daily') {
      // 日別データを生成
      const dailyData = new Map<string, {
        date: string;
        totalCalories: number;
        totalProtein: number;
        totalFat: number;
        totalCarbs: number;
        meals: Array<{
          id: number;
          recipeName: string;
          quantity: number;
          calories: number;
          protein: number;
          fat: number;
          carbs: number;
          consumedAt: Date;
        }>;
      }>();

      consumptions.forEach((consumption) => {
        const dateKey = consumption.consumedAt.toISOString().split('T')[0];
        const calories = (consumption.recipe.calorie || 0) * consumption.quantity;
        // PFCデータを取得（Prismaで生成された型を使用）
        const recipeWithPFC = consumption.recipe as typeof consumption.recipe & {
          protein?: number | null;
          fat?: number | null;
          carbs?: number | null;
        };
        const protein = (recipeWithPFC.protein || 0) * consumption.quantity;
        const fat = (recipeWithPFC.fat || 0) * consumption.quantity;
        const carbs = (recipeWithPFC.carbs || 0) * consumption.quantity;

        if (!dailyData.has(dateKey)) {
          dailyData.set(dateKey, {
            date: dateKey,
            totalCalories: 0,
            totalProtein: 0,
            totalFat: 0,
            totalCarbs: 0,
            meals: [],
          });
        }

        const dayData = dailyData.get(dateKey)!;
        dayData.totalCalories += calories;
        dayData.totalProtein += protein;
        dayData.totalFat += fat;
        dayData.totalCarbs += carbs;
        dayData.meals.push({
          id: consumption.id,
          recipeName: consumption.recipe.name,
          quantity: consumption.quantity,
          calories,
          protein,
          fat,
          carbs,
          consumedAt: consumption.consumedAt,
        });
      });

      return NextResponse.json({
        viewType: 'daily',
        data: Array.from(dailyData.values()),
        summary: {
          totalDays: dailyData.size,
          averageCalories: dailyData.size > 0 ? Array.from(dailyData.values()).reduce((sum, day) => sum + day.totalCalories, 0) / dailyData.size : 0,
          averageProtein: dailyData.size > 0 ? Array.from(dailyData.values()).reduce((sum, day) => sum + day.totalProtein, 0) / dailyData.size : 0,
          averageFat: dailyData.size > 0 ? Array.from(dailyData.values()).reduce((sum, day) => sum + day.totalFat, 0) / dailyData.size : 0,
          averageCarbs: dailyData.size > 0 ? Array.from(dailyData.values()).reduce((sum, day) => sum + day.totalCarbs, 0) / dailyData.size : 0,
        },
        userInfo: {
          id: userInfo.id,
          name: userInfo.name,
          targetCal: userInfo.targetCal,
          email: userInfo.email,
        },
      });
    } else {
      // 月別データを生成
      const monthlyData = new Map<string, {
        month: string;
        totalCalories: number;
        totalProtein: number;
        totalFat: number;
        totalCarbs: number;
        dayCount: number;
      }>();

      consumptions.forEach((consumption) => {
        const date = new Date(consumption.consumedAt);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const calories = (consumption.recipe.calorie || 0) * consumption.quantity;
        // PFCデータを取得（Prismaで生成された型を使用）
        const recipeWithPFC = consumption.recipe as typeof consumption.recipe & {
          protein?: number | null;
          fat?: number | null;
          carbs?: number | null;
        };
        const protein = (recipeWithPFC.protein || 0) * consumption.quantity;
        const fat = (recipeWithPFC.fat || 0) * consumption.quantity;
        const carbs = (recipeWithPFC.carbs || 0) * consumption.quantity;

        if (!monthlyData.has(monthKey)) {
          monthlyData.set(monthKey, {
            month: monthKey,
            totalCalories: 0,
            totalProtein: 0,
            totalFat: 0,
            totalCarbs: 0,
            dayCount: 0,
          });
        }

        const monthData = monthlyData.get(monthKey)!;
        monthData.totalCalories += calories;
        monthData.totalProtein += protein;
        monthData.totalFat += fat;
        monthData.totalCarbs += carbs;
      });

      // 各月の日数を計算
      const dailyTotals = new Map<string, Set<string>>();
      consumptions.forEach((consumption) => {
        const date = new Date(consumption.consumedAt);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const dateKey = consumption.consumedAt.toISOString().split('T')[0];
        
        if (!dailyTotals.has(monthKey)) {
          dailyTotals.set(monthKey, new Set());
        }
        dailyTotals.get(monthKey)!.add(dateKey);
      });

      // 平均値を計算
      const monthlyDataWithAverages = Array.from(monthlyData.values()).map(month => {
        const dayCount = dailyTotals.get(month.month)?.size || 1;
        return {
          ...month,
          dayCount,
          averageCalories: month.totalCalories / dayCount,
          averageProtein: month.totalProtein / dayCount,
          averageFat: month.totalFat / dayCount,
          averageCarbs: month.totalCarbs / dayCount,
        };
      }).filter(month => month.month && month.month.length > 0); // 有効な月データのみフィルター

      return NextResponse.json({
        viewType: 'monthly',
        data: monthlyDataWithAverages,
        userInfo: {
          id: userInfo.id,
          name: userInfo.name,
          targetCal: userInfo.targetCal,
          email: userInfo.email,
        },
      });
    }
  } catch (error) {
    console.error("PFC Dashboard API error:", error);
    return NextResponse.json({ error: "データ取得に失敗しました" }, { status: 500 });
  }
}
