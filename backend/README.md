# Backend - Abono Orgánico El Lago

Servicio de backend desarrollado con NestJS que implementa una API RESTful para el sistema de e-commerce de abonos orgánicos.

## Descripción

Este proyecto constituye la capa de lógica de negocio y persistencia de datos, desacoplada del frontend. Proporciona endpoints para la gestión de productos y está documentada mediante Swagger/OpenAPI.

## Tecnologías

- **Framework**: NestJS
- **Lenguaje**: TypeScript
- **Base de Datos**: PostgreSQL
- **ORM**: TypeORM
- **Documentación**: Swagger/OpenAPI
- **Contenerización**: Docker (opcional para base de datos)

## Requisitos Previos

- Node.js (v18 o superior)
- PostgreSQL (v15 o superior)
- npm

## Configuración e Instalación

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Configurar variables de entorno:
   Crear un archivo `.env` en la raíz del directorio `backend` con la siguiente configuración:
   ```env
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USER=postgres
   DATABASE_PASSWORD=postgres
   DATABASE_NAME=abono_organico_db
   PORT=3000
   ```

3. Configurar base de datos:
   Asegúrese de que el servicio de PostgreSQL esté en ejecución y la base de datos `abono_organico_db` exista.

   Opción con Docker:
   ```bash
   docker-compose up -d
   ```

## Ejecución

Modo desarrollo:
```bash
npm run start:dev
```

El servidor iniciará en `http://localhost:3000`.

## Documentación de la API

La documentación interactiva de Swagger está disponible en:

**http://localhost:3000/api**

### Endpoints Principales

- `GET /products`: Listar todos los productos
- `GET /products/:id`: Obtener detalle de un producto
- `POST /products`: Crear un nuevo producto
- `PATCH /products/:id`: Actualizar un producto existente
- `DELETE /products/:id`: Eliminar un producto
- `POST /products/seed`: Cargar datos iniciales de prueba

### Captura de Pantalla - Swagger UI

![Documentación Swagger](./docs/swagger-screenshot.png)

## Estructura del Proyecto

El código fuente se organiza siguiendo la arquitectura modular de NestJS:

- `src/modules/products`: Módulo de gestión de productos (Controlador, Servicio, Entidad, DTOs)
- `src/database`: Configuración de conexión a base de datos
- `src/main.ts`: Punto de entrada y configuración de Swagger/CORS

## Justificación Técnica

Se ha optado por NestJS (TypeScript) para mantener consistencia de lenguaje con el frontend y aprovechar su arquitectura robusta orientada a servicios, cumpliendo con todos los requisitos funcionales de API RESTful y documentación OpenAPI solicitados.
