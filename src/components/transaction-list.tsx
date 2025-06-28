
'use client';

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useAppStore, type Transaction } from "@/lib/store";
import { cn } from "@/lib/utils";
import { MoreHorizontal, Receipt } from "lucide-react";
import { Button } from "./ui/button";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from "./ui/dropdown-menu";

const statusConfig = {
    Completed: {
      variant: "default" as const,
      className: "bg-green-500 text-primary-foreground border-transparent hover:bg-green-600",
      text: "Completed",
    },
    Pending: {
      variant: "outline" as const,
      className: "bg-yellow-500 text-white border-transparent hover:bg-yellow-600",
      text: "Pending",
    },
    Failed: {
      variant: "destructive" as const,
      className: "border-transparent",
      text: "Failed",
    },
};

export function TransactionList({ transactions, isAdminView = false }: { transactions: Transaction[], isAdminView?: boolean }) {
  const { updateTransactionStatus } = useAppStore();

  if (transactions.length === 0) {
    return (
        <div className="text-center text-muted-foreground py-16 border rounded-lg mt-4">
            <Receipt className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-semibold">No Transactions Found</p>
            <p className="text-sm">Relevant transactions will appear here.</p>
        </div>
    )
  }

  return (
    <div className="space-y-4 mt-4">
      {transactions.map((transaction) => {
        const config = statusConfig[transaction.status] ?? statusConfig.Pending;
        return (
          <Card key={transaction.id} className="p-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-grow space-y-1">
                    <p className="font-semibold text-base break-words">{transaction.description}</p>
                    <p className="text-sm text-muted-foreground">{transaction.date}</p>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4 flex-shrink-0">
                    <div className="text-right">
                        <p className={cn(
                            "font-bold text-lg",
                            transaction.amount >= 0 ? "text-green-500" : "text-destructive"
                        )}>
                          {transaction.amount >= 0 ? '+' : ''}৳{transaction.amount.toFixed(2)}
                        </p>
                        <Badge variant={config.variant} className={cn('mt-1', config.className)}>
                            {config.text}
                        </Badge>
                    </div>
                    {isAdminView && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" disabled={transaction.status !== 'Pending'}>
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Actions</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => updateTransactionStatus(transaction.id, 'Completed')}>
                                    Mark as Completed
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateTransactionStatus(transaction.id, 'Failed')} className="text-destructive">
                                    Mark as Failed
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
