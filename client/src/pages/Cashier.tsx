import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CurrencySelector } from '../components/CurrencySelector';

export const CashierScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="px-4 py-6">
      <h2 className="text-white text-2xl font-bold text-center mb-6">ДЕПОЗИТ</h2>

      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => navigate('/deposit')}
          className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-2 rounded-full font-semibold"
        >
          Депозит
        </button>
        <button
          onClick={() => navigate('/withdraw')}
          className="bg-gray-800 text-white px-8 py-2 rounded-full"
        >
          Вывод
        </button>
        <button className="bg-gray-800 text-white px-8 py-2 rounded-full">
          История
        </button>
      </div>

      <CurrencySelector onSelect={(code) => navigate(`/deposit/${code}`)} />
    </div>
  );
};