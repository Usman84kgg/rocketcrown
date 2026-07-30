import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Currency {
  id: string;
  code: string;
  name: string;
  network: string;
  min_deposit: number;
  bonus_percent: number;
}

interface Props {
  onSelect: (code: string) => void;
}

export const CurrencySelector: React.FC<Props> = ({ onSelect }) => {
  const [currencies, setCurrencies] = useState<Currency[]>([]);

  useEffect(() => {
    axios.get('/api/deposit/currencies').then(res => setCurrencies(res.data));
  }, []);

  return (
    <div>
      <h3 className="text-white text-sm mb-3 uppercase tracking-wide">Выберите валюту</h3>
      <div className="flex flex-col gap-2">
        {currencies.map(c => (
          <div
            key={c.code + c.network}
            onClick={() => onSelect(c.code)}
            className="flex items-center justify-between bg-[#1a0a2e] rounded-2xl p-4 border border-purple-500/20 hover:border-pink-500/40 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-xl">
                {getCoinIcon(c.code)}
              </div>
              <div>
                <div className="text-white font-semibold">{c.code}</div>
                <div className="text-gray-400 text-sm">{c.name} ({c.network})</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {c.bonus_percent > 0 && (
                <span className="bg-red-500/20 text-red-400 text-sm px-2 py-1 rounded-lg">
                  +{c.bonus_percent}%
                </span>
              )}
              <span className="text-pink-500 text-xl">›</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

function getCoinIcon(code: string): string {
  const icons: Record<string, string> = {
    TON: '💎',
    USDT: '💵',
    BTC: '₿',
    ETH: 'Ξ',
    LTC: 'Ł',
    TRX: '🔷',
    BNB: '🟡',
    SOL: '🟣',
  };
  return icons[code] || '🪙';
}