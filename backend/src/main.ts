import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enable CORS for frontend (Next.js on port 9002)
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:9002',
      'https://abono-organico-el-lago.vercel.app',
      'https://abono-organico-frontend.vercel.app', // Fallback pattern
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Serve static files for uploads
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Abono Orgánico El Lago API')
    .setDescription(
      'API RESTful para el sistema de e-commerce de abonos orgánicos. ' +
      'Incluye gestión de productos, autenticación de usuarios, perfiles y direcciones.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Autenticación y registro de usuarios')
    .addTag('users', 'Gestión de perfil, preferencias y direcciones')
    .addTag('products', 'Operaciones sobre productos de abono orgánico')
    .addTag('categories', 'Operaciones sobre categorías de productos')
    .addTag('customers', 'Operaciones sobre clientes')
    .addTag('orders', 'Operaciones sobre órdenes de compra')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`\n🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 Swagger documentation: http://localhost:${port}/api\n`);
}
bootstrap();
