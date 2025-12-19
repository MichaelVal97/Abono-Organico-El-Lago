import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('products')
export class Product {
    @ApiProperty({
        description: 'ID único del producto (UUID)',
        example: '550e8400-e29b-41d4-a716-446655440000',
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        description: 'Nombre del producto',
        example: 'Estiércol de Vaca',
    })
    @Column({ length: 255 })
    name: string;

    @ApiProperty({
        description: 'Descripción detallada del producto',
        example:
            'Estiércol de vaca de alta calidad, perfecto para enriquecer el suelo de su jardín y huerto. 100% orgánico y compostado.',
    })
    @Column('text')
    description: string;

    @ApiProperty({
        description: 'Precio del producto en dólares',
        example: 15.99,
    })
    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @ApiProperty({
        description: 'Cantidad disponible en inventario',
        example: 100,
    })
    @Column('int')
    stock: number;

    @ApiProperty({
        description: 'URL de la imagen del producto',
        example: 'https://example.com/images/estiercol-vaca.jpg',
    })
    @Column({ length: 500 })
    imageUrl: string;

    @ApiProperty({
        description: 'Hint para generación de imagen con IA',
        example: 'organic cow manure fertilizer bag',
    })
    @Column({ length: 255 })
    imageHint: string;

    @ApiProperty({
        description: 'Galería de imágenes adicionales',
        example: ['url1.jpg', 'url2.jpg'],
        type: [String],
    })
    @Column('simple-array', { nullable: true })
    images: string[];

    @ApiProperty({
        description: 'Categoría del producto',
        example: 'PLAN DE FERTILIZACIÓN',
    })
    @Column({ length: 100, nullable: true })
    category: string;

    @ApiProperty({
        description: 'Etiquetas del producto',
        example: ['ABONO', 'FERTILIZACIÓN', 'SUELOS'],
        type: [String],
    })
    @Column('simple-array', { nullable: true })
    tags: string[];

    @ApiProperty({
        description: 'Rango de precio o presentación',
        example: '1 Bulto - 50Kg',
    })
    @Column({ length: 100, nullable: true })
    priceRange: string;

    @OneToMany('Review', 'product')
    reviews: any[];

    @ApiProperty({
        description: 'Fecha de creación del registro',
    })
    @CreateDateColumn()
    createdAt: Date;

    @ApiProperty({
        description: 'Fecha de última actualización del registro',
    })
    @UpdateDateColumn()
    updatedAt: Date;
}
