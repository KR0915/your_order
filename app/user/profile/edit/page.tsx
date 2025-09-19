"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchProfile, updateProfile, deleteProfile } from "@/app/services/userService";
import type { User } from "@/app/types";

export default function EditProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState<Partial<User> & { newPassword?: string }>({});
  const [loading, setLoading] = useState(false);
  const [dislikedFoodsInput, setDislikedFoodsInput] = useState("");
  const [allergensInput, setAllergensInput] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchProfile()
      .then(res => {
        setUser(res.user);
        setForm(res.user);
        // 配列データを文字列に変換
        setDislikedFoodsInput(res.user.dislikedFoods?.join(", ") || "");
        setAllergensInput(res.user.allergens?.join(", ") || "");
      })
      .catch(error => {
        console.error("Profile fetch error:", error);
        // 認証エラーの場合はログインページへ
        router.push("/auth/login");
      });
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // 数値フィールドの場合は適切に変換
    if (['targetCal', 'targetProtein', 'targetFat', 'targetCarbs'].includes(name)) {
      const numValue = value === '' ? '' : Number(value);
      setForm({ ...form, [name]: numValue });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 配列データを適切に処理
      const updateData = {
        ...form,
        dislikedFoods: dislikedFoodsInput 
          ? dislikedFoodsInput.split(",").map(item => item.trim()).filter(item => item.length > 0)
          : [],
        allergens: allergensInput 
          ? allergensInput.split(",").map(item => item.trim()).filter(item => item.length > 0)
          : []
      };
      
      console.log("Updating profile with data:", updateData); // デバッグ用
      const res = await updateProfile(updateData);
      setUser(res.user);
      setTimeout(() => {
        router.push("/user/profile");
      }, 1200);
    } catch (error) {
      console.error("Profile update error:", error);
      alert("プロフィールの更新に失敗しました。もう一度お試しください。");
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
    <div className="min-h-screen pt-20 px-4 flex justify-center items-start pb-20">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-black mb-4 text-center">プロフィール編集</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 基本情報 */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">基本情報</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>
          <input
            name="newPassword"
            type="password"
            value={form.newPassword ?? ""}
            onChange={handleChange}
            placeholder="新しいパスワード（8文字以上）"
            className="w-full border rounded px-3 py-2 mt-3"
          />
        </div>

        {/* 目標値設定 */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">目標値設定</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="targetCal"
              type="number"
              value={form.targetCal ?? ""}
              onChange={handleChange}
              placeholder="目標カロリー (kcal/日)"
              className="w-full border rounded px-3 py-2"
            />
            <input
              name="targetProtein"
              type="number"
              step="0.1"
              value={form.targetProtein ?? ""}
              onChange={handleChange}
              placeholder="目標タンパク質 (g/日)"
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <input
              name="targetFat"
              type="number"
              step="0.1"
              value={form.targetFat ?? ""}
              onChange={handleChange}
              placeholder="目標脂質 (g/日)"
              className="w-full border rounded px-3 py-2"
            />
            <input
              name="targetCarbs"
              type="number"
              step="0.1"
              value={form.targetCarbs ?? ""}
              onChange={handleChange}
              placeholder="目標炭水化物 (g/日)"
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        {/* 食事制限 */}
        <div className="pb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">食事制限</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                苦手な食べ物 <span className="text-gray-500 text-xs">(カンマ区切りで入力)</span>
              </label>
              <input
                value={dislikedFoodsInput}
                onChange={(e) => setDislikedFoodsInput(e.target.value)}
                placeholder="例: トマト, ピーマン, なす"
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                アレルギー食品 <span className="text-gray-500 text-xs">(カンマ区切りで入力)</span>
              </label>
              <input
                value={allergensInput}
                onChange={(e) => setAllergensInput(e.target.value)}
                placeholder="例: 卵, 乳製品, そば, 落花生"
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
        </div>

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
    </div>
  );
}