
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
import type { PaymentMethod } from '@/lib/payments';
import { PaymentMethodDialog } from '@/components/admin/payment-method-dialog';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

export default function AdminPaymentMethodsPage() {
  const { paymentMethods, deletePaymentMethod } = useAppStore();
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = React.useState(false);
  const [selectedMethod, setSelectedMethod] = React.useState<PaymentMethod | null>(null);

  const handleNew = () => {
    setSelectedMethod(null);
    setIsFormOpen(true);
  };

  const handleEdit = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setIsFormOpen(true);
  };

  const handleDelete = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (selectedMethod) {
      deletePaymentMethod(selectedMethod.id);
    }
    setIsDeleteConfirmOpen(false);
    setSelectedMethod(null);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setSelectedMethod(null);
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Manage the payment methods for wallet top-ups.</CardDescription>
          </div>
          <Button onClick={handleNew} className="w-full sm:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Method
          </Button>
        </CardHeader>
        <CardContent>
          {paymentMethods.length > 0 ? (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Method Name</TableHead>
                      <TableHead>Account Number</TableHead>
                      <TableHead>Account Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentMethods.map((method) => (
                      <TableRow key={method.id}>
                        <TableCell className="font-medium whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <Image src={method.logoUrl} alt={method.name} width={40} height={40} className="rounded-md object-contain" />
                            <span>{method.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{method.accountNumber}</TableCell>
                        <TableCell>{method.accountType}</TableCell>
                        <TableCell>
                          <Badge variant={method.enabled ? 'default' : 'secondary'} className={method.enabled ? 'bg-green-500' : ''}>
                            {method.enabled ? 'Enabled' : 'Disabled'}
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
                                  <DropdownMenuItem onClick={() => handleEdit(method)}>
                                      Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleDelete(method)} className="text-destructive">
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
                  {paymentMethods.map((method) => (
                      <Card key={method.id} className="p-4 shadow-sm">
                          <div className="flex justify-between items-start gap-4">
                              <div className="flex items-center gap-3">
                                  <Image src={method.logoUrl} alt={method.name} width={40} height={40} className="rounded-md object-contain" />
                                  <div>
                                      <p className="font-semibold text-base">{method.name}</p>
                                      <p className="text-sm text-muted-foreground">{method.accountType}</p>
                                  </div>
                              </div>
                              <Badge variant={method.enabled ? 'default' : 'secondary'} className={method.enabled ? 'bg-green-500' : ''}>
                                  {method.enabled ? 'Enabled' : 'Disabled'}
                              </Badge>
                          </div>
                          <div className="flex justify-between items-center mt-3 pt-3 border-t">
                              <p className="text-sm text-muted-foreground font-mono">{method.accountNumber}</p>
                              <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                      <Button variant="outline" size="sm">
                                          Actions <MoreHorizontal className="h-4 w-4 ml-1" />
                                      </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                      <DropdownMenuItem onClick={() => handleEdit(method)}>
                                          Edit
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => handleDelete(method)} className="text-destructive">
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
              <p>No payment methods found.</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <PaymentMethodDialog
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        method={selectedMethod}
        onSuccess={closeForm}
      />

      <AlertDialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the payment method
              "{selectedMethod?.name}".
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
