
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { User } from '../modules/auth/entities/user.entity';
import { Product } from '../modules/products/entities/product.entity';
import { CloudinaryService } from '../modules/cloudinary/cloudinary.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const cloudinaryService = app.get(CloudinaryService);
    const userRepository = app.get<Repository<User>>(getRepositoryToken(User));
    const productRepository = app.get<Repository<Product>>(getRepositoryToken(Product));

    console.log('Iniciando migración de imágenes...');

    // Migrar Usuarios
    const users = await userRepository.find();
    console.log(`Encontrados ${users.length} usuarios.`);
    for (const user of users) {
        if (user.avatar && !user.avatar.includes('cloudinary')) {
            try {
                const imagePath = resolvePath(user.avatar);
                if (fs.existsSync(imagePath)) {
                    console.log(`Subiendo avatar para usuario ${user.email}: ${imagePath}`);
                    const file = {
                        buffer: fs.readFileSync(imagePath),
                        mimetype: 'image/jpeg', // Asumimos jpeg o detectamos extensión
                        originalname: path.basename(imagePath),
                    } as any;

                    const result = await cloudinaryService.uploadImage(file);
                    if (result && result.secure_url) { // Check if result is valid
                        user.avatar = result.secure_url;
                        await userRepository.save(user);
                        console.log(`Avatar actualizado: ${user.avatar}`);
                    }
                } else {
                    console.warn(`Archivo no encontrado: ${imagePath}`);
                }
            } catch (error) {
                console.error(`Error migrando avatar de ${user.email}:`, error);
            }
        }
    }

    // Migrar Productos
    const products = await productRepository.find();
    console.log(`Encontrados ${products.length} productos.`);
    for (const product of products) {
        let updated = false;

        // Migrar imageUrl
        if (product.imageUrl && !product.imageUrl.includes('cloudinary')) {
            try {
                const imagePath = resolvePath(product.imageUrl);
                if (fs.existsSync(imagePath)) {
                    console.log(`Subiendo imagen principal para producto ${product.name}`);
                    const file = {
                        buffer: fs.readFileSync(imagePath),
                        mimetype: 'image/jpeg',
                        originalname: path.basename(imagePath),
                    } as any;

                    const result = await cloudinaryService.uploadImage(file);
                    if (result && result.secure_url) {
                        product.imageUrl = result.secure_url;
                        updated = true;
                    }
                } else {
                    console.warn(`Archivo no encontrado: ${imagePath}`);
                }
            } catch (error) {
                console.error(`Error migrando imagen de producto ${product.name}:`, error);
            }
        }

        // Migrar galería
        if (product.images && product.images.length > 0) {
            const newImages: string[] = [];
            let galleryUpdated = false;
            for (const img of product.images) {
                if (img && !img.includes('cloudinary')) {
                    try {
                        const imagePath = resolvePath(img);
                        if (fs.existsSync(imagePath)) {
                            console.log(`Subiendo imagen de galería para producto ${product.name}`);
                            const file = {
                                buffer: fs.readFileSync(imagePath),
                                mimetype: 'image/jpeg',
                                originalname: path.basename(imagePath),
                            } as any;
                            const result = await cloudinaryService.uploadImage(file);
                            if (result && result.secure_url) {
                                newImages.push(result.secure_url);
                                galleryUpdated = true;
                            } else {
                                newImages.push(img); // Keep original if upload fails? Or skip? Keeping original for safety.
                            }
                        } else {
                            console.warn(`Archivo de galería no encontrado: ${imagePath}`);
                            newImages.push(img);
                        }
                    } catch (e) {
                        console.error(`Error subiendo imagen de galería para ${product.name}`, e);
                        newImages.push(img);
                    }
                } else {
                    newImages.push(img);
                }
            }
            if (galleryUpdated) {
                product.images = newImages;
                updated = true;
            }
        }

        if (updated) {
            await productRepository.save(product);
            console.log(`Producto actualizado: ${product.name}`);
        }
    }

    console.log('Migración completada.');
    await app.close();
}

function resolvePath(urlOrPath: string): string {
    // Si es una URL http/https externa, tendriamos que descargarla. 
    // Por ahora asumimos que son rutas locales que empiezan con /uploads o uploads/

    // Eliminar slash inicial si existe
    const cleanPath = urlOrPath.startsWith('/') ? urlOrPath.substring(1) : urlOrPath;

    // Asumimos que la ruta es relativa a la raíz del proyecto backend (donde está uploads)
    // El script se ejecutará desde backend/, así que process.cwd() debería ser backend/
    return path.join(process.cwd(), cleanPath);
}

bootstrap();
