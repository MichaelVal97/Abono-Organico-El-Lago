'use client';

import CheckoutForm from '@/components/checkout/CheckoutForm';
import { useCart } from '@/context/CartProvider';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CheckoutPage() {
    const { cartItems, isInitialized } = useCart();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent hydration mismatch and redirect if empty
    if (!mounted) return null;

    if (isInitialized && cartItems.length === 0) {
        redirect('/cart');
    }

    return (
        <div className="container py-12 md:py-20 space-y-12">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold font-headline text-gradient">Finalizar Compra</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Estás a un paso de recibir el mejor abono orgánico para tus cultivos.
                </p>
            </div>

            <CheckoutForm />
        </div>
    );
}
