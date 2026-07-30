import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export const GameGrid = () => {
  const [games, setGames] = useState<any[]>([]);
  const [category, setCategory] = useState('all');

  useEffect(() => {
    const params = category !== 'all' ? { category } : {};
    axios.get('/api/games', { params }).then(res => setGames(res.data));
  }, [category]);

  return (
    <div className="mt-6">
      <h2 className="text-lg font-bold mb-2">ТОП ИГРЫ</h2>
      <div className="flex gap-2 mb-4 overflow-x-auto">
        {['all','crash','live','slots','mini','new','popular'].map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1 rounded-full text-sm ${category === cat ? 'bg-pink-600' : 'bg-gray-800'}`}
          >
            {cat === 'all' ? 'Все' : cat}
          </button>
        ))}
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {games.map((game: any) => (
          <Link to={`/game/${game.slug}`} key={game.id} className="min-w-[140px] rounded-2xl overflow-hidden bg-gray-900">
            <img src={game.image_url} alt={game.name} className="w-full h-24 object-cover" />
            <div className="p-2">
              <p className="font-semibold">{game.name}</p>
              <p className="text-xs text-gray-400">Min {game.min_bet}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};