export declare class CreateProductDto {
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl: string;
    imageHint: string;
    category?: string;
    tags?: string[];
    priceRange?: string;
}
