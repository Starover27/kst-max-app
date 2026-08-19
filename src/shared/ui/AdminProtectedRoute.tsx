import { Navigate } from 'react-router-dom';
import { useAppStore } from '../../stores/appStore';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

// Проверка: является ли пользователь администратором, используя новое состояние из store.
export const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const isAdmin = useAppStore(state => state.isAdmin);

  if (!isAdmin) {
    // Если не админ, перенаправляем на главную или страницу ошибки доступа.
    // Пока перенаправим на главную.
    return <Navigate to="/" replace />;
  }

  return children;
};