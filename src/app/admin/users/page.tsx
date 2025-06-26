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
import { useAppStore } from '@/lib/store';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users } from 'lucide-react';

export default function AdminUsersPage() {
  const { users, orders } = useAppStore();

  const usersWithStats = React.useMemo(() => {
    return users
        .filter(user => user.email) // Only show users with an email
        .map(user => {
            const userOrders = orders.filter(order => order.userId === user.uid);
            const totalSpent = userOrders.reduce((sum, order) => sum + order.amount, 0);
            return {
                ...user,
                orderCount: userOrders.length,
                totalSpent,
            };
    });
  }, [users, orders]);

  const getInitials = (email: string | null) => {
    return email ? email.charAt(0).toUpperCase() : '?';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
        <CardDescription>
            A list of registered users in your store.
        </CardDescription>
        <p className="text-sm text-muted-foreground pt-2 !mt-2">Note: This list builds as users log in. It may not show all historical users from Firebase immediately.</p>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-center">Orders</TableHead>
              <TableHead className="text-right">Total Spent</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usersWithStats.length > 0 ? (
              usersWithStats.map((user) => (
                <TableRow key={user.uid}>
                   <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {getInitials(user.email)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{user.email?.split('@')[0]}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell className="text-center">{user.orderCount}</TableCell>
                  <TableCell className="text-right">৳{user.totalSpent.toFixed(2)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-48 text-center">
                    <div className="flex flex-col items-center justify-center gap-4 text-center">
                        <Users className="h-16 w-16 text-muted-foreground" />
                        <h3 className="text-xl font-semibold">No Users Found</h3>
                        <p className="text-muted-foreground">Registered users will appear here once they log in.</p>
                    </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
