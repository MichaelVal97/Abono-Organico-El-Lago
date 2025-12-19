import { UsersService } from '../users/users.service';
export declare class AdminController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<{
        id: string;
        email: string;
        googleId?: string;
        firstName: string;
        lastName: string;
        role: "user" | "admin";
        phone?: string;
        dateOfBirth?: Date;
        avatar?: string;
        isActive: boolean;
        isEmailVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
        preferences: import("../auth/entities/user-preferences.entity").UserPreferences;
        addresses: import("../auth/entities/user-address.entity").UserAddress[];
        orders: import("../orders/entities/order.entity").Order[];
    }[]>;
    getStats(): Promise<{
        totalUsers: number;
        activeUsers: number;
    }>;
    changeRole(id: string, role: 'user' | 'admin'): Promise<{
        id: string;
        email: string;
        googleId?: string;
        firstName: string;
        lastName: string;
        role: "user" | "admin";
        phone?: string;
        dateOfBirth?: Date;
        avatar?: string;
        isActive: boolean;
        isEmailVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
        preferences: import("../auth/entities/user-preferences.entity").UserPreferences;
        addresses: import("../auth/entities/user-address.entity").UserAddress[];
        orders: import("../orders/entities/order.entity").Order[];
    }>;
    getOrders(): Promise<{
        id: string;
        userId: string;
        total: number;
        status: string;
        createdAt: string;
    }[]>;
}
