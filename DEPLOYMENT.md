# 🚀 Guía Maestra de Despliegue - Abono Orgánico El Lago

Esta guía detalla paso a paso cómo llevar la aplicación a producción utilizando servicios modernos y gratuitos/económicos.

## 📋 Prerrequisitos
Antes de empezar, asegúrate de tener cuentas en:
1.  **GitHub**: Donde está alojado tu código.
2.  **Railway**: Para el Backend, Base de Datos y Chatbot ([railway.app](https://railway.app)).
3.  **Vercel**: Para el Frontend ([vercel.com](https://vercel.com)).
4.  **Cloudinary**: Para almacenamiento de imágenes ([cloudinary.com](https://cloudinary.com)).
5.  **Google Cloud Console**: Para el inicio de sesión con Google ([console.cloud.google.com](https://console.cloud.google.com)).

---

## 🛠️ Paso 1: Configuración de Base de Datos y Backend (Railway)

### 1.1 Crear Proyecto y Base de Datos
1.  Entra a Railway y crea un **"New Project"**.
2.  Selecciona **"Provision PostgreSQL"**.
3.  Una vez creada, haz clic en la tarjeta de PostgreSQL y ve a la pestaña **"Variables"**.
4.  Copia la `DATABASE_URL` (se ve como `postgresql://postgres:password@roundhouse.proxy.rlwy.net:PORT/railway`).

### 1.2 Desplegar el Backend (NestJS)
1.  En el mismo proyecto, haz clic en **"+ New"** → **"GitHub Repo"**.
2.  Selecciona tu repositorio: `Abono-Organico-El-Lago`.
3.  **Importante**: Railway intentará desplegar todo. Necesitamos decirle que solo despliegue el backend.
4.  Haz clic en la tarjeta del repositorio recién creado → **"Settings"**.
5.  En **"Root Directory"**, escribe: `/backend`.
6.  Ve a la pestaña **"Variables"** y configura las siguientes (¡UNA POR UNA O EN BLOQUE!):

| Variable | Descripción | Valor Ejemplo |
| :--- | :--- | :--- |
| `PORT` | Puerto interno | `3000` |
| `DATABASE_URL` | Conexión a BD | *(Pegar la que copiaste en el paso 1.1)* |
| `JWT_SECRET` | Secreto para tokens | `un_secreto_super_largo_y_seguro_123!` |
| `JWT_EXPIRATION` | Duración del token | `7d` |
| `FRONTEND_URL` | URL de Vercel (Paso 3) | `https://abono-organico-el-lago.vercel.app` (Ponlo temporal, luego actualizas) |
| `GOOGLE_CLIENT_ID` | OAuth Google | *(De tu Google Console)* |
| `GOOGLE_CLIENT_SECRET` | OAuth Google | *(De tu Google Console)* |
| `GOOGLE_CALLBACK_URL` | Redirección OAuth | `https://<TU-URL-BACKEND-RAILWAY>/auth/google/callback` |
| `CLOUDINARY_CLOUD_NAME`| Imágenes | *(De tu dashboard de Cloudinary)* |
| `CLOUDINARY_API_KEY` | Imágenes | *(De tu dashboard de Cloudinary)* |
| `CLOUDINARY_API_SECRET`| Imágenes | *(De tu dashboard de Cloudinary)* |

7.  Ve a la pestaña **"Settings"** → **"Networking"** y asegúrate de hacer clic en **"Generate Domain"**.
8.  Copia este dominio (ej: `web-production-1234.up.railway.app`). Este será tu `<TU-URL-BACKEND-RAILWAY>`.
9.  **Vuelve a "Variables"** y actualiza `GOOGLE_CALLBACK_URL` con el dominio real que acabas de generar.

---

## 🤖 Paso 2: Desplegar el Chatbot (Railway)

1.  En el mismo proyecto de Railway, clic en **"+ New"** → **"GitHub Repo"** (el mismo repo).
2.  Clic en la nueva tarjeta → **"Settings"**.
3.  En **"Root Directory"**, escribe: `/chatbot-service`.
4.  Ve a **"Variables"** y configura:

| Variable | Descripción | Valor Ejemplo |
| :--- | :--- | :--- |
| `PORT` | Puerto interno | `8000` |
| `NESTJS_API_URL` | Conexión al Backend | `https://<TU-URL-BACKEND-RAILWAY>` (Sin barra al final) |
| `GOOGLE_API_KEY` | Para Gemini AI | *(Tu clave de API de Google AI Studio)* |

5.  Ve a **"Settings"** → **"Networking"** → **"Generate Domain"**.
6.  Copia este dominio (ej: `chatbot-production-5678.up.railway.app`).

---

## 🌐 Paso 3: Desplegar el Frontend (Vercel)

1.  Entra a Vercel y haz clic en **"Add New..."** → **"Project"**.
2.  Importa el repositorio `Abono-Organico-El-Lago`.
3.  En **"Framework Preset"**, debería detectar Next.js automáticamente.
4.  En **"Root Directory"**, selecciona **Edit** y elige la carpeta raíz `.` (o déjalo por defecto si tu frontend es la raíz, pero en tu caso el frontend está mezclado en la raíz). **OJO**: Como tu frontend está en la raíz (`src/app`), déjalo por defecto.
5.  Despliega la sección **"Environment Variables"** y agrega:

| Variable | Descripción | Valor |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | URL del Backend | `https://<TU-URL-BACKEND-RAILWAY>` |
| `NEXT_PUBLIC_CHATBOT_WS`| WebSocket del Chatbot | `wss://<TU-URL-CHATBOT-RAILWAY>/ws/chat` (Nota: usa `wss://`) |

6.  Haz clic en **"Deploy"**.
7.  Vercel te dará una URL (ej: `https://abono-organico-el-lago.vercel.app`).

---

## 🔄 Paso 4: Conexión Final y Ajustes

### 4.1 Actualizar CORS en Backend (Si cambió la URL)
Si Vercel te dio una URL diferente a la que configuraste en `FRONTEND_URL` del backend:
1.  Ve a Railway → Backend → Variables.
2.  Actualiza `FRONTEND_URL` con la URL final de Vercel.
3.  Railway se reiniciará automáticamente.

### 4.2 Actualizar Google Cloud Console
1.  Ve a [Google Cloud Console](https://console.cloud.google.com).
2.  Selecciona tu proyecto y ve a "APIs & Services" → "Credentials".
3.  Edita tu cliente OAuth 2.0.
4.  En **"Authorized JavaScript origins"**, agrega: `https://abono-organico-el-lago.vercel.app` (tu URL de Vercel).
5.  En **"Authorized redirect URIs"**, asegura que esté: `https://<TU-URL-BACKEND-RAILWAY>/auth/google/callback`.

---

## 🛑 Solución de Problemas Comunes

### Error de "CORS" en el navegador
*   **Causa**: El backend no permite peticiones desde tu frontend en Vercel.
*   **Solución**: Verifica que la variable `FRONTEND_URL` en Railway coincida *exactamente* con la URL de tu navegador (sin slash al final). Revisa también `main.ts` en el backend para asegurar que usa esta variable o una lista de orígenes permitidos.

### Chatbot no conecta
*   **Causa**: Estás usando `https://` en lugar de `wss://` para la variable Web Socket o el puerto es incorrecto.
*   **Solución**: En Vercel, `NEXT_PUBLIC_CHATBOT_WS` debe empezar por `wss://`.

### Imágenes no cargan
*   **Causa**: Cloudinary no está configurado o las URLs antiguas apuntan a `localhost`.
*   **Solución**: Asegúrate de haber ejecutado el script de migración (`migrate-images.ts`) si tenías datos previos, y que `CLOUDINARY_*` variables estén en Railway.

---

## 💰 Resumen de Costos (Estimado)
*   **Vercel**: $0 (Hobby Tier).
*   **Cloudinary**: $0 (Free Tier).
*   **Railway**: $5 de crédito inicial gratis. Luego modelo "pay as you go". Para este proyecto, el costo debería ser menor a $5-8/mes si el tráfico es bajo/moderado. **Tip**: Railway suspende servicios inactivos para ahorrar dinero si lo configuras.
