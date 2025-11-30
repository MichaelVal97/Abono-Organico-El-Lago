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
exports.ProductsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const products_service_1 = require("./products.service");
const create_product_dto_1 = require("./dto/create-product.dto");
const update_product_dto_1 = require("./dto/update-product.dto");
const product_entity_1 = require("./entities/product.entity");
let ProductsController = class ProductsController {
    productsService;
    constructor(productsService) {
        this.productsService = productsService;
    }
    create(createProductDto) {
        return this.productsService.create(createProductDto);
    }
    findAll() {
        return this.productsService.findAll();
    }
    findOne(id) {
        return this.productsService.findOne(id);
    }
    update(id, updateProductDto) {
        return this.productsService.update(id, updateProductDto);
    }
    async remove(id) {
        return this.productsService.remove(id);
    }
    seed() {
        return this.productsService.seed();
    }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear un nuevo producto' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Producto creado exitosamente',
        type: product_entity_1.Product,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos inválidos' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_product_dto_1.CreateProductDto]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todos los productos' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de productos',
        type: [product_entity_1.Product],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener un producto por ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID del producto' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Producto encontrado',
        type: product_entity_1.Product,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Producto no encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar un producto' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID del producto' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Producto actualizado exitosamente',
        type: product_entity_1.Product,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Producto no encontrado' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos inválidos' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_product_dto_1.UpdateProductDto]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar un producto' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID del producto' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Producto eliminado exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Producto no encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('seed'),
    (0, swagger_1.ApiOperation)({
        summary: 'Poblar base de datos con productos iniciales',
        description: 'Crea los 5 productos iniciales del catálogo. Solo funciona si la base de datos está vacía.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Productos iniciales creados exitosamente',
        type: [product_entity_1.Product],
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Ya existen productos en la base de datos',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "seed", null);
exports.ProductsController = ProductsController = __decorate([
    (0, swagger_1.ApiTags)('products'),
    (0, common_1.Controller)('products'),
    __metadata("design:paramtypes", [products_service_1.ProductsService])
], ProductsController);
//# sourceMappingURL=products.controller.js.map