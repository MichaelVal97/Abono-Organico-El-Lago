import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { UserPreferences } from '../auth/entities/user-preferences.entity';
import { UserAddress } from '../auth/entities/user-address.entity';
import { UpdateUserDto } from '../auth/dto/update-user.dto';
import { UpdatePreferencesDto } from '../auth/dto/update-preferences.dto';
import { CreateAddressDto } from '../auth/dto/create-address.dto';
import { UpdateAddressDto } from '../auth/dto/update-address.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserPreferences)
    private preferencesRepository: Repository<UserPreferences>,
    @InjectRepository(UserAddress)
    private addressRepository: Repository<UserAddress>,
  ) {}

  async onModuleInit() {
    const adminEmail = 'abonoellago@gmail.com';
    try {
      const adminExists = await this.userRepository.findOne({
        where: { email: adminEmail },
      });

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

        // Create default preferences
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
    } catch (error) {
      console.error('Error seeding admin user:', error);
    }
  }

  // Re-reading: I can't easily hash without bcrypt import.
  // Let's Import bcrypt.

  private sanitizeUser(user: User) {
    const { password, ...profile } = user;
    return profile;
  }

  async findAll() {
    const users = await this.userRepository.find({
      relations: ['preferences'],
    });
    return users.map((user) => this.sanitizeUser(user));
  }

  async getProfile(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['preferences', 'addresses'],
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return this.sanitizeUser(user);
  }

  async updateProfile(userId: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    Object.assign(user, updateUserDto);
    await this.userRepository.save(user);

    return this.sanitizeUser(user);
  }

  async updateAvatar(userId: string, avatarUrl: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    user.avatar = avatarUrl;
    await this.userRepository.save(user);

    return this.sanitizeUser(user);
  }

  async deleteAvatar(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    user.avatar = undefined;
    await this.userRepository.save(user);

    return this.sanitizeUser(user);
  }

  async getPreferences(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['preferences'],
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return user.preferences;
  }

  async updatePreferences(
    userId: string,
    updatePreferencesDto: UpdatePreferencesDto,
  ) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['preferences'],
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    Object.assign(user.preferences, updatePreferencesDto);
    await this.preferencesRepository.save(user.preferences);

    return user.preferences;
  }

  async getAddresses(userId: string) {
    const addresses = await this.addressRepository.find({
      where: { user: { id: userId } },
      order: { isDefault: 'DESC', createdAt: 'DESC' },
    });

    return addresses;
  }

  async createAddress(userId: string, createAddressDto: CreateAddressDto) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Si esta es la dirección predeterminada, quitar la marca de las otras
    if (createAddressDto.isDefault) {
      await this.addressRepository.update(
        { user: { id: userId }, isDefault: true },
        { isDefault: false },
      );
    }

    const address = this.addressRepository.create({
      ...createAddressDto,
      user,
    });

    return this.addressRepository.save(address);
  }

  async updateAddress(
    userId: string,
    addressId: string,
    updateAddressDto: UpdateAddressDto,
  ) {
    const address = await this.addressRepository.findOne({
      where: { id: addressId, user: { id: userId } },
    });

    if (!address) {
      throw new NotFoundException('Dirección no encontrada');
    }

    // Si se establece como predeterminada, quitar la marca de las otras
    if (updateAddressDto.isDefault) {
      await this.addressRepository.update(
        { user: { id: userId }, isDefault: true },
        { isDefault: false },
      );
    }

    Object.assign(address, updateAddressDto);
    return this.addressRepository.save(address);
  }

  async deleteAddress(userId: string, addressId: string) {
    const address = await this.addressRepository.findOne({
      where: { id: addressId, user: { id: userId } },
    });

    if (!address) {
      throw new NotFoundException('Dirección no encontrada');
    }

    await this.addressRepository.remove(address);
    return { message: 'Dirección eliminada exitosamente' };
  }

  async setDefaultAddress(userId: string, addressId: string) {
    const address = await this.addressRepository.findOne({
      where: { id: addressId, user: { id: userId } },
    });

    if (!address) {
      throw new NotFoundException('Dirección no encontrada');
    }

    // Quitar la marca de las otras predeterminadas
    await this.addressRepository.update(
      { user: { id: userId }, isDefault: true },
      { isDefault: false },
    );

    address.isDefault = true;
    return this.addressRepository.save(address);
  }

  async updateRole(userId: string, role: 'user' | 'admin') {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    user.role = role;
    await this.userRepository.save(user);

    return this.sanitizeUser(user);
  }
}
