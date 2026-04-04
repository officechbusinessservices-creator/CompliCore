import { apiGet } from "@/lib/api";

export async function fetchModuleData<T = any>(endpoint: string, fallback: T): Promise<T> {
  try {
    const data = await apiGet<any>(endpoint);
    if (data?.data) return data.data as T;
    return data as T;
  } catch {
    return fallback;
  }
}
