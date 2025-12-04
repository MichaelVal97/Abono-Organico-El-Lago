'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usersApi } from '@/lib/api/users';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, X } from 'lucide-react';

interface ProfileFormProps {
    user: any;
}

export function ProfileForm({ user }: ProfileFormProps) {
    const { refreshUser } = useAuth();
    const [firstName, setFirstName] = useState(user.firstName || '');
    const [lastName, setLastName] = useState(user.lastName || '');
    const [phone, setPhone] = useState(user.phone || '');
    const [dateOfBirth, setDateOfBirth] = useState(user.dateOfBirth || '');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [uploadingAvatar, setUploadingAvatar] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        setLoading(true);

        try {
            await usersApi.updateProfile({
                firstName,
                lastName,
                phone: phone || undefined,
                dateOfBirth: dateOfBirth || undefined,
            });
            await refreshUser();
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err: any) {
            setError(err.message || 'Error al actualizar perfil');
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('La imagen no debe superar 5MB');
            return;
        }

        setUploadingAvatar(true);
        setError('');

        try {
            await usersApi.uploadAvatar(file);
            await refreshUser();
        } catch (err: any) {
            setError(err.message || 'Error al subir avatar');
        } finally {
            setUploadingAvatar(false);
        }
    };

    const handleDeleteAvatar = async () => {
        setUploadingAvatar(true);
        setError('');

        try {
            await usersApi.deleteAvatar();
            await refreshUser();
        } catch (err: any) {
            setError(err.message || 'Error al eliminar avatar');
        } finally {
            setUploadingAvatar(false);
        }
    };

    const getInitials = () => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    };

    const avatarUrl = user.avatar ? `http://localhost:3000${user.avatar}` : undefined;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Información Personal</CardTitle>
                <CardDescription>
                    Actualiza tu información de perfil
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Avatar Section */}
                    <div className="flex items-center gap-6">
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={avatarUrl} alt={`${firstName} ${lastName}`} />
                            <AvatarFallback className="text-2xl">{getInitials()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={uploadingAvatar}
                                    onClick={() => document.getElementById('avatar-upload')?.click()}
                                >
                                    <Upload className="h-4 w-4 mr-2" />
                                    {uploadingAvatar ? 'Subiendo...' : 'Cambiar avatar'}
                                </Button>
                                {user.avatar && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        disabled={uploadingAvatar}
                                        onClick={handleDeleteAvatar}
                                    >
                                        <X className="h-4 w-4 mr-2" />
                                        Eliminar
                                    </Button>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">
                                JPG, PNG o GIF. Máximo 5MB.
                            </p>
                            <input
                                id="avatar-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleAvatarChange}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-50 text-green-600 p-3 rounded-md text-sm">
                            Perfil actualizado exitosamente
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">Nombre</Label>
                            <Input
                                id="firstName"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                disabled={loading}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Apellido</Label>
                            <Input
                                id="lastName"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                disabled={loading}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Correo Electrónico</Label>
                        <Input
                            id="email"
                            type="email"
                            value={user.email}
                            disabled
                            className="bg-muted"
                        />
                        <p className="text-sm text-muted-foreground">
                            El correo electrónico no se puede cambiar
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">Teléfono</Label>
                        <Input
                            id="phone"
                            type="tel"
                            placeholder="+57 300 123 4567"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="dateOfBirth">Fecha de Nacimiento</Label>
                        <Input
                            id="dateOfBirth"
                            type="date"
                            value={dateOfBirth}
                            onChange={(e) => setDateOfBirth(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    <Button type="submit" disabled={loading}>
                        {loading ? 'Guardando...' : 'Guardar Cambios'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
