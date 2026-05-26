# KnowledgExchange - Plataforma de Trueque de Habilidades

Proyecto completamente dockerizado. Levanta automáticamente el frontend/backend (Next.js) y la base de datos (PostgreSQL 16) con un único comando.

## 🚀 Requisitos Previos
* **Docker** y **Docker Compose** instalados y en ejecución (Docker Desktop).
* Node.js v18+ (opcional, solo si quieres ejecutar el seed manualmente sin Docker).

## 🛠️ Instrucciones de Despliegue

### 1. Levantar la infraestructura
Desde la raíz del proyecto:
```bash
docker compose up -d --build
```
Este comando descarga PostgreSQL, construye la imagen de Next.js y levanta ambos servicios. El contenedor de la aplicación detecta automáticamente si la base de datos está vacía y, en ese caso, **crea las tablas y carga los datos de prueba** sin intervención manual.

### 2. (Opcional) Re-inicializar la base de datos sin Docker
Si quieres regenerar el esquema y los datos contra una base de datos PostgreSQL local:
```bash
npm install
npm run db:setup
```

### 3. Acceder a la aplicación
* **Frontend / API**: http://localhost:3000
* **PostgreSQL**: `localhost:5432`

## 👥 Credenciales de prueba

| Email                          | Contraseña    | Rol   |
|--------------------------------|---------------|-------|
| admin@knowledgexchange.dev     | Admin1234!    | admin |
| ana.garcia@example.com         | User1234!     | user  |
| carlos.perez@example.com       | User1234!     | user  |
| lucia.martinez@example.com     | User1234!     | user  |
| pablo.ruiz@example.com         | User1234!     | user  |
| sofia.lopez@example.com        | User1234!     | user  |
| miguel.sanchez@example.com     | User1234!     | user  |
| carmen.fernandez@example.com   | User1234!     | user  |
| roberto.diaz@example.com       | User1234!     | user  |

## 🛑 Detener y limpiar
```bash
docker compose down       # apaga los contenedores
docker compose down -v    # apaga y borra también el volumen de la base de datos
```

## 📁 Estructura principal
* `/app/api`                 – Endpoints REST (Prisma ORM).
* `/app/(main)` / `/app/(auth)` – Vistas del frontend en React (Next.js App Router).
* `/components`              – Componentes reutilizables (modales, botones, acciones).
* `/services`                – Lógica de negocio desacoplada por dominio.
* `/lib`                     – Utilidades (auth, hashing, validación, manejo de errores).
* `/prisma/schema.prisma`    – Modelo de datos.
* `/prisma/seed.ts`          – Datos de prueba (usuarios, actividades, intercambios y reseñas).
* `/scripts/setup-db.ts`     – Script de inicialización local.
