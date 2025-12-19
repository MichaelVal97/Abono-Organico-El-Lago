import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(req: any, createOrderDto: CreateOrderDto): Promise<import("./entities/order.entity").Order>;
    findAll(): Promise<import("./entities/order.entity").Order[]>;
    getStats(): Promise<{
        totalOrders: number;
        revenue: number;
        activeUsers: number;
        totalUsers: number;
    }>;
    findOne(id: string): Promise<import("./entities/order.entity").Order>;
}
