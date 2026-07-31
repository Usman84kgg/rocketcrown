import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Games from './pages/Games';
import Cashier from './pages/Cashier';
import Deposit from './pages/Deposit';
import Withdraw from './pages/Withdraw';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Bonuses from './pages/Bonuses';
import Support from './pages/Support';
import Admin from './pages/Admin';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0d0118] text-white pb-16">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/games" element={<Games />} />
          <Route path="/cashier" element={<Cashier />} />
          <Route path="/deposit/:currency?" element={<Deposit />} />
          <Route path="/withdraw" element={<Withdraw />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/bonuses" element={<Bonuses />} />
          <Route path="/support" element={<Support />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}