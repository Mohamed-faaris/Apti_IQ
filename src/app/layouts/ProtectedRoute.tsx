import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireTeacher?: boolean;
  role?: 'student' | 'teacher' | 'admin';
}

export const ProtectedRoute = ({ children, requireAdmin = false, requireTeacher = false, role }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  if (requireTeacher && role !== 'teacher') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
