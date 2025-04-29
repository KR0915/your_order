"use client";

import { useEffect, useState } from "react";
import { getAllTest1, createTest1, deleteTest1 } from "@/app/services/test1Service";
import { Test1 } from "@/app/types";
import { useRouter } from "next/navigation";

export default function Test1Page() {
  const [items, setItems] = useState<Test1[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newName, setNewName] = useState<string>(""); // 新規作成用の名前
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getAllTest1();
        setItems(data);
      } catch {
        setError("データの取得に失敗しました");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    try {
      const createdItem = await createTest1(newName);
      setItems((prev) => [...prev, createdItem]);
      setNewName(""); // 入力フィールドをリセット
    } catch {
      alert("新規作成に失敗しました");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("本当に削除しますか？")) return;
    try {
      await deleteTest1(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch {
      alert("削除に失敗しました");
    }
  };

  const handleEdit = (id: number) => {
    router.push(`/test1/${id}`); // 編集画面に遷移
  };

  if (loading) {
    return <p>読み込み中...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Test1 一覧</h1>

      {/* 新規作成フォーム */}
      <div className="mb-4">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="新しい名前を入力"
          className="border p-2 rounded mr-2"
        />
        <button
          onClick={handleCreate}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          新規作成
        </button>
      </div>

      {items.length === 0 ? (
        <p>データがありません。</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li
              key={item.id}
              className="p-4 border rounded shadow-sm hover:shadow-md transition flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">ID: {item.id}</p>
                <p>名前: {item.name}</p>
                <p>作成日時: {new Date(item.createdAt).toLocaleString()}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(item.id)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  編集
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  削除
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <br />
    </div>
  );
}