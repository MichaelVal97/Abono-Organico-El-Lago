"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const path_1 = require("path");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: ['http://localhost:9002', 'http://localhost:3000', 'http://localhost:3001'],
        credentials: true,
    });
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'uploads'), {
        prefix: '/uploads/',
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Abono Orgánico El Lago API')
        .setDescription('API RESTful para el sistema de e-commerce de abonos orgánicos. ' +
        'Incluye gestión de productos, autenticación de usuarios, perfiles y direcciones.')
        .setVersion('1.0')
        .addBearerAuth()
        .addTag('auth', 'Autenticación y registro de usuarios')
        .addTag('users', 'Gestión de perfil, preferencias y direcciones')
        .addTag('products', 'Operaciones sobre productos de abono orgánico')
        .addTag('categories', 'Operaciones sobre categorías de productos')
        .addTag('customers', 'Operaciones sobre clientes')
        .addTag('orders', 'Operaciones sobre órdenes de compra')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`\n🚀 Application is running on: http://localhost:${port}`);
    console.log(`📚 Swagger documentation: http://localhost:${port}/api\n`);
}
bootstrap();
//# sourceMappingURL=main.js.map