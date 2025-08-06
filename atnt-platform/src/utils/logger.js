const winston = require('winston');
const path = require('path');
const { config } = require('../config');

/**
 * Custom log format for better readability
 */
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss.SSS',
  }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.prettyPrint()
);

/**
 * Console format for development
 */
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({
    format: 'HH:mm:ss',
  }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let log = `${timestamp} [${level}]: ${message}`;
    
    // Add metadata if present
    if (Object.keys(meta).length > 0) {
      log += '\n' + JSON.stringify(meta, null, 2);
    }
    
    return log;
  })
);

/**
 * Create transports based on environment
 */
const createTransports = () => {
  const transports = [];

  // Console transport (always enabled in development)
  if (config.env === 'development') {
    transports.push(
      new winston.transports.Console({
        format: consoleFormat,
        level: config.logging.level,
      })
    );
  }

  // File transport for all environments
  transports.push(
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'error.log'),
      level: 'error',
      format: logFormat,
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
    })
  );

  transports.push(
    new winston.transports.File({
      filename: path.join(process.cwd(), config.logging.file),
      format: logFormat,
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: config.logging.maxFiles,
    })
  );

  // Production-specific transports
  if (config.env === 'production') {
    // Add console for production with less verbose format
    transports.push(
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.errors({ stack: true }),
          winston.format.json()
        ),
        level: 'warn',
      })
    );
  }

  return transports;
};

/**
 * Create Winston logger instance
 */
const logger = winston.createLogger({
  level: config.logging.level,
  format: logFormat,
  defaultMeta: {
    service: config.app.name,
    version: config.app.version,
    environment: config.env,
  },
  transports: createTransports(),
  exitOnError: false,
});

/**
 * Create child logger with additional context
 * @param {Object} meta - Additional metadata
 * @returns {Object} Child logger instance
 */
const createChildLogger = (meta = {}) => {
  return logger.child(meta);
};

/**
 * Log HTTP requests
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {number} responseTime - Response time in milliseconds
 */
const logHttpRequest = (req, res, responseTime) => {
  const logData = {
    method: req.method,
    url: req.originalUrl,
    status: res.statusCode,
    responseTime: `${responseTime}ms`,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    userId: req.user?.id,
  };

  if (res.statusCode >= 400) {
    logger.warn('HTTP Request Failed', logData);
  } else {
    logger.info('HTTP Request', logData);
  }
};

/**
 * Log database queries (for development)
 * @param {string} query - SQL query
 * @param {Array} bindings - Query parameters
 * @param {number} duration - Query duration in milliseconds
 */
const logDatabaseQuery = (query, bindings, duration) => {
  if (config.env === 'development' && config.development.debugMode) {
    logger.debug('Database Query', {
      query: query.replace(/\s+/g, ' ').trim(),
      bindings,
      duration: `${duration}ms`,
    });
  }
};

/**
 * Log API errors with context
 * @param {Error} error - Error object
 * @param {Object} req - Express request object
 * @param {Object} context - Additional context
 */
const logApiError = (error, req = {}, context = {}) => {
  const errorData = {
    message: error.message,
    stack: error.stack,
    method: req.method,
    url: req.originalUrl,
    userId: req.user?.id,
    ip: req.ip,
    userAgent: req.get?.('User-Agent'),
    ...context,
  };

  logger.error('API Error', errorData);
};

/**
 * Log business events
 * @param {string} event - Event name
 * @param {Object} data - Event data
 * @param {Object} user - User context
 */
const logBusinessEvent = (event, data = {}, user = {}) => {
  logger.info('Business Event', {
    event,
    userId: user.id,
    userEmail: user.email,
    ...data,
  });
};

/**
 * Log security events
 * @param {string} event - Security event type
 * @param {Object} data - Event data
 * @param {Object} req - Express request object
 */
const logSecurityEvent = (event, data = {}, req = {}) => {
  logger.warn('Security Event', {
    event,
    ip: req.ip,
    userAgent: req.get?.('User-Agent'),
    method: req.method,
    url: req.originalUrl,
    ...data,
  });
};

/**
 * Log performance metrics
 * @param {string} operation - Operation name
 * @param {number} duration - Duration in milliseconds
 * @param {Object} metadata - Additional metadata
 */
const logPerformance = (operation, duration, metadata = {}) => {
  if (duration > 1000) { // Log slow operations
    logger.warn('Slow Operation', {
      operation,
      duration: `${duration}ms`,
      ...metadata,
    });
  } else if (config.development.debugMode) {
    logger.debug('Performance', {
      operation,
      duration: `${duration}ms`,
      ...metadata,
    });
  }
};

/**
 * Graceful shutdown logging
 */
const logShutdown = (signal) => {
  logger.info('Application Shutdown', {
    signal,
    timestamp: new Date().toISOString(),
  });
};

// Handle uncaught exceptions and unhandled rejections
logger.exceptions.handle(
  new winston.transports.File({
    filename: path.join(process.cwd(), 'logs', 'exceptions.log'),
    format: logFormat,
  })
);

logger.rejections.handle(
  new winston.transports.File({
    filename: path.join(process.cwd(), 'logs', 'rejections.log'),
    format: logFormat,
  })
);

module.exports = {
  logger,
  createChildLogger,
  logHttpRequest,
  logDatabaseQuery,
  logApiError,
  logBusinessEvent,
  logSecurityEvent,
  logPerformance,
  logShutdown,
};