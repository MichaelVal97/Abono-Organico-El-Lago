import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
        private configService: ConfigService,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {
        super({
            clientID: configService.get<string>('GOOGLE_CLIENT_ID') || '',
            clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET') || '',
            callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL') || '',
            scope: ['email', 'profile'],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback,
    ): Promise<any> {
        const { id, name, emails, photos } = profile;

        const email = emails[0].value;

        // Find or create user
        let user = await this.userRepository.findOne({
            where: [
                { googleId: id },
                { email: email }
            ],
            relations: ['preferences'],
        });

        if (!user) {
            // Create new user from Google profile
            user = this.userRepository.create({
                email: email,
                googleId: id,
                firstName: name.givenName,
                lastName: name.familyName,
                avatar: photos?.[0]?.value,
                isEmailVerified: true, // Google emails are verified
            });

            user = await this.userRepository.save(user);
        } else if (!user.googleId) {
            // Link Google account to existing user
            user.googleId = id;
            if (!user.avatar && photos?.[0]?.value) {
                user.avatar = photos[0].value;
            }
            user = await this.userRepository.save(user);
        }

        done(null, user);
    }
}
