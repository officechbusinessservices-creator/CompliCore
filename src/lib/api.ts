const defaultBase = process.env.NODE_ENV === "development" ? "http://localhost:4000" : "";
export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || defaultBase;
export const API_PREFIX = "/v1";

function getStoredToken() {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("auth_token");
}

export async function apiGet<T>(path: string, token?: string): Promise<T> {
  const authToken = token || getStoredToken();
  const res = await fetch(`${API_BASE}${API_PREFIX}${path}`, {
    cache: "no-store",
    headers: {
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    },
  });
  if (!res.ok) throw new Error(`GET ${path} failed (${res.status})`);
  return res.json();
}

export async function apiPost<T>(path: string, body: any, token?: string): Promise<T> {
  const authToken = token || getStoredToken();
  const res = await fetch(`${API_BASE}${API_PREFIX}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST ${path} failed (${res.status})`);
  return res.json();
}
