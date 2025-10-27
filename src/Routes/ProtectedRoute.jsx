import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../component/Login/authContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, token } = useAuth();

  if (loading) return null;

  if (!isAuthenticated || !token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
