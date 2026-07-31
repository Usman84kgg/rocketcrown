import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Games() {
  const [games, setGames] = useState<any[]>([]);

  useEffect(() => {
    axios.get('/api/games').then(res => setGames(res.data)).catch(() => {});
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">ВСЕ ИГРЫ</h2>
      <div className="flex gap-2 overflow-x-auto mb-4">
        {['Все','Crash','Mini','Slots'].map(cat => (
          <button key={cat} className="bg-[#1a0a2e] px-4 py-1 rounded-full text-sm border border-purple-500/20">{cat}</button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {games.length > 0 ? games.map(g => (
          <div key={g.id} className="bg-[#1a0a2e] rounded-2xl p-3 border border-purple-500/20">
            <div className="h-20 bg-purple-800/40 rounded-xl flex items-center justify-center font-bold">{g.name}</div>
            <div className="mt-2 text-sm">{g.name}</div>
            <div className="text-xs text-gray-400">Min {g.min_bet}</div>
          </div>
        )) : (
          ['CRASH','MINES','PLINKO'].map(name => (
            <div key={name} className="bg-[#1a0a2e] rounded-2xl p-3 border border-purple-500/20">
              <div className="h-20 bg-purple-800/40 rounded-xl flex items-center justify-center font-bold">{name}</div>
              <div className="mt-2 text-sm">{name}</div>
              <div className="text-xs text-gray-400">Min 0.1</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}