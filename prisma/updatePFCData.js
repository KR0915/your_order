// prisma/updatePFCData.mjs
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// サンプルPFCデータ（一般的な料理の栄養価）
const samplePFCData = {
  1: { calorie: 250, protein: 25, fat: 8, carbs: 30 }, // チキンサラダ
  2: { calorie: 320, protein: 18, fat: 12, carbs: 35 }, // 焼き魚定食
  3: { calorie: 450, protein: 15, fat: 18, carbs: 55 }, // パスタ
  4: { calorie: 350, protein: 20, fat: 15, carbs: 40 }, // 牛丼
  5: { calorie: 280, protein: 22, fat: 10, carbs: 30 }, // 鶏むね肉のソテー
  6: { calorie: 400, protein: 12, fat: 20, carbs: 45 }, // オムライス
  7: { calorie: 300, protein: 25, fat: 8, carbs: 35 }, // 豆腐ハンバーグ
  8: { calorie: 380, protein: 16, fat: 16, carbs: 42 }, // ラーメン
  9: { calorie: 220, protein: 20, fat: 6, carbs: 25 }, // 刺身定食
  10: { calorie: 420, protein: 14, fat: 22, carbs: 48 }, // カレーライス
  11: { calorie: 350, protein: 18, fat: 14, carbs: 38 }, // 唐揚げ弁当
  12: { calorie: 280, protein: 24, fat: 8, carbs: 32 }, // グリルチキン
  13: { calorie: 320, protein: 16, fat: 12, carbs: 36 }, // 焼きそば
  14: { calorie: 200, protein: 22, fat: 4, carbs: 20 }, // 野菜炒め
  15: { calorie: 450, protein: 20, fat: 25, carbs: 35 }, // ピザ
  16: { calorie: 380, protein: 15, fat: 18, carbs: 42 }, // チャーハン
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
