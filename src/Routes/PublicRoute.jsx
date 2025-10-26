import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../component/Login/authContext';

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }
  
  return children;
};

export default PublicRoute;