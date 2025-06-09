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

export async function addMeasurement(
  userId: number,
  measurement_type: string,
  value: number,
  unit: string,
  measured_at: string | Date,
  token: string
) {
  const res = await fetch(`${BASE}/${userId}/add-measurement`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, measurement_type, value, unit, measured_at }),
  });
  if (!res.ok) throw await res.json();
  return res.json(); 
}

export async function getMeasurementsByType(
  userId: number,
  measurement_type: string,
  token: string
) {
  const res = await fetch(`${BASE}/${userId}/measurements/${measurement_type}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw await res.json();
  return res.json(); // Array of measurements
}

export async function editLastMeasurement(
  userId: number,
  measurement_type: string,
  value: number,
  unit: string,
  measured_at: string | Date,
  token: string
) {
  const res = await fetch(`${BASE}/${userId}/edit-measurement/${measurement_type}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ value, unit, measured_at }),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function fetchPenaltyDaysCount(userId: number, token: string) {
  const res = await fetch(`${BASE}/${userId}/penalty-days-count`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw await res.json();
  return res.json(); // { penalty_days_count: number }
}

export async function updatePenaltyDaysCount(userId: number, increment: boolean, token: string) {
  const res = await fetch(`${BASE}/${userId}/penalty-days-count`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ increment }),
  });
  if (!res.ok) throw await res.json();
  return res.json(); // { penalty_days_count: number }
}
