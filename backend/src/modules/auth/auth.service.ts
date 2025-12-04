import {
    Injectable,
    ConflictException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { UserPreferences } from './entities/user-preferences.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(UserPreferences)
        private preferencesRepository: Repository<UserPreferences>,
        private jwtService: JwtService,
    ) { }

    async register(registerDto: RegisterDto) {
        const { email, password, firstName, lastName } = registerDto;

        // Check if user already exists
        const existingUser = await this.userRepository.findOne({
            where: { email },
        });

        if (existingUser) {
            throw new ConflictException('El correo electrónico ya está registrado');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user preferences
        const preferences = this.preferencesRepository.create();
        await this.preferencesRepository.save(preferences);

        // Create user
        const user = this.userRepository.create({
            email,
            password: hashedPassword,
            firstName,
            lastName,
            preferences,
        });

        await this.userRepository.save(user);

        // Generate JWT token
        const token = this.generateToken(user);

        return {
            user: this.sanitizeUser(user),
            token,
        };
    }

    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;

        // Find user
        const user = await this.userRepository.findOne({
            where: { email },
            relations: ['preferences'],
        });

        if (!user) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        // Check if user has password (not Google-only account)
        if (!user.password) {
            throw new UnauthorizedException('Esta cuenta usa Google Sign-In. Por favor inicia sesión con Google.');
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        if (!user.isActive) {
            throw new UnauthorizedException('Cuenta desactivada');
        }

        // Generate JWT token
        const token = this.generateToken(user);

        return {
            user: this.sanitizeUser(user),
            token,
        };
    }

    async validateGoogleUser(user: User) {
        // User is already validated by Google strategy
        // Just generate token and return
        const token = this.generateToken(user);

        return {
            user: this.sanitizeUser(user),
            token,
        };
    }

    private generateToken(user: User): string {
        const payload = { sub: user.id, email: user.email };
        return this.jwtService.sign(payload);
    }

    private sanitizeUser(user: User) {
        const { password, ...sanitized } = user;
        return sanitized;
    }
}
