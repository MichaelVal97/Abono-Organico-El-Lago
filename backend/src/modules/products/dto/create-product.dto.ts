import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsInt,
  IsUrl,
  IsOptional,
  IsArray,
  Min,
  MaxLength,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'Nombre del producto',
    example: 'Estiércol de Vaca',
    maxLength: 255,
  })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    description: 'Descripción detallada del producto',
    example:
      'Estiércol de vaca de alta calidad, perfecto para enriquecer el suelo.',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Precio del producto en dólares',
    example: 15.99,
    minimum: 0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'Cantidad disponible en inventario',
    example: 100,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  stock: number;

  @ApiProperty({
    description: 'URL de la imagen del producto',
    example: 'https://example.com/images/estiercol-vaca.jpg',
  })
  @IsUrl()
  @MaxLength(500)
  imageUrl: string;

  @ApiProperty({
    description: 'Hint para generación de imagen con IA',
    example: 'organic cow manure fertilizer bag',
    maxLength: 255,
  })
  @IsString()
  @MaxLength(255)
  imageHint: string;

  @ApiProperty({
    description: 'Galería de imágenes adicionales',
    example: ['url1.jpg', 'url2.jpg'],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiProperty({
    description: 'Categoría del producto',
    example: 'PLAN DE FERTILIZACIÓN',
    required: false,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;

  @ApiProperty({
    description: 'Etiquetas del producto',
    example: ['ABONO', 'FERTILIZACIÓN', 'SUELOS'],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({
    description: 'Rango de precio o presentación',
    example: '1 Bulto - 50Kg',
    required: false,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  priceRange?: string;
}
