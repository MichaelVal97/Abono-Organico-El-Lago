import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import express from 'express';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';

const expressApp = express();
const adapter = new ExpressAdapter(expressApp);

let app: any;

export async function bootstrap() {
    if (app) {
        return app;
    }

    app = await NestFactory.create(AppModule, adapter);

    app.enableCors({
        origin: [
            'http://localhost:3000',
            'http://localhost:9002',
            'https://abono-organico-el-lago.vercel.app',
            'https://abono-organico-frontend.vercel.app',
            // Allow all Vercel deployments
            /https:\/\/.*\.vercel\.app/,
        ],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });

    // Serve static files for uploads - Note: This might not persist in serverless but useful for reading bundled assets if any
    // In serverless, writing to disk (uploads) is ephemeral.
    // app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    //   prefix: '/uploads/',
    // });

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    await app.init();
    return expressApp;
}
