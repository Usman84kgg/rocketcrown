import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Home() {
  const [games, setGames] = useState<any[]>([]);

  useEffect(() => {
    axios.get('/api/games').then(res => setGames(res.data)).catch(() => {});
  }, []);

  return (
    <div className="p-4">
      {/* Баннер */}
      <div className="bg-gradient-to-br from-[#1c0033] to-[#300050] rounded-2xl p-6 mb-4 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold">+100% К ПЕРВОМУ ДЕПОЗИТУ</h2>
          <p className="text-gray-300 text-sm mt-2">ПОЛУЧИТЬ БОНУС</p>
          <button className="mt-4 bg-pink-600 text-white px-6 py-2 rounded-full font-bold">ПОЛУЧИТЬ БОНУС</button>
        </div>
        <div className="absolute right-0 top-0 w-32 h-32 bg-pink-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      </div>

      {/* Быстрые карточки */}
      <div className="flex gap-3 mb-6">
        {['🎰 Daily Spin','💸 Кэшбэк','👑 VIP Club','🏆 Турниры'].map((item, i) => (
          <div key={i} className="flex-1 bg-[#1a0a2e] rounded-2xl p-3 text-center text-xs border border-purple-500/20">
            {item}
          </div>
        ))}
      </div>

      {/* Игры */}
      <h3 className="text-lg font-bold mb-3">ТОП ИГРЫ</h3>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {games.length > 0 ? games.map((g: any) => (
          <Link key={g.id} to={`/game/${g.slug}`} className="min-w-[130px] bg-[#1a0a2e] rounded-2xl overflow-hidden border border-purple-500/20">
            <div className="h-20 bg-gradient-to-br from-purple-800 to-pink-700 flex items-center justify-center font-bold text-lg">{g.name}</div>
            <div className="p-2 text-sm">{g.name}</div>
            <div className="px-2 pb-2 text-xs text-gray-400">Min {g.min_bet}</div>
          </Link>
        )) : (
          ['CRASH','MINES','PLINKO'].map(name => (
            <div key={name} className="min-w-[130px] bg-[#1a0a2e] rounded-2xl overflow-hidden border border-purple-500/20">
              <div className="h-20 bg-gradient-to-br from-purple-800 to-pink-700 flex items-center justify-center font-bold text-lg">{name}</div>
              <div className="p-2 text-sm">{name}</div>
              <div className="px-2 pb-2 text-xs text-gray-400">Min 0.1</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}