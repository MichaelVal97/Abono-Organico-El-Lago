'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingStarsProps {
    rating: number;
    size?: 'sm' | 'md' | 'lg';
    interactive?: boolean;
    onChange?: (rating: number) => void;
    className?: string;
}

export function RatingStars({
    rating,
    size = 'md',
    interactive = false,
    onChange,
    className
}: RatingStarsProps) {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-6 w-6'
    };

    const handleClick = (value: number) => {
        if (interactive && onChange) {
            onChange(value);
        }
    };

    return (
        <div className={cn('flex gap-1', className)}>
            {[1, 2, 3, 4, 5].map((value) => (
                <button
                    key={value}
                    type="button"
                    onClick={() => handleClick(value)}
                    disabled={!interactive}
                    className={cn(
                        'transition-colors',
                        interactive && 'cursor-pointer hover:scale-110',
                        !interactive && 'cursor-default'
                    )}
                >
                    <Star
                        className={cn(
                            sizeClasses[size],
                            value <= rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'fill-none text-gray-300'
                        )}
                    />
                </button>
            ))}
        </div>
    );
}
