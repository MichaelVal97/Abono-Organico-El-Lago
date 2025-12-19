import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { User } from '../auth/entities/user.entity';
import { Product } from '../products/entities/product.entity';
export declare class OrdersService {
    private readonly orderRepository;
    private readonly productRepository;
    private readonly userRepository;
    constructor(orderRepository: Repository<Order>, productRepository: Repository<Product>, userRepository: Repository<User>);
    create(userId: string, createOrderDto: CreateOrderDto): Promise<Order>;
    findAll(): Promise<Order[]>;
    findOne(id: string): Promise<Order>;
    getStats(): Promise<{
        totalOrders: number;
        revenue: number;
        activeUsers: number;
        totalUsers: number;
    }>;
}
