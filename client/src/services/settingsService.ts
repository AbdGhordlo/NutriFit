// API Service for settings-related API calls

/**
 * Fetch user settings from the API
 */
export const fetchUserSettings = async (userId: number, token: string) => {
  try {
    const response = await fetch(
      `http://localhost:5000/settings/${userId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    
    if (response.status === 401) {
      throw new Error("Unauthorized");
    }
    
    if (response.status === 500) {
      throw new Error("Server error");
    }
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

/**
 * Update user profile information
 */
export const updateUserProfile = async (userId: number, token: string, profileData: any) => {
  try {
    const response = await fetch(
      `http://localhost:5000/settings/${userId}/profile`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
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

/**
 * Update user notification settings
 */
export const updateNotificationSettings = async (userId: number, token: string, notificationData: any) => {
  try {
    const response = await fetch(
      `http://localhost:5000/settings/${userId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notifications: notificationData
        }),
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

/**
 * Update user password
 */
export const updatePassword = async (userId: number, token: string, passwordData: {
  currentPassword: string;
  newPassword: string;
}) => {
  try {
    const response = await fetch(
      `http://localhost:5000/settings/${userId}/password`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(passwordData),
      }
    );
    
    if (response.status === 400) {
      const data = await response.json();
      throw new Error(data.message || "Current password is incorrect");
    }
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

/**
 * Upload profile picture
 */
export const uploadProfilePicture = async (userId: number, token: string, file: File) => {
  try {
    const formData = new FormData();
    formData.append("profilePicture", file);
    
    const response = await fetch(
      `http://localhost:5000/upload/${userId}/profile-picture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
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

/**
 * Delete profile picture
 */
export const deleteProfilePicture = async (userId: number, token: string) => {
  try {
    const response = await fetch(
      `http://localhost:5000/upload/${userId}/profile-picture`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
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

/**
 * Delete user account
 */
export const deleteUserAccount = async (userId: number, token: string) => {
  try {
    const response = await fetch(
      `http://localhost:5000/auth/${userId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    
    return true;
  } catch (error) {
    throw error;
  }
};
