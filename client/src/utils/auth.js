import { jwtDecode } from "jwt-decode";

export const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
        const decoded = jwtDecode(token);
        return decoded.id; // Extract the 'id' field
    } catch (err) {
        console.error("Invalid token", err);
        return null;
    }
};
