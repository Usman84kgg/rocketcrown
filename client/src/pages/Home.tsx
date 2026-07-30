import { BannerCarousel } from '../components/BannerCarousel';
import { QuickCards } from '../components/QuickCards';
import { GameGrid } from '../components/GameGrid';
import { ActivityFeed } from '../components/ActivityFeed';

export const HomeScreen = () => (
  <div className="px-4 py-4">
    <BannerCarousel />
    <QuickCards />
    <GameGrid />
    <ActivityFeed />
  </div>
);