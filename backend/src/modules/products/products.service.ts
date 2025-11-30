import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
    ) { }

    async create(createProductDto: CreateProductDto): Promise<Product> {
        const product = this.productRepository.create(createProductDto);
        return await this.productRepository.save(product);
    }

    async findAll(): Promise<Product[]> {
        return await this.productRepository.find({
            order: { createdAt: 'ASC' },
        });
    }

    async findOne(id: string): Promise<Product> {
        const product = await this.productRepository.findOne({ where: { id } });
        if (!product) {
            throw new NotFoundException(`Producto con ID "${id}" no encontrado`);
        }
        return product;
    }

    async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
        const product = await this.findOne(id);
        Object.assign(product, updateProductDto);
        return await this.productRepository.save(product);
    }

    async remove(id: string): Promise<void> {
        const product = await this.findOne(id);
        await this.productRepository.remove(product);
    }

    /**
     * Seed inicial de productos basado en los datos del frontend
     */
    async seed(): Promise<Product[]> {
        // Verificar si ya existen productos
        const count = await this.productRepository.count();
        if (count > 0) {
            throw new Error('Ya existen productos en la base de datos. No se puede ejecutar seed.');
        }

        const seedProducts: CreateProductDto[] = [
            {
                name: 'Estiércol de Vaca',
                description:
                    'Estiércol de vaca de alta calidad, perfecto para enriquecer el suelo de su jardín y huerto. 100% orgánico y compostado.',
                price: 15.99,
                stock: 100,
                imageUrl: 'https://picsum.photos/seed/estiercol-vaca/400/400',
                imageHint: 'organic cow manure fertilizer in a burlap sack',
                category: 'PLAN DE FERTILIZACIÓN',
                tags: ['ABONO', 'FERTILIZACIÓN', 'SUELOS'],
                priceRange: '1 Bulto - 50Kg',
            },
            {
                name: 'Estiércol de Caballo',
                description:
                    'Potente estiércol de caballo, ideal para plantas que requieren un alto contenido de nitrógeno. Cuidadosamente seleccionado.',
                price: 18.5,
                stock: 75,
                imageUrl: 'https://picsum.photos/seed/estiercol-caballo/400/400',
                imageHint: 'horse manure fertilizer organic farming',
                category: 'PLAN DE FERTILIZACIÓN',
                tags: ['ABONO', 'FERTILIZACIÓN', 'NITRÓGENO'],
                priceRange: '1 Bulto - 50Kg',
            },
            {
                name: 'Estiércol de Gallina (Gallinaza)',
                description:
                    'Gallinaza rica en nutrientes, una opción excelente para acelerar el crecimiento de sus cultivos. Olor controlado.',
                price: 12.0,
                stock: 120,
                imageUrl: 'https://picsum.photos/seed/estiercol-gallina/400/400',
                imageHint: 'chicken manure fertilizer poultry compost',
                category: 'PLAN DE FERTILIZACIÓN',
                tags: ['ABONO', 'FERTILIZACIÓN', 'CULTIVOS'],
                priceRange: '1 Bulto - 50Kg',
            },
            {
                name: 'Humus de Lombriz',
                description:
                    'El "oro negro" de la jardinería. Humus de lombriz puro para una fertilización natural y efectiva, mejorando la estructura del suelo.',
                price: 25.0,
                stock: 50,
                imageUrl: 'https://picsum.photos/seed/humus-lombriz/400/400',
                imageHint: 'worm castings vermicompost humus organic',
                category: 'PLAN DE FERTILIZACIÓN',
                tags: ['ABONO', 'HUMUS', 'ORGÁNICO'],
                priceRange: '1 Bulto - 50Kg',
            },
            {
                name: 'Compost Orgánico Premium',
                description:
                    'Mezcla de compost premium, balanceado para todo tipo de plantas. Enriquece la vida microbiana de tu tierra.',
                price: 20.0,
                stock: 80,
                imageUrl: 'https://picsum.photos/seed/compost-organico/400/400',
                imageHint: 'premium organic compost soil amendment',
                category: 'PLAN DE FERTILIZACIÓN',
                tags: ['COMPOST', 'FERTILIZACIÓN', 'PREMIUM'],
                priceRange: '1 Bulto - 50Kg',
            },
        ];

        const products = this.productRepository.create(seedProducts);
        return await this.productRepository.save(products);
    }
}
