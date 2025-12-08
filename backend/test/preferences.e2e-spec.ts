import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { Repository } from 'typeorm';
import { User } from './../src/modules/auth/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Theme, Language } from './../src/modules/auth/entities/user-preferences.entity';

describe('User Preferences (e2e)', () => {
    let app: INestApplication;
    let userRepository: Repository<User>;
    let authToken: string;

    const testUser = {
        email: 'pref_test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'Preferences',
    };

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
                transform: true,
            }),
        );
        await app.init();

        userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));

        // Clean up previous test run if needed
        const existingUser = await userRepository.findOne({
            where: { email: testUser.email },
            relations: ['preferences'],
        });
        if (existingUser) {
            if (existingUser.preferences) {
                await userRepository.query(`DELETE FROM user_preferences WHERE id = '${existingUser.preferences.id}'`);
            }
            await userRepository.remove(existingUser);
        }

        // Register user
        await request(app.getHttpServer())
            .post('/auth/register')
            .send(testUser)
            .expect(201);

        // Login to get token
        const loginResponse = await request(app.getHttpServer())
            .post('/auth/login')
            .send({
                email: testUser.email,
                password: testUser.password,
            })
            .expect(200);

        authToken = loginResponse.body.token;
    });

    afterAll(async () => {
        if (userRepository) {
            const user = await userRepository.findOne({
                where: { email: testUser.email },
                relations: ['preferences'],
            });
            if (user) {
                // Manually remove preferences to avoid FK violation
                if (user.preferences) {
                    await userRepository.query(`DELETE FROM user_preferences WHERE id = '${user.preferences.id}'`);
                }
                await userRepository.remove(user);
            }
        }
        await app.close();
    });

    describe('/users/preferences', () => {
        it('should get default preferences', () => {
            return request(app.getHttpServer())
                .get('/users/preferences')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body).toHaveProperty('theme');
                    expect(res.body).toHaveProperty('language');
                    expect(res.body).toHaveProperty('emailNotifications');
                });
        });

        it('should update preferences', () => {
            const updateData = {
                theme: Theme.DARK,
                language: Language.EN,
                emailNotifications: false,
                newsletter: true,
            };

            return request(app.getHttpServer())
                .patch('/users/preferences')
                .set('Authorization', `Bearer ${authToken}`)
                .send(updateData)
                .expect(200)
                .expect((res) => {
                    expect(res.body.theme).toBe(updateData.theme);
                    expect(res.body.language).toBe(updateData.language);
                    expect(res.body.emailNotifications).toBe(updateData.emailNotifications);
                    expect(res.body.newsletter).toBe(updateData.newsletter);
                });
        });

        it('should validate invalid enum values', () => {
            return request(app.getHttpServer())
                .patch('/users/preferences')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    theme: 'invalid-theme',
                })
                .expect(400); // Bad Request
        });
    });
});
