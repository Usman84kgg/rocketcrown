import { useAuthStore } from '../stores/authStore';
import { Navigate } from 'react-router-dom';

export const AdminPanel = () => {
  const { user } = useAuthStore();
  if (!user || (user.role !== 'owner' && user.role !== 'support')) {
    return <Navigate to="/" />;
  }
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Админ-панель</h1>
      {/* Здесь маршрутизация между разделами */}
    </div>
  );
};