import { Link } from 'react-router-dom';

export default function Cashier() {
  const coins = [
    { code: 'TON', name: 'Toncoin', bonus: 7, icon: '💎' },
    { code: 'USDT', name: 'TRC20', bonus: 5, icon: '💵' },
    { code: 'USDT', name: 'BEP20', bonus: 5, icon: '💵' },
    { code: 'BTC', name: 'Bitcoin', bonus: 5, icon: '₿' },
    { code: 'ETH', name: 'Ethereum', bonus: 5, icon: 'Ξ' },
  ];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-center mb-6">ДЕПОЗИТ</h2>
      <div className="flex justify-center gap-4 mb-6">
        <button className="bg-gradient-to-r from-pink-600 to-purple-600 px-6 py-2 rounded-full font-bold">Депозит</button>
        <Link to="/withdraw" className="bg-[#1a0a2e] px-6 py-2 rounded-full">Вывод</Link>
      </div>
      <h3 className="text-sm text-gray-400 mb-3 uppercase">Выберите валюту</h3>
      <div className="flex flex-col gap-2">
        {coins.map((c, i) => (
          <Link
            key={i}
            to={`/deposit/${c.code}`}
            className="flex items-center justify-between bg-[#1a0a2e] rounded-2xl p-4 border border-purple-500/20 hover:border-pink-500/30"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{c.icon}</span>
              <div>
                <div className="font-semibold">{c.code}</div>
                <div className="text-gray-400 text-sm">{c.name}</div>
              </div>
            </div>
            <span className="bg-red-500/20 text-red-400 text-sm px-2 py-1 rounded-lg">+{c.bonus}%</span>
          </Link>
        ))}
      </div>
    </div>
  );
}