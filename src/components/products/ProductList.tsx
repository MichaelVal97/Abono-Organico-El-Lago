'use client';

import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { productsApi, Product } from '@/lib/api/products';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productsApi.getAll();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section id="products" className="py-16 md:py-24 relative">
      <div className="absolute inset-0 gradient-mesh opacity-30 pointer-events-none" />
      <div className="container relative">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold font-headline mb-4 text-gradient">
            Nuestros Productos
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Descubre nuestra selección de abonos orgánicos de la más alta calidad
          </p>
        </div>

        {/* Promo Banner */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-12 text-center shadow-sm">
          <p className="text-green-800 font-medium flex items-center justify-center gap-2">

            ¡Envío GRATIS en pedidos superiores a 200 bultos o dentro de 10km de Fusagasugá!
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-[300px] w-full rounded-xl" />
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {products.map((product, index) => (
              <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
