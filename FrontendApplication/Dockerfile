# Multi-stage Dockerfile for React Frontend
# Build stage
FROM node:18-alpine AS build
WORKDIR /app
ENV CI=true
COPY package.json package-lock.json* yarn.lock* ./
RUN if [ -f yarn.lock ]; then yarn install --frozen-lockfile; elif [ -f package-lock.json ]; then npm ci; else npm install; fi
COPY public ./public
COPY src ./src
# Build with API base URL configurable at runtime using env var REACT_APP_API_BASE_URL
ARG REACT_APP_API_BASE_URL
ENV REACT_APP_API_BASE_URL=${REACT_APP_API_BASE_URL}
RUN npm run build

# Production stage - serve with a lightweight static server
FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve@14.2.0
COPY --from=build /app/build /app/build
EXPOSE 3000
# Use environment variable at runtime by replacing placeholder in index.html if needed (simple approach: pass at build time)
CMD ["serve", "-s", "build", "-l", "3000"]
