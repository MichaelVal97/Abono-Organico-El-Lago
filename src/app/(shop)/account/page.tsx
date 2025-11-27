'use client';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function AccountPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return (
            <div className="container py-12">
                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-4 w-64 mt-2" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                           <Skeleton className="h-4 w-24" />
                           <Skeleton className="h-6 w-full" />
                        </div>
                         <div className="space-y-2">
                           <Skeleton className="h-4 w-24" />
                           <Skeleton className="h-6 w-full" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="container py-12">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-3xl">Mi Cuenta</CardTitle>
                    <CardDescription>Hola de nuevo, {user.name}!</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Nombre</p>
                            <p className="text-lg">{user.name}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Correo Electrónico</p>
                            <p className="text-lg">{user.email}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">User ID (mock)</p>
                            <p className="text-lg font-mono text-sm">{user.uid}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
