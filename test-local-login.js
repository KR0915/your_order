const http = require('http');

const data = JSON.stringify({
  email: 'sato@example.com',
  password: 'password123'
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let responseData = '';
  
  console.log('ステータス:', res.statusCode);
  console.log('ヘッダー:', res.headers);
  
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  
  res.on('end', () => {
    console.log('レスポンス:', responseData);
    try {
      const parsed = JSON.parse(responseData);
      console.log('パースされたレスポンス:', JSON.stringify(parsed, null, 2));
    } catch (e) {
      console.log('JSONパースエラー:', e.message);
    }
  });
});

req.on('error', (error) => {
  console.error('リクエストエラー:', error);
});

req.write(data);
req.end();