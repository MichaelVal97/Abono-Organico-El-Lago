'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';

import { useCart } from '@/context/CartProvider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function CartIcon({ mobile = false }: { mobile?: boolean }) {
  const { cartCount } = useCart();

  if (mobile) {
    return (
        <Link href="/cart" passHref legacyBehavior>
            <Button variant="outline" className="w-full justify-between">
                <span>Mi Carrito</span>
                <div className="relative">
                    <ShoppingBag className="h-5 w-5" />
                    {cartCount > 0 && (
                    <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                        {cartCount}
                    </span>
                    )}
                </div>
            </Button>
      </Link>
    )
  }

  return (
    <Button variant="ghost" size="icon" asChild>
      <Link href="/cart">
        <div className="relative">
          <ShoppingBag className="h-5 w-5" />
          {cartCount > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {cartCount}
            </span>
          )}
        </div>
        <span className="sr-only">Carrito de compras</span>
      </Link>
    </Button>
  );
}
