import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { BottomNav } from '@/components/layout/bottom-nav';

export const metadata: Metadata = {
  title: 'BurnerStore',
  description: 'Top up your favorite games.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn('font-body antialiased min-h-screen flex flex-col bg-background')}>
        <Header />
        <main className="flex-grow pb-16 md:pb-0 animate-in fade-in-50 duration-300">
            {children}
        </main>
        <Footer />
        <BottomNav />
        <Toaster />
      </body>
    </html>
  );
}
