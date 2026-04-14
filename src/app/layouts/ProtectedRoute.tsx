import { Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { useAuthToken } from '@convex-dev/auth/react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireTeacher?: boolean;
  role?: 'student' | 'teacher' | 'admin';
}

export const ProtectedRoute = ({ children, requireAdmin = false, requireTeacher = false, role }: ProtectedRouteProps) => {
  const token = useAuthToken();
  const { data: profile } = useQuery({
    queryKey: ['my-profile'],
    queryFn: api.profile.getMyProfile,
    enabled: !!token,
  });

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const resolvedRole = role ?? profile?.role;

  if (requireAdmin && resolvedRole !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  if (requireTeacher && resolvedRole !== 'teacher') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
