export default function Bonuses() {
  const bonuses = [
    { title: 'Welcome Bonus', amount: '+250 FS', desc: 'за регистрацию', received: true },
    { title: 'Бонус к депозиту', amount: '+100%', desc: 'на первый депозит', received: false },
    { title: 'Кэшбэк', amount: 'до 10%', desc: 'еженедельно', received: true },
  ];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-center mb-6">МОИ БОНУСЫ</h2>
      <div className="flex flex-col gap-4">
        {bonuses.map((b, i) => (
          <div key={i} className="bg-[#1a0a2e] rounded-2xl p-5 border border-purple-500/20">
            <div className="font-bold text-lg">{b.title}</div>
            <div className="text-2xl font-bold my-1">{b.amount}</div>
            <div className="text-gray-400 text-sm mb-3">{b.desc}</div>
            <button className={`px-6 py-2 rounded-full text-sm font-bold ${b.received ? 'bg-green-600/20 text-green-400' : 'bg-gradient-to-r from-pink-600 to-purple-600 text-white'}`}>
              {b.received ? 'Получен' : 'Активировать'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}