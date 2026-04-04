### ── Stage 1: Build ────────────────────────────────────────
FROM node:20-alpine AS builder
RUN apk add --no-cache openssl
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build
RUN npm prune --omit=dev

### ── Stage 2: Production image ─────────────────────────────
FROM node:20-alpine
RUN apk add --no-cache openssl dumb-init \
 && addgroup --system --gid 1001 complicore \
 && adduser  --system --uid 1001 complicore
WORKDIR /usr/src/app

COPY --from=builder --chown=complicore:complicore /usr/src/app/package*.json ./
COPY --from=builder --chown=complicore:complicore /usr/src/app/node_modules ./node_modules
COPY --from=builder --chown=complicore:complicore /usr/src/app/dist ./dist

USER complicore
EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget -qO- http://127.0.0.1:4000/health/ready >/dev/null || exit 1

# dumb-init handles PID 1 zombie reaping and signal forwarding
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/index.js"]
