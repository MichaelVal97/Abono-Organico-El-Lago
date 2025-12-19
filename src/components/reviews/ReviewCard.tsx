'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { reviewsApi, Review } from '@/lib/api/reviews';
import { RatingStars } from './RatingStars';
import { ReviewForm } from './ReviewForm';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, User, FilePenLine } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface ReviewCardProps {
    review: Review;
    productId?: string;
    onReviewDeleted?: () => void;
    onReviewUpdated?: () => void;
}



export function ReviewCard({ review, productId, onReviewDeleted, onReviewUpdated }: ReviewCardProps) {
    const { user } = useAuth();
    const { toast } = useToast();
    const [deleting, setDeleting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const isAuthor = user?.id === review.user?.id;
    const targetProductId = productId || review.product?.id;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now.getTime() - date.getTime();
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) return 'Hoy';
        if (diffInDays === 1) return 'Ayer';
        if (diffInDays < 7) return `Hace ${diffInDays} días`;
        if (diffInDays < 30) return `Hace ${Math.floor(diffInDays / 7)} semanas`;
        if (diffInDays < 365) return `Hace ${Math.floor(diffInDays / 30)} meses`;
        return `Hace ${Math.floor(diffInDays / 365)} años`;
    };

    const handleDelete = async () => {
        setDeleting(true);

        try {
            const token = localStorage.getItem('abono-lago-token');
            if (!token) {
                throw new Error('No se encontró el token de autenticación');
            }

            await reviewsApi.delete(review.id, token);

            toast({
                title: 'Reseña eliminada',
                description: 'Tu reseña ha sido eliminada exitosamente',
            });

            if (onReviewDeleted) {
                onReviewDeleted();
            }
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error.message || 'Error al eliminar la reseña',
            });
        } finally {
            setDeleting(false);
        }
    };

    const handleUpdate = () => {
        setIsEditing(false);
        if (onReviewUpdated) {
            onReviewUpdated();
        }
    };

    if (isEditing) {
        return (
            targetProductId ? (
                <ReviewForm
                    productId={targetProductId}
                    reviewId={review.id}
                    initialRating={review.rating}
                    initialComment={review.comment}
                    onReviewCreated={handleUpdate}
                    onCancel={() => setIsEditing(false)}
                />
            ) : null
        );
    }

    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4 flex-1">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="h-5 w-5 text-primary" />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-medium">
                                    {review.user?.firstName || 'Usuario'} {review.user?.lastName || 'Anónimo'}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    • {formatDate(review.createdAt)}
                                </span>
                            </div>

                            <RatingStars rating={review.rating} size="sm" />

                            <p className="text-foreground/80 leading-relaxed">
                                {review.comment}
                            </p>
                        </div>
                    </div>

                    {/* Actions (Edit/Delete) for author */}
                    {isAuthor && (
                        <div className="flex gap-1">
                            {targetProductId && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-muted-foreground hover:text-primary"
                                    onClick={() => setIsEditing(true)}
                                    disabled={deleting}
                                >
                                    <FilePenLine className="h-4 w-4" />
                                </Button>
                            )}

                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                        disabled={deleting}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>¿Eliminar reseña?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Esta acción no se puede deshacer. Tu reseña será eliminada permanentemente.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={handleDelete}
                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        >
                                            Eliminar
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
