# docker build \
#   -t us-central1-docker.pkg.dev/iman1000-hosting/oneman1000-deployments/dashboard:latest \
#   -f apps/dashboard/Dockerfile \
#   .


FROM node:20-alpine AS base

# This Dockerfile is copy-pasted into our main docs at /docs/handbook/deploying-with-docker.
# Make sure you update both files!

FROM base AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk update
RUN apk add --no-cache libc6-compat
ENV COREPACK_NPM_REGISTRY=https://registry.npmmirror.com
RUN corepack enable
RUN sh -c 'for i in 1 2 3; do corepack prepare pnpm@10.4.1 --activate && exit 0; echo "corepack prepare pnpm failed (attempt $i)"; sleep 3; done; exit 1'

# Set working directory
WORKDIR /app
COPY . .
RUN pnpm dlx turbo prune dashboard --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN apk update
RUN apk add --no-cache libc6-compat
ENV COREPACK_NPM_REGISTRY=https://registry.npmmirror.com
RUN corepack enable
RUN sh -c 'for i in 1 2 3; do corepack prepare pnpm@10.4.1 --activate && exit 0; echo "corepack prepare pnpm failed (attempt $i)"; sleep 3; done; exit 1'
WORKDIR /app

# First install the dependencies (as they change less often)
COPY --from=builder /app/out/json/ .
RUN pnpm install --frozen-lockfile

# Build the project
COPY --from=builder /app/out/full/ .
# ENV TURBO_TEAM=$TURBO_TEAM

# ARG TURBO_TOKEN
# ENV TURBO_TOKEN=$TURBO_TOKEN

RUN pnpm turbo build --filter=dashboard...

FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/apps/dashboard/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/dashboard/.next/static ./apps/dashboard/.next/static


EXPOSE 3000
ENV PORT=3000
ENV NEXT_PUBLIC_API_URL=https://backend-api-594296215904.us-central1.run.app
# Set hostname to localhost
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/dashboard/server.js"]