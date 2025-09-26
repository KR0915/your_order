// app/api/restaurant-search/route.ts
import { NextResponse } from "next/server";

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
    
    console.log("Restaurant search request:", { preferences, location, dishName });
    
    // GEMINI_API_KEYは無視して、フォールバックデータのみ使用
    const fallbackRestaurants = dishName 
      ? getSampleRestaurantsByDish(dishName)
      : getSampleRestaurants();
      
    return NextResponse.json({ 
      restaurants: fallbackRestaurants,
      fallback: true,
      message: "GEMINI_API_KEY未設定のためサンプルデータを使用"
    });
  } catch (error) {
    console.error("Restaurant search API error:", error);
    
    // エラー時もサンプルデータを返す
    const fallbackRestaurants = getSampleRestaurants();
    return NextResponse.json({ 
      restaurants: fallbackRestaurants,
      fallback: true,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// フォールバック用のサンプルデータ（共通）
function getSampleRestaurants(): Restaurant[] {
  const baseRestaurants = [
    { name: "おいしい寿司屋", cuisine: "寿司", description: "新鮮な魚を使った絶品寿司" },
    { name: "ラーメン太郎", cuisine: "ラーメン", description: "濃厚とんこつラーメンが自慢" },
    { name: "うどん花月", cuisine: "うどん", description: "手打ちうどんの名店" },
    { name: "そば処 匠", cuisine: "そば", description: "十割そばが自慢の老舗" },
    { name: "天ぷら職人", cuisine: "天ぷら", description: "サクサクの天ぷらが絶品" },
    { name: "焼肉キング", cuisine: "焼肉", description: "上質な和牛が味わえる" },
    { name: "鍋奉行", cuisine: "鍋料理", description: "季節の鍋が楽しめる" },
    { name: "ハンバーガーファクトリー", cuisine: "ハンバーガー", description: "ジューシーなパティが自慢" },
    { name: "ステーキハウス", cuisine: "ステーキ", description: "厚切りステーキが人気" },
    { name: "オムライス専門店", cuisine: "洋食", description: "ふわふわオムライスが絶品" },
    { name: "カレーハウス", cuisine: "カレー", description: "スパイシーなカレーが自慢" },
    { name: "パスタ工房", cuisine: "イタリアン", description: "手作りパスタが絶品" },
    { name: "ピッツェリア・ベラ", cuisine: "イタリアン", description: "本格ナポリピザ" },
    { name: "イタリアン・ドリーム", cuisine: "イタリアン", description: "本場の味を再現" },
    { name: "餃子の王将", cuisine: "中華", description: "手作り餃子が自慢" },
    { name: "麻婆豆腐専門店", cuisine: "中華", description: "本格四川料理" },
    { name: "チャーハン大王", cuisine: "中華", description: "パラパラチャーハンが絶品" },
    { name: "小籠包の店", cuisine: "中華", description: "熱々小籠包が人気" },
    { name: "タイ料理レストラン", cuisine: "タイ料理", description: "本格タイカレーが味わえる" },
    { name: "韓国料理ハンナ", cuisine: "韓国料理", description: "辛いキムチが自慢" },
    { name: "ビビンバ専門店", cuisine: "韓国料理", description: "石焼ビビンバが絶品" },
    { name: "カフェ・ドリーム", cuisine: "カフェ", description: "落ち着いた雰囲気でコーヒーが美味しい" },
    { name: "サンドイッチファクトリー", cuisine: "カフェ", description: "ボリューム満点サンドイッチ" },
    { name: "パン工房", cuisine: "ベーカリー", description: "焼きたてパンが自慢" },
    { name: "フレンチビストロ", cuisine: "フレンチ", description: "本格フレンチコース" },
    { name: "ワインバー", cuisine: "フレンチ", description: "厳選ワインと料理のマリアージュ" },
    { name: "居酒屋大漁", cuisine: "居酒屋", description: "新鮮な魚介類が自慢" },
    { name: "お好み焼き広島", cuisine: "お好み焼き", description: "本場広島風お好み焼き" },
    { name: "たこ焼き大阪", cuisine: "たこ焼き", description: "外はカリッ、中はトロトロ" },
    { name: "和食の心", cuisine: "和食", description: "季節の食材を活かした和食コース" }
  ];
  
  return baseRestaurants.map((restaurant, index) => ({
    id: index + 1,
    name: restaurant.name,
    latitude: Math.round((Math.random() * 0.2 + 35.6) * 10000) / 10000,
    longitude: Math.round((Math.random() * 0.2 + 139.6) * 10000) / 10000,
    cuisine: restaurant.cuisine,
    rating: Math.round((Math.random() * 1.5 + 3.5) * 10) / 10,
    description: restaurant.description,
    address: getTokyoAddress(index)
  }));
}

// 料理名に基づくフォールバックデータを生成する関数
function getSampleRestaurantsByDish(dishName: string): Restaurant[] {
  const baseName = dishName.replace(/です！|だよ！|！|。/g, '');
  const cuisineType = getCuisineForDish(baseName);
  
  const restaurants: Restaurant[] = [];
  
  for (let i = 0; i < 30; i++) {
    restaurants.push({
      id: i + 1,
      name: `${baseName}専門店 ${getShopSuffix(i)}`,
      latitude: 35.6762 + Math.random() * 0.01,
      longitude: 139.6503 + Math.random() * 0.01,
      cuisine: cuisineType,
      rating: Math.round((Math.random() * 1.5 + 3.5) * 10) / 10,
      description: `こだわりの${baseName}が自慢の専門店。${getRandomDescription(baseName)}`,
      address: getTokyoAddress(i)
    });
  }

  return restaurants;
}

// 店名の接尾辞を生成
function getShopSuffix(index: number): string {
  const suffixes = [
    '本家', '元祖', '老舗', '名店', '匠', '職人', '一番', '二番', '三番', '四番',
    '花月', '美味', '総本家', '本店', '支店', '分店', '新店', '本舗', '工房', '庵',
    '亭', '屋', '家', '処', '店', '食堂', 'ダイニング', 'キッチン', 'カフェ', 'ビストロ'
  ];
  return suffixes[index % suffixes.length];
}

// ランダムな説明文を生成
function getRandomDescription(dishName: string): string {
  const descriptions = [
    `秘伝のタレで作る${dishName}は絶品`,
    `厳選素材を使った${dishName}専門店`,
    `職人が作る本格${dishName}が味わえる`,
    `地元で愛され続ける${dishName}の名店`,
    `伝統的な製法で作る本格${dishName}`,
    `新鮮な食材を使った${dishName}が自慢`,
    `こだわりの${dishName}を心を込めて提供`,
    `家族連れにも人気の${dishName}専門店`
  ];
  return descriptions[Math.floor(Math.random() * descriptions.length)];
}

// 料理名から料理ジャンルを判定する関数
function getCuisineForDish(dishName: string): string {
  const dishLower = dishName.toLowerCase();
  
  const cuisineMapping: { [key: string]: string } = {
    'ラーメン': 'ラーメン',
    'らーめん': 'ラーメン',
    'ramen': 'ラーメン',
    '寿司': '寿司',
    'すし': '寿司',
    'sushi': '寿司',
    'カレー': 'カレー',
    'curry': 'カレー',
    'うどん': 'うどん・そば',
    'そば': 'うどん・そば',
    'パスタ': 'イタリアン',
    'pasta': 'イタリアン',
    'ピザ': 'イタリアン',
    'pizza': 'イタリアン',
    '焼肉': '焼肉',
    'yakiniku': '焼肉',
    '天ぷら': '和食',
    'てんぷら': '和食',
    'tempura': '和食',
    '中華': '中華',
    '餃子': '中華',
    'ギョーザ': '中華',
    'gyoza': '中華'
  };

  // 完全一致チェック
  if (cuisineMapping[dishName]) {
    return cuisineMapping[dishName];
  }

  // 部分一致チェック
  for (const [key, value] of Object.entries(cuisineMapping)) {
    if (dishName.includes(key) || dishLower.includes(key)) {
      return value;
    }
  }

  // デフォルトは料理名をそのまま
  return dishName;
}

// 東京の住所生成関数
function getTokyoAddress(index: number): string {
  const areas = [
    '東京都中央区銀座', '東京都新宿区新宿', '東京都渋谷区渋谷', '東京都港区赤坂', '東京都台東区浅草',
    '東京都千代田区丸の内', '東京都品川区品川', '東京都目黒区目黒', '東京都大田区蒲田', '東京都世田谷区三軒茶屋',
    '東京都杉並区阿佐ヶ谷', '東京都中野区中野', '東京都練馬区練馬', '東京都板橋区板橋', '東京都豊島区池袋',
    '東京都北区赤羽', '東京都荒川区日暮里', '東京都足立区北千住', '東京都葛飾区亀有', '東京都江戸川区葛西',
    '東京都墨田区押上', '東京都江東区豊洲', '東京都文京区本郷', '東京都武蔵野市吉祥寺', '東京都三鷹市三鷹',
    '東京都府中市府中', '東京都調布市調布', '東京都町田市町田', '東京都立川市立川', '東京都八王子市八王子'
  ];
  
  const area = areas[index % areas.length];
  const buildingNum = Math.floor(Math.random() * 9) + 1;
  const floorNum = Math.floor(Math.random() * 9) + 1;
  
  return `${area}${buildingNum}-${floorNum}-${buildingNum}`;
}
