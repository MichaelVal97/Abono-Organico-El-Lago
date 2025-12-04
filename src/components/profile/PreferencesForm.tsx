'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usersApi } from '@/lib/api/users';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';

interface PreferencesFormProps {
    user: any;
}

export function PreferencesForm({ user }: PreferencesFormProps) {
    const { refreshUser } = useAuth();
    const [theme, setTheme] = useState(user.preferences?.theme || 'system');
    const [language, setLanguage] = useState(user.preferences?.language || 'es');
    const [emailNotifications, setEmailNotifications] = useState(
        user.preferences?.emailNotifications ?? true
    );
    const [pushNotifications, setPushNotifications] = useState(
        user.preferences?.pushNotifications ?? true
    );
    const [newsletter, setNewsletter] = useState(user.preferences?.newsletter ?? false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        setLoading(true);

        try {
            await usersApi.updatePreferences({
                theme,
                language,
                emailNotifications,
                pushNotifications,
                newsletter,
            });
            await refreshUser();
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err: any) {
            setError(err.message || 'Error al actualizar preferencias');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Preferencias</CardTitle>
                <CardDescription>
                    Personaliza tu experiencia en la plataforma
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-50 text-green-600 p-3 rounded-md text-sm">
                            Preferencias actualizadas exitosamente
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <Label className="text-base">Tema</Label>
                            <p className="text-sm text-muted-foreground mb-3">
                                Selecciona el tema de la interfaz
                            </p>
                            <RadioGroup value={theme} onValueChange={setTheme} disabled={loading}>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="light" id="light" />
                                    <Label htmlFor="light" className="font-normal cursor-pointer">
                                        Claro
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="dark" id="dark" />
                                    <Label htmlFor="dark" className="font-normal cursor-pointer">
                                        Oscuro
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="system" id="system" />
                                    <Label htmlFor="system" className="font-normal cursor-pointer">
                                        Sistema
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>

                        <div>
                            <Label className="text-base">Idioma</Label>
                            <p className="text-sm text-muted-foreground mb-3">
                                Selecciona tu idioma preferido
                            </p>
                            <RadioGroup value={language} onValueChange={setLanguage} disabled={loading}>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="es" id="es" />
                                    <Label htmlFor="es" className="font-normal cursor-pointer">
                                        Español
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="en" id="en" />
                                    <Label htmlFor="en" className="font-normal cursor-pointer">
                                        English
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>
                    </div>

                    <div className="border-t pt-6">
                        <Label className="text-base">Notificaciones</Label>
                        <p className="text-sm text-muted-foreground mb-4">
                            Gestiona cómo quieres recibir notificaciones
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="emailNotifications" className="font-normal">
                                        Notificaciones por correo
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        Recibe actualizaciones por correo electrónico
                                    </p>
                                </div>
                                <Switch
                                    id="emailNotifications"
                                    checked={emailNotifications}
                                    onCheckedChange={setEmailNotifications}
                                    disabled={loading}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="pushNotifications" className="font-normal">
                                        Notificaciones push
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        Recibe notificaciones en tu navegador
                                    </p>
                                </div>
                                <Switch
                                    id="pushNotifications"
                                    checked={pushNotifications}
                                    onCheckedChange={setPushNotifications}
                                    disabled={loading}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="newsletter" className="font-normal">
                                        Newsletter
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        Recibe noticias y ofertas especiales
                                    </p>
                                </div>
                                <Switch
                                    id="newsletter"
                                    checked={newsletter}
                                    onCheckedChange={setNewsletter}
                                    disabled={loading}
                                />
                            </div>
                        </div>
                    </div>

                    <Button type="submit" disabled={loading}>
                        {loading ? 'Guardando...' : 'Guardar Preferencias'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
