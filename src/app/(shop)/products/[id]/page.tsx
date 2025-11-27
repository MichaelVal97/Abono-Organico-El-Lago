'use client';

import { useState } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { ShoppingCart, CheckCircle } from 'lucide-react';
import { products } from '@/lib/products';
import { useCart } from '@/context/CartProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import QuantitySelector from '@/components/cart/QuantitySelector';
import { useToast } from '@/hooks/use-toast';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  const product = products.find(p => p.id === params.id);

  if (!product) {
    notFound();
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedToCart(true);
    toast({
      title: 'Añadido al carrito',
      description: `${quantity} x ${product.name} ha sido añadido a tu carrito.`,
    });
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="container py-12">
      <Card>
        <CardContent className="p-4 md:p-8 grid md:grid-cols-2 gap-8 items-start">
          <div className="aspect-square relative w-full overflow-hidden rounded-lg">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              data-ai-hint={product.imageHint}
            />
          </div>
          <div className="flex flex-col h-full">
            <h1 className="text-3xl md:text-4xl font-bold font-headline">{product.name}</h1>
            <p className="text-2xl font-semibold text-accent mt-2">${product.price.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {product.stock > 0 ? `Disponible (${product.stock} en stock)` : 'Agotado'}
            </p>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              {product.description}
            </p>
            <div className="mt-auto pt-6 space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-medium">Cantidad:</span>
                <QuantitySelector 
                    quantity={quantity}
                    onQuantityChange={setQuantity}
                    maxStock={product.stock}
                />
              </div>
              <Button 
                size="lg" 
                className="w-full" 
                onClick={handleAddToCart} 
                disabled={product.stock === 0 || addedToCart}
              >
                {addedToCart ? (
                    <CheckCircle className="mr-2 h-5 w-5" />
                ) : (
                    <ShoppingCart className="mr-2 h-5 w-5" />
                )}
                {addedToCart ? 'Añadido' : 'Añadir al carrito'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
