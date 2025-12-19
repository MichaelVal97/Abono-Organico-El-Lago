'use client';

import { useEffect, useState } from 'react';
import { reviewsApi, Review } from '@/lib/api/reviews';
import { ReviewList } from '@/components/reviews/ReviewList';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const loadReviews = async () => {
        try {
            setLoading(true);
            const data = await reviewsApi.getAll();
            setReviews(data);
        } catch (err: any) {
            console.error('Error loading reviews:', err);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'No se pudieron cargar las reseñas',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReviews();
    }, []);

    if (loading) {
        return (
            <div className="container py-8 space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold font-headline">Reseñas de nuestros clientes</h1>
                    <p className="text-muted-foreground text-lg">
                        Lo que dicen quienes confían en nuestros productos
                    </p>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Card key={i} className="h-48">
                            <CardContent className="p-6">
                                <div className="animate-pulse space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-muted" />
                                        <div className="space-y-2 flex-1">
                                            <div className="h-4 bg-muted rounded w-1/4" />
                                            <div className="h-3 bg-muted rounded w-1/6" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-3 bg-muted rounded w-full" />
                                        <div className="h-3 bg-muted rounded w-5/6" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="container py-12 space-y-12">
            <div className="text-center space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold font-headline bg-clip-text text-transparent bg-gradient-to-r from-primary to-green-600">
                    Voces del Lago
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
                    Descubre las experiencias reales de nuestra comunidad con nuestros abonos orgánicos premium.
                </p>
            </div>

            {reviews.length === 0 ? (
                <Card className="max-w-md mx-auto">
                    <CardContent className="p-12 text-center">
                        <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">Aún no hay reseñas</h3>
                        <p className="text-muted-foreground">
                            Sé el primero en probar nuestros productos y dejarnos tu opinión.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="bg-muted/30 p-6 rounded-2xl">
                    <ReviewList
                        reviews={reviews}
                        onReviewDeleted={loadReviews}
                        onReviewUpdated={loadReviews}
                    />
                </div>
            )}
        </div>
    );
}
