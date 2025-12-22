import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private dataSource: DataSource,
  ) {}

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

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.findOne(id);
    Object.assign(product, updateProductDto);
    return await this.productRepository.save(product);
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);

    // Manual Cascade Delete to handle FK constraints
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Delete related reviews
      await queryRunner.query('DELETE FROM "reviews" WHERE "product_id" = $1', [
        id,
      ]);

      // Delete related order items
      await queryRunner.query(
        'DELETE FROM "order_items" WHERE "product_id" = $1',
        [id],
      );

      // Note: We don't delete Orders here as they belong to Users.

      // Delete the product using the transaction manager
      await queryRunner.manager.remove(product);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Seed inicial de productos basado en los datos del frontend
   */
  async seed(): Promise<Product[]> {
    // CLEANUP: Reset database to ensure only the requested product exists.
    // We must delete children first to avoid Foreign Key constraints.
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Delete Order Items (depend on Products and Orders)
      await queryRunner.query('DELETE FROM "order_items"');
      // 2. Delete Orders (depend on Users - we keep Users, but Orders might link to Products if M:N)
      await queryRunner.query('DELETE FROM "orders"');
      // 3. Delete Reviews (depend on Products and Users)
      await queryRunner.query('DELETE FROM "reviews"');
      // 4. Delete Products
      await queryRunner.query('DELETE FROM "products"');

      await queryRunner.commitTransaction();
    } catch (err) {
      console.error('Error clearing database:', err);
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }

    const seedProducts: CreateProductDto[] = [
      {
        name: 'Bulto de 50 kg de compost',
        description:
          'Abono orgánico de alta calidad en presentación de 50kg. Ideal para todo tipo de cultivos.',
        price: 25000,
        stock: 100,
        imageUrl:
          'https://i.postimg.cc/XVjTxCQq/Whats-App-Image-2025-11-27-at-13-14-22-(2).jpg',
        imageHint: 'bulto abono compost 50kg',
        category: 'ABONOS',
        tags: ['ABONO', 'FERTILIZACIÓN', 'ORGÁNICO', '50KG'],
        priceRange: '1 Bulto - 50Kg',
        images: [
          'https://i.postimg.cc/XVjTxCQq/Whats-App-Image-2025-11-27-at-13-14-22-(2).jpg',
          'https://i.postimg.cc/69WDzvYQ/Whats-App-Image-2025-11-27-at-13-14-21.jpg',
        ],
      },
    ];

    const newProducts = this.productRepository.create(seedProducts);
    return await this.productRepository.save(newProducts);
  }
}
