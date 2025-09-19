// app/user/profile/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { fetchProfile } from '@/app/services/userService';
import { User } from '@/app/types';
import { useRouter } from 'next/navigation';

export default function UserProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchProfile();
        setUser(res.user);
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message
            : 'プロフィール取得に失敗しました'
        );
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleEdit = () => {
    router.push('/user/profile/edit');
  };

  if (loading) {
    return <div className="pt-20 text-center p-4">読み込み中...</div>;
  }
  if (error) {
    return <div className="pt-20 text-center p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen pt-20 px-4 flex justify-center items-start pb-20">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl">
        <h1 className="text-3xl font-semibold mb-6 text-center text-gray-900">プロフィール</h1>
        
        {/* 基本情報 */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">基本情報</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex justify-between py-2">
              <dt className="font-medium text-gray-600">名前</dt>
              <dd className="text-gray-900 font-medium">{user?.name}</dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="font-medium text-gray-600">Email</dt>
              <dd className="text-gray-900">{user?.email}</dd>
            </div>
          </div>
        </div>

        {/* 目標値設定 */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">目標値設定</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <dt className="text-sm font-medium text-gray-600 mb-1">カロリー</dt>
              <dd className="text-2xl font-bold text-blue-600">
                {user?.targetCal || '-'}
                <span className="text-sm font-normal text-gray-500 ml-1">kcal/日</span>
              </dd>
            </div>
            <div className="bg-red-50 p-4 rounded-lg text-center">
              <dt className="text-sm font-medium text-gray-600 mb-1">タンパク質</dt>
              <dd className="text-2xl font-bold text-red-600">
                {user?.targetProtein || '-'}
                <span className="text-sm font-normal text-gray-500 ml-1">g/日</span>
              </dd>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg text-center">
              <dt className="text-sm font-medium text-gray-600 mb-1">脂質</dt>
              <dd className="text-2xl font-bold text-yellow-600">
                {user?.targetFat || '-'}
                <span className="text-sm font-normal text-gray-500 ml-1">g/日</span>
              </dd>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <dt className="text-sm font-medium text-gray-600 mb-1">炭水化物</dt>
              <dd className="text-2xl font-bold text-green-600">
                {user?.targetCarbs || '-'}
                <span className="text-sm font-normal text-gray-500 ml-1">g/日</span>
              </dd>
            </div>
          </div>
        </div>

        {/* 食事制限 */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">食事制限</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">苦手な食べ物</h3>
              <div className="bg-gray-50 p-4 rounded-lg min-h-[60px]">
                {user?.dislikedFoods && user.dislikedFoods.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {user.dislikedFoods.map((food, index) => (
                      <span 
                        key={index}
                        className="inline-block bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm"
                      >
                        {food}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-500 text-sm">設定なし</span>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">アレルギー食品</h3>
              <div className="bg-gray-50 p-4 rounded-lg min-h-[60px]">
                {user?.allergens && user.allergens.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {user.allergens.map((allergen, index) => (
                      <span 
                        key={index}
                        className="inline-block bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm"
                      >
                        ⚠️ {allergen}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-500 text-sm">設定なし</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleEdit}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-lg transition-colors"
        >
          編集
        </button>
      </div>
    </div>
  );
}
