# syntax=docker/dockerfile:1
# Build: same stack as .gitlab-ci.yml (npm + Node 22). Runtime: standalone bundle only.

FROM public.ecr.aws/docker/library/node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# NEXT_PUBLIC_* are inlined at build time — pass --build-arg in CI or compose.
ARG NEXT_PUBLIC_API_URL=""
ARG NEXT_PUBLIC_TABLE_CRM_TOKEN=""
ARG NEXT_PUBLIC_ORG_ID=""
ARG NEXT_PUBLIC_ORDER_WAREHOUSE=""
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_PUBLIC_TABLE_CRM_TOKEN=$NEXT_PUBLIC_TABLE_CRM_TOKEN \
    NEXT_PUBLIC_ORG_ID=$NEXT_PUBLIC_ORG_ID \
    NEXT_PUBLIC_ORDER_WAREHOUSE=$NEXT_PUBLIC_ORDER_WAREHOUSE

RUN npm run build

# ---

FROM public.ecr.aws/docker/library/node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
