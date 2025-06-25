import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Users } from 'lucide-react';

export default function AdminUsersPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
        <CardDescription>Manage your store's users.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center gap-4 text-center h-64">
            <Users className="h-16 w-16 text-muted-foreground" />
            <p className="text-muted-foreground">User management is coming soon.</p>
        </div>
      </CardContent>
    </Card>
  );
}
