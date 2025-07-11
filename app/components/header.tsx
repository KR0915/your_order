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
    <header className="w-full bg-black bg-opacity-80 text-white py-4 px-6 shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <h1 className="text-xl font-bold">
          <Link href="/">YourOrder</Link>
        </h1>
        <nav className="flex items-center space-x-6">
          {isAuthenticated ? (
            <>
              <Link href="/question-flow" className="hover:underline">
                ごはんを探す
              </Link>
              <Link href="/overview/monthly" className="hover:underline">
                今月のカロリー
              </Link>
              <Link href="/user/profile" className="hover:underline">
                プロフィール
              </Link>
              <button onClick={handleLogout} className="hover:underline">
                ログアウト
              </button>
            </>
          ) : (
            <button onClick={handleLogin} className="hover:underline">
              ログイン
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
