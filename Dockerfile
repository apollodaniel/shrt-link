FROM oven/bun:alpine AS base

# Stage 1: Install dependencies
FROM base AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Stage 2: Build the application
FROM base AS builder

ENV API_URL="http://backend:8095"
ENV NEXT_PUBLIC_APP_URL="https://shrtl.apollodaniel.stream"

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
RUN bun run build

# Stage 3: Production server
FROM base AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV API_URL="http://backend:8095"
ENV NEXT_PUBLIC_APP_URL="https://shrtl.apollodaniel.stream"

# COPY --from=builder /app /app
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["bun", "run", "server.js"]
