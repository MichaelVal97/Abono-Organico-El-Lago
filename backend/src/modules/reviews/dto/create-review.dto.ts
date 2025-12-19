import { IsInt, IsString, IsUUID, Min, Max, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
    @ApiProperty({
        description: 'Rating del producto (1-5 estrellas)',
        minimum: 1,
        maximum: 5,
        example: 5
    })
    @IsInt()
    @Min(1)
    @Max(5)
    rating: number;

    @ApiProperty({
        description: 'Comentario sobre el producto',
        minLength: 10,
        maxLength: 500,
        example: 'Excelente producto, muy buena calidad del compost.'
    })
    @IsString()
    @MinLength(10, { message: 'El comentario debe tener al menos 10 caracteres' })
    @MaxLength(500, { message: 'El comentario no puede exceder 500 caracteres' })
    comment: string;

    @ApiProperty({
        description: 'ID del producto a reseñar',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @IsUUID()
    productId: string;
}
