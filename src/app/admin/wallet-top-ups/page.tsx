
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
import { Wallet } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TransactionList } from '@/components/transaction-list';

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

const AutomatedTopUps = () => {
    const { orders } = useAppStore();
    const walletOrders = React.useMemo(() => {
        return orders.filter(order => order.description.toLowerCase().includes('wallet top-up'));
    }, [orders]);

    return (
        <Card className="border-0 shadow-none">
            <CardContent className="p-0">
                {walletOrders.length > 0 ? (
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
                            {walletOrders.map((order) => {
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
                    <div className="flex flex-col items-center justify-center gap-4 text-center h-64 border rounded-md">
                        <Wallet className="h-16 w-16 text-muted-foreground" />
                        <h3 className="text-xl font-semibold">No Automated Top-ups Yet</h3>
                        <p className="text-muted-foreground">Orders from automated gateways will appear here.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

const ManualRequests = () => {
    const { transactions } = useAppStore();
    const manualTopUpRequests = React.useMemo(() => {
        return transactions.filter(t => t.description.toLowerCase().includes('wallet top-up request'));
    }, [transactions]);

    return <TransactionList transactions={manualTopUpRequests} isAdminView={true} />;
}

export default function AdminWalletTopUpsPage() {
  return (
    <Tabs defaultValue="manual" className="w-full">
        <div className="flex items-center justify-between mb-4">
            <div>
                <h1 className="text-2xl font-bold">Wallet Top-ups</h1>
                <p className="text-muted-foreground">Manage automated and manual wallet top-ups.</p>
            </div>
            <TabsList className="grid grid-cols-2 w-auto">
                <TabsTrigger value="manual">Manual Requests</TabsTrigger>
                <TabsTrigger value="automated">Automated Orders</TabsTrigger>
            </TabsList>
        </div>
        <TabsContent value="manual">
            <ManualRequests />
        </TabsContent>
        <TabsContent value="automated">
            <AutomatedTopUps />
        </TabsContent>
    </Tabs>
  );
}
