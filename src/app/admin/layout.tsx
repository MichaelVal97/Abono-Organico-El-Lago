'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
    LayoutDashboard,
    Users,
    ShoppingBag,
    Settings,
    LogOut,
    Menu
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { logout } = useAuth();

    const routes = [
        {
            href: '/admin',
            label: 'Dashboard',
            icon: LayoutDashboard,
            active: pathname === '/admin',
        },
        {
            href: '/admin/users',
            label: 'Usuarios',
            icon: Users,
            active: pathname === '/admin/users',
        },
        {
            href: '/admin/products',
            label: 'Productos',
            icon: ShoppingBag,
            active: pathname === '/admin/products',
        },
        {
            href: '/admin/orders',
            label: 'Pedidos',
            icon: ShoppingBag,
            active: pathname === '/admin/orders',
        },
        {
            href: '/admin/settings',
            label: 'Configuración',
            icon: Settings,
            active: pathname === '/admin/settings',
        },
    ];

    return (
        <div className="flex min-h-screen flex-col md:flex-row">
            {/* Mobile Sidebar */}
            <div className="md:hidden border-b p-4 flex items-center justify-between">
                <span className="font-bold text-lg">Admin Panel</span>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-64 p-0">
                        <div className="flex flex-col h-full">
                            <div className="p-6 border-b">
                                <h2 className="text-xl font-bold">Admin Panel</h2>
                            </div>
                            <nav className="flex-1 p-4 space-y-2">
                                {routes.map((route) => (
                                    <Link
                                        key={route.href}
                                        href={route.href}
                                        className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${route.active
                                            ? 'bg-primary text-primary-foreground'
                                            : 'hover:bg-muted'
                                            }`}
                                    >
                                        <route.icon className="h-5 w-5" />
                                        {route.label}
                                    </Link>
                                ))}
                            </nav>
                            <div className="p-4 border-t">
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50"
                                    onClick={logout}
                                >
                                    <LogOut className="h-5 w-5" />
                                    Cerrar Sesión
                                </Button>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-64 flex-col border-r bg-muted/10 min-h-screen">
                <div className="p-6 border-b">
                    <h2 className="text-xl font-bold">Admin Panel</h2>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${route.active
                                ? 'bg-primary text-primary-foreground'
                                : 'hover:bg-muted'
                                }`}
                        >
                            <route.icon className="h-5 w-5" />
                            {route.label}
                        </Link>
                    ))}
                </nav>
                <div className="p-4 border-t">
                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={logout}
                    >
                        <LogOut className="h-5 w-5" />
                        Cerrar Sesión
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
