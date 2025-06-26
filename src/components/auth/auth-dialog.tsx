
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAppStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

// Schemas
const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

const registerSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match.",
  path: ['confirmPassword'],
});

// Login Form Component
function LoginForm({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const { loginUser } = useAppStore();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    const result = await loginUser(data);
    if (result.success) {
      toast({ title: 'Success', description: result.message });
      onLoginSuccess();
    } else {
      toast({ title: 'Error', description: result.message, variant: 'destructive' });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl><Input placeholder="you@example.com" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Logging in..." : "Login"}
        </Button>
      </form>
    </Form>
  );
}

// Register Form Component
function RegisterForm({ onRegisterSuccess }: { onRegisterSuccess: () => void }) {
    const { registerUser } = useAppStore();
    const { toast } = useToast();
    const form = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: { email: '', password: '', confirmPassword: '' },
    });

    const onSubmit = async (data: z.infer<typeof registerSchema>) => {
        const result = await registerUser({ email: data.email, password: data.password });
        if (result.success) {
            toast({ title: 'Success', description: result.message });
            onRegisterSuccess();
        } else {
            toast({ title: 'Error', description: result.message, variant: 'destructive' });
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl><Input placeholder="you@example.com" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="password" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                 <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? "Creating Account..." : "Create Account"}
                </Button>
            </form>
        </Form>
    );
}

// Main Auth Dialog
export function AuthDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
    const [activeTab, setActiveTab] = useState('login');

    const handleSuccess = () => {
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md p-0">
                <DialogTitle className="sr-only">
                  {activeTab === 'login' ? 'Login' : 'Sign Up'}
                </DialogTitle>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 rounded-t-lg rounded-b-none">
                        <TabsTrigger value="login">Login</TabsTrigger>
                        <TabsTrigger value="register">Sign Up</TabsTrigger>
                    </TabsList>
                    <div className="p-6">
                        <TabsContent value="login">
                            <Card className="border-none shadow-none">
                                <CardHeader className="p-0 pb-4">
                                    <CardTitle>Welcome Back</CardTitle>
                                    <CardDescription>Enter your credentials to access your account.</CardDescription>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <LoginForm onLoginSuccess={handleSuccess} />
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="register">
                            <Card className="border-none shadow-none">
                                <CardHeader className="p-0 pb-4">
                                    <CardTitle>Create an Account</CardTitle>
                                    <CardDescription>It's quick and easy to get started.</CardDescription>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <RegisterForm onRegisterSuccess={handleSuccess} />
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </div>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
