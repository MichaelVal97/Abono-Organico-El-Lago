# Guía de Configuración - PostgreSQL

## Opción 1: Docker (Recomendado)

### Paso 1: Verificar instalación de Docker
```bash
docker --version
```
Si no está instalado, descárguelo del sitio oficial de Docker.

### Paso 2: Iniciar PostgreSQL
```bash
cd backend
docker-compose up -d
```

### Paso 3: Verificar estado
```bash
docker ps
```
Debe aparecer un contenedor activo llamado `abono-organico-postgres`.

### Paso 4: Iniciar backend
```bash
npm run start:dev
```
El servicio estará disponible en http://localhost:3000/api.

---

## Opción 2: PostgreSQL Local (Windows)

### Paso 1: Descargar e instalar
Descargue PostgreSQL para Windows desde el sitio oficial.

### Paso 2: Configuración
Durante la instalación, configure:
- Usuario: `postgres`
- Contraseña: `postgres` (o actualice el archivo .env)
- Puerto: `5432`

### Paso 3: Crear base de datos
Utilice pgAdmin o psql:
```sql
CREATE DATABASE abono_organico_db;
```

### Paso 4: Iniciar backend
```bash
cd backend
npm run start:dev
```

---

## Verificación

1. **Backend**: http://localhost:3000
2. **Swagger UI**: http://localhost:3000/api
3. **Cargar datos de prueba**:
   ```bash
   curl -X POST http://localhost:3000/products/seed
   ```

## Solución de Problemas

### Error de conexión a base de datos
- Verifique que el servicio de PostgreSQL esté en ejecución.
- Confirme las credenciales en el archivo `.env`.

### Puerto 5432 en uso
- Indique que otra instancia de PostgreSQL ya está ejecutándose.
- Detenga el servicio existente o utilice la instalación local.

### Base de datos no existe
- Ejecute el comando SQL de creación de base de datos mencionado en el Paso 3.
