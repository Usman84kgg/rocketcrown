export default function Support() {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-center mb-2">ПОДДЕРЖКА 24/7</h2>
      <p className="text-gray-400 text-center mb-6">Мы всегда готовы помочь!</p>
      <div className="flex flex-col gap-3">
        <div className="bg-[#1a0a2e] rounded-2xl p-4 border border-pink-500/40 flex items-center gap-3">
          <span className="text-2xl">💬</span>
          <div>
            <div className="font-semibold">Чат с поддержкой</div>
            <div className="text-green-400 text-sm">Онлайн</div>
          </div>
        </div>
        <div className="bg-[#1a0a2e] rounded-2xl p-4 border border-purple-500/20 flex items-center gap-3">
          <span className="text-2xl">❓</span>
          <div>
            <div className="font-semibold">FAQ</div>
            <div className="text-gray-400 text-sm">Часто задаваемые вопросы</div>
          </div>
        </div>
        <div className="bg-[#1a0a2e] rounded-2xl p-4 border border-purple-500/20 flex items-center gap-3">
          <span className="text-2xl">📧</span>
          <div>
            <div className="font-semibold">Отправить Email</div>
            <div className="text-gray-400 text-sm">info@rocketcrown.com</div>
          </div>
        </div>
      </div>
    </div>
  );
}