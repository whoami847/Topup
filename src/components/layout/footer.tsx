
'use client';

import Link from "next/link";
import { Flame, Phone, MessageCircle, Facebook, Twitter, Instagram } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { Skeleton } from "../ui/skeleton";

const FooterSkeleton = () => (
    <footer className="bg-secondary text-secondary-foreground border-t">
      <div className="container py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="flex flex-col gap-4 md:col-span-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
        </div>
         <div className="flex flex-col">
            <Skeleton className="h-6 w-24 mb-4" />
            <div className="flex flex-col gap-3">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-24" />
            </div>
            <Skeleton className="h-6 w-28 mb-4 mt-6" />
            <div className="flex flex-col gap-3">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-5 w-40" />
            </div>
        </div>
         <div>
            <Skeleton className="h-6 w-40 mb-4" />
            <div className="flex gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
        </div>
      </div>
      <div className="bg-background/50 py-4">
        <div className="container text-center text-muted-foreground text-sm">
          <Skeleton className="h-4 w-56 mx-auto" />
        </div>
      </div>
    </footer>
);

const SocialIcon = ({ id }: { id: string }) => {
    switch(id) {
        case 'facebook': return <Facebook className="h-6 w-6" />;
        case 'twitter': return <Twitter className="h-6 w-6" />;
        case 'instagram': return <Instagram className="h-6 w-6" />;
        case 'whatsapp': return <MessageCircle className="h-5 w-5" />;
        default: return null;
    }
}

export function Footer() {
  const { siteSettings } = useAppStore();

  if (!siteSettings) {
      return <FooterSkeleton />;
  }
  
  const enabledSocials = siteSettings.socialLinks.filter(link => link.enabled && link.url);
  const supportWhatsapp = siteSettings.socialLinks.find(link => link.id === 'whatsapp');

  return (
    <footer className="bg-secondary text-secondary-foreground border-t">
      <div className="container py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="flex flex-col gap-4 md:col-span-2">
          <Link href="/" className="flex items-center gap-2 font-bold text-2xl">
            <Flame className="h-8 w-8 text-primary" />
            <span className="font-headline">BurnerStore</span>
          </Link>
          <p className="text-muted-foreground max-w-sm">Your one-stop shop for instant and secure game top-ups. Experience the best prices and fastest delivery.</p>
        </div>

        <div className="flex flex-col">
            <h3 className="font-semibold text-lg mb-4">SUPPORT</h3>
            <div className="flex flex-col gap-3">
                {siteSettings.supportPhone && (
                  <a href={`tel:${siteSettings.supportPhone}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                      <Phone className="h-5 w-5" />
                      <span>{siteSettings.supportPhone}</span>
                  </a>
                )}
                {siteSettings.supportWhatsapp && (
                  <a href={`https://wa.me/${siteSettings.supportWhatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
                      <MessageCircle className="h-5 w-5" />
                      <span>WhatsApp</span>
                  </a>
                )}
            </div>
            <h3 className="font-semibold text-lg mb-4 mt-6">ABOUT US</h3>
            <div className="flex flex-col gap-3 text-muted-foreground">
                <Link href="/about" className="hover:text-primary transition-colors">About BurnerStore</Link>
                <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
                <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
                <Link href="/admin" className="hover:text-primary transition-colors">Admin Panel</Link>
            </div>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-4">STAY CONNECTED</h3>
          {enabledSocials.length > 0 && (
            <div className="flex gap-4">
              {enabledSocials.map(link => (
                <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.label} className="p-2 bg-background rounded-full hover:bg-primary hover:text-primary-foreground transition-colors">
                  <SocialIcon id={link.id} />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="bg-background/50 py-4">
        <div className="container text-center text-muted-foreground text-sm">
          © {new Date().getFullYear()} BurnerStore. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
