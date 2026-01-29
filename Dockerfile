# ------------------------
# 1️⃣ Base stage
# ------------------------
FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# ------------------------
# 2️⃣ Build stage
# ------------------------
FROM base AS builder
WORKDIR /app

# Only copy files necessary for installation to leverage cache
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/backend/package.json ./apps/backend/
COPY apps/frontend/package.json ./apps/frontend/
COPY packages/shared-types/package.json ./packages/shared-types/

# Use BuildKit cache mount to speed up installation 
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --include-workspace-root

# Copy the rest of the source code and build
COPY . .
RUN ./node_modules/.bin/tsc -p packages/shared-types/tsconfig.json || true && \
    ./node_modules/.bin/tsc -p apps/backend/tsconfig.json --skipLibCheck --noEmitOnError false || true && \
    pnpm --filter @whiteboard/frontend build || true

# Deploy the backend to a standalone production folder 
# This creates a portable folder at /prod/backend
RUN pnpm deploy --filter=@whiteboard/backend --prod /prod/backend

# Copy frontend build to the expected location relative to backend
RUN mkdir -p /prod/frontend && \
    cp -r apps/frontend/dist /prod/frontend/ || true

# ------------------------
# 3️⃣ Runtime stage
# ------------------------
FROM base AS runtime
WORKDIR /app
ENV NODE_ENV=production

# Copy only the standalone deployment directory [7, 8]
COPY --from=builder /prod/backend .
# Copy frontend files to match the local structure (../../frontend/dist from backend/dist)
COPY --from=builder /prod/frontend/dist ../frontend/dist

EXPOSE 4000

# The path is now relative to the flattened deployment directory
CMD ["node", "dist/server.js"]