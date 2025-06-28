
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { MoreHorizontal, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  const { orders, updateOrderStatus } = useAppStore();
  const { toast } = useToast();

  const productOrders = React.useMemo(() => {
    return orders.filter(order => !order.description.toLowerCase().includes('wallet top-up'));
  }, [orders]);

  const handleUpdateStatus = async (orderId: string, status: 'COMPLETED' | 'FAILED') => {
    try {
        await updateOrderStatus(orderId, status);
        toast({
            title: "Order Updated",
            description: `The order has been marked as ${status.toLowerCase()}.`
        });
    } catch (error) {
        toast({
            title: "Update Failed",
            description: "An error occurred while updating the order.",
            variant: "destructive",
        });
    }
  };

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
                    <TableHead className="text-right">Actions</TableHead>
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
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" disabled={order.status !== 'PENDING'}>
                                            <MoreHorizontal className="h-4 w-4" />
                                            <span className="sr-only">Actions</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, 'COMPLETED')}>
                                            Mark as Completed
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, 'FAILED')} className="text-destructive">
                                            Mark as Failed
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
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
