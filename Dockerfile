# Could use node 24 if not deploying to fly (only supports up to node 22)
FROM node:22-slim AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source
COPY . .

# Build
RUN pnpm build

# Production image
FROM node:22-slim AS runner

WORKDIR /app

# Install pnpm for production deps
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files and install prod deps only
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

# Copy built app
COPY --from=builder /app/build ./build

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "build"]
