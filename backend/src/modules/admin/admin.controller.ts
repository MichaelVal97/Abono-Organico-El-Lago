import { Controller, Get, UseGuards, Param, Patch, Body } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UsersService } from '../users/users.service';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly usersService: UsersService) {}

  @Get('users')
  @ApiOperation({ summary: 'Listar todos los usuarios' })
  async findAll() {
    return this.usersService.findAll();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Obtener estadísticas del sistema' })
  async getStats() {
    const users = await this.usersService.findAll();
    return {
      totalUsers: users.length,
      activeUsers: users.filter((u) => u.isActive).length,
      // Añadir más estadísticas aquí
    };
  }

  @Patch('users/:id/role')
  @ApiOperation({ summary: 'Cambiar rol de usuario' })
  async changeRole(
    @Param('id') id: string,
    @Body('role') role: 'user' | 'admin',
  ) {
    return this.usersService.updateRole(id, role);
  }

  @Get('orders')
  @ApiOperation({ summary: 'Listar todos los pedidos' })
  async getOrders() {
    // Respuesta simulada hasta que se implemente el módulo de pedidos
    return [
      {
        id: '1',
        userId: '1',
        total: 15000,
        status: 'completed',
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        userId: '2',
        total: 25000,
        status: 'pending',
        createdAt: new Date().toISOString(),
      },
    ];
  }
}
