
'use client';

import { useAppStore } from '@/lib/store';
import { Skeleton } from '@/components/ui/skeleton';

const PageSkeleton = () => (
    <div className="container py-8 md:py-12">
        <div className="flex flex-col items-center text-center">
            <Skeleton className="h-10 w-1/2 mb-6" />
            <Skeleton className="h-5 w-4/5 mb-2" />
            <Skeleton className="h-5 w-3/4 mb-8" />
            <Skeleton className="w-full max-w-4xl aspect-video rounded-lg" />
        </div>
    </div>
);

export default function TutorialPage() {
  const { siteSettings, isAuthLoading } = useAppStore();

  if (isAuthLoading || !siteSettings) {
    return <PageSkeleton />;
  }
  
  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-4xl font-bold mb-6 font-headline">How to Top Up</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mb-8">
          Follow this short video tutorial to learn how to quickly and securely top up your account and purchase your favorite in-game items.
        </p>
        <div className="w-full max-w-4xl aspect-video rounded-lg overflow-hidden shadow-2xl border bg-card">
          <iframe
            className="w-full h-full border-0"
            src={siteSettings.tutorialVideoUrl}
            title="Video Tutorial"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
}
