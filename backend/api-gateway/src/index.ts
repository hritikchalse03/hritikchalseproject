import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

// Import configurations and services
import { config } from './config/config';
import { connectDatabase } from './config/database';
import { connectRedis } from './config/redis';
import { connectElasticsearch } from './config/elasticsearch';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { authMiddleware } from './middleware/auth';

// Import routes
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import companyRoutes from './routes/company';
import eventRoutes from './routes/event';
import transcriptRoutes from './routes/transcript';
import searchRoutes from './routes/search';
import subscriptionRoutes from './routes/subscription';
import webhookRoutes from './routes/webhook';

// Import socket handlers
import { setupSocketHandlers } from './services/socketService';

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: config.cors.origin,
    credentials: true,
  },
});

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
}));
app.use(limiter);
app.use(morgan(config.logging.format));
app.use(requestLogger);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.env,
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/transcripts', authMiddleware, transcriptRoutes);
app.use('/api/search', authMiddleware, searchRoutes);
app.use('/api/subscriptions', authMiddleware, subscriptionRoutes);
app.use('/api/webhooks', webhookRoutes);

// API Documentation
if (config.env === 'development') {
  const swaggerUi = require('swagger-ui-express');
  const swaggerJSDoc = require('swagger-jsdoc');
  
  const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'FinanceStream API',
        version: '1.0.0',
        description: 'API for FinanceStream financial research platform',
      },
      servers: [
        {
          url: `http://localhost:${config.port}`,
          description: 'Development server',
        },
      ],
    },
    apis: ['./src/routes/*.ts'],
  };
  
  const swaggerSpec = swaggerJSDoc(swaggerOptions);
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
  });
});

// Error handling middleware
app.use(errorHandler);

// Socket.IO setup
setupSocketHandlers(io);

// Initialize services and start server
async function startServer() {
  try {
    console.log('🚀 Starting FinanceStream API Gateway...');
    
    // Connect to databases
    await connectDatabase();
    console.log('✅ Database connected');
    
    await connectRedis();
    console.log('✅ Redis connected');
    
    await connectElasticsearch();
    console.log('✅ Elasticsearch connected');
    
    // Start server
    server.listen(config.port, () => {
      console.log(`🌟 Server running on port ${config.port}`);
      console.log(`📚 Environment: ${config.env}`);
      
      if (config.env === 'development') {
        console.log(`📖 API Documentation: http://localhost:${config.port}/api/docs`);
      }
    });
    
    // Graceful shutdown
    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

async function gracefulShutdown(signal: string) {
  console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);
  
  server.close(() => {
    console.log('✅ HTTP server closed');
    process.exit(0);
  });
  
  // Force close after 30 seconds
  setTimeout(() => {
    console.error('❌ Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 30000);
}

// Start the server
startServer();