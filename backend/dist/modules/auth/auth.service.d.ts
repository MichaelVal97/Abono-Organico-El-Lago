import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { UserPreferences } from './entities/user-preferences.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private userRepository;
    private preferencesRepository;
    private jwtService;
    constructor(userRepository: Repository<User>, preferencesRepository: Repository<UserPreferences>, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        user: {
            id: string;
            email: string;
            googleId?: string;
            firstName: string;
            lastName: string;
            role: "user" | "admin";
            phone?: string;
            dateOfBirth?: Date;
            avatar?: string;
            isActive: boolean;
            isEmailVerified: boolean;
            createdAt: Date;
            updatedAt: Date;
            preferences: UserPreferences;
            addresses: import("./entities/user-address.entity").UserAddress[];
        };
        token: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        user: {
            id: string;
            email: string;
            googleId?: string;
            firstName: string;
            lastName: string;
            role: "user" | "admin";
            phone?: string;
            dateOfBirth?: Date;
            avatar?: string;
            isActive: boolean;
            isEmailVerified: boolean;
            createdAt: Date;
            updatedAt: Date;
            preferences: UserPreferences;
            addresses: import("./entities/user-address.entity").UserAddress[];
        };
        token: string;
    }>;
    validateGoogleUser(user: User): Promise<{
        user: {
            id: string;
            email: string;
            googleId?: string;
            firstName: string;
            lastName: string;
            role: "user" | "admin";
            phone?: string;
            dateOfBirth?: Date;
            avatar?: string;
            isActive: boolean;
            isEmailVerified: boolean;
            createdAt: Date;
            updatedAt: Date;
            preferences: UserPreferences;
            addresses: import("./entities/user-address.entity").UserAddress[];
        };
        token: string;
    }>;
    private generateToken;
    private sanitizeUser;
}
