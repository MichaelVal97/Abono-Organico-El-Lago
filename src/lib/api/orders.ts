const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface OrderStats {
    totalOrders: number;
    revenue: number;
    activeUsers: number;
}

export const ordersApi = {
    async getStats(token: string): Promise<OrderStats> {
        const response = await fetch(`${API_URL}/orders/stats`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Error fetching order stats');
        }

        return response.json();
    },

    async create(token: string, data: any) {
        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error:', errorText);
            throw new Error(`Error creating order: ${errorText}`);
        }

        return response.json();
    },

    async getAll(token: string) {
        const response = await fetch(`${API_URL}/orders`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Error fetching orders');
        }

        return response.json();
    },

    async getMyOrders(token: string) {
        const response = await fetch(`${API_URL}/orders/my-orders`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Error fetching my orders');
        }

        return response.json();
    }
};
