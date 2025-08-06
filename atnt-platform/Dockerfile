# =================================
# ATNT Platform - Multi-stage Dockerfile
# =================================

# Base stage with Node.js
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Install system dependencies for native modules
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    musl-dev \
    giflib-dev \
    pixman-dev \
    pangomm-dev \
    libjpeg-turbo-dev \
    freetype-dev

# Copy package files
COPY package*.json ./

# Development stage
FROM base AS development

# Install all dependencies (including devDependencies)
RUN npm ci

# Copy source code
COPY . .

# Create necessary directories
RUN mkdir -p uploads/transcripts uploads/avatars uploads/temp logs

# Set permissions
RUN chown -R node:node /app
USER node

# Expose ports
EXPOSE 3000 9229

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Default command
CMD ["npm", "run", "dev"]

# Production dependencies stage
FROM base AS production-deps

# Set NODE_ENV to production
ENV NODE_ENV=production

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Production stage
FROM node:18-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Set working directory
WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S atnt -u 1001

# Copy production dependencies
COPY --from=production-deps --chown=atnt:nodejs /app/node_modules ./node_modules

# Copy source code
COPY --chown=atnt:nodejs . .

# Create necessary directories
RUN mkdir -p uploads/transcripts uploads/avatars uploads/temp logs && \
    chown -R atnt:nodejs uploads logs

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

# Switch to non-root user
USER atnt

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["npm", "start"]