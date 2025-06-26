
"use client";

import React from "react";
import Link from "next/link";
import {
  Flame,
  Home,
  BookOpen,
  ListOrdered,
  Wallet,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { AuthDialog } from "@/components/auth/auth-dialog";
import { UserNav } from "../auth/user-nav";
import { Skeleton } from "../ui/skeleton";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/tutorial", label: "Tutorial", icon: BookOpen },
  { href: "/orders", label: "Order List", icon: ListOrdered },
  { href: "/wallet", label: "My Wallet", icon: Wallet },
  { href: "/account", label: "My Account", icon: User },
];

export function Header() {
  const { currentUser, isAuthDialogOpen, setAuthDialogOpen, isAuthLoading, init } = useAppStore();

  React.useEffect(() => {
    init();
  }, [init]);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center gap-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Flame className="h-7 w-7 text-primary" />
            <span className="font-headline hidden sm:inline-block">BurnerStore</span>
          </Link>
          <div className="ml-auto flex items-center gap-4">
            <nav className="hidden md:flex flex-row items-center gap-2 text-sm font-medium text-muted-foreground">
                {navLinks.map(({ href, label, icon: Icon }) => (
                    <Link
                    key={label}
                    href={href}
                    className="flex items-center gap-2 transition-colors hover:text-foreground p-2 rounded-md hover:bg-secondary/50"
                    title={label}
                    >
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                    </Link>
                ))}
            </nav>
            {isAuthLoading ? (
                <Skeleton className="h-9 w-28" />
            ) : currentUser ? (
              <UserNav />
            ) : (
              <Button size="sm" onClick={() => setAuthDialogOpen(true)}>Login / Register</Button>
            )}
          </div>
        </div>
      </header>
      <AuthDialog open={isAuthDialogOpen} onOpenChange={setAuthDialogOpen} />
    </>
  );
}
