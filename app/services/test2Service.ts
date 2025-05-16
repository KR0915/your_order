import { Test2 } from "@/app/types";

const BASE_URL = "/api/test2";

// GET: 全てのデータを取得
export async function getAllTest2(): Promise<Test2[]> {
const response = await fetch(BASE_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch test2 items");
  }
  return response.json();
}

// GET: 特定のIDのデータを取得
export async function getTest2ById(id: number): Promise<Test2> {
  const response = await fetch(`${BASE_URL}/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch test2 item with ID ${id}`);
  }
  return response.json();
}

// POST: 新しいデータを作成
export async function createTest2(name: string): Promise<Test2> {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });
  if (!response.ok) {
    throw new Error("Failed to create test2 item");
  }
  return response.json();
}

// PUT: 特定のIDのデータを更新
export async function updateTest2(id: number, name: string): Promise<Test2> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });
  if (!response.ok) {
    throw new Error(`Failed to update test2 item with ID ${id}`);
  }
  return response.json();
}

// DELETE: 特定のIDのデータを削除
export async function deleteTest2(id: number): Promise<{ message: string }> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`Failed to delete test2 item with ID ${id}`);
  }
  return response.json();
}