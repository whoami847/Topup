
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Package } from 'lucide-react';

const statusConfig = {
    COMPLETED: {
      variant: "default" as const,
      className: "bg-green-500 text-primary-foreground border-transparent hover:bg-green-600",
      text: "Completed",
    },
    PENDING: {
      variant: "outline" as const,
      className: "bg-yellow-500 text-white border-transparent hover:bg-yellow-600",
      text: "Pending",
    },
    FAILED: {
      variant: "destructive" as const,
      className: "border-transparent",
      text: "Failed",
    },
    CANCELLED: {
        variant: "secondary" as const,
        className: "bg-gray-500 text-secondary-foreground border-transparent",
        text: "Cancelled",
    },
};

export default function AdminOrdersPage() {
  const { orders } = useAppStore();

  const productOrders = React.useMemo(() => {
    return orders.filter(order => !order.description.toLowerCase().includes('wallet top-up'));
  }, [orders]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Orders</CardTitle>
        <CardDescription>A list of all the product orders from your store.</CardDescription>
      </CardHeader>
      <CardContent>
        {productOrders.length > 0 ? (
            <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {productOrders.map((order) => {
                        const configKey = order.status.toUpperCase() as keyof typeof statusConfig;
                        const config = statusConfig[configKey] ?? statusConfig.PENDING;
                        return (
                        <TableRow key={order.id}>
                            <TableCell className="font-medium truncate max-w-xs">{order.id}</TableCell>
                            <TableCell>{order.date}</TableCell>
                            <TableCell>{order.description}</TableCell>
                            <TableCell>
                            <Badge variant={config.variant} className={cn(config.className)}>
                                {config.text}
                            </Badge>
                            </TableCell>
                            <TableCell className="text-right">৳{order.amount.toFixed(2)}</TableCell>
                        </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        ) : (
            <div className="flex flex-col items-center justify-center gap-4 text-center h-64">
                <Package className="h-16 w-16 text-muted-foreground" />
                <h3 className="text-xl font-semibold">No Product Orders Yet</h3>
                <p className="text-muted-foreground">New product orders from your customers will appear here.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
