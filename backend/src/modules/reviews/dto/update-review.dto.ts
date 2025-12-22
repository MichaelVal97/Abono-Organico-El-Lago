import { PartialType } from '@nestjs/swagger';
import { CreateReviewDto } from './create-review.dto';
import {
  IsInt,
  IsString,
  Min,
  Max,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateReviewDto {
  @ApiPropertyOptional({
    description: 'Rating del producto (1-5 estrellas)',
    minimum: 1,
    maximum: 5,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;

  @ApiPropertyOptional({
    description: 'Comentario sobre el producto',
    minLength: 10,
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(500)
  comment?: string;
}
