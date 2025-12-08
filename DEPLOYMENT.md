# 🚀 Guía de Despliegue Completo - Abono Orgánico El Lago

## Arquitectura de Despliegue

```
Frontend (Next.js) → Vercel
Backend (NestJS) → Railway + PostgreSQL
Chatbot (Python) → Railway
```

## Paso 1: Desplegar Backend en Railway

### 1.1 Crear Cuenta en Railway
1. Ve a [railway.app](https://railway.app)
2. Regístrate con GitHub
3. Crea un nuevo proyecto: "abono-organico-backend"

### 1.2 Agregar PostgreSQL
1. Click en "+ New"
2. Selecciona "Database" → "PostgreSQL"
3. Espera a que se provisione
4. Copia la `DATABASE_URL` (la necesitarás después)

### 1.3 Desplegar NestJS Backend
1. Click en "+ New" → "GitHub Repo"
2. Conecta tu repositorio
3. Selecciona la carpeta `backend/`
4. Railway detectará automáticamente NestJS

### 1.4 Configurar Variables de Entorno
En Railway, ve a "Variables" y agrega:

```
DATABASE_URL=<copiado automáticamente de PostgreSQL>
JWT_SECRET=tu_secreto_super_seguro_aqui
GOOGLE_CLIENT_ID=<tu_google_client_id>
GOOGLE_CLIENT_SECRET=<tu_google_client_secret>
FRONTEND_URL=https://tu-app.vercel.app
PORT=3000
```

### 1.5 Obtener URL del Backend
Una vez desplegado, Railway te dará una URL como:
```
https://abono-organico-backend.up.railway.app
```
**¡Guarda esta URL!**

## Paso 2: Desplegar Chatbot en Railway

### 2.1 Crear Nuevo Servicio
1. En el mismo proyecto Railway, click "+ New"
2. Selecciona "GitHub Repo"
3. Selecciona la carpeta `chatbot-service/`

### 2.2 Configurar Variables de Entorno
```
GOOGLE_API_KEY=<opcional - deja en blanco si usas respuestas simples>
NESTJS_API_URL=https://abono-organico-backend.up.railway.app
PORT=8000
```

### 2.3 Obtener URL del Chatbot
Railway te dará una URL como:
```
https://abono-organico-chatbot.up.railway.app
```
**¡Guarda esta URL!**

## Paso 3: Desplegar Frontend en Vercel

### 3.1 Preparar Repositorio
Asegúrate de que los cambios estén en GitHub:
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 3.2 Crear Proyecto en Vercel
1. Ve a [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Importa tu repositorio de GitHub
4. Vercel detectará Next.js automáticamente

### 3.3 Configurar Variables de Entorno
En Vercel, ve a "Settings" → "Environment Variables" y agrega:

```
NEXT_PUBLIC_API_URL=https://abono-organico-backend.up.railway.app
NEXT_PUBLIC_CHATBOT_WS=wss://abono-organico-chatbot.up.railway.app/ws/chat
```

### 3.4 Desplegar
1. Click "Deploy"
2. Espera 2-3 minutos
3. Tu sitio estará en: `https://abono-organico-el-lago.vercel.app`

## Paso 4: Configurar CORS en Backend

Actualiza `backend/src/main.ts` para permitir tu dominio de Vercel:

```typescript
app.enableCors({
  origin: [
    'http://localhost:9002',
    'https://abono-organico-el-lago.vercel.app', // Tu dominio de Vercel
  ],
  credentials: true,
});
```

Haz commit y push. Railway redesplegará automáticamente.

## Paso 5: Verificación Final

### Checklist de Pruebas
- [ ] Frontend carga correctamente
- [ ] Login funciona
- [ ] Registro funciona
- [ ] Google OAuth funciona
- [ ] Productos se muestran
- [ ] Chatbot responde
- [ ] Carrito funciona
- [ ] Mapa se muestra correctamente

## Solución de Problemas

### Frontend no se conecta al Backend
- Verifica que `NEXT_PUBLIC_API_URL` esté configurada en Vercel
- Asegúrate de que el backend esté corriendo en Railway
- Revisa la configuración de CORS

### Chatbot no funciona
- Verifica que `NEXT_PUBLIC_CHATBOT_WS` use `wss://` (no `ws://`)
- Asegúrate de que el servicio de chatbot esté corriendo en Railway

### Error de Base de Datos
- Verifica que `DATABASE_URL` esté configurada correctamente
- Asegúrate de que PostgreSQL esté corriendo en Railway

## URLs Finales

Después del despliegue, tendrás:

- **Frontend**: `https://abono-organico-el-lago.vercel.app`
- **Backend**: `https://abono-organico-backend.up.railway.app`
- **Chatbot**: `https://abono-organico-chatbot.up.railway.app`
- **Base de Datos**: Gestionada internamente por Railway

## Costos

- **Vercel**: Gratis (plan Hobby)
- **Railway**: $5/mes de crédito gratis, luego ~$10-15/mes
- **Total**: ~$10-15/mes después del crédito inicial

## Próximos Pasos

1. Configura un dominio personalizado en Vercel
2. Habilita HTTPS en todos los servicios (automático)
3. Configura monitoreo y logs
4. Implementa backups de base de datos
