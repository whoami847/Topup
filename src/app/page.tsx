import { HeroSection } from '@/components/hero-section';
import { FavoriteGames } from '@/components/favorite-games';

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <FavoriteGames />
    </div>
  );
}
