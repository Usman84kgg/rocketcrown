import React from 'react';

const cards = [
  { label: 'Daily Spin', icon: '🎰', color: 'from-orange-500 to-red-600', path: '/daily-spin' },
  { label: 'Кэшбэк', icon: '💸', color: 'from-green-500 to-emerald-600', path: '/cashback' },
  { label: 'VIP Club', icon: '👑', color: 'from-yellow-500 to-amber-600', path: '/vip' },
  { label: 'Турниры', icon: '🏆', color: 'from-blue-500 to-cyan-600', path: '/tournaments' },
];

export const QuickCards: React.FC = () => {
  return (
    <div className="flex justify-between gap-3 mb-6">
      {cards.map(card => (
        <a
          key={card.label}
          href={card.path}
          className="flex flex-col items-center gap-1 flex-1 bg-gray-900/70 rounded-2xl p-3 border border-purple-500/10 hover:border-pink-500/30 transition-colors"
        >
          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${card.color} flex items-center justify-center text-lg`}>
            {card.icon}
          </div>
          <span className="text-white text-xs text-center leading-tight">{card.label}</span>
        </a>
      ))}
    </div>
  );
};