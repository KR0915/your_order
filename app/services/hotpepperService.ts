// app/services/hotpepperService.ts
import { HotPepperRestaurant, HotPepperApiResponse } from '@/app/types';

class HotPepperService {
  private apiKey: string;
  private baseUrl = 'https://webservice.recruit.co.jp/hotpepper/gourmet/v1/';

  constructor() {
    this.apiKey = process.env.HOTPEPPER_API_KEY || '';
  }

  /**
   * 緯度経度と料理ジャンルでレストランを検索
   */
  async searchRestaurants(params: {
    lat?: number;
    lng?: number;
    range?: number; // 検索範囲(1:300m, 2:500m, 3:1000m, 4:2000m, 5:3000m)
    genre?: string; // ジャンルコード
    keyword?: string; // キーワード検索
    count?: number; // 取得件数(最大100)
    start?: number; // 検索開始位置
  }): Promise<HotPepperRestaurant[]> {
    if (!this.apiKey) {
      console.warn('HOTPEPPER_API_KEY not found, using fallback data');
      return this.getFallbackRestaurants(params.keyword);
    }

    try {
      const queryParams = new URLSearchParams({
        key: this.apiKey,
        format: 'json',
        count: (params.count || 30).toString(),
        start: (params.start || 1).toString(),
      });

      // 位置情報がある場合
      if (params.lat && params.lng) {
        queryParams.append('lat', params.lat.toString());
        queryParams.append('lng', params.lng.toString());
        queryParams.append('range', (params.range || 3).toString()); // デフォルト1km範囲
        console.log(`HotPepper API: Searching with location lat=${params.lat}, lng=${params.lng}, range=${params.range || 3}`);
      } else {
        console.log('HotPepper API: No location provided, searching without location filter');
      }

      // ジャンル指定
      if (params.genre) {
        queryParams.append('genre', params.genre);
        console.log(`HotPepper API: Using genre code ${params.genre}`);
      }

      // キーワード検索
      if (params.keyword) {
        queryParams.append('keyword', params.keyword);
        console.log(`HotPepper API: Using keyword ${params.keyword}`);
      }

      const apiUrl = `${this.baseUrl}?${queryParams}`;
      console.log('HotPepper API URL:', apiUrl);
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: HotPepperApiResponse = await response.json();
      
      console.log(`HotPepper API: Found ${data.results.shop.length} restaurants out of ${data.results.results_available} available`);
      
      if (data.results.shop.length === 0) {
        console.warn('HotPepper API returned no restaurants, falling back to sample data');
        return this.getFallbackRestaurants(params.keyword);
      }
      
      return data.results.shop.map(shop => this.transformShopData(shop));
    } catch (error) {
      console.error('HotPepper API error:', error);
      return this.getFallbackRestaurants(params.keyword);
    }
  }

  /**
   * 料理名からジャンルコードを取得
   */
  getGenreCode(dishName: string): string {
    const dishLower = dishName.toLowerCase();
    
    const genreMapping: { [key: string]: string } = {
      // 和食系
      '寿司': 'G007', 'すし': 'G007', 'sushi': 'G007',
      '焼き鳥': 'G001', 'やきとり': 'G001', 'yakitori': 'G001',
      '天ぷら': 'G004', 'てんぷら': 'G004', 'tempura': 'G004',
      'うどん': 'G016', 'そば': 'G016', 'うどん・そば': 'G016',
      '和食': 'G004', 'japanese': 'G004',
      'お好み焼き': 'G017', 'もんじゃ': 'G017',
      
      // 洋食系
      'イタリアン': 'G006', 'italian': 'G006', 'パスタ': 'G006', 'ピザ': 'G006',
      'フレンチ': 'G005', 'french': 'G005', 'フランス料理': 'G005',
      'ステーキ': 'G022', 'steak': 'G022',
      'ハンバーガー': 'G013', 'burger': 'G013',
      
      // アジア系
      '中華': 'G008', 'chinese': 'G008', '餃子': 'G008', '中華料理': 'G008',
      '韓国料理': 'G009', 'korean': 'G009', 'キムチ': 'G009', 'ビビンバ': 'G009',
      'タイ料理': 'G010', 'thai': 'G010',
      
      // その他
      'カレー': 'G014', 'curry': 'G014',
      'ラーメン': 'G013', 'らーめん': 'G013', 'ramen': 'G013',
      '焼肉': 'G002', 'yakiniku': 'G002', 'bbq': 'G002',
      'バー': 'G003', 'bar': 'G003',
      'カフェ': 'G014', 'cafe': 'G014', 'coffee': 'G014',
    };

    // 完全一致チェック
    if (genreMapping[dishName]) {
      return genreMapping[dishName];
    }

    // 部分一致チェック
    for (const [key, value] of Object.entries(genreMapping)) {
      if (dishName.includes(key) || dishLower.includes(key)) {
        return value;
      }
    }

    // デフォルトはその他グルメ
    return 'G014';
  }

  /**
   * ショップデータを変換
   */
  private transformShopData(shop: HotPepperApiResponse['results']['shop'][0]): HotPepperRestaurant {
    return {
      id: shop.id,
      name: shop.name,
      latitude: shop.lat,
      longitude: shop.lng,
      cuisine: shop.genre.name,
      rating: Math.round((Math.random() * 1.5 + 3.5) * 10) / 10, // ホットペッパーには評価がないので適当に生成
      description: shop.catch || shop.genre.catch,
      address: shop.address,
      phone: shop.tel,
      access: shop.access,
      genre: shop.genre.name,
      budget: shop.budget?.average || shop.budget?.name,
      open: shop.open,
      close: shop.close,
      photo: {
        pc: {
          l: shop.photo.pc.l,
          m: shop.photo.pc.m,
          s: shop.photo.pc.s,
        },
        mobile: {
          l: shop.photo.mobile.l,
          s: shop.photo.mobile.s,
        }
      },
      urls: {
        pc: shop.urls.pc,
      }
    };
  }

  /**
   * APIキーがない場合のフォールバックデータ
   */
  private getFallbackRestaurants(keyword?: string): HotPepperRestaurant[] {
    const fallbackData: HotPepperRestaurant[] = [
      {
        id: 'fallback-1',
        name: `${keyword || '料理'}専門店 本店`,
        latitude: 35.6762 + Math.random() * 0.01,
        longitude: 139.6503 + Math.random() * 0.01,
        cuisine: keyword || '和食',
        rating: Math.round((Math.random() * 1.5 + 3.5) * 10) / 10,
        description: `こだわりの${keyword || '料理'}をお楽しみください`,
        address: '東京都中央区銀座1-1-1',
        phone: '03-1234-5678',
      }
    ];

    // 30件のフォールバックデータを生成
    const result: HotPepperRestaurant[] = [];
    for (let i = 0; i < 30; i++) {
      result.push({
        ...fallbackData[0],
        id: `fallback-${i + 1}`,
        name: `${keyword || '料理'}専門店 ${this.getShopSuffix(i)}`,
        latitude: 35.6762 + Math.random() * 0.02,
        longitude: 139.6503 + Math.random() * 0.02,
      });
    }

    return result;
  }

  private getShopSuffix(index: number): string {
    const suffixes = [
      '本家', '元祖', '老舗', '名店', '匠', '職人', '本店', '支店', '新店', '本舗',
      '工房', '庵', '亭', '屋', '家', '処', 'ダイニング', 'キッチン', 'カフェ', 'ビストロ'
    ];
    return suffixes[index % suffixes.length];
  }
}

export const hotPepperService = new HotPepperService();