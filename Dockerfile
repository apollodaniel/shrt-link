FROM oven/bun:alpine AS base

# Stage 1: Install dependencies
FROM base AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Stage 2: Build the application
FROM base AS builder

# change to your actual env variables
ENV API_URL "http://localhost:8080"
ENV NEXT_PUBLIC_APP_URL "http://localhost:3000"

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
RUN bun run build

# Stage 3: Production server
FROM base AS runner

WORKDIR /app
ENV NODE_ENV=production

# change to your actual env variables
ENV API_URL "http://localhost:8080"
ENV NEXT_PUBLIC_APP_URL "http://localhost:3000"

# COPY --from=builder /app /app
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["bun", "run", "server.js"]
