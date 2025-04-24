// Helper function to extract user ID from token
export const getUserIdFromToken = (token: string): number | null => {
  try {
    const tokenPayload = JSON.parse(atob(token.split('.')[1]));
    return tokenPayload.id;
  } catch (error) {
    console.error("Error extracting user ID from token:", error);
    return null;
  }
};