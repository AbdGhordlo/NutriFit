export const uploadProgressPhoto = async (userId: number, token: string, file: File) => {
  try {
    const formData = new FormData();
    formData.append("progressPhoto", file);
    const response = await fetch(
      `http://localhost:5000/progress-photos/${userId}/photos`,
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
 * List all progress photos for a user
 */
export const listProgressPhotos = async (userId: number, token: string) => {
  try {
    const response = await fetch(
      `http://localhost:5000/progress-photos/${userId}/photos`,
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

/**
 * Delete a progress photo
 */
export const deleteProgressPhoto = async (userId: number, photoId: number, token: string) => {
  try {
    const response = await fetch(
      `http://localhost:5000/progress-photos/${userId}/photos/${photoId}`,
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