import { Navigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../../stores/appStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const user = useAppStore(state => state.user);
  const location = useLocation();

  if (!user) {
    // Redirect to Login page with the current location as state
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};