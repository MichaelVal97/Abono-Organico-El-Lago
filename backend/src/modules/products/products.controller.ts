import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@ApiTags('products')
@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post()
    @ApiOperation({ summary: 'Crear un nuevo producto' })
    @ApiResponse({
        status: 201,
        description: 'Producto creado exitosamente',
        type: Product,
    })
    @ApiResponse({ status: 400, description: 'Datos inválidos' })
    create(@Body() createProductDto: CreateProductDto): Promise<Product> {
        return this.productsService.create(createProductDto);
    }

    @Get()
    @ApiOperation({ summary: 'Obtener todos los productos' })
    @ApiResponse({
        status: 200,
        description: 'Lista de productos',
        type: [Product],
    })
    findAll(): Promise<Product[]> {
        return this.productsService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener un producto por ID' })
    @ApiParam({ name: 'id', description: 'UUID del producto' })
    @ApiResponse({
        status: 200,
        description: 'Producto encontrado',
        type: Product,
    })
    @ApiResponse({ status: 404, description: 'Producto no encontrado' })
    findOne(@Param('id') id: string): Promise<Product> {
        return this.productsService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Actualizar un producto' })
    @ApiParam({ name: 'id', description: 'UUID del producto' })
    @ApiResponse({
        status: 200,
        description: 'Producto actualizado exitosamente',
        type: Product,
    })
    @ApiResponse({ status: 404, description: 'Producto no encontrado' })
    @ApiResponse({ status: 400, description: 'Datos inválidos' })
    update(
        @Param('id') id: string,
        @Body() updateProductDto: UpdateProductDto,
    ): Promise<Product> {
        return this.productsService.update(id, updateProductDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Eliminar un producto' })
    @ApiParam({ name: 'id', description: 'UUID del producto' })
    @ApiResponse({ status: 204, description: 'Producto eliminado exitosamente' })
    @ApiResponse({ status: 404, description: 'Producto no encontrado' })
    async remove(@Param('id') id: string): Promise<void> {
        return this.productsService.remove(id);
    }

    @Post('seed')
    @ApiOperation({
        summary: 'Poblar base de datos con productos iniciales',
        description:
            'Crea los 5 productos iniciales del catálogo. Solo funciona si la base de datos está vacía.',
    })
    @ApiResponse({
        status: 201,
        description: 'Productos iniciales creados exitosamente',
        type: [Product],
    })
    @ApiResponse({
        status: 400,
        description: 'Ya existen productos en la base de datos',
    })
    seed(): Promise<Product[]> {
        return this.productsService.seed();
    }
}
