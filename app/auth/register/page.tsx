// app/auth/register/page.tsx
'use client';

import React, { useState } from 'react';
import { register } from '@/app/services/authService';
import { RegisterFormValues } from '@/app/types';

export default function RegisterPage() {
  const [form, setForm] = useState<RegisterFormValues>({
    name: '',
    email: '',
    password: '',
    targetCal: 2000,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'targetCal' ? Number(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await register(form);
      setSuccess(true);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('登録に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const containerClasses = 'min-h-screen flex items-center justify-center px-4 py-8';
  const cardClasses = 'bg-white p-6 rounded-lg shadow-md w-full max-w-md overflow-y-auto max-h-[90vh]';

  if (success) {
    return (
      <div className={containerClasses}>
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm text-center">
          <h2 className="text-2xl font-bold mb-4">登録完了!</h2>
          <p className="mb-6">アカウントが作成されました。</p>
          <a href="/auth/login" className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            ログインページへ
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      <div className={cardClasses}>
        <h1 className="text-2xl font-semibold mb-6 text-center">ユーザー登録</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block mb-1 text-sm font-medium">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
              placeholder="Your Name"
            />
          </div>
          <div>
            <label htmlFor="email" className="block mb-1 text-sm font-medium">Email</label>
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
            <label htmlFor="password" className="block mb-1 text-sm font-medium">Password</label>
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
          <div>
            <label htmlFor="targetCal" className="block mb-1 text-sm font-medium">Target Calories</label>
            <input
              id="targetCal"
              name="targetCal"
              type="number"
              value={form.targetCal}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
              placeholder="e.g. 2000"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? '登録中...' : '登録'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          すでにアカウントをお持ちの方は{' '}
          <a href="/auth/login" className="text-blue-600 hover:underline">ログイン</a>
        </p>
      </div>
    </div>
  );
}
