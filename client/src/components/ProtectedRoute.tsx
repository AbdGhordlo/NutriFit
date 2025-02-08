// components/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem("token"); // Check if the user is authenticated

  if (!token) {
    return <Navigate to="/login" replace />; // Redirect to login if no token
  }

  return <Outlet />; // Render the protected component
};

export default ProtectedRoute;