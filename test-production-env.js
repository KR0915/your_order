// test-production-env.js
// Production環境をシミュレートしてテスト
require('dotenv').config({ path: '.env.production' });

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function testAuthComponents() {
  console.log('=== Production Environment Test ===');
  
  // 環境変数チェック
  console.log('\n1. Environment Variables:');
  console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
  console.log('JWT_SECRET length:', process.env.JWT_SECRET?.length || 0);
  console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
  console.log('NODE_ENV:', process.env.NODE_ENV);
  
  // NODE_ENV を production に設定
  const originalNodeEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = 'production';
  
  try {
    // JWT Secret テスト
    console.log('\n2. JWT Secret Test:');
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("Missing JWT_SECRET environment variable");
    }
    console.log('JWT Secret retrieved successfully');
    
    // bcrypt テスト
    console.log('\n3. bcrypt Test:');
    const plainPassword = 'password123';
    const hashedPassword = '$2a$10$abcdefghijklmnopqrstuu2zTJsUoKPJIwMVVLxAFjqs8mEjbYP8G'; // 既知のハッシュ
    
    try {
      const match = await bcrypt.compare(plainPassword, hashedPassword);
      console.log('bcrypt comparison completed:', match);
    } catch (bcryptError) {
      console.error('bcrypt error:', bcryptError);
      throw bcryptError;
    }
    
    // JWT生成テスト
    console.log('\n4. JWT Generation Test:');
    try {
      const token = jwt.sign(
        { userId: 1, email: 'test@example.com' },
        secret,
        { expiresIn: "1d" }
      );
      console.log('JWT token generated successfully');
      console.log('Token length:', token.length);
      
      // JWT検証テスト
      const decoded = jwt.verify(token, secret);
      console.log('JWT verification successful:', decoded);
      
    } catch (jwtError) {
      console.error('JWT error:', jwtError);
      throw jwtError;
    }
    
    console.log('\n✅ All tests passed! Production environment simulation successful.');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    console.error('Error details:', error.message);
  } finally {
    // NODE_ENV を元に戻す
    process.env.NODE_ENV = originalNodeEnv;
  }
}

testAuthComponents();