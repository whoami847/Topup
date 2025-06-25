'use client';

import * as React from 'react';
import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutGrid, ListOrdered, User, LogOut, ShoppingBag, Wallet } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { subDays, isAfter, parse } from 'date-fns';

const DashboardStatCard = ({ title, value, icon: Icon, formatAsCurrency = false }) => (
  <Card className="bg-secondary/50">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-5 w-5 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold">
        {formatAsCurrency ? `৳${value.toFixed(2)}` : value}
      </div>
    </CardContent>
  </Card>
);

const AccountSidebar = () => {
    const pathname = usePathname();
    const navLinks = [
        { href: '/account', label: 'Dashboard', icon: LayoutGrid },
        { href: '/orders', label: 'Orders', icon: ListOrdered },
        // These are placeholders for now
        { href: '#', label: 'Account details', icon: User },
        { href: '#', label: 'Logout', icon: LogOut },
    ];

    return (
        <aside>
            <Card className="bg-secondary/50 p-2 sm:p-4">
                <nav className="flex flex-col gap-1">
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
            </Card>
        </aside>
    );
}

export default function AccountPage() {
  const { orders } = useAppStore();
  const [stats, setStats] = React.useState({
    totalOrders: 0,
    totalSpent: 0,
    spentLast7Days: 0,
  });
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  React.useEffect(() => {
    if (orders && isClient) {
      const totalOrders = orders.length;
      const totalSpent = orders.reduce((sum, order) => sum + order.amount, 0);

      const sevenDaysAgo = subDays(new Date(), 7);
      const recentOrders = orders.filter(order => {
        try {
          const orderDate = parse(order.date, 'dd/MM/yyyy, HH:mm:ss', new Date());
          return isAfter(orderDate, sevenDaysAgo);
        } catch (e) {
          console.error("Error parsing date:", order.date);
          return false;
        }
      });
      const spentLast7Days = recentOrders.reduce((sum, order) => sum + order.amount, 0);

      setStats({ totalOrders, totalSpent, spentLast7Days });
    }
  }, [orders, isClient]);

  if (!isClient) {
      return (
          <div className="container py-8 md:py-12">
              <div className="grid gap-8 md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr]">
                  <div className="h-48 w-full animate-pulse rounded-lg bg-secondary/50"></div>
                  <div>
                      <div className="h-10 w-48 animate-pulse rounded-lg bg-secondary/50 mb-8"></div>
                      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                          <div className="h-28 w-full animate-pulse rounded-lg bg-secondary/50"></div>
                          <div className="h-28 w-full animate-pulse rounded-lg bg-secondary/50"></div>
                          <div className="h-28 w-full animate-pulse rounded-lg bg-secondary/50"></div>
                      </div>
                  </div>
              </div>
          </div>
      );
  }

  return (
    <div className="container py-8 md:py-12">
        <div className="grid gap-8 md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr]">
            <AccountSidebar />
            <main>
                <h1 className="text-3xl md:text-4xl font-bold mb-8 font-headline">Dashboard</h1>
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    <DashboardStatCard 
                        title="Total Orders" 
                        value={stats.totalOrders} 
                        icon={ShoppingBag} 
                    />
                    <DashboardStatCard 
                        title="Total Spent" 
                        value={stats.totalSpent} 
                        icon={Wallet} 
                        formatAsCurrency 
                    />
                    <DashboardStatCard 
                        title="Spent (Last 7 Days)" 
                        value={stats.spentLast7Days} 
                        icon={Wallet} 
                        formatAsCurrency 
                    />
                </div>
            </main>
        </div>
    </div>
  );
}
