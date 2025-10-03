// test-login-api.js
const bcrypt = require('bcryptjs');

async function testPasswordHash() {
  const testPassword = 'password123';
  const testHash = '$2a$10$abcdefghijklmnopqrstuv.abcdefghijklmnopqrstuv.abcdefghijk'; // 例
  
  console.log('パスワードハッシュテスト:');
  console.log('入力パスワード:', testPassword);
  
  // 新しいハッシュを生成
  const newHash = await bcrypt.hash(testPassword, 10);
  console.log('新しいハッシュ:', newHash);
  
  // ハッシュの検証
  const isValid = await bcrypt.compare(testPassword, newHash);
  console.log('ハッシュ検証結果:', isValid);
  
  // 実際のAPIと同じロジックをテスト
  console.log('\n--- ログインロジックテスト ---');
  
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  });
  
  try {
    // 実際のユーザーを取得
    const user = await prisma.user.findUnique({
      where: { email: 'sato@example.com' }
    });
    
    console.log('ユーザー取得:', !!user);
    console.log('hashedPassword存在:', !!user?.hashedPassword);
    
    if (user && user.hashedPassword) {
      const passwordMatch = await bcrypt.compare('password123', user.hashedPassword);
      console.log('パスワード照合結果:', passwordMatch);
      
      if (!passwordMatch) {
        const wrongPasswordMatch = await bcrypt.compare('wrongpassword', user.hashedPassword);
        console.log('間違ったパスワードでの照合:', wrongPasswordMatch);
      }
    }
    
  } catch (error) {
    console.error('エラー:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testPasswordHash();