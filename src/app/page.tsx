import { HeroSection } from '@/components/hero-section';
import { TopUpCategories } from '@/components/favorite-games';

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <TopUpCategories />
    </div>
  );
}
