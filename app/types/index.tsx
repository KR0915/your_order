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

/** 質問１つ分のデータ構造 */
export interface Question {
  /** 質問ID */
  id: number;
  /** 質問文 */
  text: string;
  /** 選択肢（二択） */
  options: Option[];
}

/** 各選択肢のデータ構造 */
export interface Option {
  /** 選択肢ID */
  id: number;
  /** 選択肢テキスト */
  text: string;
}

/** 質問一覧 */
export const questions: Question[] = [
  {
    id: 1,
    text: "お肉が食べたい？それとも魚が食べたい？",
    options: [
      { id: 1, text: "お肉" },
      { id: 2, text: "魚" },
    ],
  },
  {
    id: 2,
    text: "今日は和食の気分？それとも洋食の気分？",
    options: [
      { id: 3, text: "和食" },
      { id: 4, text: "洋食" },
    ],
  },
  {
    id: 3,
    text: "あっさりしたものが食べたい？それともこってりしたものが食べたい？",
    options: [
      { id: 5, text: "あっさり" },
      { id: 6, text: "こってり" },
    ],
  },
  {
    id: 4,
    text: "温かいものが食べたい？それとも冷たいものが食べたい？",
    options: [
      { id: 7, text: "温かいもの" },
      { id: 8, text: "冷たいもの" },
    ],
  },
  {
    id: 5,
    text: "ご飯（主食）はしっかり食べたい？それとも軽めに済ませたい？",
    options: [
      { id: 9, text: "しっかり食べたい" },
      { id: 10, text: "軽めに済ませたい" },
    ],
  },
  {
    id: 6,
    text: "辛いものは好き？それとも苦手？",
    options: [
      { id: 11, text: "辛いものが好き" },
      { id: 12, text: "辛いものは苦手" },
    ],
  },
  {
    id: 7,
    text: "今すぐ食べたい？それとも少し待っても大丈夫？",
    options: [
      { id: 13, text: "今すぐ食べたい" },
      { id: 14, text: "少し待っても大丈夫" },
    ],
  },
  {
    id: 8,
    text: "カロリー重視で選ぶ？それとも栄養バランス重視で選ぶ？",
    options: [
      { id: 15, text: "カロリー重視" },
      { id: 16, text: "栄養バランス重視" },
    ],
  },
];
