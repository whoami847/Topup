'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { TransactionList } from '@/components/transaction-list';

export default function AdminTransactionsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transactions</CardTitle>
        <CardDescription>A list of all transactions from your store.</CardDescription>
      </CardHeader>
      <CardContent>
        <TransactionList />
      </CardContent>
    </Card>
  );
}
