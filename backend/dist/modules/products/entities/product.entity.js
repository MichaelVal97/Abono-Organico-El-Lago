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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
let Product = class Product {
    id;
    name;
    description;
    price;
    stock;
    imageUrl;
    imageHint;
    category;
    tags;
    priceRange;
    createdAt;
    updatedAt;
};
exports.Product = Product;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID único del producto (UUID)',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Product.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre del producto',
        example: 'Estiércol de Vaca',
    }),
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], Product.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Descripción detallada del producto',
        example: 'Estiércol de vaca de alta calidad, perfecto para enriquecer el suelo de su jardín y huerto. 100% orgánico y compostado.',
    }),
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], Product.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Precio del producto en dólares',
        example: 15.99,
    }),
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Product.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Cantidad disponible en inventario',
        example: 100,
    }),
    (0, typeorm_1.Column)('int'),
    __metadata("design:type", Number)
], Product.prototype, "stock", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'URL de la imagen del producto',
        example: 'https://example.com/images/estiercol-vaca.jpg',
    }),
    (0, typeorm_1.Column)({ length: 500 }),
    __metadata("design:type", String)
], Product.prototype, "imageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Hint para generación de imagen con IA',
        example: 'organic cow manure fertilizer bag',
    }),
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], Product.prototype, "imageHint", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Categoría del producto',
        example: 'PLAN DE FERTILIZACIÓN',
    }),
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Etiquetas del producto',
        example: ['ABONO', 'FERTILIZACIÓN', 'SUELOS'],
        type: [String],
    }),
    (0, typeorm_1.Column)('simple-array', { nullable: true }),
    __metadata("design:type", Array)
], Product.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Rango de precio o presentación',
        example: '1 Bulto - 50Kg',
    }),
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "priceRange", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha de creación del registro',
    }),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Product.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha de última actualización del registro',
    }),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Product.prototype, "updatedAt", void 0);
exports.Product = Product = __decorate([
    (0, typeorm_1.Entity)('products')
], Product);
//# sourceMappingURL=product.entity.js.map