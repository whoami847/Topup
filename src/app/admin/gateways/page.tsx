
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
import { Button } from '@/components/ui/button';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import type { Gateway } from '@/lib/gateways';
import { GatewayDialog } from '@/components/admin/gateway-dialog';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

export default function AdminGatewaysPage() {
  const { gateways, deleteGateway } = useAppStore();
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = React.useState(false);
  const [selectedGateway, setSelectedGateway] = React.useState<Gateway | null>(null);

  const handleNew = () => {
    setSelectedGateway(null);
    setIsFormOpen(true);
  };

  const handleEdit = (gateway: Gateway) => {
    setSelectedGateway(gateway);
    setIsFormOpen(true);
  };

  const handleDelete = (gateway: Gateway) => {
    setSelectedGateway(gateway);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (selectedGateway) {
      deleteGateway(selectedGateway.id);
    }
    setIsDeleteConfirmOpen(false);
    setSelectedGateway(null);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setSelectedGateway(null);
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Payment Gateways</CardTitle>
            <CardDescription>Manage the automated payment gateways for your store.</CardDescription>
          </div>
          <Button onClick={handleNew}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Gateway
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Gateway Name</TableHead>
                <TableHead>Store ID</TableHead>
                <TableHead>Mode</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gateways.length > 0 ? (
                gateways.map((gateway) => (
                  <TableRow key={gateway.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <Image src={gateway.logoUrl} alt={gateway.name} width={40} height={40} className="rounded-md object-contain" />
                        <span>{gateway.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{gateway.storeId}</TableCell>
                    <TableCell>
                      <Badge variant={gateway.isLive ? 'destructive' : 'secondary'}>
                        {gateway.isLive ? 'Live' : 'Sandbox'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={gateway.enabled ? 'default' : 'secondary'} className={gateway.enabled ? 'bg-green-500' : ''}>
                        {gateway.enabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                       <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                              </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(gateway)}>
                                  Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDelete(gateway)} className="text-destructive">
                                  Delete
                              </DropdownMenuItem>
                          </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No payment gateways found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <GatewayDialog
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        gateway={selectedGateway}
        onSuccess={closeForm}
      />

      <AlertDialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the payment gateway
              "{selectedGateway?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
