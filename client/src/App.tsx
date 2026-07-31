import { BrowserRouter, Routes, Route } from 'react-router-dom';

function Home() {
  return <div className="p-6 text-white text-xl">👑 ROCKET CROWN — Главная</div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0d0118] text-white">
        <Routes>
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}