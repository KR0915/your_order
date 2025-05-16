"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getTest2ById, updateTest2 } from "@/app/services/test2Service";
import { Test2 } from "@/app/types";

export default function EditTest2Page() {
  const [item, setItem] = useState<Test2 | null>(null);
  const [name, setName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getTest2ById(Number(id));
        setItem(data);
        setName(data.name); // 初期値を設定
      } catch {
        setError("データの取得に失敗しました");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const handleUpdate = async () => {
    if (!name.trim()) {
      alert("名前を入力してください");
      return;
    }
    try {
      await updateTest2(Number(id), name);
      alert("更新が完了しました");
      router.push("/test2"); // 一覧画面に戻る
    } catch {
      alert("更新に失敗しました");
    }
  };

  if (loading) {
    return <p>読み込み中...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!item) {
    return <p>データが見つかりません。</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Test2 編集</h1>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">名前</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>
      <button
        onClick={handleUpdate}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        更新
      </button>
      <button
        onClick={() => router.push("/test2")}
        className="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
      >
        キャンセル
      </button>
    </div>
  );
}