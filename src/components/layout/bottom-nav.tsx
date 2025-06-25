"use client";

import Link from "next/link";
import { usePathname } from 'next/navigation';
import {
  Home,
  BookOpen,
  ListOrdered,
  Wallet,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/tutorial", label: "Tutorial", icon: BookOpen },
  { href: "/orders", label: "Order List", icon: ListOrdered },
  { href: "/wallet", label: "My Wallet", icon: Wallet },
  { href: "/account", label: "My Account", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
      <div className="container flex h-16 items-center justify-around gap-1">
        {navLinks.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={label}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 p-2 flex-1 rounded-md transition-colors text-xs font-medium",
                isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"
              )}
              title={label}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
