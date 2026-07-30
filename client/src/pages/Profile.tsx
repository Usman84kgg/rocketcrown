import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <div className="px-4 py-6">
      {/* Аватар и ID */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-purple-900/40 flex items-center justify-center border-2 border-purple-500/30">
          <img
            src={user.avatar_url || '/default-avatar.png'}
            alt="avatar"
            className="w-14 h-14 rounded-full"
          />
        </div>
        <div>
          <h3 className="text-white font-bold text-xl">{user.username}</h3>
          <p className="text-gray-400 text-sm">ID: {user.id?.slice(0, 8)}</p>
          <p className="text-orange-400 text-xs">Верификация: не пройдена</p>
        </div>
      </div>

      {/* Меню */}
      <div className="flex flex-col gap-1">
        <MenuItem icon="👤" label="Мой профиль" onClick={() => navigate('/profile/info')} />
        <MenuItem icon="⚙️" label="Настройки" onClick={() => navigate('/settings')} />
        <MenuItem icon="🔒" label="Безопасность" onClick={() => navigate('/settings/security')} />
        <MenuItem icon="📋" label="История ставок" onClick={() => navigate('/history')} />
        <MenuItem icon="🎁" label="Мои бонусы" onClick={() => navigate('/bonuses')} />
        <MenuItem icon="🚪" label="Выход" onClick={() => { logout(); navigate('/'); }} danger />
      </div>
    </div>
  );
};

const MenuItem: React.FC<{ icon: string; label: string; onClick: () => void; danger?: boolean }> = ({ icon, label, onClick, danger }) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-between p-4 rounded-2xl ${
      danger ? 'bg-red-900/20 text-red-400' : 'bg-[#1a0a2e] text-white'
    } border border-purple-500/20 hover:border-pink-500/30 transition-colors`}
  >
    <div className="flex items-center gap-3">
      <span className="text-xl">{icon}</span>
      <span>{label}</span>
    </div>
    <span className="text-gray-500">›</span>
  </button>
);