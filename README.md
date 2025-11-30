# Abono Orgánico El Lago

Sistema integral de comercio electrónico para la venta y distribución de abonos orgánicos. Este proyecto implementa una arquitectura moderna y desacoplada, integrando servicios de backend robustos, una interfaz de usuario dinámica y asistencia basada en inteligencia artificial.

## Arquitectura y Funcionamiento

El sistema opera mediante la orquestación de tres componentes principales que se comunican entre sí:

### 1. Frontend (Cliente Web)
- **Tecnología**: Next.js (React)
- **Función**: Interfaz de usuario principal donde los clientes exploran productos, gestionan su carrito de compras y realizan pedidos.
- **Comunicación**: Consume la API REST del backend para obtener datos de productos y se conecta vía WebSocket con el servicio de Chatbot para soporte en tiempo real.

### 2. Backend (API RESTful)
- **Tecnología**: NestJS (Node.js/TypeScript)
- **Base de Datos**: PostgreSQL
- **Función**: Núcleo de la lógica de negocio. Gestiona el inventario, procesa transacciones y mantiene la persistencia de datos.
- **Documentación**: Expone una interfaz Swagger/OpenAPI para facilitar la integración y pruebas de endpoints.

### 3. Servicio de Chatbot (IA)
- **Tecnología**: FastAPI (Python)
- **IA**: Google Gemini Pro
- **Función**: Proporciona asistencia automatizada inteligente.
  - **Web Chat**: Widget integrado en el frontend para consultas inmediatas.
  - **WhatsApp**: Integración vía Twilio para atención al cliente móvil.
- **Integración**: Consulta el Backend de NestJS para obtener información actualizada de productos y precios antes de generar respuestas con IA.

## Guía de Ejecución

Para desplegar el sistema completo en un entorno local, siga estos pasos en el orden indicado:

### Requisitos Previos
- Node.js (v18+)
- Docker y Docker Compose
- Cuenta de Google AI Studio (para API Key de Gemini)

### Paso 1: Base de Datos y Chatbot (Infraestructura Docker)

Inicie los servicios contenerizados (PostgreSQL y Chatbot):

```bash
cd chatbot-service
# Asegúrese de configurar su archivo .env primero
docker-compose up -d
```

### Paso 2: Backend (API NestJS)

Inicie el servidor de aplicaciones:

```bash
cd backend
npm install
npm run start:dev
```
- El servidor iniciará en: `http://localhost:3000`
- Documentación API: `http://localhost:3000/api`

### Paso 3: Frontend (Aplicación Next.js)

En una nueva terminal, inicie la interfaz de usuario:

```bash
# Desde la raíz del proyecto
npm install
npm run dev
```
- La aplicación estará disponible en: `http://localhost:9002`

## Verificación del Sistema

1. **Navegación**: Acceda a `http://localhost:9002` y verifique que los productos se carguen correctamente.
2. **Chatbot**: Abra el widget de chat en la esquina inferior derecha y realice una consulta (ej. "¿Qué abono sirve para tomates?").
3. **API**: Verifique la documentación en `http://localhost:3000/api`.

## Autor

Proyecto académico - Arquitectura de Software
Noviembre 2025
