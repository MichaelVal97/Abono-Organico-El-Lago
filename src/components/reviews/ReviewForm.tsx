'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { reviewsApi } from '@/lib/api/reviews';
import { RatingStars } from './RatingStars';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ReviewFormProps {
    productId: string;
    reviewId?: string;
    initialRating?: number;
    initialComment?: string;
    onReviewCreated?: () => void;
    onCancel?: () => void;
}

export function ReviewForm({
    productId,
    reviewId,
    initialRating = 5,
    initialComment = '',
    onReviewCreated,
    onCancel
}: ReviewFormProps) {
    const { user } = useAuth();
    const { toast } = useToast();
    const [rating, setRating] = useState(initialRating);
    const [comment, setComment] = useState(initialComment);
    const [loading, setLoading] = useState(false);

    if (!user) {
        return (
            <Card>
                <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">
                        Debes <a href="/login" className="text-primary hover:underline">iniciar sesión</a> para dejar una reseña
                    </p>
                </CardContent>
            </Card>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (comment.length < 10) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'El comentario debe tener al menos 10 caracteres',
            });
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('abono-lago-token');
            if (!token) {
                throw new Error('No se encontró el token de autenticación');
            }

            if (reviewId) {
                await reviewsApi.update(
                    reviewId,
                    { rating, comment },
                    token
                );
                toast({
                    title: '¡Reseña actualizada!',
                    description: 'Tu reseña ha sido actualizada exitosamente',
                });
            } else {
                await reviewsApi.create(
                    {
                        productId,
                        rating,
                        comment,
                    },
                    token
                );
                toast({
                    title: '¡Reseña publicada!',
                    description: 'Tu reseña ha sido publicada exitosamente',
                });
            }

            // Limpiar formulario
            setRating(5);
            setComment('');

            // Notificar al componente padre
            if (onReviewCreated) {
                onReviewCreated();
            }
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error.message || 'Error al publicar la reseña',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{reviewId ? 'Editar reseña' : 'Escribe una reseña'}</CardTitle>
                <CardDescription>
                    {reviewId ? 'Modifica tu opinión sobre este producto' : 'Comparte tu experiencia con este producto'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Calificación
                        </label>
                        <RatingStars
                            rating={rating}
                            size="lg"
                            interactive
                            onChange={setRating}
                        />
                    </div>

                    <div>
                        <label htmlFor="comment" className="block text-sm font-medium mb-2">
                            Comentario
                        </label>
                        <Textarea
                            id="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Cuéntanos sobre tu experiencia con este producto..."
                            rows={4}
                            minLength={10}
                            maxLength={500}
                            required
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            {comment.length}/500 caracteres (mínimo 10)
                        </p>
                    </div>

                    <div className="flex gap-2">
                        {onCancel && (
                            <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                                Cancelar
                            </Button>
                        )}
                        <Button type="submit" disabled={loading || comment.length < 10}>
                            {loading ? (reviewId ? 'Actualizando...' : 'Publicando...') : (reviewId ? 'Actualizar reseña' : 'Publicar reseña')}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
