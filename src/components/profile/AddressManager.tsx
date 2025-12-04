'use client';

import { useState, useEffect } from 'react';
import { usersApi, type Address, type CreateAddressData } from '@/lib/api/users';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, MapPin, Pencil, Trash2, Star } from 'lucide-react';

export function AddressManager() {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);

    useEffect(() => {
        loadAddresses();
    }, []);

    const loadAddresses = async () => {
        try {
            const data = await usersApi.getAddresses();
            setAddresses(data);
        } catch (err: any) {
            setError(err.message || 'Error al cargar direcciones');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar esta dirección?')) return;

        try {
            await usersApi.deleteAddress(id);
            await loadAddresses();
        } catch (err: any) {
            setError(err.message || 'Error al eliminar dirección');
        }
    };

    const handleSetDefault = async (id: string) => {
        try {
            await usersApi.setDefaultAddress(id);
            await loadAddresses();
        } catch (err: any) {
            setError(err.message || 'Error al marcar como predeterminada');
        }
    };

    const handleEdit = (address: Address) => {
        setEditingAddress(address);
        setDialogOpen(true);
    };

    const handleAddNew = () => {
        setEditingAddress(null);
        setDialogOpen(true);
    };

    if (loading) {
        return (
            <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Cargando direcciones...</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                    {error}
                </div>
            )}

            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold">Mis Direcciones</h3>
                    <p className="text-sm text-muted-foreground">
                        Gestiona tus direcciones de envío y facturación
                    </p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={handleAddNew}>
                            <Plus className="h-4 w-4 mr-2" />
                            Nueva Dirección
                        </Button>
                    </DialogTrigger>
                    <AddressDialog
                        address={editingAddress}
                        onSave={async () => {
                            setDialogOpen(false);
                            await loadAddresses();
                        }}
                        onCancel={() => setDialogOpen(false)}
                    />
                </Dialog>
            </div>

            {addresses.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">
                            No tienes direcciones guardadas
                        </p>
                        <Button className="mt-4" onClick={handleAddNew}>
                            Agregar primera dirección
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {addresses.map((address) => (
                        <Card key={address.id} className={address.isDefault ? 'border-primary' : ''}>
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-2">
                                        <CardTitle className="text-base">
                                            {address.type === 'shipping' ? 'Envío' : 'Facturación'}
                                        </CardTitle>
                                        {address.isDefault && (
                                            <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                                                <Star className="h-3 w-3 fill-current" />
                                                Predeterminada
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleEdit(address)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(address.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm">{address.street}</p>
                                <p className="text-sm">
                                    {address.city}, {address.state} {address.zipCode}
                                </p>
                                <p className="text-sm">{address.country}</p>
                                {!address.isDefault && (
                                    <Button
                                        variant="link"
                                        size="sm"
                                        className="mt-2 p-0 h-auto"
                                        onClick={() => handleSetDefault(address.id)}
                                    >
                                        Marcar como predeterminada
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

interface AddressDialogProps {
    address: Address | null;
    onSave: () => void;
    onCancel: () => void;
}

function AddressDialog({ address, onSave, onCancel }: AddressDialogProps) {
    const [type, setType] = useState<'shipping' | 'billing'>(address?.type || 'shipping');
    const [street, setStreet] = useState(address?.street || '');
    const [city, setCity] = useState(address?.city || '');
    const [state, setState] = useState(address?.state || '');
    const [zipCode, setZipCode] = useState(address?.zipCode || '');
    const [country, setCountry] = useState(address?.country || 'Colombia');
    const [isDefault, setIsDefault] = useState(address?.isDefault || false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data: CreateAddressData = {
                type,
                street,
                city,
                state,
                zipCode,
                country,
                isDefault,
            };

            if (address) {
                await usersApi.updateAddress(address.id, data);
            } else {
                await usersApi.createAddress(data);
            }

            onSave();
        } catch (err: any) {
            setError(err.message || 'Error al guardar dirección');
        } finally {
            setLoading(false);
        }
    };

    return (
        <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
                <DialogTitle>
                    {address ? 'Editar Dirección' : 'Nueva Dirección'}
                </DialogTitle>
                <DialogDescription>
                    {address
                        ? 'Actualiza los datos de tu dirección'
                        : 'Agrega una nueva dirección de envío o facturación'}
                </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                        {error}
                    </div>
                )}

                <div className="space-y-2">
                    <Label>Tipo de dirección</Label>
                    <RadioGroup value={type} onValueChange={(v: any) => setType(v)} disabled={loading}>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="shipping" id="shipping" />
                            <Label htmlFor="shipping" className="font-normal cursor-pointer">
                                Envío
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="billing" id="billing" />
                            <Label htmlFor="billing" className="font-normal cursor-pointer">
                                Facturación
                            </Label>
                        </div>
                    </RadioGroup>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="street">Dirección</Label>
                    <Input
                        id="street"
                        placeholder="Calle 123 #45-67"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        disabled={loading}
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="city">Ciudad</Label>
                        <Input
                            id="city"
                            placeholder="Bogotá"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            disabled={loading}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="state">Departamento</Label>
                        <Input
                            id="state"
                            placeholder="Cundinamarca"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            disabled={loading}
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="zipCode">Código Postal</Label>
                        <Input
                            id="zipCode"
                            placeholder="110111"
                            value={zipCode}
                            onChange={(e) => setZipCode(e.target.value)}
                            disabled={loading}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="country">País</Label>
                        <Input
                            id="country"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            disabled={loading}
                            required
                        />
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="isDefault"
                        checked={isDefault}
                        onChange={(e) => setIsDefault(e.target.checked)}
                        disabled={loading}
                        className="rounded border-gray-300"
                    />
                    <Label htmlFor="isDefault" className="font-normal cursor-pointer">
                        Marcar como dirección predeterminada
                    </Label>
                </div>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                        Cancelar
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Guardando...' : 'Guardar'}
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    );
}
