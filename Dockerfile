# BASE SETUP
FROM node:lts-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

# BUILD STAGE
FROM base AS build
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

# PRODUCTION DEPENDENCIES
FROM base AS prod-deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

# PRODUCTION STAGE
FROM node:lts-slim AS production
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/build ./build
COPY --from=build /app/package.json ./package.json

EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "build"]
