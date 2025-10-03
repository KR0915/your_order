"use client";

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Restaurant } from '../services/mapService';
import { IPLocationData } from '../services/ipLocationService';

// ユーザー位置用のアイコン
const userIcon = new Icon({
  iconUrl: `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3b82f6" width="24" height="24">
      <circle cx="12" cy="12" r="8" fill="#3b82f6" stroke="#ffffff" stroke-width="3"/>
      <circle cx="12" cy="12" r="3" fill="#ffffff"/>
    </svg>
  `)}`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  popupAnchor: [0, -10]
});
const getRestaurantIcon = (cuisine: string) => {
  const iconColors: { [key: string]: string } = {
    '寿司': '#ff6b6b',
    'ラーメン': '#4ecdc4',
    'カフェ': '#45b7d1',
    'イタリアン': '#96ceb4',
    'default': '#feca57'
  };

  const color = iconColors[cuisine] || iconColors.default;
  
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="24" height="24">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    `)}`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  });
};

interface RestaurantMapProps {
  restaurants: Restaurant[];
  userLocation?: IPLocationData | null;
}

export default function RestaurantMap({ restaurants, userLocation }: RestaurantMapProps) {
  // 東京駅を中心とした初期表示位置（ユーザーの位置がある場合はそれを使用）
  const defaultCenter: [number, number] = userLocation 
    ? [userLocation.lat, userLocation.lng] 
    : [35.6762, 139.6503];
  const defaultZoom = 13;

  return (
    <MapContainer
      center={defaultCenter}
      zoom={defaultZoom}
      style={{ height: '100%', width: '100%', minHeight: '400px', maxHeight: '100vh' }}
      className="rounded-lg"
      zoomControl={true}
      scrollWheelZoom={true}
      doubleClickZoom={true}
      touchZoom={true}
      dragging={true}
      attributionControl={false}
    >
      {/* OpenStreetMapタイル */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* ユーザーの現在位置マーカー */}
      {userLocation && (
        <Marker
          position={[userLocation.lat, userLocation.lng]}
          icon={userIcon}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-bold text-blue-600">あなたの現在位置</h3>
              <p className="text-sm text-gray-600">ここからレストランを探しています</p>
            </div>
          </Popup>
        </Marker>
      )}
      
      {/* レストランマーカー */}
      {restaurants.filter(restaurant => {
        // 有効なレストランデータのみを表示
        const isValid = restaurant && 
          restaurant.name && 
          typeof restaurant.latitude === 'number' && 
          typeof restaurant.longitude === 'number' &&
          !isNaN(restaurant.latitude) &&
          !isNaN(restaurant.longitude);
        
        if (!isValid) {
          console.warn('Invalid restaurant data for map marker:', restaurant);
        }
        
        return isValid;
      }).map((restaurant) => (
        <Marker
          key={restaurant.id}
          position={[restaurant.latitude, restaurant.longitude]}
          icon={getRestaurantIcon(restaurant.cuisine || 'default')}
        >
          <Popup className="custom-popup">
            <div className="p-2 min-w-48">
              <h3 className="font-bold text-lg text-gray-800 mb-2">
                {restaurant.name}
              </h3>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-medium text-gray-600">料理:</span> 
                  <span className="ml-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    {restaurant.cuisine || '各国料理'}
                  </span>
                </p>
                <p className="flex items-center">
                  <span className="font-medium text-gray-600">評価:</span>
                  <span className="ml-1 flex items-center">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span key={i} className={i < Math.floor(restaurant.rating || 4.0) ? "text-yellow-400" : "text-gray-300"}>
                        ⭐
                      </span>
                    ))}
                    <span className="ml-1 text-xs text-gray-500">({restaurant.rating || 4.0})</span>
                  </span>
                </p>
                {restaurant.address && (
                  <p className="text-xs text-gray-600">
                    <span className="font-medium">住所:</span> {restaurant.address}
                  </p>
                )}
                {restaurant.description && (
                  <p className="text-gray-600 text-xs mt-2 italic">
                    {restaurant.description}
                  </p>
                )}
              </div>
              <button className="mt-3 w-full bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm transition-colors">
                詳細を見る
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
