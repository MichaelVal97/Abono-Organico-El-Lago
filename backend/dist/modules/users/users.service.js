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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../auth/entities/user.entity");
const user_preferences_entity_1 = require("../auth/entities/user-preferences.entity");
const user_address_entity_1 = require("../auth/entities/user-address.entity");
let UsersService = class UsersService {
    userRepository;
    preferencesRepository;
    addressRepository;
    constructor(userRepository, preferencesRepository, addressRepository) {
        this.userRepository = userRepository;
        this.preferencesRepository = preferencesRepository;
        this.addressRepository = addressRepository;
    }
    sanitizeUser(user) {
        const { password, ...profile } = user;
        return profile;
    }
    async findAll() {
        const users = await this.userRepository.find({
            relations: ['preferences'],
        });
        return users.map(user => this.sanitizeUser(user));
    }
    async getProfile(userId) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['preferences', 'addresses'],
        });
        if (!user) {
            throw new common_1.NotFoundException('Usuario no encontrado');
        }
        return this.sanitizeUser(user);
    }
    async updateProfile(userId, updateUserDto) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('Usuario no encontrado');
        }
        Object.assign(user, updateUserDto);
        await this.userRepository.save(user);
        return this.sanitizeUser(user);
    }
    async updateAvatar(userId, avatarUrl) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('Usuario no encontrado');
        }
        user.avatar = avatarUrl;
        await this.userRepository.save(user);
        return this.sanitizeUser(user);
    }
    async deleteAvatar(userId) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('Usuario no encontrado');
        }
        user.avatar = undefined;
        await this.userRepository.save(user);
        return this.sanitizeUser(user);
    }
    async getPreferences(userId) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['preferences'],
        });
        if (!user) {
            throw new common_1.NotFoundException('Usuario no encontrado');
        }
        return user.preferences;
    }
    async updatePreferences(userId, updatePreferencesDto) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['preferences'],
        });
        if (!user) {
            throw new common_1.NotFoundException('Usuario no encontrado');
        }
        Object.assign(user.preferences, updatePreferencesDto);
        await this.preferencesRepository.save(user.preferences);
        return user.preferences;
    }
    async getAddresses(userId) {
        const addresses = await this.addressRepository.find({
            where: { user: { id: userId } },
            order: { isDefault: 'DESC', createdAt: 'DESC' },
        });
        return addresses;
    }
    async createAddress(userId, createAddressDto) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('Usuario no encontrado');
        }
        if (createAddressDto.isDefault) {
            await this.addressRepository.update({ user: { id: userId }, isDefault: true }, { isDefault: false });
        }
        const address = this.addressRepository.create({
            ...createAddressDto,
            user,
        });
        return this.addressRepository.save(address);
    }
    async updateAddress(userId, addressId, updateAddressDto) {
        const address = await this.addressRepository.findOne({
            where: { id: addressId, user: { id: userId } },
        });
        if (!address) {
            throw new common_1.NotFoundException('Dirección no encontrada');
        }
        if (updateAddressDto.isDefault) {
            await this.addressRepository.update({ user: { id: userId }, isDefault: true }, { isDefault: false });
        }
        Object.assign(address, updateAddressDto);
        return this.addressRepository.save(address);
    }
    async deleteAddress(userId, addressId) {
        const address = await this.addressRepository.findOne({
            where: { id: addressId, user: { id: userId } },
        });
        if (!address) {
            throw new common_1.NotFoundException('Dirección no encontrada');
        }
        await this.addressRepository.remove(address);
        return { message: 'Dirección eliminada exitosamente' };
    }
    async setDefaultAddress(userId, addressId) {
        const address = await this.addressRepository.findOne({
            where: { id: addressId, user: { id: userId } },
        });
        if (!address) {
            throw new common_1.NotFoundException('Dirección no encontrada');
        }
        await this.addressRepository.update({ user: { id: userId }, isDefault: true }, { isDefault: false });
        address.isDefault = true;
        return this.addressRepository.save(address);
    }
    async updateRole(userId, role) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('Usuario no encontrado');
        }
        user.role = role;
        await this.userRepository.save(user);
        return this.sanitizeUser(user);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(user_preferences_entity_1.UserPreferences)),
    __param(2, (0, typeorm_1.InjectRepository)(user_address_entity_1.UserAddress)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map