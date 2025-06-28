
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
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Payment Gateways</CardTitle>
            <CardDescription>Manage the automated payment gateways for your store.</CardDescription>
          </div>
          <Button onClick={handleNew} className="w-full sm:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Gateway
          </Button>
        </CardHeader>
        <CardContent>
          {gateways.length > 0 ? (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Gateway Name</TableHead>
                      <TableHead>Mode</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {gateways.map((gateway) => (
                      <TableRow key={gateway.id}>
                        <TableCell className="font-medium">
                          {gateway.name}
                        </TableCell>
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
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {gateways.map((gateway) => (
                  <Card key={gateway.id} className="p-4 shadow-sm">
                    <div className="flex justify-between items-start gap-4">
                      <p className="font-semibold text-base">{gateway.name}</p>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <Badge variant={gateway.isLive ? 'destructive' : 'secondary'}>
                          {gateway.isLive ? 'Live' : 'Sandbox'}
                        </Badge>
                        <Badge variant={gateway.enabled ? 'default' : 'secondary'} className={gateway.enabled ? 'bg-green-500' : ''}>
                          {gateway.enabled ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex justify-end items-center mt-3 pt-3 border-t">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            Actions <MoreHorizontal className="h-4 w-4 ml-1" />
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
                    </div>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <div className="h-24 text-center text-muted-foreground flex items-center justify-center border rounded-lg">
              <p>No payment gateways found.</p>
            </div>
          )}
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
