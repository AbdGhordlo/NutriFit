const BASE = "http://localhost:5000/progress";

export async function fetchCompletedDaysCount(userId: number, token: string) {
  const res = await fetch(`${BASE}/${userId}/completed-days-count`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw await res.json();
  return res.json(); // { completed_days_count: number }
}

export async function updateCompletedDaysCount(userId: number, increment: boolean, token: string) {
  const res = await fetch(`${BASE}/${userId}/completed-days-count`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ increment }),
  });
  if (!res.ok) throw await res.json();
  return res.json(); // { completed_days_count: number }
}
