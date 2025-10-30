import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../component/Login/authContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Wait until auth context finishes loading
  if (loading) return null;

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
