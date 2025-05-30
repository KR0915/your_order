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