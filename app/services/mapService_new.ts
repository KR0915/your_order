// app/services/mapService.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export interface Restaurant {
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

export async function getRestaurantRecommendations(
  userPreferences: string, 
  location?: { lat: number; lng: number }
): Promise<Restaurant[]> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  const locationText = location 
    ? `緯度: ${location.lat}, 経度: ${location.lng}の周辺で` 
    : "東京都内で";

  const prompt = `
あなたはレストラン検索AIです。以下のユーザーの好みに基づいて、${locationText}おすすめのレストランを5店舗提案してください。

ユーザーの好み: ${userPreferences}

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

  try {
    const result = await model.generateContent(prompt);
    const response = result.response.text().trim();
    
    // JSONパースの前にレスポンスをクリーンアップ
    const cleanedResponse = response.replace(/```json\n?|\n?```/g, '').trim();
    
    const restaurants = JSON.parse(cleanedResponse);
    
    // IDを追加
    return restaurants.map((restaurant: Omit<Restaurant, 'id'>, index: number) => ({
      id: index + 1,
      ...restaurant
    }));
  } catch (error) {
    console.error('Gemini API error:', error);
    
    // フォールバック: サンプルデータを返す
    return getSampleRestaurants();
  }
}

export async function getRestaurantsByDish(dishName: string): Promise<Restaurant[]> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  const prompt = `
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

  try {
    const result = await model.generateContent(prompt);
    const response = result.response.text().trim();
    
    // JSONパースの前にレスポンスをクリーンアップ
    const cleanedResponse = response.replace(/```json\n?|\n?```/g, '').trim();
    
    const restaurants = JSON.parse(cleanedResponse);
    
    // IDを追加
    return restaurants.map((restaurant: Omit<Restaurant, 'id'>, index: number) => ({
      id: index + 1,
      ...restaurant
    }));
  } catch (error) {
    console.error('Gemini API error:', error);
    
    // フォールバック: 料理名に基づいたサンプルデータを返す
    return getSampleRestaurantsByDish(dishName);
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

// フォールバック用のサンプルデータ（料理名ベース）
function getSampleRestaurantsByDish(dishName: string): Restaurant[] {
  const baseName = dishName.replace(/です！|だよ！|！|。/g, '');
  
  const sampleRestaurants: Restaurant[] = [
    {
      id: 1,
      name: `${baseName}専門店 美味亭`,
      latitude: 35.6762,
      longitude: 139.6503,
      cuisine: getCuisineType(baseName),
      rating: 4.5,
      description: `絶品の${baseName}が自慢の老舗レストラン`,
      address: "東京都中央区銀座1-1-1"
    },
    {
      id: 2,
      name: `${baseName}の店 味楽`,
      latitude: 35.6895,
      longitude: 139.6917,
      cuisine: getCuisineType(baseName),
      rating: 4.2,
      description: `こだわりの${baseName}を提供する人気店`,
      address: "東京都新宿区新宿2-2-2"
    },
    {
      id: 3,
      name: `${baseName}工房`,
      latitude: 35.6580,
      longitude: 139.7016,
      cuisine: getCuisineType(baseName),
      rating: 4.3,
      description: `手作りの${baseName}が味わえる隠れ家的なお店`,
      address: "東京都渋谷区渋谷3-3-3"
    },
    {
      id: 4,
      name: `レストラン ${baseName}`,
      latitude: 35.6684,
      longitude: 139.6833,
      cuisine: getCuisineType(baseName),
      rating: 4.1,
      description: `モダンな雰囲気で楽しむ${baseName}`,
      address: "東京都港区赤坂4-4-4"
    },
    {
      id: 5,
      name: `${baseName}ダイニング`,
      latitude: 35.6586,
      longitude: 139.7454,
      cuisine: getCuisineType(baseName),
      rating: 4.4,
      description: `上質な${baseName}を落ち着いた空間で`,
      address: "東京都台東区浅草5-5-5"
    }
  ];

  return sampleRestaurants;
}

// 料理名から料理ジャンルを推測する関数
function getCuisineType(dishName: string): string {
  const cuisineMapping: { [key: string]: string } = {
    '寿司': '寿司',
    'ラーメン': 'ラーメン',
    'うどん': 'うどん',
    'そば': 'そば',
    'カレー': 'カレー',
    'パスタ': 'イタリアン',
    'ピザ': 'イタリアン',
    'ハンバーガー': '洋食',
    'ステーキ': '洋食',
    'てんぷら': '和食',
    '天ぷら': '和食',
    '刺身': '和食',
    '焼肉': '焼肉',
    '鍋': '鍋',
    '中華': '中華',
    'ギョーザ': '中華',
    '餃子': '中華',
    'タイ料理': 'タイ料理',
    '韓国': '韓国料理',
    'フレンチ': 'フレンチ'
  };

  for (const [key, value] of Object.entries(cuisineMapping)) {
    if (dishName.includes(key)) {
      return value;
    }
  }

  return '各国料理';
}

export async function getRestaurantsByMood(mood: string): Promise<Restaurant[]> {
  const moodToPreference: { [key: string]: string } = {
    "元気": "活力のある雰囲気の焼肉やBBQ、エネルギッシュな料理",
    "リラックス": "落ち着いたカフェや和食、静かな雰囲気のレストラン",
    "ロマンチック": "デートに適したイタリアンやフレンチ、夜景の見える店",
    "冒険": "珍しい料理や異国料理、新しいジャンルの料理",
    "懐かしい": "家庭料理や昔ながらの定食屋、懐かしい味の店",
    "贅沢": "高級料理店や特別な日にふさわしい上質なレストラン"
  };

  const preference = moodToPreference[mood] || "バランスの取れた様々なジャンルの料理";
  return getRestaurantRecommendations(preference);
}

// 位置情報を取得する関数
export function getCurrentLocation(): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        console.error('Geolocation error:', error);
        // デフォルトで東京駅の座標を返す
        resolve({ lat: 35.6762, lng: 139.6503 });
      }
    );
  });
}
