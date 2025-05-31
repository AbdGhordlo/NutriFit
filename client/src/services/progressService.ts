// export async function updateCompletedDaysCount(userId: string, token: string) {
//   const res = await fetch(`/api/progress/${userId}/updateCompletedDaysCount`, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//   });
//   if (!res.ok) throw new Error("Failed to update completed days count");
//   return res.json();
// }