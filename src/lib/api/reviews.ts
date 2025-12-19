// API client para reseñas
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface Review {
    id: string;
    rating: number;
    comment: string;
    user: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
    product?: {
        id: string;
        name: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface ReviewStats {
    average: number;
    count: number;
}

export interface CreateReviewData {
    rating: number;
    comment: string;
    productId: string;
}

export interface UpdateReviewData {
    rating?: number;
    comment?: string;
}

export const reviewsApi = {
    // Crear una reseña
    async create(data: CreateReviewData, token: string): Promise<Review> {
        const response = await fetch(`${API_URL}/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al crear la reseña');
        }

        return response.json();
    },

    // Obtener todas las reseñas
    async getAll(): Promise<Review[]> {
        const response = await fetch(`${API_URL}/reviews`);

        if (!response.ok) {
            throw new Error('Error al obtener las reseñas');
        }

        return response.json();
    },

    // Obtener reseñas de un producto
    async getByProduct(productId: string): Promise<Review[]> {
        const response = await fetch(`${API_URL}/reviews/product/${productId}`);

        if (!response.ok) {
            throw new Error('Error al obtener las reseñas');
        }

        return response.json();
    },

    // Obtener estadísticas de un producto
    async getStats(productId: string): Promise<ReviewStats> {
        const response = await fetch(`${API_URL}/reviews/product/${productId}/stats`);

        if (!response.ok) {
            throw new Error('Error al obtener las estadísticas');
        }

        return response.json();
    },

    // Actualizar una reseña
    async update(id: string, data: UpdateReviewData, token: string): Promise<Review> {
        const response = await fetch(`${API_URL}/reviews/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al actualizar la reseña');
        }

        return response.json();
    },

    // Eliminar una reseña
    async delete(id: string, token: string): Promise<void> {
        const response = await fetch(`${API_URL}/reviews/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al eliminar la reseña');
        }
    },
};
