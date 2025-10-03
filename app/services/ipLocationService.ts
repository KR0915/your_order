// app/services/ipLocationService.ts

export interface IPLocationData {
  lat: number;
  lng: number;
  city: string;
  region: string;
  country: string;
  accuracy: 'ip' | 'gps';
}

class IPLocationService {
  /**
   * IPアドレスから位置情報を取得（無料API使用）
   */
  async getLocationFromIP(): Promise<IPLocationData> {
    try {
      console.log('🌐 Getting location from IP address...');
      
      // ipapi.co の無料API（1日1000リクエスト制限）
      const response = await fetch('https://ipapi.co/json/');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      console.log('📍 IP location data:', data);
      
      const locationData: IPLocationData = {
        lat: parseFloat(data.latitude),
        lng: parseFloat(data.longitude),
        city: data.city || '不明',
        region: data.region || '不明',
        country: data.country_name || '不明',
        accuracy: 'ip'
      };
      
      console.log('✅ IP location processed:', locationData);
      
      return locationData;
    } catch (error) {
      console.error('❌ IP location error:', error);
      
      // フォールバック：東京駅
      return {
        lat: 35.6762,
        lng: 139.6503,
        city: '東京',
        region: '東京都',
        country: '日本',
        accuracy: 'ip'
      };
    }
  }

  /**
   * 住所から位置情報を取得（Nominatim API使用）
   */
  async getLocationFromAddress(address: string): Promise<IPLocationData | null> {
    try {
      console.log('🏠 Getting location from address:', address);
      
      const encodedAddress = encodeURIComponent(address);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.length === 0) {
        console.warn('⚠️ No results found for address:', address);
        return null;
      }
      
      const result = data[0];
      
      const locationData: IPLocationData = {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
        city: result.display_name.split(',')[0] || '不明',
        region: '不明',
        country: '不明',
        accuracy: 'ip'
      };
      
      console.log('✅ Address location processed:', locationData);
      
      return locationData;
    } catch (error) {
      console.error('❌ Address location error:', error);
      return null;
    }
  }

  /**
   * 日本の主要都市の位置情報
   */
  getMajorCityLocations(): { [key: string]: IPLocationData } {
    return {
      '東京': { lat: 35.6762, lng: 139.6503, city: '東京', region: '東京都', country: '日本', accuracy: 'ip' },
      '大阪': { lat: 34.6937, lng: 135.5023, city: '大阪', region: '大阪府', country: '日本', accuracy: 'ip' },
      '名古屋': { lat: 35.1815, lng: 136.9066, city: '名古屋', region: '愛知県', country: '日本', accuracy: 'ip' },
      '横浜': { lat: 35.4438, lng: 139.6380, city: '横浜', region: '神奈川県', country: '日本', accuracy: 'ip' },
      '京都': { lat: 35.0116, lng: 135.7681, city: '京都', region: '京都府', country: '日本', accuracy: 'ip' },
      '神戸': { lat: 34.6901, lng: 135.1956, city: '神戸', region: '兵庫県', country: '日本', accuracy: 'ip' },
      '福岡': { lat: 33.5904, lng: 130.4017, city: '福岡', region: '福岡県', country: '日本', accuracy: 'ip' },
      '札幌': { lat: 43.0642, lng: 141.3469, city: '札幌', region: '北海道', country: '日本', accuracy: 'ip' },
      '仙台': { lat: 38.2682, lng: 140.8694, city: '仙台', region: '宮城県', country: '日本', accuracy: 'ip' },
      '広島': { lat: 34.3853, lng: 132.4553, city: '広島', region: '広島県', country: '日本', accuracy: 'ip' }
    };
  }
}

export const ipLocationService = new IPLocationService();