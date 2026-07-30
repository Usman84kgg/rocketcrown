import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

export const WithdrawScreen: React.FC = () => {
  const { currency } = useParams<{ currency?: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [selectedCurrency, setSelectedCurrency] = useState(currency || 'TON');
  const [walletAddress, setWalletAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleMax = () => {
    if (user) setAmount(user.balance.toString());
  };

  const handleWithdraw = async () => {
    setError('');
    if (!walletAddress) return setError('Введите адрес кошелька');
    if (!amount || parseFloat(amount) <= 0) return setError('Введите сумму');

    const token = localStorage.getItem('token');
    setLoading(true);
    try {
      await axios.post('/api/withdraw/request', {
        currency: selectedCurrency,
        walletAddress,
        amount: parseFloat(amount),
      }, { headers: { Authorization: `Bearer ${token}` } });
      alert('Заявка на вывод создана');
      navigate('/cashier');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Ошибка вывода');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-6">
      <h2 className="text-white text-2xl font-bold text-center mb-6">ВЫВОД СРЕДСТВ</h2>

      {/* Выбор валюты */}
      <div className="bg-[#1a0a2e] rounded-2xl p-4 mb-4 border border-purple-500/30">
        <div className="text-gray-400 text-sm mb-1">Валюта</div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-sm">
            {getCoinIcon(selectedCurrency)}
          </div>
          <span className="text-white font-semibold">{selectedCurrency}</span>
        </div>
      </div>

      {/* Адрес кошелька */}
      <div className="text-gray-400 text-sm mb-1">Адрес кошелька</div>
      <input
        type="text"
        value={walletAddress}
        onChange={(e) => setWalletAddress(e.target.value)}
        placeholder="Введите адрес"
        className="w-full bg-[#1a0a2e] rounded-2xl p-3 text-white mb-4 border border-purple-500/30 focus:border-pink-500/50 outline-none"
      />

      {/* Сумма */}
      <div className="text-gray-400 text-sm mb-1">Сумма</div>
      <div className="relative mb-4">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Минимум 0.2 TON"
          className="w-full bg-[#1a0a2e] rounded-2xl p-3 text-white pr-16 border border-purple-500/30 focus:border-pink-500/50 outline-none"
        />
        <button
          onClick={handleMax}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-pink-600 text-white px-3 py-1 rounded-full text-sm font-semibold"
        >
          MAX
        </button>
      </div>

      {/* Вы получите */}
      <div className="text-gray-400 text-sm mb-1">Вы получите</div>
      <div className="bg-[#1a0a2e] rounded-2xl p-3 text-white mb-6 border border-purple-500/30">
        {amount ? `${parseFloat(amount).toFixed(2)} ${selectedCurrency}` : `0.00 ${selectedCurrency}`}
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <button
        onClick={handleWithdraw}
        disabled={loading}
        className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold py-3 rounded-2xl text-lg hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {loading ? 'Обработка...' : 'Вывести'}
      </button>
    </div>
  );
};