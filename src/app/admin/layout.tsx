// src/app/admin/layout.tsx
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-muted/40">
      <AdminSidebar />
      <main className="flex-1 flex flex-col gap-4 p-4 sm:p-6 md:gap-8 animate-in fade-in-50 slide-in-from-top-4 duration-500">
        {children}
      </main>
    </div>
  );
}
