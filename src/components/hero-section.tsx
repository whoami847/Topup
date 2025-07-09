
'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/store';
import { Skeleton } from './ui/skeleton';

export function HeroSection() {
    const { siteSettings } = useAppStore();
    const [currentIndex, setCurrentIndex] = useState(0);

    const banners = siteSettings?.banners.filter(b => b.enabled) || [];

    useEffect(() => {
        if (banners.length > 1) {
            const intervalId = setInterval(() => {
                setCurrentIndex(prevIndex => (prevIndex + 1) % banners.length);
            }, 5000); // Change slide every 5 seconds

            return () => clearInterval(intervalId);
        }
    }, [banners.length]);
    
    if (!siteSettings) {
        return <Skeleton className="w-full h-[40vh] md:h-[60vh]" />;
    }

    if (banners.length === 0) {
        return null; // Don't render the hero section if no banners are enabled
    }

    return (
        <section className="relative w-full h-[40vh] md:h-[60vh] flex items-center justify-center text-center text-white overflow-hidden">
            {/* Background Images */}
            {banners.map((banner, index) => (
                <Image
                    key={banner.id}
                    src={banner.src}
                    alt={banner.alt}
                    fill
                    sizes="100vw"
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
                      key={banner.id}
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
