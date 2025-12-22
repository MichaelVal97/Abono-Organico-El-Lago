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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("./entities/product.entity");
let ProductsService = class ProductsService {
    productRepository;
    dataSource;
    constructor(productRepository, dataSource) {
        this.productRepository = productRepository;
        this.dataSource = dataSource;
    }
    async create(createProductDto) {
        const product = this.productRepository.create(createProductDto);
        return await this.productRepository.save(product);
    }
    async findAll() {
        return await this.productRepository.find({
            order: { createdAt: 'ASC' },
        });
    }
    async findOne(id) {
        const product = await this.productRepository.findOne({ where: { id } });
        if (!product) {
            throw new common_1.NotFoundException(`Producto con ID "${id}" no encontrado`);
        }
        return product;
    }
    async update(id, updateProductDto) {
        const product = await this.findOne(id);
        Object.assign(product, updateProductDto);
        return await this.productRepository.save(product);
    }
    async remove(id) {
        const product = await this.findOne(id);
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.query('DELETE FROM "reviews" WHERE "product_id" = $1', [
                id,
            ]);
            await queryRunner.query('DELETE FROM "order_items" WHERE "product_id" = $1', [id]);
            await queryRunner.manager.remove(product);
            await queryRunner.commitTransaction();
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        }
        finally {
            await queryRunner.release();
        }
    }
    async seed() {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.query('DELETE FROM "order_items"');
            await queryRunner.query('DELETE FROM "orders"');
            await queryRunner.query('DELETE FROM "reviews"');
            await queryRunner.query('DELETE FROM "products"');
            await queryRunner.commitTransaction();
        }
        catch (err) {
            console.error('Error clearing database:', err);
            await queryRunner.rollbackTransaction();
            throw err;
        }
        finally {
            await queryRunner.release();
        }
        const seedProducts = [
            {
                name: 'Bulto de 50 kg de compost',
                description: 'Abono orgánico de alta calidad en presentación de 50kg. Ideal para todo tipo de cultivos.',
                price: 25000,
                stock: 100,
                imageUrl: 'https://i.postimg.cc/XVjTxCQq/Whats-App-Image-2025-11-27-at-13-14-22-(2).jpg',
                imageHint: 'bulto abono compost 50kg',
                category: 'ABONOS',
                tags: ['ABONO', 'FERTILIZACIÓN', 'ORGÁNICO', '50KG'],
                priceRange: '1 Bulto - 50Kg',
                images: [
                    'https://i.postimg.cc/XVjTxCQq/Whats-App-Image-2025-11-27-at-13-14-22-(2).jpg',
                    'https://i.postimg.cc/69WDzvYQ/Whats-App-Image-2025-11-27-at-13-14-21.jpg',
                ],
            },
        ];
        const newProducts = this.productRepository.create(seedProducts);
        return await this.productRepository.save(newProducts);
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.DataSource])
], ProductsService);
//# sourceMappingURL=products.service.js.map