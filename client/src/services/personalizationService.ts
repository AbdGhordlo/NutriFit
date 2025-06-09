const BASE = "http://localhost:5000/personalization";

export async function fetchPersonalizationData(userId: number, token: string) {
  const res = await fetch(`${BASE}/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw await res.json();
  return res.json();
}
