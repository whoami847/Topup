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

export default function AdminTransactionsPage() {
  const { transactions } = useAppStore();

  const walletTopUpRequests = React.useMemo(() => {
    return transactions.filter(t => t.description.toLowerCase().includes('wallet top-up request'));
  }, [transactions]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manual Top-up Requests</CardTitle>
        <CardDescription>
          A list of all manual wallet top-up requests from users that require approval.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TransactionList transactions={walletTopUpRequests} isAdminView={true} />
      </CardContent>
    </Card>
  );
}
