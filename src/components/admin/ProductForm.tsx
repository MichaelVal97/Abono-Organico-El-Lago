'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { productsApi, Product, CreateProductData } from '@/lib/api/products';
import { useAuth } from '@/context/AuthContext';

const productSchema = z.object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
    price: z.coerce.number().min(0, 'El precio no puede ser negativo'),
    stock: z.coerce.number().int().min(0, 'El stock no puede ser negativo'),
    imageUrl: z.string().url('URL de imagen inválida'),
    category: z.string().min(1, 'Selecciona una categoría'),
    imageHint: z.string().optional(),
    priceRange: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
    initialData?: Product;
    isEditing?: boolean;
}

export default function ProductForm({ initialData, isEditing = false }: ProductFormProps) {
    const router = useRouter();
    const { token } = useAuth();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: initialData?.name || '',
            description: initialData?.description || '',
            price: initialData?.price || 0,
            stock: initialData?.stock || 0,
            imageUrl: initialData?.imageUrl || '',
            category: initialData?.category || 'PLAN DE FERTILIZACIÓN',
            imageHint: initialData?.imageHint || 'product',
            priceRange: initialData?.priceRange || '1 Bulto - 50Kg',
        },
    });

    const onSubmit = async (data: ProductFormValues) => {
        if (!token) {
            toast({ title: 'Error', description: 'No estás autenticado', variant: 'destructive' });
            return;
        }

        try {
            setLoading(true);
            const productData: CreateProductData = {
                ...data,
                tags: ['ABONO', 'FERTILIZACIÓN'], // Default tags for now
            };

            if (isEditing && initialData) {
                await productsApi.update(initialData.id, productData, token);
                toast({ title: 'Producto actualizado', description: 'Los cambios se han guardado correctamente.' });
            } else {
                await productsApi.create(productData, token);
                toast({ title: 'Producto creado', description: 'El nuevo producto ha sido añadido al catálogo.' });
            }

            router.push('/admin/products');
            router.refresh();
        } catch (error) {
            console.error('Error saving product:', error);
            toast({
                title: 'Error',
                description: 'Ocurrió un error al guardar el producto.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl bg-white dark:bg-zinc-900 p-6 rounded-lg border shadow-sm">
                <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem className="col-span-2">
                                <FormLabel>Nombre del Producto</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ej. Abono Orgánico" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Precio ($)</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.01" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="stock"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Stock</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Categoría</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona una categoría" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="PLAN DE FERTILIZACIÓN">Plan de Fertilización</SelectItem>
                                        <SelectItem value="HERRAMIENTAS">Herramientas</SelectItem>
                                        <SelectItem value="OTROS">Otros</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="priceRange"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Presentación / Rango</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ej. 1 Bulto - 50Kg" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => (
                            <FormItem className="col-span-2">
                                <FormLabel>URL de la Imagen</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://..." {...field} />
                                </FormControl>
                                <FormDescription>
                                    Usa una URL pública de imagen.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem className="col-span-2">
                                <FormLabel>Descripción</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Describe el producto..."
                                        className="min-h-[120px]"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-end gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        disabled={loading}
                    >
                        Cancelar
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Guardando...' : isEditing ? 'Actualizar Producto' : 'Crear Producto'}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
