
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAppStore } from '@/lib/store';
import { UserCheck } from 'lucide-react';

export function LoginRequired({ message }: { message: string }) {
  const { setAuthDialogOpen } = useAppStore();

  return (
    <Card className="mt-4 shadow-lg bg-secondary/50">
      <CardContent className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <UserCheck className="h-16 w-16 text-primary mb-4" />
        <h3 className="text-2xl font-bold">{message}</h3>
        <p className="text-muted-foreground max-w-sm">
          Please log in or create an account to view this page and manage your profile.
        </p>
        <Button size="lg" className="mt-4" onClick={() => setAuthDialogOpen(true)}>
          Login / Register
        </Button>
      </CardContent>
    </Card>
  );
}
