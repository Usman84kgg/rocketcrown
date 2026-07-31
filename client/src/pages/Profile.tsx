import { Link } from 'react-router-dom';

export default function Profile() {
  return (
    <div className="p-4">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-purple-900/40 border-2 border-purple-500 flex items-center justify-center text-2xl">👤</div>
        <div>
          <div className="font-bold text-lg">RocketPlayer</div>
          <div className="text-gray-400 text-sm">ID: 54879621</div>
          <div className="text-orange-400 text-xs">Верификация: не пройдена</div>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <MenuItem icon="👤" label="Мой профиль" to="/profile" />
        <MenuItem icon="⚙️" label="Настройки" to="/settings" />
        <MenuItem icon="🔒" label="Безопасность" to="/profile" />
        <MenuItem icon="📋" label="История ставок" to="/profile" />
        <MenuItem icon="🎁" label="Мои бонусы" to="/bonuses" />
        <MenuItem icon="🚪" label="Выход" to="/" danger />
      </div>
    </div>
  );
}

function MenuItem({ icon, label, to, danger }: any) {
  return (
    <Link to={to} className={`flex items-center justify-between p-4 rounded-2xl border ${danger ? 'bg-red-900/20 text-red-400 border-red-500/20' : 'bg-[#1a0a2e] border-purple-500/20'}`}>
      <span>{icon} {label}</span>
      <span>›</span>
    </Link>
  );
}