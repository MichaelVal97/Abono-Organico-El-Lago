"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../app.module");
const user_entity_1 = require("../modules/auth/entities/user.entity");
const product_entity_1 = require("../modules/products/entities/product.entity");
const cloudinary_service_1 = require("../modules/cloudinary/cloudinary.service");
const typeorm_1 = require("@nestjs/typeorm");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
async function bootstrap() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const cloudinaryService = app.get(cloudinary_service_1.CloudinaryService);
    const userRepository = app.get((0, typeorm_1.getRepositoryToken)(user_entity_1.User));
    const productRepository = app.get((0, typeorm_1.getRepositoryToken)(product_entity_1.Product));
    console.log('Iniciando migración de imágenes...');
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
                        mimetype: 'image/jpeg',
                        originalname: path.basename(imagePath),
                    };
                    const result = await cloudinaryService.uploadImage(file);
                    if (result && result.secure_url) {
                        user.avatar = result.secure_url;
                        await userRepository.save(user);
                        console.log(`Avatar actualizado: ${user.avatar}`);
                    }
                }
                else {
                    console.warn(`Archivo no encontrado: ${imagePath}`);
                }
            }
            catch (error) {
                console.error(`Error migrando avatar de ${user.email}:`, error);
            }
        }
    }
    const products = await productRepository.find();
    console.log(`Encontrados ${products.length} productos.`);
    for (const product of products) {
        let updated = false;
        if (product.imageUrl && !product.imageUrl.includes('cloudinary')) {
            try {
                const imagePath = resolvePath(product.imageUrl);
                if (fs.existsSync(imagePath)) {
                    console.log(`Subiendo imagen principal para producto ${product.name}`);
                    const file = {
                        buffer: fs.readFileSync(imagePath),
                        mimetype: 'image/jpeg',
                        originalname: path.basename(imagePath),
                    };
                    const result = await cloudinaryService.uploadImage(file);
                    if (result && result.secure_url) {
                        product.imageUrl = result.secure_url;
                        updated = true;
                    }
                }
                else {
                    console.warn(`Archivo no encontrado: ${imagePath}`);
                }
            }
            catch (error) {
                console.error(`Error migrando imagen de producto ${product.name}:`, error);
            }
        }
        if (product.images && product.images.length > 0) {
            const newImages = [];
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
                            };
                            const result = await cloudinaryService.uploadImage(file);
                            if (result && result.secure_url) {
                                newImages.push(result.secure_url);
                                galleryUpdated = true;
                            }
                            else {
                                newImages.push(img);
                            }
                        }
                        else {
                            console.warn(`Archivo de galería no encontrado: ${imagePath}`);
                            newImages.push(img);
                        }
                    }
                    catch (e) {
                        console.error(`Error subiendo imagen de galería para ${product.name}`, e);
                        newImages.push(img);
                    }
                }
                else {
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
function resolvePath(urlOrPath) {
    const cleanPath = urlOrPath.startsWith('/') ? urlOrPath.substring(1) : urlOrPath;
    return path.join(process.cwd(), cleanPath);
}
bootstrap();
//# sourceMappingURL=migrate-images.js.map