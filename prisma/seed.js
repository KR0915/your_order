// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ─────────────────────────────────────────────
// ① サンプル ユーザー データ (User)
// ─────────────────────────────────────────────
const userSeed = [
  { name: 'sato',   email: 'sato@example.com',   targetCal: 1800 },
  { name: 'tanaka', email: 'tanaka@example.com', targetCal: 2000 },
  { name: 'yamada', email: 'yamada@example.com', targetCal: 1700 },
];

// ─────────────────────────────────────────────
// ② サンプル レシピ データ (Recipe)
//   combo は文字列型なので文字列で upsert する
// ─────────────────────────────────────────────
const recipeSeed = {
  1:  { name: 'おろしハンバーグ',            calorie: 650 },
  2:  { name: '豚しゃぶサラダ',             calorie: 450 },
  3:  { name: '鶏むね肉の梅しそ焼き',        calorie: 400 },
  4:  { name: '筑前煮',                     calorie: 350 },
  5:  { name: '親子丼',                     calorie: 700 },
  6:  { name: '肉じゃが',                   calorie: 500 },
  7:  { name: '鶏そぼろ丼',                 calorie: 680 },
  8:  { name: '冷しゃぶうどん',             calorie: 600 },
  9:  { name: '鶏ももの甘辛炒め',           calorie: 550 },
  10: { name: '牛丼',                       calorie: 750 },
  11: { name: 'カレーライス',               calorie: 800 },
  12: { name: '鮭の塩焼き定食',             calorie: 520 },
  13: { name: '味噌カツ',                   calorie: 700 },
  14: { name: 'きんぴらごぼうと豚汁',       calorie: 400 },
  15: { name: '麻婆豆腐',                   calorie: 650 },
  16: { name: '餃子定食',                   calorie: 720 },
  17: { name: '鮭フレーク丼',               calorie: 600 },
  18: { name: '回鍋肉',                     calorie: 580 },
  19: { name: '鶏の照り焼き',               calorie: 500 },
  20: { name: '鮭のホイル焼き',             calorie: 480 },
  21: { name: '豚の生姜焼き',               calorie: 620 },
  22: { name: '鶏のから揚げ',               calorie: 700 },
  23: { name: 'ビビンバ',                   calorie: 650 },
  24: { name: 'エビチリ',                   calorie: 680 },
  25: { name: '照り焼きハンバーグ',         calorie: 670 },
  26: { name: '豚キムチ炒め',               calorie: 550 },
  27: { name: '豚バラ大根',                 calorie: 480 },
  28: { name: '麻婆茄子',                   calorie: 600 },
  29: { name: '回鍋肉丼',                   calorie: 700 },
  30: { name: '焼き魚定食',                 calorie: 500 },
  31: { name: 'チキンカツ',                 calorie: 720 },
  32: { name: '野菜炒め定食',               calorie: 450 },
  33: { name: 'サバの味噌煮',               calorie: 550 },
  34: { name: 'ハヤシライス',               calorie: 800 },
  35: { name: '魚介パスタ',                 calorie: 750 },
  36: { name: 'カツ丼',                     calorie: 780 },
  37: { name: '海鮮丼',                     calorie: 700 },
  38: { name: '鯖の塩焼き',                 calorie: 500 },
  39: { name: 'タコライス',                 calorie: 650 },
  40: { name: 'チーズタッカルビ',           calorie: 750 },
  41: { name: '肉豆腐',                     calorie: 550 },
  42: { name: '海鮮あんかけ焼きそば',       calorie: 720 },
  43: { name: 'エビフライ定食',             calorie: 800 },
  44: { name: 'ビーフシチュー',             calorie: 850 },
  45: { name: '照り焼きチキン丼',           calorie: 700 },
  46: { name: 'カキフライ定食',             calorie: 750 },
  47: { name: 'ステーキ丼',                 calorie: 900 },
  48: { name: '豚トロ塩焼き',               calorie: 660 },
  49: { name: '唐揚げ丼',                   calorie: 780 },
  50: { name: 'シーフードカレー',           calorie: 820 },
  51: { name: 'チキン南蛮',                 calorie: 730 },
  52: { name: '焼き鳥丼',                   calorie: 680 },
  53: { name: 'かつおたたき定食',           calorie: 550 },
  54: { name: 'イカ焼き定食',               calorie: 520 },
  55: { name: '豚汁定食',                   calorie: 400 },
  56: { name: '白身魚フライ定食',           calorie: 750 },
  57: { name: '野菜カレー',                 calorie: 780 },
  58: { name: '牛すじ煮込み定食',           calorie: 800 },
  59: { name: '豚丼',                       calorie: 720 },
  60: { name: 'チキンステーキ定食',         calorie: 700 },
  61: { name: 'カレイの煮付け定食',         calorie: 500 },
  62: { name: 'ニンニク醤油焼き肉定食',     calorie: 780 },
  63: { name: '鮭のムニエル定食',           calorie: 550 },
  64: { name: 'アジフライ定食',             calorie: 780 },
};

// ─────────────────────────────────────────────
// ③ サンプル Consumption データ (中間テーブル)
//   「どのユーザーが、どのレシピを、いつ、何食分」
// ─────────────────────────────────────────────
const consumptionSeed = [
  {
    // sato が おろしハンバーグ( combo = "1" ) を 1 食、2025-06-05 に食べた例
    userEmail: 'sato@example.com',
    recipeCombo: '1',
    quantity: 1,
    consumedAt: new Date('2025-06-05T12:00:00+09:00'),
  },
  {
    // tanaka が カレーライス(combo = "11") を 2 食、2025-06-05 に食べた例
    userEmail: 'tanaka@example.com',
    recipeCombo: '11',
    quantity: 2,
    consumedAt: new Date('2025-06-05T18:30:00+09:00'),
  },
  {
    // yamada が 野菜炒め定食(combo = "32") を 1 食、2025-06-06 に食べる予定の例
    userEmail: 'yamada@example.com',
    recipeCombo: '32',
    quantity: 1,
    consumedAt: new Date('2025-06-06T12:00:00+09:00'),
  },
];

async function seed() {
  // ────────────
  // ① User の upsert
  // ────────────
  for (const u of userSeed) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {
        name: u.name,
        targetCal: u.targetCal,
      },
      create: {
        name: u.name,
        email: u.email,
        targetCal: u.targetCal,
      },
    });
  }

  // ────────────
  // ② Recipe の upsert
  // ────────────
  for (const [combo, data] of Object.entries(recipeSeed)) {
    await prisma.recipe.upsert({
      where: { combo: combo.toString() },
      update: {
        name: data.name,
        calorie: data.calorie,
      },
      create: {
        combo: combo.toString(),
        name: data.name,
        calorie: data.calorie,
      },
    });
  }

  // ────────────────────────────────────
  // ③ Consumption の upsert
  //   ユーザーとレシピの主キー（email, combo）を使って関連づけ
  // ────────────────────────────────────
  for (const c of consumptionSeed) {
    await prisma.consumption.upsert({
      // 「id: X」などの一意キーがない場合は、シンプルに事前にレコードがない前提で create してもOKです。
      // ここでは、email と combo の複合キーがないため、id で upsert するパターンではなく、
      // ひとまず「where: { id: 0 } で必ず存在しないレコードを指定しようとしてエラー回避」して create のみ実行する方法にします。
      // もしくは consumption に「userId と recipeId の複合ユニーク制約」を追加すれば upsert が可能になります。
      where: { id: -1 }, // 存在しないIDを指定 → create 実行へ
      update: {},
      create: {
        user: {
          connect: { email: c.userEmail },  
        },
        recipe: {
          connect: { combo: c.recipeCombo },
        },
        quantity: c.quantity,
        consumedAt: c.consumedAt,
      },
    });
  }

  console.log('✅ ユーザー・レシピ・Consumption のシードが完了しました');
  await prisma.$disconnect();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
