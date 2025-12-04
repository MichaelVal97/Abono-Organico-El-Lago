import { AddressType } from '../entities/user-address.entity';
export declare class CreateAddressDto {
    type: AddressType;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country?: string;
    isDefault?: boolean;
}
