
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TransactionList } from '@/components/transaction-list';
import { useAppStore, type Transaction } from '@/lib/store';
import { parse } from 'date-fns';

export default function AdminTransactionsPage() {
  const { transactions } = useAppStore();

  const filterAndSortTransactions = (status: Transaction['status']) => {
    return transactions
      .filter((t) => t.status === status)
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
  };

  const pendingTransactions = React.useMemo(() => filterAndSortTransactions('Pending'), [transactions]);
  const completedTransactions = React.useMemo(() => filterAndSortTransactions('Completed'), [transactions]);
  const failedTransactions = React.useMemo(() => filterAndSortTransactions('Failed'), [transactions]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>
          A complete log of all wallet transactions, filterable by status.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="failed">Failed</TabsTrigger>
          </TabsList>
          <TabsContent value="pending">
            <TransactionList transactions={pendingTransactions} isAdminView={true} />
          </TabsContent>
          <TabsContent value="completed">
            <TransactionList transactions={completedTransactions} isAdminView={false} />
          </TabsContent>
          <TabsContent value="failed">
            <TransactionList transactions={failedTransactions} isAdminView={false} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
