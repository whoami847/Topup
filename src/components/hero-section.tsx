'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from '@/lib/utils';

const banners = [
  {
    src: 'https://placehold.co/1920x1080.png',
    alt: 'Free Fire Diamonds Banner',
    title: 'FREE FIRE DIAMONDS',
    description: 'Get your game diamonds instantly and securely. The best prices, guaranteed.',
    buttonText: 'Top Up Now',
    buttonLink: '/top-up/diamond-top-up-bd',
    aiHint: 'gaming background'
  },
  {
    src: 'https://placehold.co/1920x1080.png',
    alt: 'PUBG UC Banner',
    title: 'PUBG MOBILE UC',
    description: 'Load up on Unknown Cash and dominate the battlegrounds.',
    buttonText: 'Get UC Now',
    buttonLink: '/top-up/pubg-mobile-uc',
    aiHint: 'battle royale action'
  },
  {
    src: 'https://placehold.co/1920x1080.png',
    alt: 'Vouchers Banner',
    title: 'GAME VOUCHERS',
    description: 'All your favorite game vouchers in one place.',
    buttonText: 'Browse Vouchers',
    buttonLink: '/', 
    aiHint: 'gift cards gaming'
  }
];


export function HeroSection() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentIndex(prevIndex => (prevIndex + 1) % banners.length);
        }, 3000); // Change slide every 3 seconds

        return () => clearInterval(intervalId);
    }, []);

    return (
        <section className="relative w-full h-[40vh] md:h-[60vh] flex items-center justify-center text-center text-white overflow-hidden">
            {/* Background Images */}
            {banners.map((banner, index) => (
                <Image
                    key={index}
                    src={banner.src}
                    alt={banner.alt}
                    fill
                    className={cn(
                        "object-cover z-0 transition-opacity duration-1000 ease-in-out",
                        index === currentIndex ? "opacity-100" : "opacity-0"
                    )}
                    data-ai-hint={banner.aiHint}
                    priority={index === 0}
                />
            ))}
           
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60 z-10"></div>
            
            {/* Content */}
            <div className="relative z-20 container">
              {banners.map((banner, index) => (
                  <div 
                      key={index}
                      className={cn(
                          "absolute inset-0 flex flex-col items-center justify-center gap-6 p-4 transition-all duration-1000 ease-in-out",
                          index === currentIndex ? "opacity-100 scale-100" : "opacity-0 scale-95"
                      )}
                  >
                      <div className="bg-black/50 p-2 rounded-md inline-block">
                          <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-primary to-yellow-400">
                              {banner.title}
                          </h1>
                      </div>
                      <p className="max-w-2xl text-lg md:text-xl text-neutral-200">
                         {banner.description}
                      </p>
                      <Link href={banner.buttonLink}>
                          <Button size="lg" className="rounded-full font-bold group">
                              {banner.buttonText}
                              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                          </Button>
                      </Link>
                  </div>
              ))}
            </div>
        </section>
    );
}