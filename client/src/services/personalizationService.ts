const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const BASE = `${API_BASE_URL}/personalization`;

export async function fetchPersonalizationData(userId: number, token: string) {
  const res = await fetch(`${BASE}/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw await res.json();
  return res.json();
}
