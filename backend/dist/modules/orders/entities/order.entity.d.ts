import { User } from '../../auth/entities/user.entity';
import { OrderItem } from './order-item.entity';
export declare class Order {
    id: string;
    user: User;
    items: OrderItem[];
    total: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
