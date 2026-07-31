export default function Admin() {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Админ-панель</h2>
      <div className="bg-[#1a0a2e] rounded-2xl p-6 border border-purple-500/20 text-center">
        <p className="text-gray-400">Панель управления владельца.</p>
        <p className="text-gray-500 text-sm mt-2">Здесь будут: пользователи, депозиты, выводы, игры, кошельки.</p>
      </div>
    </div>
  );
}