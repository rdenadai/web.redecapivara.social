# Multi-stage Dockerfile for building the Vite + Vue app and serving it with nginx

# --- Builder stage ---
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies (copy package manifest first for layer caching)
COPY package.json package-lock.json* ./

# Prefer ci when lockfile present, otherwise install
RUN npm ci --silent || npm install --silent

# Copy rest of the sources
COPY . .

# Build the production assets (outputs to ./dist)
RUN npm run build


# --- Final stage: lightweight nginx with built assets ---
FROM nginx:stable-alpine AS runner

# Remove default nginx content and copy built files
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy SPA-friendly nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
