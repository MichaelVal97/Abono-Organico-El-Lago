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
    constructor(productRepository) {
        this.productRepository = productRepository;
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
        await this.productRepository.remove(product);
    }
    async seed() {
        const count = await this.productRepository.count();
        if (count > 0) {
            throw new Error('Ya existen productos en la base de datos. No se puede ejecutar seed.');
        }
        const seedProducts = [
            {
                name: 'Estiércol de Vaca',
                description: 'Estiércol de vaca de alta calidad, perfecto para enriquecer el suelo de su jardín y huerto. 100% orgánico y compostado.',
                price: 15.99,
                stock: 100,
                imageUrl: 'https://picsum.photos/seed/estiercol-vaca/400/400',
                imageHint: 'organic cow manure fertilizer in a burlap sack',
                category: 'PLAN DE FERTILIZACIÓN',
                tags: ['ABONO', 'FERTILIZACIÓN', 'SUELOS'],
                priceRange: '1 Bulto - 50Kg',
            },
            {
                name: 'Estiércol de Caballo',
                description: 'Potente estiércol de caballo, ideal para plantas que requieren un alto contenido de nitrógeno. Cuidadosamente seleccionado.',
                price: 18.5,
                stock: 75,
                imageUrl: 'https://picsum.photos/seed/estiercol-caballo/400/400',
                imageHint: 'horse manure fertilizer organic farming',
                category: 'PLAN DE FERTILIZACIÓN',
                tags: ['ABONO', 'FERTILIZACIÓN', 'NITRÓGENO'],
                priceRange: '1 Bulto - 50Kg',
            },
            {
                name: 'Estiércol de Gallina (Gallinaza)',
                description: 'Gallinaza rica en nutrientes, una opción excelente para acelerar el crecimiento de sus cultivos. Olor controlado.',
                price: 12.0,
                stock: 120,
                imageUrl: 'https://picsum.photos/seed/estiercol-gallina/400/400',
                imageHint: 'chicken manure fertilizer poultry compost',
                category: 'PLAN DE FERTILIZACIÓN',
                tags: ['ABONO', 'FERTILIZACIÓN', 'CULTIVOS'],
                priceRange: '1 Bulto - 50Kg',
            },
            {
                name: 'Humus de Lombriz',
                description: 'El "oro negro" de la jardinería. Humus de lombriz puro para una fertilización natural y efectiva, mejorando la estructura del suelo.',
                price: 25.0,
                stock: 50,
                imageUrl: 'https://picsum.photos/seed/humus-lombriz/400/400',
                imageHint: 'worm castings vermicompost humus organic',
                category: 'PLAN DE FERTILIZACIÓN',
                tags: ['ABONO', 'HUMUS', 'ORGÁNICO'],
                priceRange: '1 Bulto - 50Kg',
            },
            {
                name: 'Compost Orgánico Premium',
                description: 'Mezcla de compost premium, balanceado para todo tipo de plantas. Enriquece la vida microbiana de tu tierra.',
                price: 20.0,
                stock: 80,
                imageUrl: 'https://picsum.photos/seed/compost-organico/400/400',
                imageHint: 'premium organic compost soil amendment',
                category: 'PLAN DE FERTILIZACIÓN',
                tags: ['COMPOST', 'FERTILIZACIÓN', 'PREMIUM'],
                priceRange: '1 Bulto - 50Kg',
            },
        ];
        const products = this.productRepository.create(seedProducts);
        return await this.productRepository.save(products);
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ProductsService);
//# sourceMappingURL=products.service.js.map