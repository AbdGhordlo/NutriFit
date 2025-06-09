import { useNavigate } from "react-router-dom";
import { getUserIdFromToken } from "./auth";

export const useAuth = () => {
  const navigate = useNavigate();

  const getAuthToken = () => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      console.error("No token found, redirecting to login...");
      window.location.href = "/login";
      return null;
    }
    
    return token;
  };

  const getAuthUserId = () => {
    const token = getAuthToken();
    if (!token) return null;
    
    const userId = getUserIdFromToken();
    
    if (!userId) {
      localStorage.removeItem("token");
      window.location.href = "/login";
      return null;
    }
    
    return userId;
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return {
    getAuthToken,
    getAuthUserId,
    logout
  };
};