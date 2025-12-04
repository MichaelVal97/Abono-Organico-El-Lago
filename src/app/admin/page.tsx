'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, ShoppingBag, DollarSign, Activity } from 'lucide-react';
import { api } from '@/lib/api';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        totalOrders: 0,
        revenue: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // En una aplicación real, esto sería una sola llamada a la API
                // Por ahora simularemos algunos datos o obtendremos lo que podamos
                // const data = await api.admin.getStats();

                // Datos simulados por ahora hasta que el endpoint del backend esté completamente listo
                setStats({
                    totalUsers: 150,
                    activeUsers: 120,
                    totalOrders: 45,
                    revenue: 12500,
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const statCards = [
        {
            title: 'Usuarios Totales',
            value: stats.totalUsers,
            icon: Users,
            description: `${stats.activeUsers} activos actualmente`,
        },
        {
            title: 'Pedidos',
            value: stats.totalOrders,
            icon: ShoppingBag,
            description: '+12% respecto al mes pasado',
        },
        {
            title: 'Ingresos',
            value: `$${stats.revenue.toLocaleString()}`,
            icon: DollarSign,
            description: '+8% respecto al mes pasado',
        },
        {
            title: 'Actividad',
            value: '+573',
            icon: Activity,
            description: '+201 desde la última hora',
        },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                    Resumen general del estado de la tienda.
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

            {/* Actividad reciente o gráficos podrían ir aquí */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Resumen de Ventas</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                            Gráfico de ventas (Próximamente)
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Actividad Reciente</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            <div className="flex items-center">
                                <div className="ml-4 space-y-1">
                                    <p className="text-sm font-medium leading-none">
                                        Nuevo usuario registrado
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        hace 5 minutos
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="ml-4 space-y-1">
                                    <p className="text-sm font-medium leading-none">
                                        Pedido #1234 completado
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        hace 15 minutos
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
