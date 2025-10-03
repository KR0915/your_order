// test-vercel-login.js
// 本番環境のログインAPIをテストするスクリプト

const https = require('https');

function testVercelLogin(email, password) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      email: email,
      password: password
    });

    const options = {
      hostname: 'your-order-omega.vercel.app',
      port: 443,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        console.log(`\n=== ログインテスト結果 ===`);
        console.log(`Email: ${email}`);
        console.log(`ステータスコード: ${res.statusCode}`);
        console.log(`レスポンスヘッダー:`, res.headers);
        console.log(`レスポンスボディ:`, responseData);
        
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: responseData
        });
      });
    });

    req.on('error', (error) => {
      console.error('エラー:', error);
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

async function runTests() {
  console.log('Vercel本番環境のログインAPIをテストします...');
  
  // テストユーザー
  const testUsers = [
    { email: 'sato@example.com', password: 'password123' },
    { email: '22nc020@ms.dendai.ac.jp', password: 'password123' },
    { email: 'nonexistent@example.com', password: 'password123' }, // 存在しないユーザー
    { email: 'sato@example.com', password: 'wrongpassword' } // 間違ったパスワード
  ];

  for (const user of testUsers) {
    try {
      await testVercelLogin(user.email, user.password);
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1秒待機
    } catch (error) {
      console.error(`テスト失敗 (${user.email}):`, error);
    }
  }
}

runTests();