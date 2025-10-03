// debug-vercel-users.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

async function checkUsers() {
  try {
    console.log('データベース接続確認中...');
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        hashedPassword: true,
        targetCal: true,
        createdAt: true
      }
    });
    
    console.log('ユーザー数:', users.length);
    users.forEach(user => {
      console.log({
        id: user.id,
        name: user.name,
        email: user.email,
        hasPassword: !!user.hashedPassword,
        passwordLength: user.hashedPassword ? user.hashedPassword.length : 0,
        targetCal: user.targetCal,
        createdAt: user.createdAt
      });
    });
    
  } catch (error) {
    console.error('エラー:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();