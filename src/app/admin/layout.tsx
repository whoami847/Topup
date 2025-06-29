
'use client';

import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { ReactNode, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

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

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { currentUser, isAuthLoading } = useAppStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthLoading) {
      return; // Wait until loading is complete
    }

    if (!currentUser || !currentUser.isAdmin) {
      router.push('/'); // Redirect to home if not logged in or not an admin
    }
  }, [currentUser, isAuthLoading, router]);

  // While loading or if user is not an admin, show a skeleton to prevent content flash
  if (isAuthLoading || !currentUser || !currentUser.isAdmin) {
    return <AdminLayoutSkeleton />;
  }

  // Render the admin layout only if the user is a verified admin
  return (
    <div className="flex min-h-screen bg-muted/40">
      <AdminSidebar />
      <main className="flex-1 flex flex-col gap-4 p-4 sm:p-6 md:gap-8 animate-in fade-in-50 slide-in-from-top-4 duration-500">
        {children}
      </main>
    </div>
  );
}
