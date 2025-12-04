'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

function GoogleCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { refreshUser } = useAuth();

    useEffect(() => {
        const handleCallback = async () => {
            const token = searchParams.get('token');

            if (token) {
                // Guardar token
                localStorage.setItem('abono-lago-token', token);
                document.cookie = `abono-lago-token=${token}; path=/; max-age=604800`; // 7 días

                // Actualizar datos de usuario
                await refreshUser();

                // Redirigir al perfil o inicio
                router.push('/profile');
            } else {
                // Manejar error
                router.push('/login?error=google_auth_failed');
            }
        };

        handleCallback();
    }, [router, searchParams, refreshUser]);

    return (
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">Autenticando con Google...</p>
        </div>
    );
}

export default function GoogleCallbackPage() {
    return (
        <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-8">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center">Procesando Login</CardTitle>
                </CardHeader>
                <CardContent>
                    <Suspense fallback={<Skeleton className="h-20 w-full" />}>
                        <GoogleCallbackContent />
                    </Suspense>
                </CardContent>
            </Card>
        </div>
    );
}
