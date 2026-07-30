import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { TelegramAuth } from './components/Auth/TelegramAuth';
import { HomeScreen } from './pages/Home';
import { CashierScreen } from './pages/Cashier';
import { DepositScreen } from './pages/Deposit';
import { WithdrawScreen } from './pages/Withdraw';
import { GamesScreen } from './pages/Games';
import { ProfileScreen } from './pages/Profile';
import { SettingsScreen } from './pages/Settings';
import { BonusesScreen } from './pages/Bonuses';
import { SupportScreen } from './pages/Support';
import { AdminPanel } from './pages/Admin';
import { Layout } from './components/Layout';
import { initTelegram } from './lib/telegram';

export default function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    initTelegram();
    checkAuth();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomeScreen />} />
          <Route path="cashier" element={<CashierScreen />} />
          <Route path="deposit/:currency?" element={<DepositScreen />} />
          <Route path="withdraw" element={<WithdrawScreen />} />
          <Route path="games" element={<GamesScreen />} />
          <Route path="profile" element={<ProfileScreen />} />
          <Route path="settings" element={<SettingsScreen />} />
          <Route path="bonuses" element={<BonusesScreen />} />
          <Route path="support" element={<SupportScreen />} />
          <Route path="admin/*" element={<AdminPanel />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}