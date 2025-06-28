
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
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
import { useAppStore, type User } from '@/lib/store';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, Wallet, ShoppingBag, MoreHorizontal, KeyRound, Ban } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { UserWalletDialog } from '@/components/admin/user-wallet-dialog';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const UserRowSkeleton = () => (
    <TableRow>
        <TableCell>
            <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-full" />
                <Skeleton className="h-4 w-24" />
            </div>
        </TableCell>
        <TableCell><Skeleton className="h-4 w-40" /></TableCell>
        <TableCell><Skeleton className="h-4 w-12" /></TableCell>
        <TableCell className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
        <TableCell className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
        <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
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
  const { users, orders, toggleUserBanStatus } = useAppStore();
  const [isClient, setIsClient] = React.useState(false);
  const { toast } = useToast();

  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [isWalletDialogOpen, setIsWalletDialogOpen] = React.useState(false);
  const [isBanConfirmOpen, setIsBanConfirmOpen] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const usersWithStats = React.useMemo(() => {
    if (!isClient) return [];
    return users
        .filter(user => user.email)
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

  const handleOpenWalletDialog = (user: User) => {
    setSelectedUser(user);
    setIsWalletDialogOpen(true);
  };
  
  const handleOpenBanDialog = (user: User) => {
      setSelectedUser(user);
      setIsBanConfirmOpen(true);
  };

  const handleToggleBan = async () => {
    if (!selectedUser) return;
    try {
        const newBanStatus = !selectedUser.isBanned;
        await toggleUserBanStatus(selectedUser.uid, newBanStatus);
        toast({
            title: "Success",
            description: `User has been ${newBanStatus ? 'banned' : 'unbanned'}.`
        });
    } catch (error) {
        toast({
            title: "Error",
            description: "Failed to update user's ban status.",
            variant: "destructive"
        });
    } finally {
        setIsBanConfirmOpen(false);
        setSelectedUser(null);
    }
  };

  const renderActionsMenu = (user: User) => (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Actions for {user.email}</span>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleOpenWalletDialog(user)}>
                <Wallet className="mr-2 h-4 w-4" />
                <span>Wallet Management</span>
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
                <KeyRound className="mr-2 h-4 w-4" />
                <span>Change Password</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
                onClick={() => handleOpenBanDialog(user)} 
                className={cn(user.isBanned ? "text-green-500 focus:text-green-600" : "text-destructive focus:text-destructive")}
            >
                <Ban className="mr-2 h-4 w-4" />
                <span>{user.isBanned ? 'Unban User' : 'Ban User'}</span>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <>
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
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Wallet Balance</TableHead>
                            <TableHead className="text-right">Total Spent</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
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
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Wallet Balance</TableHead>
                            <TableHead className="text-right">Total Spent</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {usersWithStats.map((user) => (
                                <TableRow key={user.uid} className={cn(user.isBanned && 'bg-destructive/10')}>
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
                                <TableCell>
                                    {user.isBanned && <Badge variant="destructive">Banned</Badge>}
                                </TableCell>
                                <TableCell className="text-right">৳{user.balance.toFixed(2)}</TableCell>
                                <TableCell className="text-right">৳{user.totalSpent.toFixed(2)}</TableCell>
                                <TableCell className="text-right">
                                    {renderActionsMenu(user)}
                                </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                {/* Mobile Card View */}
                <div className="md:hidden space-y-4">
                    {usersWithStats.map((user) => (
                        <Card key={user.uid} className={cn("p-4 shadow-sm", user.isBanned && 'bg-destructive/10 border-destructive')}>
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-center gap-4 min-w-0">
                                <Avatar className="h-12 w-12 text-xl">
                                    <AvatarFallback className="bg-primary text-primary-foreground">
                                    {getInitials(user.email)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                    <p className="font-semibold text-base truncate">{user.email?.split('@')[0]}</p>
                                    <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                                    {user.isBanned && <Badge variant="destructive" className="mt-1">Banned</Badge>}
                                </div>
                              </div>
                              {renderActionsMenu(user)}
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
      
      <UserWalletDialog 
        isOpen={isWalletDialogOpen}
        onOpenChange={setIsWalletDialogOpen}
        user={selectedUser}
        onSuccess={() => {
            setIsWalletDialogOpen(false);
            setSelectedUser(null);
        }}
      />
      
      <AlertDialog open={isBanConfirmOpen} onOpenChange={setIsBanConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to {selectedUser?.isBanned ? 'unban' : 'ban'} the user <span className="font-bold">{selectedUser?.email}</span>.
              {selectedUser?.isBanned ? " They will be able to log in and use the service again." : " They will no longer be able to log in."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleToggleBan} 
              className={!selectedUser?.isBanned ? 'bg-destructive hover:bg-destructive/90' : 'bg-green-600 hover:bg-green-700'}
            >
              {selectedUser?.isBanned ? 'Confirm Unban' : 'Confirm Ban'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
