import { products } from '@/lib/products';
import ProductCard from './ProductCard';

export default function ProductList() {
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
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {products.map((product, index) => (
            <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
