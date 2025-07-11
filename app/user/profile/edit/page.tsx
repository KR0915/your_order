"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchProfile, updateProfile, deleteProfile } from "@/app/services/userService";
import type { User } from "@/app/types";

export default function EditProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState<Partial<User> & { newPassword?: string }>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchProfile()
      .then(res => {
        setUser(res.user);
        setForm(res.user);
      })
      .catch(() => {});
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await updateProfile(form);
      setUser(res.user);
      setTimeout(() => {
        router.push("/user/profile");
      }, 1200);
    } catch {
      // エラー時の処理は必要なら追加
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!window.confirm("本当に削除しますか？")) return;
    setLoading(true);
    try {
      await deleteProfile();
      setUser(null);
      setTimeout(() => {
        router.push("/auth/login");
      }, 1200);
    } catch {
      // エラー時の処理は必要なら追加
    }
    setLoading(false);
  };

  const handleBack = () => {
    router.push("/user/profile");
  };

  if (!user) return <div className="p-8 text-center text-orange-500"></div>;

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 mt-10">
      <h2 className="text-xl font-bold text-black mb-4 text-center">プロフィール編集</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={form.name ?? ""}
          onChange={handleChange}
          placeholder="名前"
          className="w-full border rounded px-3 py-2"
        />
        <input
          name="email"
          value={form.email ?? ""}
          onChange={handleChange}
          placeholder="メール"
          className="w-full border rounded px-3 py-2"
        />
        <input
          name="targetCal"
          type="number"
          value={form.targetCal ?? ""}
          onChange={handleChange}
          placeholder="目標カロリー"
          className="w-full border rounded px-3 py-2"
        />
        <input
          name="newPassword"
          type="password"
          value={form.newPassword ?? ""}
          onChange={handleChange}
          placeholder="新しいパスワード（8文字以上）"
          className="w-full border rounded px-3 py-2"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-bold"
        >
          更新
        </button>
      </form>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="w-full mt-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 font-bold"
      >
        プロフィール削除
      </button>
      <button
        onClick={handleBack}
        disabled={loading}
        className="w-full mt-4 py-2 bg-gray-200 text-black rounded font-bold border"
      >
        戻る
      </button>
    </div>
  );
}