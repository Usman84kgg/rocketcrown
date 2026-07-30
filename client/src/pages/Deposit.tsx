import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface DepositData {
  deposit_id: string;
  currency: string;
  network: string;
  wallet_address: string;
  qr_code: string;
  min_deposit: number;
}

export const DepositScreen: React.FC = () => {
  const { currency } = useParams<{ currency?: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<DepositData | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState(currency || 'TON');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedCurrency) {
      setLoading(true);
      const token = localStorage.getItem('token');
      axios
        .post('/api/deposit/request', { currency: selectedCurrency }, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(res => setData(res.data))
        .finally(() => setLoading(false));
    }
  }, [selectedCurrency]);

  const handlePaid = async () => {
    if (!data) return;
    const token = localStorage.getItem('token');
    await axios.post('/api/deposit/confirm-payment', { depositId: data.deposit_id }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    alert('Заявка отправлена владельцу на проверку');
  };

  if (loading || !data) {
    return <div className="flex justify-center items-center h-64 text-white">Загрузка...</div>;
  }

  return (
    <div className="px-4 py-6">
      <h2 className="text-white text-2xl font-bold text-center mb-6">ДЕПОЗИТ</h2>

      {/* Выбрано */}
      <div className="bg-[#1a0a2e] rounded-2xl p-4 mb-4 border border-purple-500/30">
        <div className="text-gray-400 text-sm mb-1">Выбрано</div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-sm">
            {getCoinIcon(data.currency)}
          </div>
          <span className="text-white font-semibold">{data.currency}</span>
          <span className="text-gray-400 text-sm">({data.network})</span>
        </div>
      </div>

      {/* Сеть */}
      <div className="text-gray-400 text-sm mb-1">Сеть</div>
      <div className="bg-[#1a0a2e] rounded-2xl p-3 mb-4 border border-purple-500/30">
        <span className="text-white">{data.network} Network</span>
      </div>

      {/* Адрес кошелька */}
      <div className="text-gray-400 text-sm mb-1">Адрес кошелька</div>
      <div className="bg-[#1a0a2e] rounded-2xl p-3 flex justify-between items-center border border-purple-500/30 mb-4">
        <span className="text-white text-sm truncate">{data.wallet_address}</span>
        <button
          onClick={() => navigator.clipboard.writeText(data.wallet_address)}
          className="text-pink-500 hover:text-pink-400 transition-colors"
        >
          📋
        </button>
      </div>

      {/* QR-код */}
      <div className="flex justify-center mb-4">
        <img
          src={data.qr_code}
          alt="QR code"
          className="w-48 h-48 border-4 border-pink-500/30 rounded-xl"
        />
      </div>

      <p className="text-white text-center text-sm mb-1">
        Отправьте только {data.currency} на этот адрес
      </p>
      <p className="text-center text-sm mb-6">
        Минимум: <span className="text-red-500">{data.min_deposit} {data.currency}</span>
      </p>

      <button
        onClick={handlePaid}
        className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold py-3 rounded-2xl text-lg hover:opacity-90 transition-opacity"
      >
        Я оплатил
      </button>
    </div>
  );
};