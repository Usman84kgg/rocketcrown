import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

interface UserBonus {
  id: string;
  bonus: {
    id: string;
    title: string;
    description: string;
    type: string;
    amount: number;
    percent: number;
  };
  status: string;
}

export const BonusesScreen: React.FC = () => {
  const { user } = useAuthStore();
  const [bonuses, setBonuses] = useState<UserBonus[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('/api/users/me/bonuses', { headers: { Authorization: `Bearer ${token}` } }).then(res => setBonuses(res.data));
  }, []);

  return (
    <div className="px-4 py-6">
      <h2 className="text-white text-2xl font-bold mb-6">МОИ БОНУСЫ</h2>

      <div className="flex flex-col gap-4">
        {bonuses.map(ub => (
          <div
            key={ub.id}
            className="bg-[#1a0a2e] rounded-2xl p-5 border border-purple-500/20 hover:border-pink-500/30 transition-colors"
          >
            <h3 className="text-white font-semibold text-lg">{ub.bonus.title}</h3>
            <p className="text-white text-2xl font-bold mt-1">
              {ub.bonus.type === 'deposit_percent' && `+${ub.bonus.percent}%`}
              {ub.bonus.type === 'free_spins' && `+${ub.bonus.amount} FS`}
              {ub.bonus.type === 'cashback' && `до ${ub.bonus.percent}%`}
              {ub.bonus.type === 'welcome' && `+${ub.bonus.amount} FS`}
            </p>
            {ub.bonus.description && (
              <p className="text-gray-400 text-sm mt-1">{ub.bonus.description}</p>
            )}
            <div className="mt-3">
              {ub.status === 'active' ? (
                <button className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
                  Активировать
                </button>
              ) : (
                <button className="bg-green-600/20 text-green-400 px-6 py-2 rounded-full text-sm" disabled>
                  Получен
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};