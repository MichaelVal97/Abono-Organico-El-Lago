import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new order' })
  create(@Request() req: any, @Body() createOrderDto: CreateOrderDto) {
    console.log('Creating order. User:', req.user);
    console.log('DTO:', createOrderDto);
    return this.ordersService.create(req.user.id, createOrderDto);
  }

  @Get('my-orders')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get orders for the authenticated user' })
  getMyOrders(@Request() req: any) {
    return this.ordersService.findByUser(req.user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all orders (Admin only ideally, but open for now)',
  })
  findAll() {
    return this.ordersService.findAll();
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard) // Could relax this if needed for admin dashboard without specific role check yet
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get order statistics' })
  getStats() {
    return this.ordersService.getStats();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }
}
