import { User } from './user.entity';
export declare enum AddressType {
    SHIPPING = "shipping",
    BILLING = "billing"
}
export declare class UserAddress {
    id: string;
    type: AddressType;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isDefault: boolean;
    createdAt: Date;
    updatedAt: Date;
    user: User;
}
