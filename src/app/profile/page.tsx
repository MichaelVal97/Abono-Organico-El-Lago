'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { PreferencesForm } from '@/components/profile/PreferencesForm';
import { AddressManager } from '@/components/profile/AddressManager';

export default function ProfilePage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
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
                <h1 className="text-3xl font-bold mb-2">Mi Perfil</h1>
                <p className="text-muted-foreground mb-8">
                    Gestiona tu información personal, preferencias y direcciones
                </p>

                <Tabs defaultValue="profile" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="profile">Perfil</TabsTrigger>
                        <TabsTrigger value="preferences">Preferencias</TabsTrigger>
                        <TabsTrigger value="addresses">Direcciones</TabsTrigger>
                    </TabsList>

                    <TabsContent value="profile" className="mt-6">
                        <ProfileForm user={user} />
                    </TabsContent>

                    <TabsContent value="preferences" className="mt-6">
                        <PreferencesForm user={user} />
                    </TabsContent>

                    <TabsContent value="addresses" className="mt-6">
                        <AddressManager />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
