import { useNavigate, useLocation } from 'react-router-dom';

const items = [
  { path: '/cashier', label: 'Касса' },
  { path: '/games', label: 'Игры' },
  { path: '/', label: 'Казино' },
  { path: '/support', label: 'Меню' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/90 border-t border-purple-500/20 flex justify-around py-2 z-50">
      {items.map(item => (
        <button
          key={item.path}
          onClick={() => navigate(item.path)}
          className={`text-sm ${location.pathname === item.path ? 'text-pink-500' : 'text-gray-400'}`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}