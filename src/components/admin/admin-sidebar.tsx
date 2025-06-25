'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Package, Settings, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

const navLinks = [
  { href: '/admin', label: 'Dashboard', icon: Home },
  { href: '/admin/orders', label: 'Orders', icon: Package },
  { href: '#', label: 'Products', icon: Settings }, // Placeholder
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 flex-col border-r bg-background p-4 md:flex">
      <div className="mb-8 flex items-center gap-2 text-lg font-semibold">
        <Flame className="h-7 w-7 text-primary" />
        <span className="font-headline">Admin Panel</span>
      </div>
      <nav className="flex flex-col gap-2">
        {navLinks.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={label}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                isActive && 'bg-primary/10 text-primary font-bold'
              )}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}
      </nav>
       <div className="mt-auto">
         <Card>
            <CardHeader>
                <CardTitle className="text-base">Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">
                    Contact support if you have any issues with the panel.
                </p>
            </CardContent>
         </Card>
       </div>
    </aside>
  );
}
