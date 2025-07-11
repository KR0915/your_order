// app/auth/login/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/app/services/authService';
import { LoginFormValues } from '@/app/types';
import { mutate } from 'swr';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState<LoginFormValues>({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(form);
      // ログイン成功後、月別画面へリダイレクト
      mutate('/api/user/profile');
      router.push('/overview/monthly');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">ログイン</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block mb-1 font-medium">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
              placeholder="example@domain.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-1 font-medium">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
              placeholder="Password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'ログイン'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          アカウントをお持ちでない方は{' '}
          <a href="/auth/register" className="text-blue-600 hover:underline">新規登録</a>
        </p>
      </div>
    </div>
  );
}
