import { useParams } from 'react-router-dom';

export default function Deposit() {
  const { currency } = useParams();
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-center mb-6">ДЕПОЗИТ</h2>
      <div className="bg-[#1a0a2e] rounded-2xl p-4 mb-4 border border-purple-500/30">
        <div className="text-gray-400 text-sm mb-1">Выбрано</div>
        <div className="font-semibold">💎 {currency || 'TON'} ({currency || 'TON'} Network)</div>
      </div>
      <div className="bg-[#1a0a2e] rounded-2xl p-4 mb-4 border border-purple-500/30 flex justify-between items-center">
        <span className="text-sm truncate">EQC123...abcd456efg</span>
        <span className="text-pink-500">📋</span>
      </div>
      <div className="w-40 h-40 bg-white mx-auto rounded-xl border-4 border-pink-500/40 mb-4" />
      <p className="text-center text-sm">Отправьте только {currency || 'TON'} на этот адрес</p>
      <p className="text-center text-sm text-red-500 mt-1">Минимум: 0.2 {currency || 'TON'}</p>
      <button className="w-full mt-6 bg-gradient-to-r from-pink-600 to-purple-600 py-3 rounded-2xl font-bold text-lg">Я оплатил</button>
    </div>
  );
}