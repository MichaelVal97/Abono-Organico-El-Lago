import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { User } from '../auth/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { OrderItem } from './entities/order-item.entity';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async create(userId: string, createOrderDto: CreateOrderDto): Promise<Order> {
        const order = new Order();
        order.user = { id: userId } as User;
        order.status = createOrderDto.status || 'pending';
        order.items = [];
        let total = 0;

        for (const itemDto of createOrderDto.items) {
            const product = await this.productRepository.findOne({ where: { id: itemDto.productId } });
            if (!product) {
                throw new NotFoundException(`Product not found: ${itemDto.productId}`);
            }

            const orderItem = new OrderItem();
            orderItem.product = product;
            orderItem.quantity = itemDto.quantity;
            orderItem.price = product.price; // Capture price at time of order

            total += Number(product.price) * itemDto.quantity;
            order.items.push(orderItem);
        }

        order.total = total;

        return await this.orderRepository.save(order);
    }

    async findAll(): Promise<Order[]> {
        return await this.orderRepository.find({
            relations: ['user', 'items', 'items.product'],
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(id: string): Promise<Order> {
        const order = await this.orderRepository.findOne({
            where: { id },
            relations: ['user', 'items', 'items.product'],
        });

        if (!order) {
            throw new NotFoundException(`Order not found: ${id}`);
        }

        return order;
    }

    async findByUser(userId: string): Promise<Order[]> {
        return await this.orderRepository.find({
            where: { user: { id: userId } },
            relations: ['user', 'items', 'items.product'],
            order: { createdAt: 'DESC' },
        });
    }

    async getStats() {
        const totalOrders = await this.orderRepository.count();
        const revenueResult = await this.orderRepository
            .createQueryBuilder('o')
            .select('SUM(o.total)', 'total')
            .getRawOne();

        const revenue = revenueResult && revenueResult.total ? parseFloat(revenueResult.total) : 0;

        // Active users (unique users who placed orders)
        // Active users (unique users who placed orders)
        const activeUsersResult = await this.orderRepository
            .createQueryBuilder('o')
            .select('COUNT(DISTINCT o.user_id)', 'count')
            .getRawOne();

        const activeUsers = activeUsersResult ? parseInt(activeUsersResult.count) : 0;

        // Total registered users
        const totalUsers = await this.userRepository.count();

        return {
            totalOrders,
            revenue,
            activeUsers,
            totalUsers
        };
    }
}
