'use client';

import { useEffect, useState } from 'react';
import { reviewsApi, Review } from '@/lib/api/reviews';
import { ReviewCard } from './ReviewCard';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';

interface ReviewListProps {
    productId: string;
    refreshTrigger?: number;
}

export function ReviewList({ reviews, productId, onReviewDeleted, onReviewUpdated }: {
    reviews: Review[];
    productId?: string;
    onReviewDeleted: () => void;
    onReviewUpdated: () => void;
}) {




    if (reviews.length === 0) {
        return (
            <Card>
                <CardContent className="p-12 text-center">
                    <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No hay reseñas aún</h3>
                    <p className="text-muted-foreground">
                        Sé el primero en compartir tu experiencia con este producto
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium">
                Reseñas ({reviews.length})
            </h3>
            {reviews.map((review) => (
                <ReviewCard
                    key={review.id}
                    review={review}
                    productId={productId}
                    onReviewDeleted={onReviewDeleted}
                    onReviewUpdated={onReviewUpdated}
                />
            ))}
        </div>
    );
}
