import { NavLink } from 'react-router-dom';

const items = [
  { to: '/cashier', label: 'Касса', icon: '💳' },
  { to: '/games', label: 'Игры', icon: '🎮' },
  { to: '/', label: 'Казино', icon: '👑' },
  { to: '/menu', label: 'Меню', icon: '≡' },
];

export const BottomNav = () => (
  <nav className="fixed bottom-0 left-0 right-0 bg-black/90 border-t border-purple-500/20 flex justify-around py-2 z-50">
    {items.map(item => (
      <NavLink
        key={item.to}
        to={item.to}
        className={({ isActive }) =>
          `flex flex-col items-center text-xs ${isActive ? 'text-pink-500' : 'text-gray-400'}`
        }
      >
        <span className="text-lg">{item.icon}</span>
        <span>{item.label}</span>
      </NavLink>
    ))}
  </nav>
);