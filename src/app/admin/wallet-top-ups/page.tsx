
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Wallet, Trash2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TransactionList } from '@/components/transaction-list';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { parse } from 'date-fns';

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
        return orders
            .filter(order => order.description.toLowerCase().includes('wallet top-up'))
            .sort((a, b) => {
                try {
                    const dateA = parse(a.date, 'dd/MM/yyyy, HH:mm:ss', new Date());
                    const dateB = parse(b.date, 'dd/MM/yyyy, HH:mm:ss', new Date());
                    return dateB.getTime() - dateA.getTime();
                } catch (e) {
                    console.error("Failed to parse date for sorting:", e);
                    return 0;
                }
            });
    }, [orders]);

    return (
        <Card className="border-0 shadow-none">
            <CardContent className="p-0 pt-4">
                {walletOrders.length > 0 ? (
                    <div className="space-y-4">
                        {walletOrders.map((order) => {
                            const configKey = order.status.toUpperCase() as keyof typeof statusConfig;
                            const config = statusConfig[configKey] ?? statusConfig.PENDING;
                            return (
                                <Card key={order.id} className="p-4 shadow-sm">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                        <div className="flex-grow space-y-1">
                                            <p className="font-semibold text-base break-words">{order.description}</p>
                                            <p className="text-sm text-muted-foreground">{order.date}</p>
                                            <p className="text-xs text-muted-foreground break-all">ID: {order.id}</p>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <p className="font-bold text-lg mb-1 whitespace-nowrap">৳{order.amount.toFixed(2)}</p>
                                            <Badge variant={config.variant} className={cn(config.className)}>
                                                {config.text}
                                            </Badge>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
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
    const [isClearConfirmOpen, setIsClearConfirmOpen] = React.useState(false);
    const { orders, transactions, clearWalletHistory, undoClearWalletHistory } = useAppStore();
    const { toast } = useToast();

    const nonPendingWalletItems = React.useMemo(() => {
        const o = orders.filter(order => order.description.toLowerCase().includes('wallet top-up') && order.status !== 'PENDING');
        const t = transactions.filter(t => t.description.toLowerCase().includes('wallet top-up request') && t.status !== 'Pending');
        return [...o, ...t];
    }, [orders, transactions]);
    
    const handleUndoClear = async () => {
        try {
            await undoClearWalletHistory();
            toast({
                title: "Undo Successful",
                description: "Wallet history has been restored."
            });
        } catch (error) {
            toast({
                title: "Undo Failed",
                description: "An error occurred while restoring the history.",
                variant: "destructive",
            });
        }
    }

    const handleClearHistory = async () => {
        try {
            await clearWalletHistory();
            toast({
                title: "History Cleared",
                description: "All non-pending wallet history has been removed.",
                duration: 6000,
                action: (
                    <ToastAction altText="Undo" onClick={handleUndoClear}>
                        Undo
                    </ToastAction>
                )
            });
        } catch (error) {
            toast({
                title: "Clear Failed",
                description: "An error occurred while clearing the wallet history.",
                variant: "destructive",
            });
        } finally {
            setIsClearConfirmOpen(false);
        }
    };


  return (
    <>
        <Tabs defaultValue="manual" className="w-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                <div>
                    <h1 className="text-2xl font-bold">Wallet Top-ups</h1>
                    <p className="text-muted-foreground">Manage automated and manual wallet top-ups.</p>
                </div>
                 <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                    <TabsList className="grid grid-cols-2 w-full sm:w-auto">
                        <TabsTrigger value="manual">Manual Requests</TabsTrigger>
                        <TabsTrigger value="automated">Automated Orders</TabsTrigger>
                    </TabsList>
                    <Button 
                        variant="outline" 
                        onClick={() => setIsClearConfirmOpen(true)}
                        disabled={nonPendingWalletItems.length === 0}
                        className="w-full sm:w-auto"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Clear History
                    </Button>
                </div>
            </div>
            <TabsContent value="manual">
                <ManualRequests />
            </TabsContent>
            <TabsContent value="automated">
                <AutomatedTopUps />
            </TabsContent>
        </Tabs>

        <AlertDialog open={isClearConfirmOpen} onOpenChange={setIsClearConfirmOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to clear the wallet history?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone easily. This will permanently delete all completed, failed, and cancelled wallet top-up records (both manual and automated). Pending requests will not be affected.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClearHistory} className="bg-destructive hover:bg-destructive/90">
                        Clear History
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </>
  );
}
