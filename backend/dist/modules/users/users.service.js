"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcryptjs"));
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
    async onModuleInit() {
        const adminEmail = 'abonoellago@gmail.com';
        try {
            const adminExists = await this.userRepository.findOne({ where: { email: adminEmail } });
            if (!adminExists) {
                console.log('Seeding Admin User...');
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash('Admin135', salt);
                const adminUser = this.userRepository.create({
                    email: adminEmail,
                    password: hashedPassword,
                    firstName: 'Admin',
                    lastName: 'Abono El Lago',
                    isActive: true,
                    role: 'admin',
                });
                const preferences = this.preferencesRepository.create({
                    emailNotifications: true,
                    pushNotifications: true,
                    newsletter: true,
                });
                await this.userRepository.save(adminUser);
                preferences.user = adminUser;
                await this.preferencesRepository.save(preferences);
                console.log('Admin User Created Successfully');
            }
        }
        catch (error) {
            console.error('Error seeding admin user:', error);
        }
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