import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface Activity {
  username_display: string;
  game_name: string;
  win_amount: number;
  currency: string;
  created_at: string;
}

export const ActivityFeed: React.FC = () => {
  const [events, setEvents] = useState<Activity[]>([]);

  useEffect(() => {
    const socket: Socket = io(import.meta.env.VITE_WS_URL || '');

    socket.on('connect', () => {
      socket.emit('activity:request', { limit: 20 });
    });

    socket.on('activity:initial', (items: Activity[]) => setEvents(items));
    socket.on('activity:new', (item: Activity) => {
      setEvents(prev => [item, ...prev].slice(0, 20));
    });

    return () => { socket.disconnect(); };
  }, []);

  if (events.length === 0) return null;

  return (
    <div className="bg-[#0d0118]/70 backdrop-blur rounded-2xl p-4 border border-purple-500/15">
      <h3 className="text-white text-sm font-semibold mb-3">Последние выигрыши</h3>
      <div className="flex flex-col gap-2">
        {events.slice(0, 10).map((e, i) => (
          <div key={i} className="flex justify-between items-center text-sm">
            <span className="text-gray-400 truncate mr-2">
              {maskName(e.username_display)} —{' '}
              <span className="text-pink-400">{e.game_name}</span>
            </span>
            <span className="text-green-400 font-mono whitespace-nowrap">
              +{Number(e.win_amount).toFixed(2)} {e.currency}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

function maskName(name: string): string {
  if (!name || name.length <= 2) return name || 'Anon';
  return name[0] + '***' + name[name.length - 1];
}