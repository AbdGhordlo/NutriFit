const BASE = "http://localhost:5000/home";

export async function fetchMealProgress(date: string, token: string) {
  const res = await fetch(`${BASE}/meal?date=${date}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function upsertMealProgress(
  mealId: number,
  date: string,
  completed: boolean,
  token: string
) {
  const res = await fetch(`${BASE}/meal`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ mealId, date, completed }),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function fetchExerciseProgress(date: string, token: string) {
  const res = await fetch(`${BASE}/exercise?date=${date}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function upsertExerciseProgress(
  exerciseId: number,
  date: string,
  completed: boolean,
  token: string
) {
  const res = await fetch(`${BASE}/exercise`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ exerciseId, date, completed }),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}
