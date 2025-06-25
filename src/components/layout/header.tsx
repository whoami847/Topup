"use client";

import Link from "next/link";
import {
  Flame,
  Menu,
  Home,
  BookOpen,
  ListOrdered,
  Wallet,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/tutorial", label: "Tutorial", icon: BookOpen },
  { href: "/orders", label: "Order List", icon: ListOrdered },
  { href: "/wallet", label: "My Wallet", icon: Wallet },
  { href: "/account", label: "My Account", icon: User },
];

export function Header() {
  const isMobile = useIsMobile();

  const navContent = (className?: string) => (
    <nav className={cn("flex flex-col md:flex-row items-start md:items-center gap-6 text-lg md:text-sm font-medium text-muted-foreground", className)}>
      {navLinks.map(({ href, label, icon: Icon }) => (
        <Link
          key={label}
          href={href}
          className="flex items-center gap-2 transition-colors hover:text-foreground"
        >
          <Icon className="h-5 w-5" />
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Flame className="h-7 w-7 text-primary" />
          <span className="font-headline">BurnerStore</span>
        </Link>

        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>
                  <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                    <Flame className="h-7 w-7 text-primary" />
                    <span>BurnerStore</span>
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <div className="mt-8 flex flex-col gap-y-4">
                {navContent()}
                <Button className="w-full mt-6">Login / Register</Button>
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <div className="flex items-center gap-8">
            {navContent()}
            <Button>Login / Register</Button>
          </div>
        )}
      </div>
    </header>
  );
}
