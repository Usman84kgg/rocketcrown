import { useState } from 'react';

export default function Settings() {
  const [bonus, setBonus] = useState(true);
  const [tournaments, setTournaments] = useState(true);
  const [system, setSystem] = useState(false);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-6">Настройки</h2>
      <Section title="АККАУНТ">
        <Row label="Привязать телефон" />
        <Row label="Изменить пароль" />
        <div className="flex items-center justify-between p-4 bg-[#1a0a2e] rounded-2xl border border-purple-500/20">
          <span>🌐 Язык</span>
          <span className="text-gray-400">Русский ›</span>
        </div>
      </Section>
      <Section title="УВЕДОМЛЕНИЯ">
        <ToggleRow label="🎁 Бонусы и акции" checked={bonus} onChange={setBonus} />
        <ToggleRow label="🏆 Турниры" checked={tournaments} onChange={setTournaments} />
        <ToggleRow label="🔔 Системные" checked={system} onChange={setSystem} />
      </Section>
      <Section title="ПРОЧЕЕ">
        <Row label="📄 Условия и правила" />
      </Section>
    </div>
  );
}

function Section({ title, children }: any) {
  return (
    <div className="mb-6">
      <h3 className="text-sm text-gray-400 mb-2">{title}</h3>
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );
}

function Row({ label }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-[#1a0a2e] rounded-2xl border border-purple-500/20">
      <span>{label}</span>
      <span className="text-gray-500">›</span>
    </div>
  );
}

function ToggleRow({ label, checked, onChange }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-[#1a0a2e] rounded-2xl border border-purple-500/20" onClick={() => onChange(!checked)}>
      <span>{label}</span>
      <div className={`w-11 h-6 rounded-full ${checked ? 'bg-pink-600' : 'bg-gray-600'} relative transition`}>
        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${checked ? 'right-1' : 'left-1'}`} />
      </div>
    </div>
  );
}