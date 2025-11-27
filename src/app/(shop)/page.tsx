import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ProductList from '@/components/products/ProductList';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function HomePage() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-image');

  return (
    <>
      <section className="relative h-[60vh] min-h-[400px] w-full flex items-center justify-center text-center text-white">
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
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 container px-4">
          <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tight">
            MierdaCar
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl md:text-2xl font-slogan italic text-white/90">
            "La mejor inversión para tu tierra."
          </p>
          <Button asChild size="lg" className="mt-8 bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="#products">Ver Productos</Link>
          </Button>
        </div>
      </section>
      <ProductList />
    </>
  );
}
