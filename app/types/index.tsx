export interface Test1 {
    id: number; // 自動インクリメントされるID
    name: string; // 名前
    createdAt: Date; // 作成日時
}

export interface Test2 {
    id: number; // 自動インクリメントされるID
    name: string; // 名前
    createdAt: Date; // 作成日時
}

export interface Recipe {
  id: number;       // 1～64 のユニークID
  combo: string;    // "1,2,5,6,9,10" のようなキー
  name: string;     // recipeMap[combo] で取り出せる料理名
  createdAt: Date;
}

// ユーザー情報
export interface User {
  id: number;
  name: string;
  email: string;
  targetCal: number;
  targetProtein?: number;    // 目標タンパク質 (g/日)
  targetFat?: number;        // 目標脂質 (g/日)
  targetCarbs?: number;      // 目標炭水化物 (g/日)
  dislikedFoods?: string[];  // 苦手な食べ物
  allergens?: string[];      // アレルギー食品
  createdAt: Date;
}

// サーバーから返ってくるログイン・登録レスポンス
export interface AuthResponse {
  user?: User;
  userId?: number;        // 登録時に返ってくる userId
  message?: string;       // e.g. "ok" / "logged out"
  error?: string;
}

// 会員登録フォームで入力する値
export interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  targetCal: number;
}

// ログインフォームで入力する値
export interface LoginFormValues {
  email: string;
  password: string;
}

// 認証状態を管理する Context の型
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (values: LoginFormValues) => Promise<void>;
  register: (values: RegisterFormValues) => Promise<void>;
  logout: () => Promise<void>;
}

// API 呼び出し用のエンドポイント定義（例）
// Register → POST /api/auth/register で返る JSON
// Login    → POST /api/auth/login    で返る JSON と Set-Cookie
// Logout   → POST /api/auth/logout   で返る JSON

// 消費記録（食事登録）用データ構造
export interface ConsumptionRecord {
  id: number;
  userId: number;
  recipeId: number;
  quantity: number;
  consumedAt: Date;
  recipeName?: string; // レシピ名（オプション）
}

// レシピ情報（既存）
export interface Recipe {
  id: number;       // 1～64 のユニークID
  combo: string;    // "1,2,5,6,9,10" のようなキー
  name: string;     // recipeMap[combo] で取り出せる料理名
  createdAt: Date;
  calorie?: number | null; // カロリー
  protein?: number | null; // タンパク質 (g)
  fat?: number | null;     // 脂質 (g)  
  carbs?: number | null;   // 炭水化物 (g)
}

// 日付ごとの食事一覧＋合計カロリー取得用レスポンス
export interface DailyConsumptionResponse {
  records: Array<ConsumptionRecord & { recipe: Recipe }>;
  totalCalories: number;
}

// PFCダッシュボード用の型定義
export interface DailyPFCData {
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
}

export interface MonthlyPFCData {
  month: string;
  totalCalories: number;
  totalProtein: number;
  totalFat: number;
  totalCarbs: number;
  dayCount: number;
  averageCalories: number;
  averageProtein: number;
  averageFat: number;
  averageCarbs: number;
}

export interface PFCDashboardResponse {
  viewType: 'daily' | 'monthly';
  data: DailyPFCData[] | MonthlyPFCData[];
  summary?: {
    totalDays: number;
    averageCalories: number;
    averageProtein: number;
    averageFat: number;
    averageCarbs: number;
  };
  userInfo: {
    id: number;
    name: string;
    targetCal: number;
    email: string;
  };
}

// レストラン関連の型定義
export interface Restaurant {
  id: string | number;
  name: string;
  latitude: number;
  longitude: number;
  cuisine: string;
  rating: number;
  description?: string;
  address?: string;
  phone?: string;
}

// ホットペッパーAPI用のレストラン型
export interface HotPepperRestaurant {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  cuisine: string;
  rating?: number;
  description?: string;
  address: string;
  phone?: string;
  access?: string;
  genre?: string;
  budget?: string;
  open?: string;
  close?: string;
  photo?: {
    pc?: {
      l?: string;
      m?: string;
      s?: string;
    };
    mobile?: {
      l?: string;
      s?: string;
    };
  };
  urls?: {
    pc?: string;
    mobile?: string;
  };
}

// ホットペッパーAPI レスポンス型
export interface HotPepperApiResponse {
  results: {
    shop: Array<{
      id: string;
      name: string;
      name_kana?: string;
      lat: number;
      lng: number;
      genre: {
        name: string;
        catch?: string;
      };
      address: string;
      access?: string;
      tel?: string;
      open?: string;
      close?: string;
      catch?: string;
      budget?: {
        average?: string;
        name?: string;
      };
      photo: {
        pc: {
          l: string;
          m: string;
          s: string;
        };
        mobile: {
          l: string;
          s: string;
        };
      };
      urls: {
        pc: string;
      };
    }>;
    results_available: number;
    results_returned: string;
    results_start: number;
  };
}
