// components/Header.tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useSWR, { mutate } from 'swr';
import { fetchProfile } from '@/app/services/userService';
import { logout } from '@/app/services/authService';

// SWR fetchers
const profileFetcher = () => fetchProfile().then(res => res.user);

export default function Header() {
  const router = useRouter();

  // プロフィール取得
  const { data: user, error: userError } = useSWR('/api/user/profile', profileFetcher, {
    revalidateOnFocus: true,
    revalidateOnMount: true,
    shouldRetryOnError: false,
  });
  const isAuthenticated = Boolean(user) && !userError;

  const handleLogin = () => router.push('/auth/login');
  const handleLogout = async () => {
    await logout();
    mutate('/api/user/profile', null, false);
    router.push('/auth/login');
  };

  return (
    <header className="w-full bg-black backdrop-blur-sm text-white py-4 px-6 shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <h1 className="text-xl font-bold">
          <Link href="/" className="text-white hover:text-blue-300 transition-colors">YourOrder</Link>
        </h1>
        <nav className="flex items-center space-x-6">
          {isAuthenticated ? (
            <>
              <Link href="/question-flow" className="text-gray-200 hover:text-blue-300 hover:underline transition-colors">
                ごはんを探す
              </Link>
              <Link href="/map" className="text-gray-200 hover:text-blue-300 hover:underline transition-colors">
                レストランマップ
              </Link>
              <Link href="/overview/monthly" className="text-gray-200 hover:text-blue-300 hover:underline transition-colors">
                今月のカロリー
              </Link>
              <Link href="/user/profile" className="text-gray-200 hover:text-blue-300 hover:underline transition-colors">
                プロフィール
              </Link>
              <button onClick={handleLogout} className="text-gray-200 hover:text-blue-300 hover:underline transition-colors">
                ログアウト
              </button>
            </>
          ) : (
            <button onClick={handleLogin} className="text-gray-200 hover:text-blue-300 hover:underline transition-colors">
              ログイン
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
