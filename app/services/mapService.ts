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
    console.log("Fetching restaurants for preferences:", userPreferences); // デバッグ用
    
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

    console.log("API response status:", response.status); // デバッグ用

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API response error:", errorText);
      throw new Error(`Restaurant search API failed: ${response.status}`);
    }

    const data = await response.json();
    console.log("API response data:", data); // デバッグ用
    
    // フォールバックデータかどうかを確認
    if (data.fallback) {
      console.warn("Using fallback data due to API error:", data.error);
    }
    
    return data.restaurants;
  } catch (error) {
    console.error('Restaurant search error:', error);
    
    // フォールバック: サンプルデータを返す
    return getSampleRestaurants();
  }
}

export async function getRestaurantsByDish(dishName: string): Promise<Restaurant[]> {
  try {
    console.log("Fetching restaurants for dish:", dishName); // デバッグ用
    
    const response = await fetch('/api/restaurant-search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dishName: dishName
      }),
    });

    console.log("API response status:", response.status); // デバッグ用

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API response error:", errorText);
      throw new Error(`Restaurant search API failed: ${response.status}`);
    }

    const data = await response.json();
    console.log("API response data:", data); // デバッグ用
    
    // フォールバックデータかどうかを確認
    if (data.fallback) {
      console.warn("Using fallback data due to API error:", data.error);
    }
    
    return data.restaurants;
  } catch (error) {
    console.error('Restaurant search error:', error);
    
    // フォールバック: 料理名に基づいたサンプルデータを返す
    return getSampleRestaurantsByDish(dishName);
  }
}

// フォールバック用のサンプルデータ
function getSampleRestaurants(): Restaurant[] {
  const baseRestaurants = [
    // 和食系
    { name: "おいしい寿司屋", cuisine: "寿司", description: "新鮮な魚を使った絶品寿司" },
    { name: "ラーメン太郎", cuisine: "ラーメン", description: "濃厚とんこつラーメンが自慢" },
    { name: "うどん花月", cuisine: "うどん", description: "手打ちうどんの名店" },
    { name: "そば処 匠", cuisine: "そば", description: "十割そばが自慢の老舗" },
    { name: "天ぷら職人", cuisine: "天ぷら", description: "サクサクの天ぷらが絶品" },
    { name: "焼肉キング", cuisine: "焼肉", description: "上質な和牛が味わえる" },
    { name: "鍋奉行", cuisine: "鍋料理", description: "季節の鍋が楽しめる" },
    
    // 洋食系
    { name: "ハンバーガーファクトリー", cuisine: "ハンバーガー", description: "ジューシーなパティが自慢" },
    { name: "ステーキハウス", cuisine: "ステーキ", description: "厚切りステーキが人気" },
    { name: "オムライス専門店", cuisine: "洋食", description: "ふわふわオムライスが絶品" },
    { name: "カレーハウス", cuisine: "カレー", description: "スパイシーなカレーが自慢" },
    
    // イタリアン
    { name: "パスタ工房", cuisine: "イタリアン", description: "手作りパスタが絶品" },
    { name: "ピッツェリア・ベラ", cuisine: "イタリアン", description: "本格ナポリピザ" },
    { name: "イタリアン・ドリーム", cuisine: "イタリアン", description: "本場の味を再現" },
    
    // 中華系
    { name: "餃子の王将", cuisine: "中華", description: "手作り餃子が自慢" },
    { name: "麻婆豆腐専門店", cuisine: "中華", description: "本格四川料理" },
    { name: "チャーハン大王", cuisine: "中華", description: "パラパラチャーハンが絶品" },
    { name: "小籠包の店", cuisine: "中華", description: "熱々小籠包が人気" },
    
    // アジア料理
    { name: "タイ料理レストラン", cuisine: "タイ料理", description: "本格タイカレーが味わえる" },
    { name: "韓国料理ハンナ", cuisine: "韓国料理", description: "辛いキムチが自慢" },
    { name: "ビビンバ専門店", cuisine: "韓国料理", description: "石焼ビビンバが絶品" },
    
    // カフェ・軽食
    { name: "カフェ・ドリーム", cuisine: "カフェ", description: "落ち着いた雰囲気でコーヒーが美味しい" },
    { name: "サンドイッチファクトリー", cuisine: "カフェ", description: "ボリューム満点サンドイッチ" },
    { name: "パン工房", cuisine: "ベーカリー", description: "焼きたてパンが自慢" },
    
    // フレンチ・高級
    { name: "フレンチビストロ", cuisine: "フレンチ", description: "本格フレンチコース" },
    { name: "ワインバー", cuisine: "フレンチ", description: "厳選ワインと料理のマリアージュ" },
    
    // その他
    { name: "居酒屋大漁", cuisine: "居酒屋", description: "新鮮な魚介類が自慢" },
    { name: "お好み焼き広島", cuisine: "お好み焼き", description: "本場広島風お好み焼き" },
    { name: "たこ焼き大阪", cuisine: "たこ焼き", description: "外はカリッ、中はトロトロ" },
    { name: "和食の心", cuisine: "和食", description: "季節の食材を活かした和食コース" }
  ];
  
  return baseRestaurants.map((restaurant, index) => ({
    id: index + 1,
    name: restaurant.name,
    latitude: getTokyoLatitude(),
    longitude: getTokyoLongitude(),
    cuisine: restaurant.cuisine,
    rating: Math.round((Math.random() * 1.5 + 3.5) * 10) / 10,
    description: restaurant.description,
    address: getTokyoAddress(index)
  }));
}

// フォールバック用のサンプルデータ（料理名ベース）- 改善版
function getSampleRestaurantsByDish(dishName: string): Restaurant[] {
  const baseName = dishName.replace(/です！|だよ！|！|。/g, '');
  const cuisineType = getCuisineType(baseName);
  
  // 30店舗分の多様な店名パターンを生成
  const generateRestaurantNames = (dish: string, cuisine: string): string[] => {
    const names: string[] = [];
    
    // 料理ジャンル別の特別なパターン
    if (cuisine === 'ラーメン') {
      const patterns = [
        `麺屋`, `らーめん`, `${dish}一番`, `${dish}家`, `麺場`, `麺処`, `${dish}亭`, `${dish}店`,
        `麺工房`, `${dish}道場`, `麺の`, `${dish}専門店`, `${dish}本舗`, `${dish}屋台`, `${dish}食堂`
      ];
      const suffixes = ['太郎', '次郎', '三郎', '花月', '美味', '一番', '本店', '総本家', '元祖', '老舗', '名店', '匠', '職人', '龍', '虎'];
      
      patterns.forEach((pattern, i) => {
        if (names.length < 30) {
          names.push(`${pattern} ${dish}${suffixes[i % suffixes.length]}`);
        }
      });
    } else if (cuisine === '寿司') {
      const patterns = [
        `鮨`, `寿司`, `すし`, `江戸前`, `築地`, `銀座`, `本格`, `職人`, `伝統`,
        `名店`, `老舗`, `高級`, `回転`, `立ち食い`, `カウンター`
      ];
      const suffixes = ['太郎', '次郎', '三郎', '四郎', '五郎', '六郎', '七郎', '八郎', '花', '月', '風', '雪', '雲', '海', '山'];
      
      patterns.forEach((pattern, i) => {
        if (names.length < 30) {
          names.push(`${pattern}${dish} ${suffixes[i % suffixes.length]}`);
        }
      });
    } else if (cuisine === 'カレー') {
      const patterns = [
        `カレー`, `カリー`, `スパイス`, `インド`, `タイ`, `欧風`, `本格`, `激辛`,
        `マイルド`, `ココナッツ`, `チキン`, `ビーフ`, `ポーク`, `野菜`, `シーフード`
      ];
      const suffixes = ['ハウス', '工房', '厨房', '専門店', '本舗', '亭', '屋', '家', '処', '庵', '店', '食堂', 'キッチン', 'ダイニング', 'カフェ'];
      
      patterns.forEach((pattern, i) => {
        if (names.length < 30) {
          names.push(`${pattern}${dish} ${suffixes[i % suffixes.length]}`);
        }
      });
    } else {
      // その他の料理の場合の汎用パターン
      const prefixes = ['元祖', '本家', '老舗', '名店', '匠の', '職人', '伝統', '本格', '絶品', '極上', '特製', '秘伝', '手作り', '自慢の', 'こだわり'];
      const suffixes = ['亭', '屋', '家', '処', '庵', '本舗', '工房', '専門店', '食堂', 'ダイニング', 'キッチン', 'カフェ', 'レストラン', 'ビストロ', '酒場'];
      
      for (let i = 0; i < 30; i++) {
        const prefix = prefixes[i % prefixes.length];
        const suffix = suffixes[i % suffixes.length];
        names.push(`${prefix}${dish}${suffix}`);
      }
    }
    
    // 30個に満たない場合は追加生成
    while (names.length < 30) {
      const randomNames = ['美味', '一番', '本店', '総本家', '元祖', '老舗', '名店', '匠', '職人'];
      const randomSuffixes = ['亭', '屋', '家', '処', '庵', '本舗'];
      const randomName = randomNames[Math.floor(Math.random() * randomNames.length)];
      const randomSuffix = randomSuffixes[Math.floor(Math.random() * randomSuffixes.length)];
      names.push(`${dish}${randomName}${randomSuffix}${names.length + 1}`);
    }
    
    return names.slice(0, 30);
  };
  
  const restaurantNames = generateRestaurantNames(baseName, cuisineType);
  
  const sampleRestaurants: Restaurant[] = restaurantNames.map((name, index) => ({
    id: index + 1,
    name,
    latitude: getTokyoLatitude(),
    longitude: getTokyoLongitude(),
    cuisine: cuisineType,
    rating: Math.round((Math.random() * 1.5 + 3.5) * 10) / 10, // 3.5-5.0
    description: getDetailedDescription(baseName, cuisineType),
    address: getTokyoAddress(index)
  }));

  return sampleRestaurants;
}

function getDetailedDescription(dishName: string, cuisine: string): string {
  const baseDescriptions: { [key: string]: string[] } = {
    'ラーメン': [
      `こだわりの${dishName}スープが自慢の名店`,
      `秘伝のタレで作る${dishName}は絶品`,
      `厳選素材を使った${dishName}専門店`,
      `職人が作る本格${dishName}が味わえる`
    ],
    '寿司': [
      `新鮮なネタで握る${dishName}は格別`,
      `職人の技が光る本格${dishName}`,
      `築地直送の新鮮な${dishName}`,
      `伝統の技法で作る絶品${dishName}`
    ],
    'カレー': [
      `スパイスから手作りする本格${dishName}`,
      `秘伝のルウで作る絶品${dishName}`,
      `20種類のスパイスを使った${dishName}`,
      `インドの伝統的な製法による${dishName}`
    ]
  };
  
  const descriptions = baseDescriptions[cuisine] || [
    `こだわりの${dishName}が自慢の専門店`,
    `伝統的な製法で作る本格${dishName}`,
    `厳選素材を使った絶品${dishName}`,
    `職人の技が光る本格${dishName}`
  ];
  
  return descriptions[Math.floor(Math.random() * descriptions.length)];
}

function getTokyoLatitude(): number {
  // 東京23区内の緯度範囲: 35.6-35.8
  return Math.round((Math.random() * 0.2 + 35.6) * 10000) / 10000;
}

function getTokyoLongitude(): number {
  // 東京23区内の経度範囲: 139.6-139.8
  return Math.round((Math.random() * 0.2 + 139.6) * 10000) / 10000;
}

function getTokyoAddress(index: number): string {
  const areas = [
    '東京都中央区銀座',
    '東京都新宿区新宿',
    '東京都渋谷区渋谷',
    '東京都港区赤坂',
    '東京都台東区浅草'
  ];
  
  const area = areas[index % areas.length];
  const buildingNum = Math.floor(Math.random() * 9) + 1;
  const floorNum = Math.floor(Math.random() * 9) + 1;
  
  return `${area}${buildingNum}-${floorNum}-${buildingNum}`;
}

// 料理名から料理ジャンルを推測する関数（強化版）
function getCuisineType(dishName: string): string {
  const dishLower = dishName.toLowerCase();
  
  const cuisineMapping: { [key: string]: string } = {
    // 和食系
    '寿司': '寿司',
    'すし': '寿司',
    'sushi': '寿司',
    'ラーメン': 'ラーメン',
    'らーめん': 'ラーメン',
    'ramen': 'ラーメン',
    'うどん': 'うどん・そば',
    'そば': 'うどん・そば',
    '蕎麦': 'うどん・そば',
    'てんぷら': '天ぷら',
    '天ぷら': '天ぷら',
    'tempura': '天ぷら',
    '刺身': '和食',
    'さしみ': '和食',
    '焼き魚': '和食',
    '煮物': '和食',
    '味噌汁': '和食',
    '定食': '定食・食堂',
    
    // 洋食系
    'ハンバーガー': 'ハンバーガー',
    'burger': 'ハンバーガー',
    'ステーキ': 'ステーキ・グリル',
    'steak': 'ステーキ・グリル',
    'パスタ': 'イタリアン',
    'pasta': 'イタリアン',
    'ピザ': 'イタリアン',
    'pizza': 'イタリアン',
    'オムライス': '洋食',
    'ハンバーグ': '洋食',
    'カレー': 'カレー',
    'curry': 'カレー',
    
    // 中華系
    '餃子': '中華',
    'ギョーザ': '中華',
    'gyoza': '中華',
    '麻婆豆腐': '中華',
    'チャーハン': '中華',
    '炒飯': '中華',
    '中華麺': '中華',
    '小籠包': '中華',
    
    // 焼肉・肉系
    '焼肉': '焼肉',
    'yakiniku': '焼肉',
    'bbq': '焼肉・BBQ',
    'バーベキュー': '焼肉・BBQ',
    
    // 鍋系
    '鍋': '鍋料理',
    'しゃぶしゃぶ': '鍋料理',
    'すき焼き': '鍋料理',
    
    // アジア系
    'タイ料理': 'タイ料理',
    'thai': 'タイ料理',
    'パッタイ': 'タイ料理',
    '韓国': '韓国料理',
    'korean': '韓国料理',
    'キムチ': '韓国料理',
    'ビビンバ': '韓国料理',
    
    // フレンチ・高級
    'フレンチ': 'フレンチ',
    'french': 'フレンチ',
    'フォアグラ': 'フレンチ',
    
    // カフェ・軽食
    'コーヒー': 'カフェ',
    'coffee': 'カフェ',
    'サンドイッチ': 'カフェ・軽食',
    'sandwich': 'カフェ・軽食',
    'パン': 'ベーカリー',
    'bread': 'ベーカリー'
  };

  // 完全一致を優先
  if (cuisineMapping[dishName]) {
    return cuisineMapping[dishName];
  }

  // 部分一致で検索
  for (const [key, value] of Object.entries(cuisineMapping)) {
    if (dishName.includes(key) || dishLower.includes(key)) {
      return value;
    }
  }

  // デフォルトは料理名をそのまま使用
  return dishName;
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
