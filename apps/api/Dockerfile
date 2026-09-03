# Stage 1: Prune workspace to only include NestJS API and its dependencies
FROM node:20-alpine AS pruner
RUN apk add --no-cache libc6-compat
RUN npm install -g turbo
WORKDIR /app
COPY . .
RUN turbo prune api --docker

# Stage 2: Installer
FROM node:20-alpine AS installer
RUN apk add --no-cache libc6-compat
RUN npm install -g pnpm@9.0.0
WORKDIR /app

# First copy lockfile and package.json to cache pnpm install
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile

# Copy remaining source code and configurations
COPY --from=pruner /app/out/full/ .
COPY turbo.json turbo.json



# Build database package (includes prisma generate and tsc)
RUN pnpm run build --filter=@repo/database_postgres
# Debug: verify generated client exists
RUN ls -la packages/database/dist/ || echo "dist missing"
RUN ls -la node_modules/.prisma/client/ || echo ".prisma/client missing"
RUN ls -la node_modules/@prisma/client/ || echo "@prisma/client missing"
# Build NestJS API (depends on database package)
RUN pnpm run build --filter=api

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app
RUN npm install -g pnpm@9.0.0

# 1. Define build arguments (ARG) for all environment variables
ARG PORT
ARG NODE_ENV
ARG ADMIN_SECRET
ARG DATABASE_URL
ARG REDIS_DB
ARG REDIS_HOST
ARG REDIS_PORT
ARG REDIS_PASSWORD
ARG FIREBASE_PROJECT_ID
ARG FIREBASE_CLIENT_EMAIL
ARG FIREBASE_PRIVATE_KEY
ARG RAZORPAY_KEY_ID
ARG RAZORPAY_KEY_SECRET
ARG GNEWS_API_KEY
ARG NEWS_API_KEY
ARG SENTRY_DSN
ARG NEW_RELIC_LICENSE_KEY
ARG NEW_RELIC_APP_NAME
ARG APP_VERSION

# 2. Map them to runtime environment variables (ENV)
ENV PORT=${PORT}
ENV NODE_ENV=${NODE_ENV}
ENV ADMIN_SECRET=${ADMIN_SECRET}
ENV DATABASE_URL=${DATABASE_URL}
ENV REDIS_DB=${REDIS_DB}
ENV REDIS_HOST=${REDIS_HOST}
ENV REDIS_PORT=${REDIS_PORT}
ENV REDIS_PASSWORD=${REDIS_PASSWORD}
ENV FIREBASE_PROJECT_ID=${FIREBASE_PROJECT_ID}
ENV FIREBASE_CLIENT_EMAIL=${FIREBASE_CLIENT_EMAIL}
ENV FIREBASE_PRIVATE_KEY=${FIREBASE_PRIVATE_KEY}
ENV RAZORPAY_KEY_ID=${RAZORPAY_KEY_ID}
ENV RAZORPAY_KEY_SECRET=${RAZORPAY_KEY_SECRET}
ENV GNEWS_API_KEY=${GNEWS_API_KEY}
ENV NEWS_API_KEY=${NEWS_API_KEY}
ENV SENTRY_DSN=${SENTRY_DSN}
ENV NEW_RELIC_LICENSE_KEY=${NEW_RELIC_LICENSE_KEY}
ENV NEW_RELIC_APP_NAME=${NEW_RELIC_APP_NAME}
ENV APP_VERSION=${APP_VERSION}

COPY --from=installer /app .

EXPOSE 3000
CMD ["sh", "-c", "pnpm run --filter=@repo/database_postgres generate && pnpm --filter api start:prod"]
