#!/bin/sh
set -e

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║       KnowledgExchange — Producción      ║"
echo "╚══════════════════════════════════════════╝"
echo ""

# ── 1. Esperar a que PostgreSQL esté listo ───────────────────────────────────
echo "⏳ Esperando a PostgreSQL (db:5432)..."
until pg_isready -h db -p 5432 -U "$DATABASE_USER" -d knowledgexchange -q 2>/dev/null; do
  echo "   PostgreSQL no disponible todavía, reintentando en 2s..."
  sleep 2
done
echo "✅ PostgreSQL listo."
echo ""

# ── 2. Comprobar si la DB ya fue inicializada (idempotencia) ─────────────────
TABLE_EXISTS=$(
  PGPASSWORD="$DATABASE_PASSWORD" psql \
    -h db -U "$DATABASE_USER" -d knowledgexchange \
    -tAc "SELECT EXISTS (
            SELECT FROM information_schema.tables
            WHERE table_schema = 'public'
            AND   table_name   = 'users'
          );" 2>/dev/null || echo "f"
)

if [ "$TABLE_EXISTS" = "t" ]; then
  echo "✅ Base de datos ya inicializada. Omitiendo setup."
else
  echo "🔧 Primera ejecución: creando esquema..."
  npx prisma db push

  echo ""
  echo "🌱 Ejecutando seed de datos de prueba..."
  npx tsx prisma/seed.ts

  echo ""
  echo "✅ Base de datos inicializada correctamente."
fi

echo ""
echo "🚀 Iniciando servidor Next.js en producción (puerto 3000)..."
echo ""
exec npm run start
