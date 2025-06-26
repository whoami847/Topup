'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { MoreHorizontal } from "lucide-react";
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

export function TransactionList({ isAdminView = false }: { isAdminView?: boolean }) {
  const { transactions, updateTransactionStatus } = useAppStore();

  if (transactions.length === 0) {
    return (
        <div className="text-center text-muted-foreground py-16">
            <p className="text-lg">You have no transactions yet.</p>
        </div>
    )
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-center">Status</TableHead>
            {isAdminView && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => {
            const config = statusConfig[transaction.status] ?? statusConfig.Pending;
            return (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium whitespace-nowrap">{transaction.date}</TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell className={cn(
                    "text-right font-semibold",
                    transaction.amount >= 0 ? "text-green-500" : "text-destructive"
                )}>
                  {transaction.amount >= 0 ? '+' : ''}৳{transaction.amount.toFixed(2)}
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant={config.variant} className={cn(config.className)}>
                    {config.text}
                  </Badge>
                </TableCell>
                {isAdminView && (
                    <TableCell className="text-right">
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
                                <DropdownMenuItem onClick={() => updateTransactionStatus(transaction.id, 'Failed')}>
                                    Mark as Failed
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                )}
              </TableRow>
            );
            })}
        </TableBody>
      </Table>
    </Card>
  );
}
