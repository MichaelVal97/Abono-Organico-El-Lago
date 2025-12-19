'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, ShoppingBag, DollarSign, Activity, AlertTriangle } from 'lucide-react';
import { ordersApi } from '@/lib/api/orders';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function AdminDashboard() {
    const { token } = useAuth();
    const { toast } = useToast();
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        totalOrders: 0,
        revenue: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            if (!token) return;
            try {
                // Fetch stats from backend
                const orderStats = await ordersApi.getStats(token);

                // For users, we'd ideally have a usersApi.getStats() but we'll use placeholder or orders active users
                // Assuming we want real user count eventually, but for now let's use what we have

                setStats({
                    totalUsers: orderStats.totalUsers || 0,
                    activeUsers: orderStats.activeUsers || 0,
                    totalOrders: orderStats.totalOrders,
                    revenue: orderStats.revenue,
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
                toast({
                    title: 'Error',
                    description: 'No se pudieron cargar las estadísticas.',
                    variant: 'destructive',
                });
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [token, toast]);

    const statCards = [
        {
            title: 'Usuarios Activos',
            value: stats.activeUsers,
            icon: Users,
            description: 'Usuarios que han comprado',
        },
        {
            title: 'Pedidos Totales',
            value: stats.totalOrders,
            icon: ShoppingBag,
            description: 'Total histórico',
        },
        {
            title: 'Ingresos',
            value: `$${(stats.revenue || 0).toLocaleString()}`,
            icon: DollarSign,
            description: 'Ingresos totales',
        },
        {
            title: 'Estado del Sistema',
            value: 'En Línea',
            icon: Activity,
            description: 'Funcionando correctamente',
        },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                    Resumen general del estado de la tienda (Datos Reales).
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat) => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{loading ? '...' : stat.value}</div>
                            <p className="text-xs text-muted-foreground">
                                {stat.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-1">
                <Card className="bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-900">
                    <CardHeader className="flex flex-row items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
                        <CardTitle className="text-yellow-800 dark:text-yellow-500">Nota del Sistema</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-yellow-700 dark:text-yellow-400">
                            El módulo de pedidos acaba de ser activado. El historial de ventas comienza desde 0 a partir de este momento.
                            Las estadísticas se actualizarán automáticamente con cada nueva compra.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
