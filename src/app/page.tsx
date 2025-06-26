'use client';

import { useState } from 'react';
import { HeroSection } from '@/components/hero-section';
import { TopUpCategories } from '@/components/favorite-games';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div className="flex flex-col">
      {!selectedCategory && <HeroSection />}
      <TopUpCategories 
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
    </div>
  );
}
