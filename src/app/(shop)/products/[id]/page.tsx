'use client';

import { useState, use, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { ShoppingCart, CheckCircle, Package } from 'lucide-react';
import { useCart } from '@/context/CartProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import QuantitySelector from '@/components/cart/QuantitySelector';
import { useToast } from '@/hooks/use-toast';
import { formatPrice } from '@/lib/utils';
import { ReviewStatsDisplay } from '@/components/reviews/ReviewStatsDisplay';
import { ReviewForm } from '@/components/reviews/ReviewForm';
import { ReviewList } from '@/components/reviews/ReviewList';
import { reviewsApi, Review } from '@/lib/api/reviews';
import { productsApi, Product } from '@/lib/api/products';
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [reviewsRefreshTrigger, setReviewsRefreshTrigger] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const { addToCart } = useCart();
  const { toast } = useToast();
  const { user } = useAuth();

  const userHasReviewed = reviews.some(review => review.user?.id === user?.id);

  // Load product data
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await productsApi.getOne(id);
        setProduct(data);
      } catch (error) {
        console.error('Error loading product:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  // Load reviews (existing logic)
  useEffect(() => {
    const loadReviews = async () => {
      try {
        setReviewsLoading(true);
        const data = await reviewsApi.getByProduct(id);
        setReviews(data);
      } catch (err) {
        console.error('Error loading reviews:', err);
      } finally {
        setReviewsLoading(false);
      }
    };

    loadReviews();
  }, [id, reviewsRefreshTrigger]);

  if (loading) {
    return (
      <div className="container py-12 space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="h-[500px] w-full" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  // Ensure we have a valid image to show (state > first gallery image > main image)
  const currentImage = selectedImage || (product.images && product.images.length > 0 ? product.images[0] : product.imageUrl);

  // Combine all available images for the gallery
  const galleryImages = product.images && product.images.length > 0 ? product.images : [product.imageUrl];

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedToCart(true);
    toast({
      title: 'Añadido al carrito',
      description: `${quantity} x ${product.name} ha sido añadido a tu carrito.`,
    });
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleReviewCreated = () => {
    setReviewsRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="container py-8 md:py-12 space-y-12">
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Image Section */}
            <div className="flex flex-col bg-muted">
              {/* Main Image */}
              <div className="relative aspect-square md:aspect-auto md:min-h-[500px] w-full">
                <Image
                  src={currentImage}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  data-ai-hint={product.imageHint}
                  priority
                />
              </div>

              {/* Thumbnails Gallery */}
              {galleryImages.length > 1 && (
                <div className="flex gap-2 p-4 overflow-x-auto bg-background/50 backdrop-blur-sm">
                  {galleryImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(img)}
                      className={`relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all ${currentImage === img ? 'border-primary ring-2 ring-primary/20' : 'border-transparent hover:border-muted-foreground/50'
                        }`}
                    >
                      <Image
                        src={img}
                        alt={`${product.name} view ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </button>
                  ))}
                </div>
              )}
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
                  <div className="mt-4 flex flex-col gap-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-primary">
                        {formatPrice(product.price)}
                      </span>
                      {product.priceRange && (
                        <span className="text-sm text-muted-foreground">
                          / {product.priceRange}
                        </span>
                      )}
                    </div>
                    {/* Discount Label */}
                    <Badge variant="destructive" className="w-fit text-sm px-3 py-1">
                      10% de descuento en pedidos mayores a 100 bultos
                    </Badge>

                    {/* Free Shipping Label */}
                    <Badge variant="secondary" className="w-fit text-sm px-3 py-1 bg-green-100 text-green-800 hover:bg-green-200 border-green-200 hidden md:inline-flex">
                      Envío Gratis {'>'} 200 Unidades
                    </Badge>
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
                  {quantity >= 100 && (
                    <p className="text-sm font-medium text-green-600 animate-pulse">
                      ¡Aplica 10% de descuento!
                    </p>
                  )}
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
                <p className="text-xs text-muted-foreground text-center font-medium">
                  Transporte por aparte.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews Section */}
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold font-headline mb-2">Reseñas de clientes</h2>
          <p className="text-muted-foreground">
            Descubre lo que nuestros clientes opinan sobre este producto
          </p>
        </div>

        {/* Review Stats */}
        <ReviewStatsDisplay productId={id} refreshTrigger={reviewsRefreshTrigger} />

        {/* Review Form (only if user hasn't reviewed yet) */}
        {!userHasReviewed && (
          <ReviewForm productId={id} onReviewCreated={handleReviewCreated} />
        )}

        {/* Review List */}
        <ReviewList
          reviews={reviews}
          productId={id}
          onReviewDeleted={handleReviewCreated}
          onReviewUpdated={handleReviewCreated}
        />
      </div>
    </div>
  );
}
