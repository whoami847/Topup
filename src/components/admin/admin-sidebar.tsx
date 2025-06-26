
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Package, 
  Settings, 
  Flame, 
  Users, 
  Grid, 
  Archive, 
  DollarSign, 
  ArrowRightLeft,
  Landmark
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const navLinks = [
  { href: '/admin', label: 'Dashboard', icon: Home },
  { href: '/admin/orders', label: 'Orders', icon: Package },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/categories', label: 'Categories', icon: Grid },
  { href: '/admin/products', label: 'Products', icon: Archive },
  { href: '/admin/product-prices', label: 'Product Prices', icon: DollarSign },
  { href: '/admin/transactions', label: 'Transactions', icon: ArrowRightLeft },
  { href: '/admin/gateways', label: 'Gateways', icon: Landmark },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 flex-col border-r bg-background p-4 md:flex">
      <div className="mb-8 flex items-center gap-2 text-lg font-semibold">
        <Flame className="h-7 w-7 text-primary" />
        <span className="font-headline">Admin Panel</span>
      </div>
      <nav className="flex flex-1 flex-col gap-2 overflow-y-auto">
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
       <div className="mt-auto pt-4">
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
