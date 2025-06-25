'use client';

import * as React from 'react';
import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { DollarSign, Package, Users } from 'lucide-react';
import { subDays, format, parse, isAfter } from 'date-fns';

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


export default function AdminDashboardPage() {
    const { orders } = useAppStore();
    const [isClient, setIsClient] = React.useState(false);
    
    React.useEffect(() => {
        setIsClient(true);
    }, []);

    const { totalRevenue, totalOrders, weeklySalesData } = React.useMemo(() => {
        if (!isClient) return { totalRevenue: 0, totalOrders: 0, weeklySalesData: [] };

        const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);
        const totalOrders = orders.length;

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

        return { totalRevenue, totalOrders, weeklySalesData };
    }, [orders, isClient]);

    if (!isClient) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                     <div key={i} className="h-28 w-full animate-pulse rounded-lg bg-secondary/50"></div>
                ))}
                <div className="col-span-full h-80 w-full animate-pulse rounded-lg bg-secondary/50"></div>
            </div>
        );
    }
    
  return (
    <>
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
            title="New Customers" 
            value={0} // Placeholder
            icon={Users}
            description="New customers this month"
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
