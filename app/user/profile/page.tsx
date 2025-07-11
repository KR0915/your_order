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
    <div className="pt-20 px-4 flex justify-center items-start">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-semibold mb-4 text-center">プロフィール</h1>
        <dl className="space-y-3">
          <div className="flex justify-between">
            <dt className="font-medium">名前</dt>
            <dd>{user?.name}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="font-medium">Email</dt>
            <dd>{user?.email}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="font-medium">目標カロリー</dt>
            <dd>{user?.targetCal} kcal</dd>
          </div>
        </dl>
        <button
          onClick={handleEdit}
          className="mt-6 w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          編集
        </button>
      </div>
    </div>
  );
}
