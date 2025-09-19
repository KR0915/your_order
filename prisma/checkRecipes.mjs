// prisma/checkRecipes.mjs
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkRecipes() {
  console.log('データベース内のレシピを確認しています...')
  
  try {
    const recipes = await prisma.recipe.findMany({
      orderBy: { id: 'asc' }
    })
    
    console.log(`レシピ数: ${recipes.length}`)
    
    recipes.forEach(recipe => {
      console.log(`ID: ${recipe.id}, Name: ${recipe.name}, Combo: ${recipe.combo}`)
    })
    
    if (recipes.length === 0) {
      console.log('レシピが存在しません。先にレシピを作成する必要があります。')
    }
  } catch (error) {
    console.error('レシピ確認中にエラーが発生しました:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkRecipes()
