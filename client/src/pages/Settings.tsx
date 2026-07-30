import React, { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import axios from 'axios';

export const SettingsScreen: React.FC = () => {
  const { user } = useAuthStore();
  const [phone, setPhone] = useState('');
  const [bonusNotif, setBonusNotif] = useState(true);
  const [tournamentNotif, setTournamentNotif] = useState(true);
  const [systemNotif, setSystemNotif] = useState(false);

  const handleSavePhone = async () => {
    const token = localStorage.getItem('token');
    await axios.put('/api/users/me/phone', { phone }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    alert('Телефон сохранён');
  };

  return (
    <div className="px-4 py-6">
      <h2 className="text-white text-2xl font-bold mb-6">Настройки</h2>

      {/* Аккаунт */}
      <div className="mb-8">
        <h3 className="text-white text-sm font-semibold uppercase tracking-wide mb-3">Аккаунт</h3>
        <div className="flex flex-col gap-1">
          <div className="bg-[#1a0a2e] rounded-2xl p-4 border border-purple-500/20 flex items-center justify-between">
            <span className="text-white">Привязать телефон</span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+7 (___) ___-__-__"
                className="bg-transparent text-right text-gray-400 outline-none w-32"
              />
              <button onClick={handleSavePhone} className="text-pink-500">💾</button>
            </div>
          </div>
          <div className="bg-[#1a0a2e] rounded-2xl p-4 border border-purple-500/20 flex items-center justify-between">
            <span className="text-white">Изменить пароль</span>
            <span className="text-gray-500">›</span>
          </div>
          <div className="bg-[#1a0a2e] rounded-2xl p-4 border border-purple-500/20 flex items-center justify-between">
            <span className="text-white">Язык</span>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Русский</span>
              <span className="text-gray-500">›</span>
            </div>
          </div>
        </div>
      </div>

      {/* Уведомления */}
      <div className="mb-8">
        <h3 className="text-white text-sm font-semibold uppercase tracking-wide mb-3">Уведомления</h3>
        <div className="flex flex-col gap-1">
          <ToggleRow label="Бонусы и акции" checked={bonusNotif} onChange={setBonusNotif} />
          <ToggleRow label="Турниры" checked={tournamentNotif} onChange={setTournamentNotif} />
          <ToggleRow label="Системные" checked={systemNotif} onChange={setSystemNotif} />
        </div>
      </div>

      {/* Прочее */}
      <div>
        <h3 className="text-white text-sm font-semibold uppercase tracking-wide mb-3">Прочее</h3>
        <div className="bg-[#1a0a2e] rounded-2xl p-4 border border-purple-500/20 flex items-center justify-between">
          <span className="text-white">Условия и правила</span>
          <span className="text-gray-500">›</span>
        </div>
      </div>
    </div>
  );
};

const ToggleRow: React.FC<{ label: string; checked: boolean; onChange: (v: boolean) => void }> = ({ label, checked, onChange }) => (
  <div className="bg-[#1a0a2e] rounded-2xl p-4 border border-purple-500/20 flex items-center justify-between">
    <span className="text-white">{label}</span>
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-12 h-6 rounded-full transition-colors ${checked ? 'bg-pink-600' : 'bg-gray-600'}`}
    >
      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${checked ? 'right-1' : 'left-1'}`} />
    </button>
  </div>
);