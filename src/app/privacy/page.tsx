
'use client';

import { useAppStore } from '@/lib/store';
import { Skeleton } from '@/components/ui/skeleton';

const PageSkeleton = () => (
    <div className="container py-12 md:py-16">
        <div className="max-w-4xl mx-auto space-y-8">
            <Skeleton className="h-10 w-1/2 mx-auto" />
            <Skeleton className="h-48 w-full mt-8" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-32 w-full mt-8" />
        </div>
    </div>
);


export default function PrivacyPage() {
  const { siteSettings, isAuthLoading } = useAppStore();

  if (isAuthLoading || !siteSettings) {
    return <PageSkeleton />;
  }

  return (
    <div className="container py-12 md:py-16">
      <div
        className="prose prose-lg dark:prose-invert max-w-4xl mx-auto"
        dangerouslySetInnerHTML={{ __html: siteSettings.privacyPage }}
      />
    </div>
  );
}
