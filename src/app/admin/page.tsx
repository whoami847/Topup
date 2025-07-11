
'use client';

import * as React from 'react';
import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { 
    DollarSign, 
    Package, 
    Users, 
    Home, 
    Grid, 
    Archive, 
    ArrowRightLeft, 
    Settings,
    Landmark,
    CreditCard,
    Wallet
} from 'lucide-react';
import { subDays, format, parse, isAfter } from 'date-fns';
import Link from 'next/link';

const DashboardStatCard = ({ title, value, icon: Icon, description, formatAsCurrency = false }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">
        {formatAsCurrency ? `৳${value.toFixed(2)}` : value}
      </div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

const QuickNavCard = ({ href, icon: Icon, label, notificationCount = 0 }) => (
    <Link href={href} className="block h-full relative group">
      <Card className="p-4 h-full flex flex-col items-center justify-center gap-2 text-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/5 group-hover:border-primary transition-colors duration-200">
        {notificationCount > 0 && (
            <div className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs font-bold text-destructive-foreground">
                {notificationCount}
            </div>
        )}
        <Icon className="h-8 w-8" />
        <span className="text-sm font-semibold">{label}</span>
      </Card>
    </Link>
);


export default function AdminDashboardPage() {
    const { orders, users, transactions } = useAppStore();
    const [isClient, setIsClient] = React.useState(false);
    
    React.useEffect(() => {
        setIsClient(true);
    }, []);

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

    const { 
        totalRevenue, 
        totalOrders, 
        weeklySalesData, 
        totalUsers,
        pendingProductOrdersCount,
        pendingWalletRequestsCount,
    } = React.useMemo(() => {
        if (!isClient) return { 
            totalRevenue: 0, 
            totalOrders: 0, 
            weeklySalesData: [], 
            totalUsers: 0,
            pendingProductOrdersCount: 0,
            pendingWalletRequestsCount: 0,
        };

        const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);
        const totalOrders = orders.length;
        const totalUsers = users.length;

        const productOrders = orders.filter(order => !order.description.toLowerCase().includes('wallet top-up'));
        const pendingProductOrdersCount = productOrders.filter(o => o.status === 'PENDING').length;

        const pendingWalletRequestsCount = transactions.filter(t => 
            t.description.toLowerCase().includes('wallet top-up request') && t.status === 'Pending'
        ).length;

        const weeklySalesData = Array.from({ length: 7 }, (_, i) => {
            const date = subDays(new Date(), i);
            return {
                name: format(date, 'MMM d'),
                total: 0,
            };
        }).reverse();

        const sevenDaysAgo = subDays(new Date(), 7);

        orders.forEach(order => {
            try {
                const orderDate = parse(order.date, 'dd/MM/yyyy, HH:mm:ss', new Date());
                if (isAfter(orderDate, sevenDaysAgo)) {
                    const day = format(orderDate, 'MMM d');
                    const dayData = weeklySalesData.find(d => d.name === day);
                    if (dayData) {
                        dayData.total += order.amount;
                    }
                }
            } catch (e) {
                console.error("Could not parse date for order:", order);
            }
        });

        return { totalRevenue, totalOrders, weeklySalesData, totalUsers, pendingProductOrdersCount, pendingWalletRequestsCount };
    }, [orders, users, transactions, isClient]);

    const getNotificationCount = (label: string) => {
        if (label === 'Orders') return pendingProductOrdersCount;
        if (label === 'Wallet Top-ups') return pendingWalletRequestsCount;
        return 0;
    }

    if (!isClient) {
        return (
            <>
                <div className="mb-8">
                    <div className="h-8 w-48 animate-pulse rounded-lg bg-secondary/50 mb-4"></div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-11 gap-4">
                        {[...Array(11)].map((_, i) => (
                            <div key={i} className="h-24 w-full animate-pulse rounded-lg bg-secondary/50"></div>
                        ))}
                    </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {[...Array(4)].map((_, i) => (
                         <div key={i} className="h-28 w-full animate-pulse rounded-lg bg-secondary/50"></div>
                    ))}
                </div>
                <div className="mt-8 col-span-full h-80 w-full animate-pulse rounded-lg bg-secondary/50"></div>
            </>
        );
    }
    
  return (
    <>
      <div className="mb-8">
          <h1 className="text-2xl font-semibold mb-4">Admin Controls</h1>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-11 gap-4">
              {navLinks.map(link => (
                  <QuickNavCard 
                    key={link.href} 
                    {...link} 
                    notificationCount={getNotificationCount(link.label)}
                  />
              ))}
          </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardStatCard 
            title="Total Revenue" 
            value={totalRevenue} 
            icon={DollarSign}
            description="Total revenue from all orders"
            formatAsCurrency
        />
        <DashboardStatCard 
            title="Total Orders" 
            value={totalOrders} 
            icon={Package}
            description="Total number of completed orders"
        />
        <DashboardStatCard 
            title="Avg. Order Value" 
            value={totalOrders > 0 ? totalRevenue / totalOrders : 0} 
            icon={DollarSign}
            description="Average value of each order"
            formatAsCurrency
        />
        <DashboardStatCard 
            title="Total Users" 
            value={totalUsers} 
            icon={Users}
            description="Total registered users"
        />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Sales Overview</CardTitle>
          <CardContent className="pl-2 pt-6">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={weeklySalesData}>
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `৳${value}`}
                />
                <Tooltip
                    cursor={{fill: 'hsl(var(--muted))'}}
                    contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: 'var(--radius)',
                    }}
                />
                <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </CardHeader>
      </Card>
    </>
  );
}
