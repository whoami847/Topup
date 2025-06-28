
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { TransactionList } from '@/components/transaction-list';
import { useAppStore } from '@/lib/store';
import { parse } from 'date-fns';

export default function AdminTransactionsPage() {
  const { transactions } = useAppStore();

  const sortedTransactions = React.useMemo(() => {
    return [...transactions].sort((a, b) => {
        try {
            const dateA = parse(a.date, 'dd/MM/yyyy, HH:mm:ss', new Date());
            const dateB = parse(b.date, 'dd/MM/yyyy, HH:mm:ss', new Date());
            return dateB.getTime() - dateA.getTime();
        } catch (e) {
            console.error("Failed to parse date for sorting:", e);
            return 0; 
        }
    });
  }, [transactions]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>
          A complete log of all wallet transactions, including top-ups and purchases.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TransactionList transactions={sortedTransactions} isAdminView={false} />
      </CardContent>
    </Card>
  );
}
