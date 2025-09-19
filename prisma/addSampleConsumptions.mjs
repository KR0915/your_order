// prisma/addSampleConsumptions.mjs
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function addSampleConsumptions() {
  console.log('サンプル消費データの追加を開始します...')
  
  try {
    // 松本人志ユーザーを取得
    const user = await prisma.user.findFirst({
      where: {
        name: {
          contains: '松本'
        }
      }
    })
    
    if (!user) {
      console.log('松本人志ユーザーが見つかりません。先にユーザーを作成してください。')
      return
    }
    
    console.log(`ユーザー: ${user.name} (ID: ${user.id})`)
    
    // レシピを取得
    const recipes = await prisma.recipe.findMany({
      take: 10, // 最初の10個のレシピを使用
      orderBy: { id: 'asc' }
    })
    
    if (recipes.length === 0) {
      console.log('レシピが見つかりません。')
      return
    }
    
    // 過去3ヶ月間のサンプルデータを生成（より多くのデータ）
    const today = new Date()
    const sampleConsumptions = []
    
    // 過去90日間のデータを生成
    for (let i = 0; i < 90; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      
      // 平日は3食、週末は2食の設定
      const dayOfWeek = date.getDay()
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
      
      // 朝食
      date.setHours(8, 0, 0, 0)
      sampleConsumptions.push({
        userId: user.id,
        recipeId: recipes[i % recipes.length].id,
        quantity: 1,
        consumedAt: new Date(date)
      })
      
      // 昼食
      date.setHours(12, 30, 0, 0)
      sampleConsumptions.push({
        userId: user.id,
        recipeId: recipes[(i + 1) % recipes.length].id,
        quantity: 1,
        consumedAt: new Date(date)
      })
      
      // 夕食（週末は時々スキップ）
      if (!isWeekend || Math.random() > 0.3) {
        date.setHours(19, 0, 0, 0)
        sampleConsumptions.push({
          userId: user.id,
          recipeId: recipes[(i + 2) % recipes.length].id,
          quantity: 1,
          consumedAt: new Date(date)
        })
      }
      
      // 時々間食を追加
      if (Math.random() > 0.7) {
        date.setHours(15, 0, 0, 0)
        sampleConsumptions.push({
          userId: user.id,
          recipeId: recipes[(i + 3) % recipes.length].id,
          quantity: 1,
          consumedAt: new Date(date)
        })
      }
    }
    
    // 既存の消費データをクリア（テスト用）
    await prisma.consumption.deleteMany({
      where: { userId: user.id }
    })
    
    // サンプルデータを挿入
    for (const consumption of sampleConsumptions) {
      await prisma.consumption.create({
        data: consumption,
        include: { recipe: true }
      })
      console.log(`追加: ${consumption.consumedAt.toLocaleDateString()} - レシピID: ${consumption.recipeId}`)
    }
    
    console.log(`${sampleConsumptions.length}件のサンプル消費データを追加しました！`)
  } catch (error) {
    console.error('サンプルデータ追加中にエラーが発生しました:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addSampleConsumptions()
