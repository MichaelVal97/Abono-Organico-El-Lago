import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ProductList from '@/components/products/ProductList';
import LocationMap from '@/components/common/LocationMap';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function HomePage() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-image');

  return (
    <>
      <section className="relative h-[60vh] min-h-[400px] w-full flex items-center justify-center text-center text-white overflow-hidden">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            priority
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
        <div className="absolute inset-0 gradient-mesh opacity-50" />
        <div className="relative z-10 container px-4">
          <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tight animate-fade-in-up drop-shadow-2xl">
            Abono Orgánico El Lago
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl md:text-2xl font-slogan italic text-white/90 animate-fade-in-up drop-shadow-lg" style={{ animationDelay: '0.2s' }}>
            "La mejor inversión para tu tierra."
          </p>
          <Button asChild size="lg" className="mt-8 bg-primary hover:bg-primary/90 text-primary-foreground animate-fade-in-up hover:scale-105 transition-all glow-on-hover shadow-2xl" style={{ animationDelay: '0.4s' }}>
            <Link href="#products">Ver Productos</Link>
          </Button>
        </div>
      </section>
      <ProductList />
      <LocationMap />
    </>
  );
}
