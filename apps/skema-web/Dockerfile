# --- Builder ---
FROM node:22-alpine AS builder
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache libc6-compat curl

# Install deps
COPY package.json turbo.json bun.lock ./
COPY apps/skema-web/package.json ./apps/skema-web/
COPY packages ./packages

# Use npm for more stable cross-platform builds
RUN npm install

# Generate Prisma client
RUN cd packages/db && npx prisma generate

# Copy source code
COPY apps/skema-web ./apps/skema-web

# Build using Node (more reliable than bun for building)
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app/apps/skema-web
RUN npm run build

# --- Runtime ---
FROM oven/bun:1-alpine
WORKDIR /app

# Install runtime dependencies
RUN apk add --no-cache curl

# Copy built app and necessary files
COPY --from=builder /app/apps/skema-web/.next ./.next
COPY --from=builder /app/apps/skema-web/public ./public
COPY --from=builder /app/apps/skema-web/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

EXPOSE 3000
CMD ["bun", "run", "start"]