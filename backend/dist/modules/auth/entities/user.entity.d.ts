import { UserPreferences } from './user-preferences.entity';
import { UserAddress } from './user-address.entity';
import { Order } from '../../orders/entities/order.entity';
export declare class User {
    id: string;
    email: string;
    password?: string;
    googleId?: string;
    firstName: string;
    lastName: string;
    role: 'user' | 'admin';
    phone?: string;
    dateOfBirth?: Date;
    avatar?: string;
    isActive: boolean;
    isEmailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    preferences: UserPreferences;
    addresses: UserAddress[];
    orders: Order[];
}
