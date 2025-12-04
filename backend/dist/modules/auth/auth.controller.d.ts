import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    private readonly configService;
    constructor(authService: AuthService, configService: ConfigService);
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
            preferences: import("./entities/user-preferences.entity").UserPreferences;
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
            preferences: import("./entities/user-preferences.entity").UserPreferences;
            addresses: import("./entities/user-address.entity").UserAddress[];
        };
        token: string;
    }>;
    googleAuth(): Promise<void>;
    googleAuthCallback(req: any, res: any): Promise<any>;
}
