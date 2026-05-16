# ============================================================
# Dockerfile — Frontend React (Kang Bejo)
# Modul 6: Docker Frontend + Nginx
# ============================================================
# Multi-stage build:
#   Stage 1 (builder) — Install deps & build React app
#   Stage 2 (runner)  — Serve static files via nginx:alpine
# ============================================================

# ── Stage 1: Builder ─────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Build argument untuk API URL (diisi saat docker compose build)
ARG VITE_API_URL=http://localhost:8000
ENV VITE_API_URL=$VITE_API_URL

# Copy package files dulu (cache optimization — sama seperti backend)
COPY package*.json ./

# Install dependencies (ci = clean install, reproducible)
RUN npm ci

# Copy seluruh source code
COPY . .

# Build production bundle
RUN npm run build

# ── Stage 2: Runner (nginx) ───────────────────────────────
FROM nginx:alpine AS runner

# Hapus default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy hasil build dari stage 1
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port nginx
EXPOSE 80

# Jalankan nginx di foreground (agar container tidak langsung exit)
CMD ["nginx", "-g", "daemon off;"]
