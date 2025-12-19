const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl: string;
    imageHint?: string;
    images?: string[];
    category?: string;
    tags?: string[];
    priceRange?: string;
}

export interface CreateProductData {
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl: string;
    imageHint?: string;
    category?: string;
    tags?: string[];
    priceRange?: string;
}

export const productsApi = {
    async getAll(): Promise<Product[]> {
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) throw new Error('Error fetching products');
        return response.json();
    },

    async getOne(id: string): Promise<Product> {
        const response = await fetch(`${API_URL}/products/${id}`);
        if (!response.ok) throw new Error('Error fetching product');
        return response.json();
    },

    async create(data: CreateProductData, token: string): Promise<Product> {
        const response = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Error creating product');
        return response.json();
    },

    async update(id: string, data: Partial<CreateProductData>, token: string): Promise<Product> {
        const response = await fetch(`${API_URL}/products/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Error updating product');
        return response.json();
    },

    async delete(id: string, token: string): Promise<void> {
        const response = await fetch(`${API_URL}/products/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('Error deleting product');
    }
};
