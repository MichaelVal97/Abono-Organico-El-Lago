import ProductForm from '@/components/admin/ProductForm';

export default function NewProductPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Nuevo Producto</h1>
                <p className="text-muted-foreground">
                    Agrega un nuevo producto al catálogo.
                </p>
            </div>

            <ProductForm />
        </div>
    );
}
