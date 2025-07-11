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
}

// 日付ごとの食事一覧＋合計カロリー取得用レスポンス
export interface DailyConsumptionResponse {
  records: Array<ConsumptionRecord & { recipe: Recipe }>;
  totalCalories: number;
}
