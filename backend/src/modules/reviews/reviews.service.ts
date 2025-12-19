import { Injectable, NotFoundException, ForbiddenException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class ReviewsService {
    constructor(
        @InjectRepository(Review)
        private reviewsRepository: Repository<Review>,
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
    ) { }

    private readonly BAD_WORDS = ['mierda', 'puta', 'pendejo', 'estupido', 'idiota', 'basura', 'carajo', 'verga', 'imbecil', 'malparido'];

    private checkProfanity(text: string) {
        const lowerText = text.toLowerCase();
        const foundWord = this.BAD_WORDS.find(word => lowerText.includes(word));
        if (foundWord) {
            throw new BadRequestException('El comentario contiene lenguaje inapropiado.');
        }
    }

    async create(userId: string, createReviewDto: CreateReviewDto): Promise<Review> {
        const { productId, ...reviewData } = createReviewDto;

        // Validar lenguaje
        this.checkProfanity(reviewData.comment);

        // Verificar que el producto existe
        const product = await this.productsRepository.findOne({
            where: { id: productId }
        });

        if (!product) {
            throw new NotFoundException('Producto no encontrado');
        }

        // Verificar si ya existe una reseña del usuario para este producto
        const existingReview = await this.reviewsRepository.findOne({
            where: {
                product: { id: productId },
                user: { id: userId }
            }
        });

        if (existingReview) {
            throw new ConflictException('Ya has publicado una reseña para este producto.');
        }

        // Crear la reseña
        const review = this.reviewsRepository.create({
            ...reviewData,
            user: { id: userId } as any,
            product: { id: productId } as any,
        });

        return await this.reviewsRepository.save(review);
    }

    async findByProduct(productId: string): Promise<Review[]> {
        return await this.reviewsRepository.find({
            where: { product: { id: productId } },
            relations: ['user'],
            order: { createdAt: 'DESC' }
        });
    }

    async getAverageRating(productId: string): Promise<{ average: number; count: number }> {
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

    async update(id: string, userId: string, updateReviewDto: UpdateReviewDto): Promise<Review> {
        const review = await this.reviewsRepository.findOne({
            where: { id },
            relations: ['user']
        });

        if (!review) {
            throw new NotFoundException('Reseña no encontrada');
        }

        // Verificar que el usuario es el autor
        if (review.user.id !== userId) {
            throw new ForbiddenException('No tienes permiso para editar esta reseña');
        }

        if (updateReviewDto.comment) {
            this.checkProfanity(updateReviewDto.comment);
        }

        Object.assign(review, updateReviewDto);
        return await this.reviewsRepository.save(review);
    }

    async delete(id: string, userId: string): Promise<void> {
        const review = await this.reviewsRepository.findOne({
            where: { id },
            relations: ['user']
        });

        if (!review) {
            throw new NotFoundException('Reseña no encontrada');
        }

        // Verificar que el usuario es el autor
        if (review.user.id !== userId) {
            throw new ForbiddenException('No tienes permiso para eliminar esta reseña');
        }

        await this.reviewsRepository.remove(review);
    }

    async findAll(): Promise<Review[]> {
        return await this.reviewsRepository.find({
            relations: ['user', 'product'],
            order: { createdAt: 'DESC' }
        });
    }
}
