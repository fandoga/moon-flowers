# syntax=docker/dockerfile:1
ARG NODE_VERSION=22
##########################################################

FROM node:${NODE_VERSION}-alpine AS vendor
WORKDIR /app

COPY package.json package-lock.json ./
RUN --mount=type=cache,id=npm,target=/root/.npm npm ci

##########################################################

FROM node:${NODE_VERSION}-alpine AS builder
COPY . .
COPY --from=vendor /app/node_modules ./node_modules
RUN --mount=type=cache,id=npm,target=/app/node_modules/.cache npm run build

##########################################################

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
