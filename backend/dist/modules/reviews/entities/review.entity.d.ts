import { User } from '../../auth/entities/user.entity';
import { Product } from '../../products/entities/product.entity';
export declare class Review {
    id: string;
    rating: number;
    comment: string;
    user: User;
    product: Product;
    createdAt: Date;
    updatedAt: Date;
}
