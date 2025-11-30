# Chatbot Service - Abono Orgánico El Lago

Microservicio de inteligencia artificial para atención al cliente, implementado con FastAPI y Google Gemini.

## Descripción

Este servicio gestiona la interacción con usuarios a través de chat web (WebSocket) y WhatsApp (Twilio), proporcionando respuestas automatizadas y contextualizadas sobre los productos del vivero.

## Tecnologías

- **Framework**: FastAPI (Python)
- **IA**: Google Gemini Pro
- **Mensajería**: Twilio (WhatsApp), WebSockets
- **Despliegue**: Docker

## Requisitos Previos

- Docker y Docker Compose
- Clave de API de Google Gemini
- Cuenta de Twilio (opcional, para WhatsApp)

## Configuración

1. Crear archivo `.env` basado en `.env.example`:
   ```env
   GOOGLE_API_KEY=su_clave_api
   TWILIO_ACCOUNT_SID=su_sid
   TWILIO_AUTH_TOKEN=su_token
   TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
   NESTJS_API_URL=http://host.docker.internal:3000
   ```

## Ejecución

Iniciar el servicio con Docker Compose:

```bash
docker-compose up -d
```

## Endpoints

- **Documentación API**: http://localhost:8000/docs
- **WebSocket Chat**: `ws://localhost:8000/ws/chat`
- **Webhook WhatsApp**: `POST /whatsapp/webhook`

## Integración

Este servicio se integra con:
- **Backend NestJS**: Para consultar el catálogo de productos actualizado.
- **Frontend Next.js**: A través del componente `ChatWidget`.
