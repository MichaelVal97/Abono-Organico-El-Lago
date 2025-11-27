'use client';

import { useState, use } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { ShoppingCart, CheckCircle, Package } from 'lucide-react';
import { products } from '@/lib/products';
import { useCart } from '@/context/CartProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import QuantitySelector from '@/components/cart/QuantitySelector';
import { useToast } from '@/hooks/use-toast';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const product = products.find(p => p.id === id);

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
    <div className="container py-8 md:py-12">
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Image Section */}
            <div className="relative aspect-square md:aspect-auto md:min-h-[600px] bg-muted">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                data-ai-hint={product.imageHint}
                priority
              />
            </div>

            {/* Product Info Section */}
            <div className="flex flex-col p-6 md:p-10">
              <div className="space-y-6 flex-1">
                {/* Title */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold font-headline text-foreground">
                    {product.name}
                  </h1>

                  {/* Price */}
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-primary">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.priceRange && (
                      <span className="text-sm text-muted-foreground">
                        / {product.priceRange}
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-base text-foreground/80 leading-relaxed">
                  {product.description}
                </p>

                {/* Stock Status */}
                <div className="flex items-center gap-2 text-sm">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className={product.stock > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                    {product.stock > 0 ? `En stock (${product.stock} disponibles)` : 'Agotado'}
                  </span>
                </div>

                <Separator />

                {/* Category & Tags */}
                <div className="space-y-3">
                  {product.category && (
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">CATEGORÍA: </span>
                      <Badge variant="secondary" className="ml-2">
                        {product.category}
                      </Badge>
                    </div>
                  )}

                  {product.tags && product.tags.length > 0 && (
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">ETIQUETAS: </span>
                      <div className="inline-flex flex-wrap gap-2 ml-2">
                        {product.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Quantity Selector */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium">Cantidad ({product.priceRange || '1 Bulto - 50Kg'})</span>
                  </div>
                  <QuantitySelector
                    quantity={quantity}
                    onQuantityChange={setQuantity}
                    maxStock={product.stock}
                  />
                </div>

                {/* Add to Cart Button */}
                <Button
                  size="lg"
                  className="w-full text-base glow-on-hover"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || addedToCart}
                >
                  {addedToCart ? (
                    <>
                      <CheckCircle className="mr-2 h-5 w-5" />
                      Añadido al carrito
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Añadir al carrito
                    </>
                  )}
                </Button>

                {/* Additional Info */}
                <p className="text-xs text-muted-foreground text-center">
                  No incluye costo de envío.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
