# ── Stage 1: Build ──────────────────────────────────────────────────────────
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# In Docker (Nginx proxy), API_BASE is empty so fetch calls use relative paths
# that Nginx routes to the backend container. Override for non-proxy deployments.
ARG VITE_API_BASE_URL=""
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

# ── Stage 2: Serve with Nginx ────────────────────────────────────────────────
FROM nginx:alpine

# Copy built static files; Vite outputs to docs/ with base /p101/
COPY --from=build /app/docs /usr/share/nginx/html/p101

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
