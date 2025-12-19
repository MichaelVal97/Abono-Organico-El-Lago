const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

function getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('abono-lago-token');
}

export interface UpdateUserData {
    firstName?: string;
    lastName?: string;
    phone?: string;
    dateOfBirth?: string;
}

export interface UpdatePreferencesData {
    theme?: 'light' | 'dark' | 'system';
    language?: 'es' | 'en';
    emailNotifications?: boolean;
    pushNotifications?: boolean;
    newsletter?: boolean;
}

export interface CreateAddressData {
    type: 'shipping' | 'billing';
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country?: string;
    isDefault?: boolean;
}

export interface Address extends CreateAddressData {
    id: string;
    createdAt: string;
    updatedAt: string;
}

export const usersApi = {
    async getProfile() {
        const token = getAuthToken();
        const response = await fetch(`${API_URL}/users/profile`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Error al obtener perfil');
        }

        return response.json();
    },

    async updateProfile(data: UpdateUserData) {
        const token = getAuthToken();
        const response = await fetch(`${API_URL}/users/profile`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Error al actualizar perfil');
        }

        return response.json();
    },

    async uploadAvatar(file: File) {
        const token = getAuthToken();
        const formData = new FormData();
        formData.append('avatar', file);

        const response = await fetch(`${API_URL}/users/avatar`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Error al subir avatar');
        }

        return response.json();
    },

    async deleteAvatar() {
        const token = getAuthToken();
        const response = await fetch(`${API_URL}/users/avatar`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Error al eliminar avatar');
        }

        return response.json();
    },

    async getPreferences() {
        const token = getAuthToken();
        const response = await fetch(`${API_URL}/users/preferences`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Error al obtener preferencias');
        }

        return response.json();
    },

    async updatePreferences(data: UpdatePreferencesData) {
        const token = getAuthToken();
        const response = await fetch(`${API_URL}/users/preferences`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Error al actualizar preferencias');
        }

        return response.json();
    },

    async getAddresses(): Promise<Address[]> {
        const token = getAuthToken();
        const response = await fetch(`${API_URL}/users/addresses`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Error al obtener direcciones');
        }

        return response.json();
    },

    async createAddress(data: CreateAddressData): Promise<Address> {
        const token = getAuthToken();
        const response = await fetch(`${API_URL}/users/addresses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Error al crear dirección');
        }

        return response.json();
    },

    async updateAddress(id: string, data: Partial<CreateAddressData>): Promise<Address> {
        const token = getAuthToken();
        const response = await fetch(`${API_URL}/users/addresses/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Error al actualizar dirección');
        }

        return response.json();
    },

    async deleteAddress(id: string) {
        const token = getAuthToken();
        const response = await fetch(`${API_URL}/users/addresses/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Error al eliminar dirección');
        }

        return response.json();
    },

    async setDefaultAddress(id: string): Promise<Address> {
        const token = getAuthToken();
        const response = await fetch(`${API_URL}/users/addresses/${id}/default`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Error al marcar dirección como predeterminada');
        }

        return response.json();
    },
    async getAll(): Promise<any[]> {
        const token = getAuthToken();
        const response = await fetch(`${API_URL}/users`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Error al obtener usuarios');
        }

        return response.json();
    },
};
