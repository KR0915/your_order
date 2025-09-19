// app/services/mapService.ts

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
  try {
    const response = await fetch('/api/restaurant-search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        preferences: userPreferences,
        location: location
      }),
    });

    if (!response.ok) {
      throw new Error('Restaurant search API failed');
    }

    const data = await response.json();
    return data.restaurants;
  } catch (error) {
    console.error('Restaurant search error:', error);
    
    // フォールバック: サンプルデータを返す
    return getSampleRestaurants();
  }
}

export async function getRestaurantsByDish(dishName: string): Promise<Restaurant[]> {
  try {
    const response = await fetch('/api/restaurant-search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dishName: dishName
      }),
    });

    if (!response.ok) {
      throw new Error('Restaurant search API failed');
    }

    const data = await response.json();
    return data.restaurants;
  } catch (error) {
    console.error('Restaurant search error:', error);
    
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
