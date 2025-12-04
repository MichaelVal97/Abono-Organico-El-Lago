import {
    Controller,
    Get,
    Patch,
    Post,
    Delete,
    Body,
    Param,
    UseGuards,
    Request,
    UseInterceptors,
    UploadedFile,
    BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateUserDto } from '../auth/dto/update-user.dto';
import { UpdatePreferencesDto } from '../auth/dto/update-preferences.dto';
import { CreateAddressDto } from '../auth/dto/create-address.dto';
import { UpdateAddressDto } from '../auth/dto/update-address.dto';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get('profile')
    @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
    @ApiResponse({ status: 200, description: 'Perfil obtenido exitosamente' })
    async getProfile(@Request() req) {
        return this.usersService.getProfile(req.user.id);
    }

    @Patch('profile')
    @ApiOperation({ summary: 'Actualizar perfil del usuario' })
    @ApiResponse({ status: 200, description: 'Perfil actualizado exitosamente' })
    async updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.updateProfile(req.user.id, updateUserDto);
    }

    @Post('avatar')
    @ApiOperation({ summary: 'Subir avatar del usuario' })
    @ApiConsumes('multipart/form-data')
    @ApiResponse({ status: 200, description: 'Avatar subido exitosamente' })
    @UseInterceptors(
        FileInterceptor('avatar', {
            storage: diskStorage({
                destination: './uploads/avatars',
                filename: (req, file, cb) => {
                    const randomName = Array(32)
                        .fill(null)
                        .map(() => Math.round(Math.random() * 16).toString(16))
                        .join('');
                    cb(null, `${randomName}${extname(file.originalname)}`);
                },
            }),
            limits: {
                fileSize: 5 * 1024 * 1024, // 5MB
            },
            fileFilter: (req, file, cb) => {
                if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
                    return cb(
                        new BadRequestException('Solo se permiten archivos de imagen'),
                        false,
                    );
                }
                cb(null, true);
            },
        }),
    )
    async uploadAvatar(@Request() req, @UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('No se proporcionó ningún archivo');
        }

        const avatarUrl = `/uploads/avatars/${file.filename}`;
        return this.usersService.updateAvatar(req.user.id, avatarUrl);
    }

    @Delete('avatar')
    @ApiOperation({ summary: 'Eliminar avatar del usuario' })
    @ApiResponse({ status: 200, description: 'Avatar eliminado exitosamente' })
    async deleteAvatar(@Request() req) {
        return this.usersService.deleteAvatar(req.user.id);
    }

    @Get('preferences')
    @ApiOperation({ summary: 'Obtener preferencias del usuario' })
    @ApiResponse({ status: 200, description: 'Preferencias obtenidas exitosamente' })
    async getPreferences(@Request() req) {
        return this.usersService.getPreferences(req.user.id);
    }

    @Patch('preferences')
    @ApiOperation({ summary: 'Actualizar preferencias del usuario' })
    @ApiResponse({ status: 200, description: 'Preferencias actualizadas exitosamente' })
    async updatePreferences(
        @Request() req,
        @Body() updatePreferencesDto: UpdatePreferencesDto,
    ) {
        return this.usersService.updatePreferences(req.user.id, updatePreferencesDto);
    }

    @Get('addresses')
    @ApiOperation({ summary: 'Listar direcciones del usuario' })
    @ApiResponse({ status: 200, description: 'Direcciones obtenidas exitosamente' })
    async getAddresses(@Request() req) {
        return this.usersService.getAddresses(req.user.id);
    }

    @Post('addresses')
    @ApiOperation({ summary: 'Crear nueva dirección' })
    @ApiResponse({ status: 201, description: 'Dirección creada exitosamente' })
    async createAddress(@Request() req, @Body() createAddressDto: CreateAddressDto) {
        return this.usersService.createAddress(req.user.id, createAddressDto);
    }

    @Patch('addresses/:id')
    @ApiOperation({ summary: 'Actualizar dirección' })
    @ApiResponse({ status: 200, description: 'Dirección actualizada exitosamente' })
    async updateAddress(
        @Request() req,
        @Param('id') addressId: string,
        @Body() updateAddressDto: UpdateAddressDto,
    ) {
        return this.usersService.updateAddress(req.user.id, addressId, updateAddressDto);
    }

    @Delete('addresses/:id')
    @ApiOperation({ summary: 'Eliminar dirección' })
    @ApiResponse({ status: 200, description: 'Dirección eliminada exitosamente' })
    async deleteAddress(@Request() req, @Param('id') addressId: string) {
        return this.usersService.deleteAddress(req.user.id, addressId);
    }

    @Patch('addresses/:id/default')
    @ApiOperation({ summary: 'Marcar dirección como predeterminada' })
    @ApiResponse({ status: 200, description: 'Dirección marcada como predeterminada' })
    async setDefaultAddress(@Request() req, @Param('id') addressId: string) {
        return this.usersService.setDefaultAddress(req.user.id, addressId);
    }
}
