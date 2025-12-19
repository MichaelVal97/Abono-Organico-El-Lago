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
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const review_entity_1 = require("./entities/review.entity");
const product_entity_1 = require("../products/entities/product.entity");
let ReviewsService = class ReviewsService {
    reviewsRepository;
    productsRepository;
    constructor(reviewsRepository, productsRepository) {
        this.reviewsRepository = reviewsRepository;
        this.productsRepository = productsRepository;
    }
    BAD_WORDS = ['mierda', 'puta', 'pendejo', 'estupido', 'idiota', 'basura', 'carajo', 'verga', 'imbecil', 'malparido'];
    checkProfanity(text) {
        const lowerText = text.toLowerCase();
        const foundWord = this.BAD_WORDS.find(word => lowerText.includes(word));
        if (foundWord) {
            throw new common_1.BadRequestException('El comentario contiene lenguaje inapropiado.');
        }
    }
    async create(userId, createReviewDto) {
        const { productId, ...reviewData } = createReviewDto;
        this.checkProfanity(reviewData.comment);
        const product = await this.productsRepository.findOne({
            where: { id: productId }
        });
        if (!product) {
            throw new common_1.NotFoundException('Producto no encontrado');
        }
        const existingReview = await this.reviewsRepository.findOne({
            where: {
                product: { id: productId },
                user: { id: userId }
            }
        });
        if (existingReview) {
            throw new common_1.ConflictException('Ya has publicado una reseña para este producto.');
        }
        const review = this.reviewsRepository.create({
            ...reviewData,
            user: { id: userId },
            product: { id: productId },
        });
        return await this.reviewsRepository.save(review);
    }
    async findByProduct(productId) {
        return await this.reviewsRepository.find({
            where: { product: { id: productId } },
            relations: ['user'],
            order: { createdAt: 'DESC' }
        });
    }
    async getAverageRating(productId) {
        const result = await this.reviewsRepository
            .createQueryBuilder('review')
            .select('AVG(review.rating)', 'average')
            .addSelect('COUNT(review.id)', 'count')
            .where('review.product_id = :productId', { productId })
            .getRawOne();
        return {
            average: parseFloat(result.average) || 0,
            count: parseInt(result.count) || 0
        };
    }
    async update(id, userId, updateReviewDto) {
        const review = await this.reviewsRepository.findOne({
            where: { id },
            relations: ['user']
        });
        if (!review) {
            throw new common_1.NotFoundException('Reseña no encontrada');
        }
        if (review.user.id !== userId) {
            throw new common_1.ForbiddenException('No tienes permiso para editar esta reseña');
        }
        if (updateReviewDto.comment) {
            this.checkProfanity(updateReviewDto.comment);
        }
        Object.assign(review, updateReviewDto);
        return await this.reviewsRepository.save(review);
    }
    async delete(id, userId) {
        const review = await this.reviewsRepository.findOne({
            where: { id },
            relations: ['user']
        });
        if (!review) {
            throw new common_1.NotFoundException('Reseña no encontrada');
        }
        if (review.user.id !== userId) {
            throw new common_1.ForbiddenException('No tienes permiso para eliminar esta reseña');
        }
        await this.reviewsRepository.remove(review);
    }
    async findAll() {
        return await this.reviewsRepository.find({
            relations: ['user', 'product'],
            order: { createdAt: 'DESC' }
        });
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(review_entity_1.Review)),
    __param(1, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map