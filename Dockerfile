# ── Stage 1: Instalar dependencias ──────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app

COPY package*.json ./
RUN npm ci

# ── Stage 2: Build de Next.js ────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npx prisma generate
RUN npm run build

# ── Stage 3: Runner de producción ────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN apk add --no-cache postgresql-client openssl

COPY --from=builder /app/public           ./public
COPY --from=builder /app/.next            ./.next
COPY --from=builder /app/node_modules     ./node_modules
COPY --from=builder /app/package.json     ./package.json
COPY --from=builder /app/prisma           ./prisma
COPY --from=builder /app/scripts          ./scripts
COPY --from=builder /app/lib              ./lib

COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["./entrypoint.sh"]
