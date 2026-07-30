import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '../stores/authStore';
import { io, Socket } from 'socket.io-client';

interface Ticket {
  id: string;
  subject: string;
  status: string;
  created_at: string;
}

export const SupportScreen: React.FC = () => {
  const { user } = useAuthStore();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [activeTicket, setActiveTicket] = useState<string | null>(null);

  const loadTickets = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get('/api/support/tickets', { headers: { Authorization: `Bearer ${token}` } });
    setTickets(res.data);
  };

  useEffect(() => { loadTickets(); }, []);

  const createTicket = async () => {
    if (!subject || !message) return;
    const token = localStorage.getItem('token');
    await axios.post('/api/support/tickets', { subject, message }, { headers: { Authorization: `Bearer ${token}` } });
    setSubject('');
    setMessage('');
    loadTickets();
  };

  return (
    <div className="px-4 py-6">
      <h2 className="text-white text-2xl font-bold text-center mb-2">ПОДДЕРЖКА 24/7</h2>
      <p className="text-gray-400 text-center mb-6">Мы всегда готовы помочь!</p>

      <div className="flex flex-col gap-3">
        <button
          onClick={() => setActiveTicket('new')}
          className="bg-[#1a0a2e] rounded-2xl p-4 border border-pink-500/40 flex items-center gap-3 hover:border-pink-500/60 transition-colors"
        >
          <span className="text-2xl">💬</span>
          <div>
            <p className="text-white font-semibold">Чат с поддержкой</p>
            <p className="text-green-400 text-sm">Онлайн</p>
          </div>
        </button>

        <a href="/faq" className="bg-[#1a0a2e] rounded-2xl p-4 border border-purple-500/20 flex items-center gap-3">
          <span className="text-2xl">❓</span>
          <div>
            <p className="text-white font-semibold">FAQ</p>
            <p className="text-gray-400 text-sm">Часто задаваемые вопросы</p>
          </div>
        </a>

        <a href="mailto:info@rocketcrown.com" className="bg-[#1a0a2e] rounded-2xl p-4 border border-purple-500/20 flex items-center gap-3">
          <span className="text-2xl">📧</span>
          <div>
            <p className="text-white font-semibold">Отправить Email</p>
            <p className="text-gray-400 text-sm">info@rocketcrown.com</p>
          </div>
        </a>
      </div>

      {/* Создание тикета */}
      {activeTicket === 'new' && (
        <div className="mt-6 bg-[#1a0a2e] rounded-2xl p-4 border border-purple-500/30">
          <h3 className="text-white font-semibold mb-3">Новое обращение</h3>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Тема"
            className="w-full bg-gray-900 rounded-xl p-2 text-white mb-2 outline-none"
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ваше сообщение..."
            rows={3}
            className="w-full bg-gray-900 rounded-xl p-2 text-white mb-3 outline-none"
          />
          <div className="flex gap-2">
            <button onClick={createTicket} className="bg-pink-600 text-white px-4 py-2 rounded-full text-sm">Отправить</button>
            <button onClick={() => setActiveTicket(null)} className="bg-gray-700 text-white px-4 py-2 rounded-full text-sm">Отмена</button>
          </div>
        </div>
      )}

      {/* Список тикетов */}
      {tickets.length > 0 && (
        <div className="mt-6">
          <h3 className="text-white font-semibold mb-3">Мои обращения</h3>
          <div className="flex flex-col gap-2">
            {tickets.map(t => (
              <div key={t.id} className="bg-[#1a0a2e] rounded-2xl p-3 border border-purple-500/20">
                <p className="text-white text-sm">{t.subject}</p>
                <p className="text-gray-500 text-xs">{new Date(t.created_at).toLocaleDateString()} — {t.status}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};