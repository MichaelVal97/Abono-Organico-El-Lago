'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { MyOrders } from '@/components/profile/MyOrders';
import { Button } from '@/components/ui/button';
import { LayoutDashboard } from 'lucide-react';
import Link from 'next/link';

export default function OrdersPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Cargando...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-2">
                    <h1 className="text-3xl font-bold">Mis Pedidos</h1>
                    {(user.email === 'abonoellago@gmail.com' || user.role === 'admin') && (
                        <Button asChild variant="outline">
                            <Link href="/admin/orders">
                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                Dashboard Admin
                            </Link>
                        </Button>
                    )}
                </div>
                <p className="text-muted-foreground mb-8">
                    Historial completo de tus pedidos
                </p>

                <MyOrders />
            </div>
        </div>
    );
}
