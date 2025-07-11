import { User } from "@/app/types";

const USER_BASE = "/api/user";

/** プロフィール取得 */
export async function fetchProfile(): Promise<{ user: User }> {
  const res = await fetch(`${USER_BASE}/profile`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) throw new Error("プロフィール取得に失敗しました");
  return res.json();
}

/** プロフィール更新（パスワード変更対応） */
export async function updateProfile(data: Partial<User> & { newPassword?: string }): Promise<{ user: User }> {
  const res = await fetch(`${USER_BASE}/profile`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("プロフィール更新に失敗しました");
  return res.json();
}

/** パスワード変更のみ */
export async function changePassword(newPassword: string): Promise<{ user: User }> {
  const res = await fetch(`${USER_BASE}/profile`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ newPassword }),
  });
  if (!res.ok) throw new Error("パスワード変更に失敗しました");
  return res.json();
}

/** プロフィール削除 */
export async function deleteProfile(): Promise<{ message: string }> {
  const res = await fetch(`${USER_BASE}/profile`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("プロフィール削除に失敗しました");
  return res.json();
}