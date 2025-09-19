// test/testPFCAPI.mjs
// PFC Dashboard APIの簡易テスト

async function testPFCAPI() {
  const baseUrl = 'http://localhost:3000';
  
  try {
    // まずログインが必要
    console.log('Testing PFC Dashboard API...');
    
    const startDate = '2025-09-13';
    const endDate = '2025-09-19';
    
    const response = await fetch(`${baseUrl}/api/pfc-dashboard?startDate=${startDate}&endDate=${endDate}&viewType=daily`, {
      headers: {
        'Cookie': 'session=your-session-here' // 実際のセッションクッキーが必要
      }
    });
    
    console.log('Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('PFC Dashboard Data:');
      console.log('View Type:', data.viewType);
      console.log('Data count:', data.data?.length || 0);
      console.log('User Info:', data.userInfo);
      
      if (data.data && data.data.length > 0) {
        console.log('\nSample daily data:');
        const sampleDay = data.data[0];
        console.log(`Date: ${sampleDay.date}`);
        console.log(`Calories: ${sampleDay.totalCalories}`);
        console.log(`Protein: ${sampleDay.totalProtein}g`);
        console.log(`Fat: ${sampleDay.totalFat}g`);
        console.log(`Carbs: ${sampleDay.totalCarbs}g`);
        console.log(`Meals count: ${sampleDay.meals?.length || 0}`);
      }
    } else {
      const errorData = await response.text();
      console.log('Error response:', errorData);
    }
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

// Node.js環境でfetchを使用するため
import fetch from 'node-fetch';
testPFCAPI();
