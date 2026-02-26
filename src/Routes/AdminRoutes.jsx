import React from 'react';
import UseAuth from '../Hooks/UseAuth';
import { Navigate, useLocation } from 'react-router';

export default function AdminRoutes({ children }) {
  const { user,loading } = UseAuth();
  const loacation = useLocation();
  const role=user?.role;

  if (loading) {
    return <h1>Loading...</h1>;
  }
  if (!user || role!=='admin')
    return <Navigate to="/login" state={{ from: loacation }} replace />;

  return children;
}
