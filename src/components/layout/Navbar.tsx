'use client';

import Link from 'next/link';
import { Sprout, Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import CartIcon from './CartIcon';
import AuthNav from './AuthNav';
import ThemeToggle from './ThemeToggle';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet"



const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/#products', label: 'Productos' },
  { href: '/reviews', label: 'Reseñas' },
  { href: '/about', label: 'Nosotros' },
  { href: '/process', label: 'Proceso' },
  { href: '/results', label: 'Resultados' },
  { href: '/contact', label: 'Contáctanos' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg supports-backdrop-filter:bg-background/60">
      <div className="container flex h-24 items-center">
        <Link href="/" className="mr-8 flex items-center gap-2 group">
          <img
            src="https://i.postimg.cc/bPWqYmmz/Whats-App-Image-2025-11-27-at-15-02-02-Photoroom.png"
            alt="Logo Abono Orgánico El Lago"
            className="h-20 w-auto object-contain transition-transform group-hover:scale-105"
          />
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'transition-all hover:text-foreground relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full',
                (pathname === href || (href === '/#products' && pathname.startsWith('/products'))) ? 'text-foreground after:w-full' : 'text-foreground/60'
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-1 items-center justify-end gap-2">
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
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
              <SheetTitle className="sr-only">Menú de Navegación</SheetTitle>
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between border-b pb-4">
                  <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                    <img
                      src="https://i.postimg.cc/bPWqYmmz/Whats-App-Image-2025-11-27-at-15-02-02-Photoroom.png"
                      alt="Logo Abono Orgánico El Lago"
                      className="h-24 w-auto object-contain"
                    />
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
                  <div className="flex items-center justify-between px-2">
                    <span className="text-sm text-muted-foreground">Tema</span>
                    <ThemeToggle />
                  </div>
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
