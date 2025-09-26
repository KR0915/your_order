"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { getRestaurantsByMood, getRestaurantsByDish, getCurrentLocation, Restaurant } from '../services/mapService';

// LeafletマップをSSR無しで動的インポート
const RestaurantMap = dynamic(() => import('../components/RestaurantMap'), {
  ssr: false,
  loading: () => <div className="h-96 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
    <p className="text-gray-500">地図を読み込み中...</p>
  </div>
});

function MapContent() {
  const searchParams = useSearchParams();
  const dishName = searchParams.get('dish'); // URLパラメータから料理名を取得
  
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);

  const moods = ['元気', 'リラックス', 'ロマンチック', '冒険', '懐かしい', '贅沢'];

  // 位置情報取得
  useEffect(() => {
    getCurrentLocation()
      .then(location => {
        setUserLocation(location);
      })
      .catch(error => {
        console.error('位置情報の取得に失敗:', error);
      });
  }, []);

  // 初期レストラン取得
  useEffect(() => {
    console.log("Initial load with dishName:", dishName); // デバッグ用
    if (dishName) {
      // 料理名が指定されている場合
      loadRestaurantsByDish(dishName);
    } else {
      // デフォルトは気分モード
      loadRestaurants('リラックス');
    }
  }, [dishName]);

  const loadRestaurants = async (mood: string) => {
    setLoading(true);
    try {
      console.log("Loading restaurants for mood:", mood); // デバッグ用
      const restaurantData = await getRestaurantsByMood(mood);
      console.log("Received restaurant data:", restaurantData); // デバッグ用
      setRestaurants(restaurantData);
    } catch (error) {
      console.error('レストラン取得エラー:', error);
      // エラー時もフォールバックデータを表示
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  const loadRestaurantsByDish = async (dish: string) => {
    setLoading(true);
    try {
      console.log("Loading restaurants for dish:", dish); // デバッグ用
      const restaurantData = await getRestaurantsByDish(dish);
      console.log("Received restaurant data:", restaurantData); // デバッグ用
      setRestaurants(restaurantData);
    } catch (error) {
      console.error('レストラン取得エラー:', error);
      // エラー時もフォールバックデータを表示
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMoodChange = (mood: string) => {
    setSelectedMood(mood);
    loadRestaurants(mood);
  };

  return (
    <div className="min-h-screen bg-white flex relative z-0 p-4 pt-24 pb-4">
      {/* サイドバー - レストランリスト */}
      <div className="w-80 bg-white border-r border-gray-300 flex flex-col overflow-hidden rounded-l-lg shadow-lg h-[calc(100vh-8rem)]">
        {/* サイドバーヘッダー */}
        <div className="p-4 border-b border-gray-300 bg-white shadow-sm border-t-0 pt-6 rounded-tl-lg">
          <h1 className="text-xl font-bold text-gray-800 mb-2">
            🍽️ お店を探す
          </h1>
          <p className="text-sm text-gray-600">
            {dishName 
              ? `おすすめ料理のお店を表示中` 
              : "あなたの気分に合わせたレストランを地図で確認できます"
            }
          </p>

          {/* 料理名指定時の戻るボタンのみ */}
          {dishName && (
            <div className="mt-3 flex justify-between items-center">
              <button
                onClick={() => window.history.back()}
                className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
              >
                ← レコメンドに戻る
              </button>
            </div>
          )}

          {/* 気分選択（料理名指定時は非表示） */}
          {!dishName && (
            <div className="mt-3">
              <h2 className="text-sm font-semibold text-gray-700 mb-2">今の気分を選んでください：</h2>
              <div className="flex flex-wrap gap-1">
                {moods.map((mood) => (
                  <button
                    key={mood}
                    onClick={() => handleMoodChange(mood)}
                    className={`px-2 py-1 rounded-full text-xs font-medium transition-colors border ${
                      selectedMood === mood
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                    }`}
                  >
                    {mood}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* レストランリスト */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-600 text-sm">読み込み中...</p>
            </div>
          ) : (
            <div className="p-4">
              {restaurants.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-2xl mb-2">🔍</div>
                  <p className="text-sm font-medium mb-1">レストランが見つかりませんでした</p>
                  <p className="text-xs mb-2">
                    {dishName ? '別の料理を試してみてください' : '気分を選択してレストランを探してみてください'}
                  </p>
                  {process.env.NODE_ENV === 'development' && (
                    <div className="text-xs text-gray-400 mt-2">
                      <p>デバッグ情報:</p>
                      <p>dishName: {dishName || 'なし'}</p>
                      <p>selectedMood: {selectedMood || 'なし'}</p>
                      <p>userLocation: {userLocation ? `${userLocation.lat}, ${userLocation.lng}` : 'なし'}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {restaurants.map((restaurant, index) => {
                    // レストランデータの検証
                    const isValidRestaurant = restaurant && 
                      restaurant.name && 
                      typeof restaurant.latitude === 'number' && 
                      typeof restaurant.longitude === 'number';
                    
                    if (!isValidRestaurant) {
                      console.warn(`Invalid restaurant data at index ${index}:`, restaurant);
                      return null;
                    }
                    
                    return (
                      <div 
                        key={restaurant.id || index} 
                        className="bg-white rounded-lg shadow-sm p-3 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => setSelectedRestaurant(restaurant)}
                      >
                        <h4 className="font-semibold text-gray-800 text-sm mb-2">{restaurant.name}</h4>
                        <div className="space-y-1 text-xs text-gray-600">
                          <div className="flex items-center justify-between">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                              {restaurant.cuisine || '各国料理'}
                            </span>
                            <div className="flex items-center">
                              <span className="text-yellow-500 mr-1">⭐</span>
                              <span className="font-medium text-xs">{restaurant.rating || 4.0}</span>
                            </div>
                          </div>
                          {restaurant.address && (
                            <p className="text-gray-600 text-xs">
                              📍 {restaurant.address}
                            </p>
                          )}
                          {restaurant.description && (
                            <p className="text-gray-500 text-xs italic mt-1">
                              {restaurant.description}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  }).filter(Boolean)}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* メインマップエリア */}
      <div className="flex-1 relative overflow-hidden rounded-r-lg shadow-lg h-[calc(100vh-8rem)]">
        {loading ? (
          <div className="h-full bg-gray-100 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">地図を読み込み中...</p>
            </div>
          </div>
        ) : (
          <div className="h-full">
            <RestaurantMap restaurants={restaurants} userLocation={userLocation} />
          </div>
        )}
      </div>

      {/* レストラン詳細モーダル - 元の位置に戻す */}
      {selectedRestaurant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-800">{selectedRestaurant.name}</h2>
                <button
                  onClick={() => setSelectedRestaurant(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {selectedRestaurant.cuisine}
                  </span>
                  <div className="flex items-center">
                    <span className="text-yellow-500 mr-1">⭐</span>
                    <span className="font-medium">{selectedRestaurant.rating}</span>
                  </div>
                </div>
                
                {selectedRestaurant.address && (
                  <div className="flex items-start">
                    <span className="text-gray-500 mr-2">📍</span>
                    <span className="text-gray-700">{selectedRestaurant.address}</span>
                  </div>
                )}
                
                {selectedRestaurant.description && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">説明</h3>
                    <p className="text-gray-600 leading-relaxed">{selectedRestaurant.description}</p>
                  </div>
                )}
                
                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setSelectedRestaurant(null)}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    閉じる
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MapPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center">ページを読み込み中...</div>}>
      <MapContent />
    </Suspense>
  );
}
