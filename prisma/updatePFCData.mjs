// prisma/updatePFCData.mjs
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// サンプルPFCデータ（一般的な料理の栄養価）
const samplePFCData = {
  65: { calorie: 250, protein: 25, fat: 8, carbs: 30 }, // おろしハンバーグ
  66: { calorie: 320, protein: 18, fat: 12, carbs: 35 }, // 豚しゃぶサラダ
  67: { calorie: 450, protein: 15, fat: 18, carbs: 55 }, // 鶏むね肉の梅しそ焼き
  68: { calorie: 350, protein: 20, fat: 15, carbs: 40 }, // 筑前煮
  69: { calorie: 280, protein: 22, fat: 10, carbs: 30 }, // 親子丼
  70: { calorie: 400, protein: 12, fat: 20, carbs: 45 }, // 肉じゃが
  71: { calorie: 300, protein: 25, fat: 8, carbs: 35 }, // 鶏そぼろ丼
  72: { calorie: 380, protein: 16, fat: 16, carbs: 42 }, // 冷しゃぶうどん
  73: { calorie: 220, protein: 20, fat: 6, carbs: 25 }, // 鶏ももの甘辛炒め
  74: { calorie: 420, protein: 14, fat: 22, carbs: 48 }, // 牛丼
  75: { calorie: 350, protein: 18, fat: 14, carbs: 38 }, // カレーライス
  76: { calorie: 280, protein: 24, fat: 8, carbs: 32 }, // 鮭の塩焼き定食
  77: { calorie: 320, protein: 16, fat: 12, carbs: 36 }, // 味噌カツ
  78: { calorie: 200, protein: 22, fat: 4, carbs: 20 }, // きんぴらごぼうと豚汁
  79: { calorie: 450, protein: 20, fat: 25, carbs: 35 }, // 麻婆豆腐
  80: { calorie: 380, protein: 15, fat: 18, carbs: 42 }, // 餃子定食
  81: { calorie: 300, protein: 20, fat: 10, carbs: 35 }, // 鮭フレーク丼
  82: { calorie: 350, protein: 18, fat: 16, carbs: 38 }, // 回鍋肉
  83: { calorie: 280, protein: 25, fat: 8, carbs: 30 }, // 鶏の照り焼き
  84: { calorie: 250, protein: 22, fat: 6, carbs: 28 }, // 鮭のホイル焼き
  85: { calorie: 400, protein: 20, fat: 18, carbs: 40 }, // 豚の生姜焼き
  86: { calorie: 420, protein: 22, fat: 20, carbs: 35 }, // 鶏のから揚げ
  87: { calorie: 380, protein: 16, fat: 15, carbs: 45 }, // ビビンバ
  88: { calorie: 320, protein: 18, fat: 12, carbs: 38 }, // エビチリ
  89: { calorie: 380, protein: 25, fat: 16, carbs: 35 }, // 照り焼きハンバーグ
  90: { calorie: 350, protein: 18, fat: 16, carbs: 32 }, // 豚キムチ炒め
  91: { calorie: 280, protein: 20, fat: 10, carbs: 30 }, // 豚バラ大根
  92: { calorie: 300, protein: 15, fat: 18, carbs: 25 }, // 麻婆茄子
  93: { calorie: 420, protein: 20, fat: 18, carbs: 45 }, // 回鍋肉丼
  94: { calorie: 250, protein: 24, fat: 6, carbs: 28 }, // 焼き魚定食
  95: { calorie: 450, protein: 25, fat: 20, carbs: 40 }, // チキンカツ
  96: { calorie: 200, protein: 12, fat: 8, carbs: 25 }, // 野菜炒め定食
  97: { calorie: 280, protein: 22, fat: 10, carbs: 25 }, // サバの味噌煮
  98: { calorie: 400, protein: 18, fat: 16, carbs: 48 }, // ハヤシライス
  99: { calorie: 380, protein: 20, fat: 14, carbs: 45 }, // 魚介パスタ
  100: { calorie: 500, protein: 22, fat: 22, carbs: 50 }, // カツ丼
  101: { calorie: 320, protein: 25, fat: 8, carbs: 35 }, // 海鮮丼
  102: { calorie: 240, protein: 20, fat: 8, carbs: 25 }, // 鯖の塩焼き
  103: { calorie: 380, protein: 18, fat: 16, carbs: 40 }, // タコライス
  104: { calorie: 420, protein: 22, fat: 18, carbs: 38 }, // チーズタッカルビ
  105: { calorie: 300, protein: 20, fat: 12, carbs: 28 }, // 肉豆腐
  106: { calorie: 400, protein: 18, fat: 16, carbs: 45 }, // 海鮮あんかけ焼きそば
  107: { calorie: 480, protein: 20, fat: 22, carbs: 45 }, // エビフライ定食
  108: { calorie: 450, protein: 25, fat: 18, carbs: 40 }, // ビーフシチュー
  109: { calorie: 380, protein: 28, fat: 12, carbs: 35 }, // 照り焼きチキン丼
  110: { calorie: 420, protein: 18, fat: 20, carbs: 42 }, // カキフライ定食
  111: { calorie: 550, protein: 35, fat: 22, carbs: 45 }, // ステーキ丼
  112: { calorie: 400, protein: 25, fat: 18, carbs: 30 }, // 豚トロ塩焼き
  113: { calorie: 480, protein: 25, fat: 22, carbs: 40 }, // 唐揚げ丼
  114: { calorie: 380, protein: 20, fat: 14, carbs: 45 }, // シーフードカレー
  115: { calorie: 450, protein: 28, fat: 18, carbs: 38 }, // チキン南蛮
  116: { calorie: 350, protein: 22, fat: 14, carbs: 32 }, // 焼き鳥丼
  117: { calorie: 280, protein: 25, fat: 8, carbs: 25 }, // かつおたたき定食
  118: { calorie: 300, protein: 20, fat: 12, carbs: 28 }, // イカ焼き定食
  119: { calorie: 220, protein: 15, fat: 8, carbs: 25 }, // 豚汁定食
  120: { calorie: 350, protein: 22, fat: 14, carbs: 35 }, // 白身魚フライ定食
  121: { calorie: 300, protein: 12, fat: 8, carbs: 50 }, // 野菜カレー
  122: { calorie: 320, protein: 20, fat: 12, carbs: 32 }, // 牛すじ煮込み定食
  123: { calorie: 400, protein: 20, fat: 16, carbs: 42 }, // 豚丼
  124: { calorie: 380, protein: 30, fat: 14, carbs: 32 }, // チキンステーキ定食
  125: { calorie: 250, protein: 18, fat: 8, carbs: 28 }, // カレイの煮付け定食
  126: { calorie: 450, protein: 28, fat: 20, carbs: 35 }, // ニンニク醤油焼き肉定食
  127: { calorie: 300, protein: 22, fat: 12, carbs: 28 }, // 鮭のムニエル定食
  128: { calorie: 380, protein: 20, fat: 16, carbs: 38 }, // アジフライ定食
};

async function updatePFCData() {
  console.log('PFCデータの更新を開始します...')
  
  try {
    for (const [recipeId, pfcData] of Object.entries(samplePFCData)) {
      const id = parseInt(recipeId)
      
      const updated = await prisma.recipe.update({
        where: { id },
        data: pfcData,
      })
      
      console.log(`Recipe ${id} updated:`, updated.name, pfcData)
    }
    
    console.log('PFCデータの更新が完了しました!')
  } catch (error) {
    console.error('PFCデータの更新中にエラーが発生しました:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updatePFCData()
