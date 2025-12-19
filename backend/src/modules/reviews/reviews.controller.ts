import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Crear una nueva reseña' })
    @ApiResponse({ status: 201, description: 'Reseña creada exitosamente' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @ApiResponse({ status: 404, description: 'Producto no encontrado' })
    create(@Request() req, @Body() createReviewDto: CreateReviewDto) {
        return this.reviewsService.create(req.user.id, createReviewDto);
    }

    @Get('product/:productId')
    @ApiOperation({ summary: 'Obtener todas las reseñas de un producto' })
    @ApiResponse({ status: 200, description: 'Lista de reseñas' })
    findByProduct(@Param('productId') productId: string) {
        return this.reviewsService.findByProduct(productId);
    }

    @Get('product/:productId/stats')
    @ApiOperation({ summary: 'Obtener estadísticas de reseñas de un producto' })
    @ApiResponse({ status: 200, description: 'Promedio y total de reseñas' })
    getStats(@Param('productId') productId: string) {
        return this.reviewsService.getAverageRating(productId);
    }

    @Get()
    @ApiOperation({ summary: 'Obtener todas las reseñas' })
    @ApiResponse({ status: 200, description: 'Lista de todas las reseñas' })
    findAll() {
        return this.reviewsService.findAll();
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Actualizar una reseña' })
    @ApiResponse({ status: 200, description: 'Reseña actualizada' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @ApiResponse({ status: 403, description: 'No tienes permiso' })
    @ApiResponse({ status: 404, description: 'Reseña no encontrada' })
    update(
        @Param('id') id: string,
        @Request() req,
        @Body() updateReviewDto: UpdateReviewDto,
    ) {
        return this.reviewsService.update(id, req.user.id, updateReviewDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Eliminar una reseña' })
    @ApiResponse({ status: 200, description: 'Reseña eliminada' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @ApiResponse({ status: 403, description: 'No tienes permiso' })
    @ApiResponse({ status: 404, description: 'Reseña no encontrada' })
    delete(@Param('id') id: string, @Request() req) {
        return this.reviewsService.delete(id, req.user.id);
    }
}
