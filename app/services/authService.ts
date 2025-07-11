// app/lib/api.ts
import { 
  RegisterFormValues, 
  LoginFormValues, 
  AuthResponse, 
} from "@/app/types";

const AUTH_BASE = "/api/auth";

/** 会員登録 */
export async function register(values: RegisterFormValues): Promise<AuthResponse> {
  const res = await fetch(`${AUTH_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
  if (!res.ok) throw new Error("登録に失敗しました");
  return res.json();
}

/** ログイン */
export async function login(values: LoginFormValues): Promise<AuthResponse> {
  const res = await fetch(`${AUTH_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
    credentials: "include", // Cookie を含める
  });
  if (!res.ok) throw new Error("ログインに失敗しました");
  return res.json();
}

/** ログアウト */
export async function logout(): Promise<AuthResponse> {
  const res = await fetch(`${AUTH_BASE}/logout`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) throw new Error("ログアウトに失敗しました");
  return res.json();
}