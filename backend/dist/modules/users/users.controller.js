"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const multer_1 = require("multer");
const path_1 = require("path");
const users_service_1 = require("./users.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const update_user_dto_1 = require("../auth/dto/update-user.dto");
const update_preferences_dto_1 = require("../auth/dto/update-preferences.dto");
const create_address_dto_1 = require("../auth/dto/create-address.dto");
const update_address_dto_1 = require("../auth/dto/update-address.dto");
let UsersController = class UsersController {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    async findAll() {
        return this.usersService.findAll();
    }
    async getProfile(req) {
        return this.usersService.getProfile(req.user.id);
    }
    async updateProfile(req, updateUserDto) {
        return this.usersService.updateProfile(req.user.id, updateUserDto);
    }
    async uploadAvatar(req, file) {
        if (!file) {
            throw new common_1.BadRequestException('No se proporcionó ningún archivo');
        }
        const avatarUrl = `/uploads/avatars/${file.filename}`;
        return this.usersService.updateAvatar(req.user.id, avatarUrl);
    }
    async deleteAvatar(req) {
        return this.usersService.deleteAvatar(req.user.id);
    }
    async getPreferences(req) {
        return this.usersService.getPreferences(req.user.id);
    }
    async updatePreferences(req, updatePreferencesDto) {
        return this.usersService.updatePreferences(req.user.id, updatePreferencesDto);
    }
    async getAddresses(req) {
        return this.usersService.getAddresses(req.user.id);
    }
    async createAddress(req, createAddressDto) {
        return this.usersService.createAddress(req.user.id, createAddressDto);
    }
    async updateAddress(req, addressId, updateAddressDto) {
        return this.usersService.updateAddress(req.user.id, addressId, updateAddressDto);
    }
    async deleteAddress(req, addressId) {
        return this.usersService.deleteAddress(req.user.id, addressId);
    }
    async setDefaultAddress(req, addressId) {
        return this.usersService.setDefaultAddress(req.user.id, addressId);
    }
    async findOne(id) {
        return this.usersService.getProfile(id);
    }
    async updateRole(id, role) {
        return this.usersService.updateRole(id, role);
    }
    async update(id, updateUserDto) {
        return this.usersService.updateProfile(id, updateUserDto);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todos los usuarios' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de usuarios obtenida exitosamente' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener perfil del usuario autenticado' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Perfil obtenido exitosamente' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Patch)('profile'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar perfil del usuario' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Perfil actualizado exitosamente' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Post)('avatar'),
    (0, swagger_1.ApiOperation)({ summary: 'Subir avatar del usuario' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Avatar subido exitosamente' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('avatar', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/avatars',
            filename: (req, file, cb) => {
                const randomName = Array(32)
                    .fill(null)
                    .map(() => Math.round(Math.random() * 16).toString(16))
                    .join('');
                cb(null, `${randomName}${(0, path_1.extname)(file.originalname)}`);
            },
        }),
        limits: {
            fileSize: 5 * 1024 * 1024,
        },
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
                return cb(new common_1.BadRequestException('Solo se permiten archivos de imagen'), false);
            }
            cb(null, true);
        },
    })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "uploadAvatar", null);
__decorate([
    (0, common_1.Delete)('avatar'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar avatar del usuario' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Avatar eliminado exitosamente' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deleteAvatar", null);
__decorate([
    (0, common_1.Get)('preferences'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener preferencias del usuario' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Preferencias obtenidas exitosamente' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getPreferences", null);
__decorate([
    (0, common_1.Patch)('preferences'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar preferencias del usuario' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Preferencias actualizadas exitosamente' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_preferences_dto_1.UpdatePreferencesDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updatePreferences", null);
__decorate([
    (0, common_1.Get)('addresses'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar direcciones del usuario' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Direcciones obtenidas exitosamente' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getAddresses", null);
__decorate([
    (0, common_1.Post)('addresses'),
    (0, swagger_1.ApiOperation)({ summary: 'Crear nueva dirección' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Dirección creada exitosamente' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_address_dto_1.CreateAddressDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "createAddress", null);
__decorate([
    (0, common_1.Patch)('addresses/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar dirección' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Dirección actualizada exitosamente' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_address_dto_1.UpdateAddressDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateAddress", null);
__decorate([
    (0, common_1.Delete)('addresses/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar dirección' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Dirección eliminada exitosamente' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deleteAddress", null);
__decorate([
    (0, common_1.Patch)('addresses/:id/default'),
    (0, swagger_1.ApiOperation)({ summary: 'Marcar dirección como predeterminada' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Dirección marcada como predeterminada' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "setDefaultAddress", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener un usuario por ID (Admin)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Usuario obtenido exitosamente' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/role'),
    (0, swagger_1.ApiOperation)({ summary: 'Cambiar rol de usuario (Admin)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Rol actualizado exitosamente' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateRole", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar usuario por ID (Admin)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Usuario actualizado exitosamente' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "update", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('users'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('users'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map