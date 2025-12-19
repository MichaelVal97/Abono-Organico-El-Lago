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
    }
};
