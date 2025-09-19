// app/api/restaurant-search/route.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface Restaurant {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  cuisine: string;
  rating: number;
  description?: string;
  address?: string;
  phone?: string;
}

export async function POST(req: Request) {
  try {
    const { preferences, location, dishName } = await req.json();
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    let prompt = '';
    
    if (dishName) {
      // 料理名ベースの検索
      prompt = `
あなたはレストラン検索AIです。以下の料理名に基づいて、東京都内でその料理を提供しているレストランを5店舗提案してください。

料理名: ${dishName}

以下のJSON形式で返してください（JSONのみ返し、他の文字は含めないでください）:
[
  {
    "name": "レストラン名",
    "latitude": 35.6762,
    "longitude": 139.6503,
    "cuisine": "料理ジャンル",
    "rating": 4.5,
    "description": "その料理の特徴やレストランの魅力",
    "address": "住所",
    "phone": "電話番号（任意）"
  }
]

実在するレストランである必要はありませんが、リアルな設定にしてください。
東京都内の実際の緯度経度を使用し、rating は 3.5〜5.0 の範囲で設定してください。
レストラン名や説明は、指定された料理に特化した内容にしてください。
`;
    } else {
      // 好みベースの検索
      const locationText = location 
        ? `緯度: ${location.lat}, 経度: ${location.lng}の周辺で` 
        : "東京都内で";

      prompt = `
あなたはレストラン検索AIです。以下のユーザーの好みに基づいて、${locationText}おすすめのレストランを5店舗提案してください。

ユーザーの好み: ${preferences}

以下のJSON形式で返してください（JSONのみ返し、他の文字は含めないでください）:
[
  {
    "name": "レストラン名",
    "latitude": 35.6762,
    "longitude": 139.6503,
    "cuisine": "料理ジャンル",
    "rating": 4.5,
    "description": "レストランの特徴や魅力",
    "address": "住所",
    "phone": "電話番号（任意）"
  }
]

実在するレストランである必要はありませんが、リアルな設定にしてください。
東京都内の実際の緯度経度を使用し、rating は 3.5〜5.0 の範囲で設定してください。
`;
    }

    const result = await model.generateContent(prompt);
    const response = result.response.text().trim();
    
    // JSONパースの前にレスポンスをクリーンアップ
    const cleanedResponse = response.replace(/```json\n?|\n?```/g, '').trim();
    
    const restaurantsData = JSON.parse(cleanedResponse);
    
    // IDを追加
    const restaurants: Restaurant[] = restaurantsData.map((restaurant: Omit<Restaurant, 'id'>, index: number) => ({
      id: index + 1,
      ...restaurant
    }));

    return NextResponse.json({ restaurants });
  } catch (error) {
    console.error("Restaurant search API error:", error);
    
    // フォールバック: サンプルデータを返す
    const fallbackRestaurants = getSampleRestaurants();
    return NextResponse.json({ restaurants: fallbackRestaurants });
  }
}

// フォールバック用のサンプルデータ
function getSampleRestaurants(): Restaurant[] {
  return [
    {
      id: 1,
      name: "おいしい寿司屋",
      latitude: 35.6762,
      longitude: 139.6503,
      cuisine: "寿司",
      rating: 4.5,
      description: "新鮮な魚を使った絶品寿司",
      address: "東京都中央区銀座1-1-1"
    },
    {
      id: 2,
      name: "ラーメン太郎",
      latitude: 35.6895,
      longitude: 139.6917,
      cuisine: "ラーメン",
      rating: 4.2,
      description: "濃厚とんこつラーメンが自慢",
      address: "東京都新宿区新宿2-2-2"
    },
    {
      id: 3,
      name: "カフェ・ドリーム",
      latitude: 35.6580,
      longitude: 139.7016,
      cuisine: "カフェ",
      rating: 4.0,
      description: "落ち着いた雰囲気でコーヒーが美味しい",
      address: "東京都渋谷区渋谷3-3-3"
    },
    {
      id: 4,
      name: "イタリアン・ベラ",
      latitude: 35.6684,
      longitude: 139.6833,
      cuisine: "イタリアン",
      rating: 4.3,
      description: "本格的なイタリア料理を楽しめる",
      address: "東京都港区赤坂4-4-4"
    },
    {
      id: 5,
      name: "和食の心",
      latitude: 35.6586,
      longitude: 139.7454,
      cuisine: "和食",
      rating: 4.6,
      description: "季節の食材を活かした和食コース",
      address: "東京都台東区浅草5-5-5"
    }
  ];
}
