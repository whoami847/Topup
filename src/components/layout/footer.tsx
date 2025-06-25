import Link from "next/link";
import { Flame, Phone, MessageCircle, Facebook, Twitter, Instagram } from "lucide-react";

export function Footer() {
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
                <a href="tel:+123456789" className="flex items-center gap-2 hover:text-primary transition-colors">
                    <Phone className="h-5 w-5" />
                    <span>+1 234 567 89</span>
                </a>
                <a href="https://wa.me/123456789" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
                    <MessageCircle className="h-5 w-5" />
                    <span>WhatsApp</span>
                </a>
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
          <div className="flex gap-4">
            <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="p-2 bg-background rounded-full hover:bg-primary hover:text-primary-foreground transition-colors">
              <Facebook className="h-6 w-6" />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="p-2 bg-background rounded-full hover:bg-primary hover:text-primary-foreground transition-colors">
              <Twitter className="h-6 w-6" />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="p-2 bg-background rounded-full hover:bg-primary hover:text-primary-foreground transition-colors">
              <Instagram className="h-6 w-6" />
            </a>
          </div>
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
