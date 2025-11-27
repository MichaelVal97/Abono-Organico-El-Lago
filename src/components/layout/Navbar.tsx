'use client';

import Link from 'next/link';
import { Sprout, Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import CartIcon from './CartIcon';
import AuthNav from './AuthNav';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"


const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/#products', label: 'Productos' },
  { href: '/admin/feedback', label: 'Feedback AI' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-8 flex items-center gap-2">
          <Sprout className="h-6 w-6 text-primary" />
          <span className="hidden font-bold sm:inline-block text-lg">
            MierdaCar
          </span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'transition-colors hover:text-foreground/80',
                (pathname === href || (href === '/#products' && pathname.startsWith('/products'))) ? 'text-foreground' : 'text-foreground/60'
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-1 items-center justify-end gap-2">
           <div className="hidden md:flex items-center gap-2">
            <CartIcon />
            <AuthNav />
           </div>
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between border-b pb-4">
                    <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                        <Sprout className="h-6 w-6 text-primary" />
                        <span className="font-bold text-lg">MierdaCar</span>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                        <X />
                        <span className="sr-only">Cerrar menú</span>
                    </Button>
                </div>
                <nav className="flex flex-col gap-4 text-lg font-medium mt-8">
                  {navLinks.map(({ href, label }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        'transition-colors hover:text-foreground/80',
                        (pathname === href || (href === '/#products' && pathname.startsWith('/products'))) ? 'text-foreground' : 'text-foreground/60'
                      )}
                    >
                      {label}
                    </Link>
                  ))}
                </nav>
                <div className="mt-auto border-t pt-4 flex flex-col gap-4">
                  <AuthNav mobile />
                  <CartIcon mobile />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
