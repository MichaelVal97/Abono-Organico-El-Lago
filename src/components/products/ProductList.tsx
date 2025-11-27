import { products } from '@/lib/products';
import ProductCard from './ProductCard';

export default function ProductList() {
  return (
    <section id="products" className="py-12 md:py-20">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-10 font-headline">Nuestros Productos</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
