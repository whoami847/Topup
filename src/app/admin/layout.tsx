
'use client';

import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { ReactNode, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Lock } from 'lucide-react';

function AdminLayoutSkeleton() {
    return (
        <div className="flex min-h-screen bg-muted/40">
            <Skeleton className="hidden md:block w-64 p-4" />
            <main className="flex-1 flex flex-col gap-4 p-4 sm:p-6 md:gap-8">
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-64 w-full" />
            </main>
        </div>
    );
}

function AccessDenied() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-muted/40">
            <Card className="w-full max-w-md mx-4">
                <CardContent className="flex flex-col items-center justify-center gap-4 py-20 text-center">
                    <Lock className="h-16 w-16 text-destructive mb-4" />
                    <h1 className="text-3xl font-bold">Access Denied</h1>
                    <p className="text-muted-foreground">
                        You do not have permission to view this page.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { currentUser, isAuthLoading } = useAppStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthLoading && !currentUser) {
      router.push('/');
    }
  }, [currentUser, isAuthLoading, router]);

  if (isAuthLoading) {
    return <AdminLayoutSkeleton />;
  }
  
  if (!currentUser?.isAdmin) {
      return <AccessDenied />;
  }

  return (
    <div className="flex min-h-screen bg-muted/40">
      <AdminSidebar />
      <main className="flex-1 flex flex-col gap-4 p-4 sm:p-6 md:gap-8 animate-in fade-in-50 slide-in-from-top-4 duration-500">
        {children}
      </main>
    </div>
  );
}
