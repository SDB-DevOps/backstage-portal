# Stage 1: Build the backend bundle
FROM node:20-bookworm-slim AS build

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    g++ \
    make \
    git \
    ca-certificates \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy yarn configuration and manifests
COPY .yarn ./.yarn
COPY .yarnrc.yml package.json yarn.lock ./
COPY packages/ packages/
COPY plugins/ plugins/

# Install dependencies and build bundles
RUN yarn install --immutable
RUN yarn tsc
RUN yarn build:backend

# Stage 2: Production runner image
FROM node:20-bookworm-slim AS runner

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    git \
    ca-certificates \
  && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
WORKDIR /app

# Copy built backend bundle
COPY --from=build /app/packages/backend/dist/bundle.tar.gz ./
RUN tar xzf bundle.tar.gz && rm bundle.tar.gz

# Copy configuration files
COPY app-config.yaml app-config.production.yaml ./

# Security: non-root user
USER 1001
EXPOSE 7007

CMD ["node", "packages/backend", "--config", "app-config.yaml", "--config", "app-config.production.yaml"]
