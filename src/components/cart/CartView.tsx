'use client';

import { useCart } from '@/context/CartProvider';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CartItem from './CartItem';
import { Separator } from '@/components/ui/separator';
import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';

export default function CartView() {
  const { cartItems, cartTotal, clearCart, cartCount } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="container py-24 text-center">
        <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground" />
        <h2 className="mt-6 text-2xl font-bold">Tu carrito está vacío</h2>
        <p className="mt-2 text-muted-foreground">
          Parece que todavía no has añadido ningún producto.
        </p>
        <Button asChild className="mt-6">
          <Link href="/#products">Ver Productos</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Carrito de Compras ({cartCount} {cartCount > 1 ? 'productos' : 'producto'})</CardTitle>
          </CardHeader>
          <CardContent className="divide-y">
            {cartItems.map(item => (
              <CartItem key={item.product.id} item={item} />
            ))}
          </CardContent>
        </Card>
      </div>
      <div>
        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle>Resumen del Pedido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Transporte</span>
              <span className="text-muted-foreground text-sm text-right">Por acordar /<br />Contra entrega</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              * El costo del transporte se acuerda al momento de la entrega.
            </p>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button className="w-full" asChild>
              <Link href="/checkout">Proceder al Pago</Link>
            </Button>
            <Button variant="ghost" className="w-full text-destructive hover:text-destructive" onClick={clearCart}>
              Vaciar Carrito
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
