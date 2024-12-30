FROM node:20-slim AS builder
# Set working directory
WORKDIR /app
# Install pnpm
RUN npm install -g pnpm turbo
COPY . .
RUN turbo prune --scope=server --docker

FROM node:20-slim AS installer
WORKDIR /app
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/turbo.json ./turbo.json
RUN pnpm install --frozen-lockfile
RUN pnpm drizzle generate

FROM node:20-slim AS sourcer
WORKDIR /app
COPY --from=installer /app/ .
COPY --from=builder /app/out/full/ .
COPY .gitignore .gitignore
RUN pnpm turbo run build --scope=server --include-dependencies --no-deps

FROM node:20-slim as runner
WORKDIR /app
COPY --from=sourcer /app/ .
CMD [ "node", "apps/server/dist/main.js" ]
