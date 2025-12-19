import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    create(req: any, createReviewDto: CreateReviewDto): Promise<import("./entities/review.entity").Review>;
    findByProduct(productId: string): Promise<import("./entities/review.entity").Review[]>;
    getStats(productId: string): Promise<{
        average: number;
        count: number;
    }>;
    findAll(): Promise<import("./entities/review.entity").Review[]>;
    update(id: string, req: any, updateReviewDto: UpdateReviewDto): Promise<import("./entities/review.entity").Review>;
    delete(id: string, req: any): Promise<void>;
}
