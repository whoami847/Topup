
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
  Landmark,
  CreditCard,
  Wallet
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppStore } from '@/lib/store';
import React from 'react';

const navLinks = [
  { href: '/admin', label: 'Dashboard', icon: Home },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/orders', label: 'Orders', icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: Grid },
  { href: '/admin/products', label: 'Products', icon: Archive },
  { href: '/admin/product-prices', label: 'Product Prices', icon: DollarSign },
  { href: '/admin/payment-methods', label: 'Payment Methods', icon: Landmark },
  { href: '/admin/wallet-top-ups', label: 'Wallet Top-ups', icon: Wallet },
  { href: '/admin/gateways', label: 'Gateways', icon: CreditCard },
  { href: '/admin/transactions', label: 'Transactions', icon: ArrowRightLeft },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { orders, transactions } = useAppStore();

  const getNotificationCount = (label: string) => {
    if (label === 'Orders') {
        return orders
            .filter(order => !order.description.toLowerCase().includes('wallet top-up'))
            .filter(o => o.status === 'PENDING').length;
    }
    if (label === 'Wallet Top-ups') {
        return transactions.filter(t => 
            t.description.toLowerCase().includes('wallet top-up request') && t.status === 'Pending'
        ).length;
    }
    return 0;
  }

  return (
    <aside className="hidden w-64 flex-col border-r bg-background p-4 md:flex">
      <div className="mb-8 flex items-center gap-2 text-lg font-semibold">
        <Flame className="h-7 w-7 text-primary" />
        <span className="font-headline">Admin Panel</span>
      </div>
      <nav className="flex flex-1 flex-col gap-2 overflow-y-auto">
        {navLinks.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          const notificationCount = getNotificationCount(label);

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
              <span className="flex-grow">{label}</span>
              {notificationCount > 0 && (
                 <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-xs font-semibold">
                    {notificationCount}
                 </span>
              )}
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
