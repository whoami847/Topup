import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center text-center text-white">
      <Image
        src="https://placehold.co/1920x1080.png"
        alt="Free Fire Diamonds Banner"
        fill
        className="object-cover z-0"
        data-ai-hint="gaming background"
        priority
      />
      <div className="absolute inset-0 bg-black/60 z-10"></div>
      <div className="relative z-20 container flex flex-col items-center gap-6">
        <div className="bg-black/50 p-2 rounded-md inline-block">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-headline font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-primary to-yellow-400">
            FREE FIRE DIAMONDS
          </h1>
        </div>
        <p className="max-w-2xl text-lg md:text-xl text-neutral-200">
          Get your game diamonds instantly and securely. The best prices, guaranteed.
        </p>
        <Link href="/top-up/diamond-top-up-bd">
          <Button size="lg" className="text-lg px-8 py-6 rounded-full font-bold group">
            Top Up Now
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
