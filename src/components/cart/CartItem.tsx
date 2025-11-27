'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import type { CartItem as CartItemType } from '@/lib/types';
import { useCart } from '@/context/CartProvider';
import { Button } from '@/components/ui/button';
import QuantitySelector from './QuantitySelector';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();
  const { product, quantity } = item;

  return (
    <div className="flex items-start gap-4 py-4">
      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="96px"
          className="object-cover"
          data-ai-hint={product.imageHint}
        />
      </div>
      <div className="flex-grow">
        <Link href={`/products/${product.id}`} className="hover:text-primary">
          <h3 className="font-semibold text-lg">{product.name}</h3>
        </Link>
        <p className="text-sm text-muted-foreground">
          Precio: ${product.price.toFixed(2)}
        </p>
        <div className="mt-2">
          <QuantitySelector
            quantity={quantity}
            onQuantityChange={(newQuantity) => updateQuantity(product.id, newQuantity)}
            maxStock={product.stock}
          />
        </div>
      </div>
      <div className="flex flex-col items-end justify-between h-full">
        <p className="font-semibold text-lg">
          ${(product.price * quantity).toFixed(2)}
        </p>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => removeFromCart(product.id)}
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-5 w-5" />
          <span className="sr-only">Eliminar producto</span>
        </Button>
      </div>
    </div>
  );
}
