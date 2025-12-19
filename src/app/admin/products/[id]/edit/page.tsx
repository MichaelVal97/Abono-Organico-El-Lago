'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import ProductForm from '@/components/admin/ProductForm';
import { productsApi, Product } from '@/lib/api/products';
import { useToast } from '@/hooks/use-toast';

export default function EditProductPage() {
    const params = useParams();
    const { toast } = useToast();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                if (typeof params.id !== 'string') return;
                const data = await productsApi.getOne(params.id);
                setProduct(data);
            } catch (error) {
                console.error('Error fetching product:', error);
                toast({
                    title: 'Error',
                    description: 'No se pudo cargar el producto para editar.',
                    variant: 'destructive',
                });
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [params.id, toast]);

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (!product) {
        return <div>Producto no encontrado</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Editar Producto</h1>
                <p className="text-muted-foreground">
                    Modifica los detalles del producto {product.name}.
                </p>
            </div>

            <ProductForm initialData={product} isEditing />
        </div>
    );
}
