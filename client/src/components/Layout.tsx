import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { BottomNav } from './BottomNav';

export const Layout = () => (
  <div className="min-h-screen bg-rocket-dark text-white pb-16">
    <Header />
    <Outlet />
    <BottomNav />
  </div>
);