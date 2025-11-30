import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend (Next.js on port 9002)
  app.enableCors({
    origin: ['http://localhost:9002', 'http://localhost:3000'],
    credentials: true,
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
      'Incluye gestión de productos, categorías, clientes y órdenes.',
    )
    .setVersion('1.0')
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

