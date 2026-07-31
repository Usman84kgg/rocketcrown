export default function Withdraw() {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-center mb-6">ВЫВОД СРЕДСТВ</h2>
      <div className="bg-[#1a0a2e] rounded-2xl p-4 mb-4 border border-purple-500/30">
        <span className="text-gray-400 text-sm">Валюта:</span> 💎 TON
      </div>
      <input className="w-full bg-[#1a0a2e] p-3 rounded-2xl mb-4 border border-purple-500/30 text-white" placeholder="Введите адрес" />
      <div className="relative mb-4">
        <input className="w-full bg-[#1a0a2e] p-3 rounded-2xl border border-purple-500/30 text-white" placeholder="Минимум 0.2 TON" />
        <button className="absolute right-2 top-2 bg-pink-600 text-white px-3 py-1 rounded-full text-sm font-bold">MAX</button>
      </div>
      <div className="bg-[#1a0a2e] rounded-2xl p-4 mb-6 border border-purple-500/30 text-gray-400">Вы получите: 0.00 TON</div>
      <button className="w-full bg-gradient-to-r from-pink-600 to-purple-600 py-3 rounded-2xl font-bold text-lg">Вывести</button>
    </div>
  );
}