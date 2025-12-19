import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Product } from '../products/entities/product.entity';
export declare class ReviewsService {
    private reviewsRepository;
    private productsRepository;
    constructor(reviewsRepository: Repository<Review>, productsRepository: Repository<Product>);
    private readonly BAD_WORDS;
    private checkProfanity;
    create(userId: string, createReviewDto: CreateReviewDto): Promise<Review>;
    findByProduct(productId: string): Promise<Review[]>;
    getAverageRating(productId: string): Promise<{
        average: number;
        count: number;
    }>;
    update(id: string, userId: string, updateReviewDto: UpdateReviewDto): Promise<Review>;
    delete(id: string, userId: string): Promise<void>;
    findAll(): Promise<Review[]>;
}
