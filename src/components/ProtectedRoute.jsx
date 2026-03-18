import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/index';

const ProtectedRoute = ({ allowedRoles = null }) => {
  const { session, profile } = useAuthStore();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
    // If they have the wrong role, redirect them to home
    return <Navigate to="/" replace />;
  }

  // If we don't have the profile yet but we have a session, we might want to show a spinner,
  // but for simplicity we rely on the Outlet being rendered when profile loads.
  return <Outlet />;
};

export default ProtectedRoute;
