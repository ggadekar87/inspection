// src/routes/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';

export default function ProtectedRoute({ allowedRoles }: { allowedRoles?: string[] }) {
  const user = useSelector((s: RootState) => s.auth.user);
  if (!user) return <Navigate to="/auth/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role ?? '')) return <Navigate to="/unauthorized" replace />;
  return <Outlet />;
}
