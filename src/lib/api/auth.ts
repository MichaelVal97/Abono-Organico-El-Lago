const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface RegisterData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface AuthResponse {
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phone?: string;
        dateOfBirth?: string;
        avatar?: string;
        isActive: boolean;
        isEmailVerified: boolean;
        createdAt: string;
        updatedAt: string;
        preferences: {
            id: string;
            theme: 'light' | 'dark' | 'system';
            language: 'es' | 'en';
            emailNotifications: boolean;
            pushNotifications: boolean;
            newsletter: boolean;
        };
    };
    token: string;
}

export const authApi = {
    async register(data: RegisterData): Promise<AuthResponse> {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al registrar usuario');
        }

        return response.json();
    },

    async login(data: LoginData): Promise<AuthResponse> {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Credenciales inválidas');
        }

        return response.json();
    },
};
