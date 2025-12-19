'use client';

import { useEffect, useState } from 'react';
import { reviewsApi, ReviewStats } from '@/lib/api/reviews';
import { RatingStars } from './RatingStars';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

interface ReviewStatsDisplayProps {
    productId: string;
    refreshTrigger?: number;
}

export function ReviewStatsDisplay({ productId, refreshTrigger }: ReviewStatsDisplayProps) {
    const [stats, setStats] = useState<ReviewStats>({ average: 0, count: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            try {
                setLoading(true);
                const data = await reviewsApi.getStats(productId);
                setStats(data);
            } catch (error) {
                console.error('Error loading stats:', error);
            } finally {
                setLoading(false);
            }
        };

        loadStats();
    }, [productId, refreshTrigger]);

    if (loading) {
        return (
            <Card>
                <CardContent className="p-6">
                    <div className="animate-pulse space-y-3">
                        <div className="h-8 bg-muted rounded w-1/3" />
                        <div className="h-4 bg-muted rounded w-1/2" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (stats.count === 0) {
        return (
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                        <Star className="h-8 w-8 text-muted-foreground" />
                        <div>
                            <p className="text-lg font-medium">Sin reseñas aún</p>
                            <p className="text-sm text-muted-foreground">
                                Sé el primero en dejar una reseña
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-center gap-4">
                    <div className="text-center">
                        <div className="text-4xl font-bold">{stats.average.toFixed(1)}</div>
                        <RatingStars rating={Math.round(stats.average)} size="sm" className="justify-center mt-1" />
                    </div>
                    <div className="border-l pl-4">
                        <p className="text-sm text-muted-foreground">
                            Basado en <span className="font-medium text-foreground">{stats.count}</span>{' '}
                            {stats.count === 1 ? 'reseña' : 'reseñas'}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
