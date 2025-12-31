# Development Dockerfile
FROM node:18-alpine AS development
WORKDIR /app
# Copy package files
COPY package*.json ./
# Install dependencies
RUN npm ci
# Copy source code
COPY . .
# Expose port
EXPOSE 3000
# Development command
CMD ["npm", "run", "dev"]
# Production Dockerfile
FROM node:18-alpine AS build
WORKDIR /app
# Copy package files
COPY package*.json ./
# Install dependencies
RUN npm ci --only=production
# Copy source code
COPY . .
# Remove dev dependencies if any
RUN npm prune --production
# Production Dockerfile
FROM node:18-alpine AS production
WORKDIR /app
# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
# Copy built application
COPY --from=build --chown=nodejs:nodejs /app .
# Switch to non-root user
USER nodejs
# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
	CMD node -e "require('http').get('http://localhost:3000/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"
# Expose port
EXPOSE 3000
# Start application
CMD ["node", "src/server.js"]