import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Settings } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>Manage your store settings.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center gap-4 text-center h-64">
            <Settings className="h-16 w-16 text-muted-foreground" />
            <p className="text-muted-foreground">Store settings are coming soon.</p>
        </div>
      </CardContent>
    </Card>
  );
}
