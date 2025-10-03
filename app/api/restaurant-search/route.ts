// app/api/restaurant-search/route.ts
import { NextResponse } from "next/server";
import { hotPepperService } from "@/app/services/hotpepperService";
import { Restaurant } from "@/app/types";

export async function POST(req: Request) {
  try {
    const { preferences, location, dishName } = await req.json();
    
    console.log("Restaurant search request:", { preferences, location, dishName });
    
    // ホットペッパーAPIを使用してレストランを検索
    const searchParams: {
      count: number;
      range: number;
      lat?: number;
      lng?: number;
      genre?: string;
      keyword?: string;
    } = {
      count: 30,
      range: 4, // 2km範囲
    };

    // 位置情報がある場合
    if (location?.lat && location?.lng) {
      searchParams.lat = location.lat;
      searchParams.lng = location.lng;
    }

    // 料理名からジャンルコードを取得
    if (dishName) {
      searchParams.genre = hotPepperService.getGenreCode(dishName);
      searchParams.keyword = dishName;
    }

    const hotPepperRestaurants = await hotPepperService.searchRestaurants(searchParams);
    
    // ホットペッパーの結果を共通のRestaurant型に変換
    const restaurants: Restaurant[] = hotPepperRestaurants.map(shop => ({
      id: shop.id,
      name: shop.name,
      latitude: shop.latitude,
      longitude: shop.longitude,
      cuisine: shop.cuisine,
      rating: shop.rating || 4.0,
      description: shop.description,
      address: shop.address,
      phone: shop.phone
    }));
    
    return NextResponse.json({ 
      restaurants,
      source: process.env.HOTPEPPER_API_KEY ? "hotpepper" : "fallback",
      count: restaurants.length,
      message: process.env.HOTPEPPER_API_KEY ? "ホットペッパーAPIから取得" : "APIキー未設定のためサンプルデータを使用"
    });
  } catch (error) {
    console.error("Restaurant search API error:", error);
    
    // エラー時はホットペッパーサービスのフォールバック機能を使用
    const { dishName: errorDishName } = await req.json().catch(() => ({ dishName: null }));
    const fallbackRestaurants = await hotPepperService.searchRestaurants({
      keyword: errorDishName || "レストラン",
      count: 30
    });
    
    const restaurants: Restaurant[] = fallbackRestaurants.map(shop => ({
      id: shop.id,
      name: shop.name,
      latitude: shop.latitude,
      longitude: shop.longitude,
      cuisine: shop.cuisine,
      rating: shop.rating || 4.0,
      description: shop.description,
      address: shop.address,
      phone: shop.phone
    }));
    
    return NextResponse.json({ 
      restaurants,
      source: "fallback",
      count: restaurants.length,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: "エラーが発生したためサンプルデータを使用"
    });
  }
}
