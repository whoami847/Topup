'use client';

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
    Completed: {
      variant: "default" as const,
      className: "bg-green-500 text-primary-foreground border-transparent hover:bg-green-600",
      text: "Completed",
    },
    Pending: {
      variant: "outline" as const,
      className: "bg-yellow-500 text-white border-transparent",
      text: "Pending",
    },
    Failed: {
      variant: "destructive" as const,
      className: "border-transparent",
      text: "Failed",
    },
};

export default function AdminOrdersPage() {
  const { orders } = useAppStore();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders</CardTitle>
        <CardDescription>A list of all the orders from your store.</CardDescription>
      </CardHeader>
      <CardContent>
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
            {orders.length > 0 ? (
              orders.map((order) => {
                const config = statusConfig[order.status] ?? statusConfig.Pending;
                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
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
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
