# Production Dockerfile for WebSocket Server

FROM oven/bun:1-alpine AS base
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache libc6-compat curl

# Copy package files
COPY package.json bun.lock turbo.json ./
COPY apps/ws-server/package.json ./apps/ws-server/
COPY packages ./packages

# Dependencies stage
FROM base AS deps
RUN bun install 

# Production stage
FROM oven/bun:1-alpine AS production
WORKDIR /app

# Install runtime dependencies
RUN apk add --no-cache curl

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN cd packages/db && bunx prisma generate

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

# Set ownership
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 8080
ENV PORT=8080
ENV NODE_ENV=production

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

CMD ["bun", "run", "apps/ws-server/index.ts"]