// prisma/debugData.mjs
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function debugData() {
  console.log('=== デバッグ: データベース状況確認 ===')
  
  try {
    // ユーザー情報確認
    const users = await prisma.user.findMany()
    console.log(`\nユーザー数: ${users.length}`)
    users.forEach(user => {
      console.log(`- ID: ${user.id}, 名前: ${user.name}, 目標Cal: ${user.targetCal}`)
    })
    
    // 消費データ確認
    const consumptions = await prisma.consumption.findMany({
      include: {
        recipe: true,
        user: true
      },
      orderBy: {
        consumedAt: 'desc'
      },
      take: 10
    })
    
    console.log(`\n消費データ数: ${consumptions.length}`)
    consumptions.forEach(c => {
      console.log(`- ユーザー: ${c.user.name}, レシピ: ${c.recipe.name}, 日時: ${c.consumedAt.toLocaleDateString()}`)
    })
    
    // 特定ユーザー（松本人志）のデータ確認
    const matsumotoUser = await prisma.user.findFirst({
      where: {
        name: {
          contains: '松本'
        }
      }
    })
    
    if (matsumotoUser) {
      console.log(`\n松本人志ユーザー見つかりました: ID ${matsumotoUser.id}`)
      
      const matsumotoConsumptions = await prisma.consumption.findMany({
        where: {
          userId: matsumotoUser.id
        },
        include: {
          recipe: true
        },
        orderBy: {
          consumedAt: 'desc'
        }
      })
      
      console.log(`松本人志の消費データ数: ${matsumotoConsumptions.length}`)
      matsumotoConsumptions.forEach(c => {
        console.log(`- ${c.consumedAt.toLocaleDateString()}: ${c.recipe.name} (${c.recipe.calorie}kcal)`)
      })
      
      // 最新1週間のデータ確認
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
      
      const recentData = await prisma.consumption.findMany({
        where: {
          userId: matsumotoUser.id,
          consumedAt: {
            gte: oneWeekAgo
          }
        },
        include: {
          recipe: true
        }
      })
      
      console.log(`\n過去1週間の松本人志のデータ数: ${recentData.length}`)
      
    } else {
      console.log('\n松本人志ユーザーが見つかりません')
    }
    
  } catch (error) {
    console.error('デバッグ中にエラーが発生しました:', error)
  } finally {
    await prisma.$disconnect()
  }
}

debugData()
