'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MapPin, Phone, User, Truck, CreditCard } from 'lucide-react';
import DynamicLocationPicker from './DynamicLocationPicker';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/context/CartProvider';
import { useAuth } from '@/context/AuthContext';
import { ordersApi } from '@/lib/api/orders';
import { useRouter } from 'next/navigation';

const checkoutSchema = z.object({
    fullName: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
    phoneNumber: z.string().min(10, 'Número de teléfono inválido'),
    address: z.string().min(5, 'La dirección es requerida'),
    city: z.string().min(3, 'La ciudad es requerida'),
    additionalInfo: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutForm() {
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const { cartItems, cartTotal, clearCart } = useCart();
    const { token } = useAuth();
    const { toast } = useToast();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<CheckoutFormData>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            city: 'Bogotá',
        }
    });

    const [shippingCost, setShippingCost] = useState<number | null>(null);
    const [isFreeShipping, setIsFreeShipping] = useState(false);

    // Fusagasugá Coordinates
    const FUSA_COORDS = { lat: 4.33646, lng: -74.36378 };
    const MAX_FREE_DIST_KM = 10;
    const MIN_FREE_BULK_QTY = 200;

    // Load persisted data on mount
    useEffect(() => {
        const savedData = localStorage.getItem('checkout_form_data');
        const savedLocation = localStorage.getItem('checkout_location');

        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                form.reset(parsed);
            } catch (e) {
                console.error('Error loading form data', e);
            }
        }

        if (savedLocation) {
            try {
                const parsedLoc = JSON.parse(savedLocation);
                setLocation(parsedLoc);
            } catch (e) {
                console.error('Error loading location', e);
            }
        }
    }, []); // Run once to load

    // Update shipping logic when cart or location changes
    useEffect(() => {
        if (location) {
            checkShippingLogic(location.lat, location.lng);
        }
    }, [cartItems, location]);

    // Persist form data on change
    useEffect(() => {
        const subscription = form.watch((value) => {
            localStorage.setItem('checkout_form_data', JSON.stringify(value));
        });
        return () => subscription.unsubscribe();
    }, [form.watch]);

    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371; // Radius of the earth in km
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in km
    };

    const deg2rad = (deg: number) => {
        return deg * (Math.PI / 180);
    };

    const checkShippingLogic = (lat: number, lng: number) => {
        const dist = calculateDistance(lat, lng, FUSA_COORDS.lat, FUSA_COORDS.lng);
        const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

        const isFree = dist <= MAX_FREE_DIST_KM || totalItems > MIN_FREE_BULK_QTY;

        setIsFreeShipping(isFree);
        setShippingCost(isFree ? 0 : null);
        return { isFree, dist, totalItems };
    };

    const handleLocationSelect = (lat: number, lng: number) => {
        const loc = { lat, lng };
        setLocation(loc);
        localStorage.setItem('checkout_location', JSON.stringify(loc));

        const { isFree, dist, totalItems } = checkShippingLogic(lat, lng);

        let message = "Coordenadas registradas.";
        if (isFree) {
            message = totalItems > MIN_FREE_BULK_QTY
                ? "¡Envío GRATIS aplicado por volumen (>200 bultos)!"
                : "¡Estás dentro de la zona de envío GRATIS!";
        } else {
            message = `Ubicación fuera del rango gratuito (${dist.toFixed(1)}km). Te contactaremos para acordar el envío.`;
        }

        toast({
            title: isFree ? "Envío Gratis Aplica" : "Zona Estándar",
            description: message,
            variant: isFree ? "default" : "default",
        });
    };

    const [isSuccess, setIsSuccess] = useState(false);

    // ... existing hooks ...

    const onSubmit = async (data: CheckoutFormData) => {
        if (!location) {
            toast({
                variant: "destructive",
                title: "Ubicación requerida",
                description: "Por favor selecciona tu ubicación exacta en el mapa.",
            });
            return;
        }

        setIsSubmitting(true);

        // If outside free zone -> Redirect to WhatsApp
        if (location && !isFreeShipping) {
            try {
                // Attempt to create order in backend if logged in
                if (token) {
                    const orderData = {
                        items: cartItems.map(item => ({
                            productId: item.product.id,
                            quantity: item.quantity
                        })),
                        status: 'pending_confirmation',
                    };

                    try {
                        await ordersApi.create(token, orderData);
                    } catch (error) {
                        console.error('Error creating order in backend', error);
                        // Continue to WhatsApp even if backend save fails, but warn?
                    }
                }

                const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
                const itemsList = cartItems.map(i => `- ${i.quantity}x ${i.product.name}`).join('\n');
                const message = `Halo! 🌿 Quisiera hacer un pedido (Envío por acordar):\n\n` +
                    `*Cliente:* ${data.fullName}\n` +
                    `*Teléfono:* ${data.phoneNumber}\n` +
                    `*Ciudad:* ${data.city}\n` +
                    `*Dirección:* ${data.address}\n` +
                    `*Ubicación:* https://maps.google.com/?q=${location.lat},${location.lng}\n\n` +
                    `*Pedido:*\n${itemsList}\n\n` +
                    `*Total Items:* ${totalItems}\n` +
                    `*Total:* $${cartTotal.toLocaleString('es-CO')}\n` +
                    (data.additionalInfo ? `*Notas:* ${data.additionalInfo}` : '');

                const encodedMessage = encodeURIComponent(message);
                const whatsappUrl = `https://wa.me/573164160587?text=${encodedMessage}`;

                clearCart();
                localStorage.removeItem('checkout_form_data');
                localStorage.removeItem('checkout_location');

                window.open(whatsappUrl, '_blank');
                setIsSuccess(true); // Show success view

            } catch (error) {
                console.error("Error redirecting to WA", error);
            } finally {
                setIsSubmitting(false);
            }
            return;
        }

        // Standard Order Creation (Internal)
        try {
            if (!token) {
                toast({
                    variant: "destructive",
                    title: "Inicio de sesión requerido",
                    description: "Para completar pedidos estándar, por favor inicia sesión.",
                });
                setIsSubmitting(false);
                return;
            }

            const orderData = {
                items: cartItems.map(item => ({
                    productId: item.product.id,
                    quantity: item.quantity
                })),
                status: 'pending', // Free shipping orders are pending fulfillment
            };

            await ordersApi.create(token, orderData);

            clearCart();
            localStorage.removeItem('checkout_form_data');
            localStorage.removeItem('checkout_location');
            setIsSuccess(true); // Show success view

        } catch (error) {
            console.error('Error submitting order', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Hubo un problema al procesar tu pedido. Inténtalo de nuevo.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-6 animate-fade-in-up">
                <div className="bg-green-100 p-4 rounded-full">
                    <Truck className="h-12 w-12 text-green-600" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-3xl font-bold text-foreground">¡Tu pedido está en trámite!</h2>
                    <p className="text-muted-foreground max-w-md mx-auto text-lg">
                        Hemos recibido tu solicitud. Espera a que un asesor se comunique contigo en los próximos minutos para confirmar detalles.
                    </p>
                </div>
                <div className="pt-4">
                    <Button
                        size="lg"
                        onClick={() => router.push('/')}
                        className="bg-primary hover:bg-primary/90 text-lg px-8"
                    >
                        Seguir Comprando
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="grid lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Truck className="h-5 w-5 text-primary" />
                        Información de Envío
                    </CardTitle>
                    <CardDescription>
                        Ingresa tus datos para coordinar la entrega
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                        <div className="space-y-2">
                            <Label htmlFor="fullName">Nombre Completo</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="fullName"
                                    placeholder="Juan Pérez"
                                    className="pl-9"
                                    {...form.register('fullName')}
                                />
                            </div>
                            {form.formState.errors.fullName && (
                                <p className="text-xs text-destructive">{form.formState.errors.fullName.message}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="phoneNumber">Teléfono / WhatsApp</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="phoneNumber"
                                        placeholder="300 123 4567"
                                        className="pl-9"
                                        {...form.register('phoneNumber')}
                                    />
                                </div>
                                {form.formState.errors.phoneNumber && (
                                    <p className="text-xs text-destructive">{form.formState.errors.phoneNumber.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="city">Ciudad / Municipio</Label>
                                <Input
                                    id="city"
                                    placeholder="Bogotá"
                                    {...form.register('city')}
                                />
                                {form.formState.errors.city && (
                                    <p className="text-xs text-destructive">{form.formState.errors.city.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">Dirección de referencia</Label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="address"
                                    placeholder="Calle 123 # 45-67, Barrio..."
                                    className="pl-9"
                                    {...form.register('address')}
                                />
                            </div>
                            {form.formState.errors.address && (
                                <p className="text-xs text-destructive">{form.formState.errors.address.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="additionalInfo">Información Adicional (Opcional)</Label>
                            <Textarea
                                id="additionalInfo"
                                placeholder="Instrucciones especiales para el conductor (ej. Conjunto cerrado, dejar en portería)"
                                {...form.register('additionalInfo')}
                            />
                        </div>

                        <Button type="submit" className={`w-full text-lg py-6 ${!isFreeShipping && location ? 'bg-green-600 hover:bg-green-700' : ''}`} disabled={isSubmitting}>
                            {isSubmitting ? 'Procesando...' : (
                                <>
                                    {!isFreeShipping && location ? (
                                        <>
                                            <span className="mr-2 text-xl">📱</span>
                                            Acordar Envío por WhatsApp
                                        </>
                                    ) : (
                                        <>
                                            <CreditCard className="mr-2 h-5 w-5" />
                                            Confirmar Pedido
                                        </>
                                    )}
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Map Section */}
            <div className="space-y-6">
                <Card className="h-full flex flex-col">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-primary" />
                            Ubicación Exacta
                        </CardTitle>
                        <CardDescription>
                            Confirma la ubicación exacta en el mapa para asegurar una entrega exitosa.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 p-0 overflow-hidden rounded-b-xl relative min-h-[400px]">
                        <DynamicLocationPicker
                            onLocationSelect={handleLocationSelect}
                            initialLat={4.33646} // Fusagasugá
                            initialLng={-74.36378}
                        />

                        {/* Coords display overlay */}
                        {location && (
                            <div className="absolute top-4 right-4 bg-background/90 backdrop-blur border p-2 rounded text-xs z-[400] font-mono shadow-sm">
                                Lat: {location.lat.toFixed(5)}, Lng: {location.lng.toFixed(5)}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Shipping Info Card */}
            <div className="space-y-6">
                <div className={`p-4 rounded-lg border flex items-center gap-4 transition-colors ${isFreeShipping ? 'bg-green-50 border-green-200' : 'bg-muted/50 border-border'}`}>
                    <div className={`p-2 rounded-full ${isFreeShipping ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                        <Truck className="h-5 w-5" />
                    </div>
                    <div>
                        <p className={`font-bold text-sm ${isFreeShipping ? 'text-green-700' : 'text-foreground'}`}>
                            {location ? (
                                isFreeShipping ? "ENVÍO GRATIS APLICA" : "COSTO DE ENVÍO POR ACORDAR"
                            ) : "Calculadora de Envío"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            {location ? (
                                isFreeShipping
                                    ? "Cumples condiciones: Zona (10km) o Volumen (>200)."
                                    : "Fuera de zona gratuita o pedido bajo volumen."
                            ) : "Selecciona tu ubicación en el mapa para verificar cobertura."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
