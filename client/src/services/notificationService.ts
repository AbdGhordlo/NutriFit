const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const BASE = `${API_BASE_URL}/api/notifications`;

export const fetchUserNotifications = async (userId: number, token: string) => {
  try {
    const response = await fetch(
      `${BASE}/user/${userId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const deleteNotification = async (notificationId: number, token: string) => {
  try {
    const response = await fetch(
      `${BASE}/${notificationId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};
