
"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { TopUpCategory } from "@/lib/products";
import { cn } from "@/lib/utils";
import { QuantityInput } from "./ui/quantity-input";
import { Separator } from "./ui/separator";
import { useAppStore } from "@/lib/store";
import { format } from 'date-fns';
import { Eye, EyeOff } from "lucide-react";

const getValidationSchema = (category: TopUpCategory) => {
  let schemaObject: any = {
    productId: z.string({ required_error: "Please select an option." }),
    quantity: z.number().min(1).max(99),
  };

  if (category.formFields.includes("player_id")) {
    schemaObject.player_id = z
      .string()
      .min(5, "Please enter a valid Player ID.");
  }
  if (category.formFields.includes("email")) {
    schemaObject.email = z.string().email("Please enter a valid email.");
  }
  if (category.formFields.includes("account_type")) {
    schemaObject.account_type = z.string({
      required_error: "Please select an account type.",
    });
  }
  if (category.formFields.includes("email_phone")) {
    schemaObject.email_phone = z.string().min(1, "This field is required.");
  }
  if (category.formFields.includes("password")) {
    schemaObject.password = z
      .string()
      .min(6, "Password must be at least 6 characters.");
  }
  if (category.formFields.includes("two_step_code")) {
    schemaObject.two_step_code = z.string().optional();
  }

  return z.object(schemaObject);
};

export function TopUpForm({ category }: { category: TopUpCategory }) {
  const router = useRouter();
  const { toast } = useToast();
  const { currentUser, setAuthDialogOpen } = useAppStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const validationSchema = useMemo(() => getValidationSchema(category), [category]);

  const defaultFormValues = {
    productId: undefined,
    player_id: '',
    email: '',
    account_type: undefined,
    email_phone: '',
    password: '',
    two_step_code: '',
    quantity: 1,
  };

  const form = useForm<z.infer<typeof validationSchema>>({
    resolver: zodResolver(validationSchema),
    defaultValues: defaultFormValues,
  });

  const selectedProductId = form.watch("productId");
  const quantity = form.watch("quantity");

  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const selectedProduct = category.products.find(p => p.id === selectedProductId);
    if (selectedProduct) {
      setTotalPrice(selectedProduct.price * quantity);
    } else {
      setTotalPrice(0);
    }
  }, [selectedProductId, quantity, category.products]);
  
  async function onSubmit(values: z.infer<typeof validationSchema>) {
    setIsSubmitting(true);
    
    if (!currentUser) {
      toast({ title: "Login Required", description: "You must be logged in to place an order.", variant: "destructive" });
      setAuthDialogOpen(true);
      setIsSubmitting(false);
      return;
    }

    const selectedProduct = category.products.find(p => p.id === values.productId);
    if (!selectedProduct) {
        toast({
            title: "Error",
            description: "Please select a product before purchasing.",
            variant: "destructive"
        });
        setIsSubmitting(false);
        return;
    }
    
    const orderDetails = {
        date: format(new Date(), 'dd/MM/yyyy, HH:mm:ss'),
        description: `${values.quantity} x ${selectedProduct.name} - ${category.title}`,
        amount: totalPrice,
        userId: currentUser.uid,
        productDetails: values, // Includes player_id etc.
    };

    try {
        const response = await fetch('/api/payment/initiate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order: orderDetails, user: currentUser }),
        });

        const data = await response.json();

        if (response.ok && data.url) {
            window.location.href = data.url; // Redirect to payment gateway
        } else {
            toast({ title: "Error", description: data.message || "Failed to initiate payment.", variant: "destructive" });
            setIsSubmitting(false);
        }
    } catch(error) {
        console.error("Payment initiation failed:", error);
        toast({ title: "Error", description: "Could not connect to the payment server.", variant: "destructive" });
        setIsSubmitting(false);
    }
  }

  const renderField = (fieldName: string) => {
    switch (fieldName) {
      case "player_id":
        return (
          <FormField
            control={form.control}
            name="player_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>PLAYER ID *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Player ID (UID)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      case "email":
        return (
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>EMAIL *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      case "account_type":
        return (
          <FormField
            control={form.control}
            name="account_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SELECT ACCOUNT TYPE *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="google">Google</SelectItem>
                    <SelectItem value="vk">VK</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      case "email_phone":
        return (
            <FormField control={form.control} name="email_phone" render={({field}) => (
                <FormItem>
                    <FormLabel>EMAIL / PHONE *</FormLabel>
                    <FormControl><Input placeholder="Enter Email or Phone" {...field}/></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
        );
      case "password":
        return (
            <FormField control={form.control} name="password" render={({field}) => (
                <FormItem>
                    <FormLabel>PASSWORD *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type={showPassword ? 'text' : 'password'} 
                          placeholder="Enter password" 
                          {...field}
                          className="pr-12"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute top-1/2 right-1 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground"
                          onClick={togglePasswordVisibility}
                          tabIndex={-1}
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )} />
        );
      case "two_step_code":
        return (
            <FormField control={form.control} name="two_step_code" render={({field}) => (
                <FormItem>
                    <FormLabel>TWO STEP CODE</FormLabel>
                    <FormControl><Input placeholder="Enter two step backup code if enabled" {...field}/></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
        );
      default:
        return null;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="productId"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-base font-bold">Select Option</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                >
                  {category.products.map((product) => (
                    <FormItem key={product.id}>
                      <FormControl>
                        <RadioGroupItem value={product.id} id={product.id} className="sr-only" />
                      </FormControl>
                      <FormLabel htmlFor={product.id} className={cn(
                          "flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 font-normal hover:bg-accent hover:text-accent-foreground cursor-pointer",
                          field.value === product.id && "border-primary text-primary"
                      )}>
                        <span className="text-center font-semibold">{product.name}</span>
                        <span className="text-sm">৳{product.price}</span>
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="space-y-4">
            <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>QUANTITY *</FormLabel>
                    <FormControl>
                        <QuantityInput value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            {category.formFields.map((fieldName) => (
                <React.Fragment key={fieldName}>
                    {renderField(fieldName)}
                </React.Fragment>
            ))}
        </div>

        <Separator />

        <div className="flex justify-between items-center bg-card-foreground/5 p-4 rounded-lg">
            <span className="text-xl font-bold">Total:</span>
            <span className="text-2xl font-bold text-primary">৳{totalPrice.toFixed(2)}</span>
        </div>

        <Button type="submit" size="lg" className="w-full text-lg font-bold" disabled={isSubmitting}>
          {isSubmitting ? 'Processing...' : 'Proceed to Pay'}
        </Button>
      </form>
    </Form>
  );
}
