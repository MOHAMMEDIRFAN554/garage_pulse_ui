import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../component/Login/authContext";

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // While loading auth state, avoid flickering or redirects
  if (loading) return null;

  // If logged in, redirect to home
  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default PublicRoute;
