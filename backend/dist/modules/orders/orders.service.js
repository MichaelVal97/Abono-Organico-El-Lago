"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("./entities/order.entity");
const user_entity_1 = require("../auth/entities/user.entity");
const product_entity_1 = require("../products/entities/product.entity");
const order_item_entity_1 = require("./entities/order-item.entity");
let OrdersService = class OrdersService {
    orderRepository;
    productRepository;
    userRepository;
    constructor(orderRepository, productRepository, userRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }
    async create(userId, createOrderDto) {
        const order = new order_entity_1.Order();
        order.user = { id: userId };
        order.status = createOrderDto.status || 'pending';
        order.items = [];
        let total = 0;
        for (const itemDto of createOrderDto.items) {
            const product = await this.productRepository.findOne({
                where: { id: itemDto.productId },
            });
            if (!product) {
                throw new common_1.NotFoundException(`Product not found: ${itemDto.productId}`);
            }
            const orderItem = new order_item_entity_1.OrderItem();
            orderItem.product = product;
            orderItem.quantity = itemDto.quantity;
            orderItem.price = product.price;
            total += Number(product.price) * itemDto.quantity;
            order.items.push(orderItem);
        }
        order.total = total;
        return await this.orderRepository.save(order);
    }
    async findAll() {
        return await this.orderRepository.find({
            relations: ['user', 'items', 'items.product'],
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const order = await this.orderRepository.findOne({
            where: { id },
            relations: ['user', 'items', 'items.product'],
        });
        if (!order) {
            throw new common_1.NotFoundException(`Order not found: ${id}`);
        }
        return order;
    }
    async findByUser(userId) {
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
        const revenue = revenueResult && revenueResult.total
            ? parseFloat(revenueResult.total)
            : 0;
        const activeUsersResult = await this.orderRepository
            .createQueryBuilder('o')
            .select('COUNT(DISTINCT o.user_id)', 'count')
            .getRawOne();
        const activeUsers = activeUsersResult
            ? parseInt(activeUsersResult.count)
            : 0;
        const totalUsers = await this.userRepository.count();
        return {
            totalOrders,
            revenue,
            activeUsers,
            totalUsers,
        };
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], OrdersService);
//# sourceMappingURL=orders.service.js.map