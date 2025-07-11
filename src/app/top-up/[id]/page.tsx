
'use client';

import * as React from 'react';
import { useAppStore } from '@/lib/store';
import { notFound, useParams } from 'next/navigation';
import { TopUpForm } from '@/components/top-up-form';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { TopUpCategory } from '@/lib/products';

const PageSkeleton = () => (
    <div className="container py-8 md:py-12">
        <div className="grid lg:grid-cols-3 gap-8 md:gap-12 items-start">
            <div className="lg:col-span-2">
                <Skeleton className="h-[500px] w-full" />
            </div>
            <div className="lg:col-span-1">
                <Skeleton className="h-[200px] w-full" />
            </div>
        </div>
    </div>
);

export default function TopUpPage() {
  const params = useParams<{ id: string }>();
  const { topUpCategories } = useAppStore();
  const [category, setCategory] = React.useState<TopUpCategory | null | undefined>(undefined);

  React.useEffect(() => {
    if (topUpCategories.length > 0) {
      const foundCategory = topUpCategories.find((c) => c.slug === params.id);
      setCategory(foundCategory || null);
    }
  }, [topUpCategories, params.id]);

  // If category is explicitly null (not found after searching), show notFound page.
  if (category === null) {
    notFound();
  }

  // If category is undefined (still loading/searching), show a skeleton.
  if (category === undefined) {
    return <PageSkeleton />;
  }

  // If we reach here, category is found and valid.
  return (
    <div className="container py-8 md:py-12">
      <div className="grid lg:grid-cols-3 gap-8 md:gap-12 items-start">
        <div className="lg:col-span-2">
          <Card className="bg-secondary/50">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl font-bold font-headline">{category.pageTitle}</CardTitle>
            </CardHeader>
            <CardContent>
                <TopUpForm category={category} />
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <Alert variant="default" className="bg-secondary/50 border-secondary-foreground/10">
            <AlertCircle className="h-4 w-4 text-primary" />
            <AlertTitle className="font-bold text-lg text-primary/90">Instructions</AlertTitle>
            <AlertDescription className="text-foreground/80">
              <ul className="list-disc pl-5 space-y-2.5 mt-2">
                {category.description.map((line, index) => (
                  <li key={index}>{line}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}
