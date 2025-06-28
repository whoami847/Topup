
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
import { Users, Wallet, ShoppingBag } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const UserRowSkeleton = () => (
    <TableRow>
        <TableCell>
            <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-full" />
                <Skeleton className="h-4 w-24" />
            </div>
        </TableCell>
        <TableCell><Skeleton className="h-4 w-40" /></TableCell>
        <TableCell className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
        <TableCell className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
    </TableRow>
);

const UserCardSkeleton = () => (
    <Card className="p-4 shadow-sm">
        <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-grow space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
            </div>
        </div>
        <div className="mt-4 flex justify-around border-t pt-4">
             <div className="text-center space-y-2 w-1/2">
                <Skeleton className="h-4 w-12 mx-auto" />
                <Skeleton className="h-5 w-20 mx-auto" />
            </div>
            <div className="text-center space-y-2 w-1/2">
                <Skeleton className="h-4 w-12 mx-auto" />
                <Skeleton className="h-5 w-20 mx-auto" />
            </div>
        </div>
    </Card>
);

export default function AdminUsersPage() {
  const { users, orders } = useAppStore();
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const usersWithStats = React.useMemo(() => {
    if (!isClient) return [];
    return users
        .filter(user => user.email) // Only show users with an email
        .map(user => {
            const userOrders = orders.filter(order => order.userId === user.uid);
            const totalSpent = userOrders.reduce((sum, order) => sum + order.amount, 0);
            return {
                ...user,
                totalSpent,
            };
    });
  }, [users, orders, isClient]);

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
        {!isClient ? (
            <>
                {/* Desktop Skeletons */}
                <Table className="hidden md:table">
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead className="text-right">Wallet Balance</TableHead>
                            <TableHead className="text-right">Total Spent</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <UserRowSkeleton />
                        <UserRowSkeleton />
                        <UserRowSkeleton />
                    </TableBody>
                </Table>
                {/* Mobile Skeletons */}
                <div className="md:hidden space-y-4">
                    <UserCardSkeleton />
                    <UserCardSkeleton />
                    <UserCardSkeleton />
                </div>
            </>
        ) : usersWithStats.length > 0 ? (
            <>
                {/* Desktop Table View */}
                <div className="hidden md:block">
                    <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead className="text-right">Wallet Balance</TableHead>
                            <TableHead className="text-right">Total Spent</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {usersWithStats.map((user) => (
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
                                <TableCell className="text-right">৳{user.balance.toFixed(2)}</TableCell>
                                <TableCell className="text-right">৳{user.totalSpent.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                {/* Mobile Card View */}
                <div className="md:hidden space-y-4">
                    {usersWithStats.map((user) => (
                        <Card key={user.uid} className="p-4 shadow-sm">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-12 w-12 text-xl">
                                    <AvatarFallback className="bg-primary text-primary-foreground">
                                    {getInitials(user.email)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                    <p className="font-semibold text-base truncate">{user.email?.split('@')[0]}</p>
                                    <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                                </div>
                            </div>
                            <div className="mt-4 flex justify-around border-t pt-4">
                                <div className="text-center">
                                    <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5 mb-1"><Wallet className="h-3 w-3" /> Balance</p>
                                    <p className="font-semibold text-green-500">৳{user.balance.toFixed(2)}</p>
                                </div>
                                 <div className="text-center">
                                    <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5 mb-1"><ShoppingBag className="h-3 w-3" /> Spent</p>
                                    <p className="font-semibold">৳{user.totalSpent.toFixed(2)}</p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </>
        ) : (
            <div className="h-48 text-center flex flex-col items-center justify-center gap-4 border rounded-lg">
                <Users className="h-16 w-16 text-muted-foreground" />
                <h3 className="text-xl font-semibold">No Users Found</h3>
                <p className="text-muted-foreground">Registered users will appear here once they log in.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
