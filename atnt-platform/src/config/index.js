require('dotenv').config();
const Joi = require('joi');

/**
 * Environment variables validation schema
 * Ensures all required configuration is present and valid
 */
const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'test', 'production').default('development'),
  PORT: Joi.number().default(3000),
  APP_NAME: Joi.string().default('ATNT Platform'),
  APP_VERSION: Joi.string().default('1.0.0'),
  API_BASE_URL: Joi.string().uri().default('http://localhost:3000/api'),

  // Database
  DB_HOST: Joi.string().default('localhost'),
  DB_PORT: Joi.number().default(5432),
  DB_NAME: Joi.string().default('atnt_platform'),
  DB_USER: Joi.string().default('atnt_user'),
  DB_PASSWORD: Joi.string().required(),
  DB_SSL: Joi.boolean().default(false),
  DB_POOL_MIN: Joi.number().default(2),
  DB_POOL_MAX: Joi.number().default(10),

  // Redis
  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().default(6379),
  REDIS_PASSWORD: Joi.string().allow('').default(''),
  REDIS_DB: Joi.number().default(0),

  // JWT
  JWT_SECRET: Joi.string().min(32).required(),
  JWT_REFRESH_SECRET: Joi.string().min(32).required(),
  JWT_EXPIRES_IN: Joi.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),

  // OpenAI
  OPENAI_API_KEY: Joi.string().required(),
  OPENAI_MODEL: Joi.string().default('gpt-4'),
  OPENAI_MAX_TOKENS: Joi.number().default(2000),
  OPENAI_TEMPERATURE: Joi.number().min(0).max(2).default(0.3),

  // File Upload
  MAX_FILE_SIZE: Joi.number().default(10485760), // 10MB
  ALLOWED_FILE_TYPES: Joi.string().default('pdf,doc,docx,txt'),
  UPLOAD_PATH: Joi.string().default('uploads/'),

  // Email
  EMAIL_SERVICE: Joi.string().default('sendgrid'),
  EMAIL_API_KEY: Joi.string().allow('').default(''),
  EMAIL_FROM: Joi.string().email().default('noreply@atnt-platform.com'),
  EMAIL_FROM_NAME: Joi.string().default('ATNT Platform'),

  // External APIs
  ALPHA_VANTAGE_API_KEY: Joi.string().allow('').default(''),
  POLYGON_API_KEY: Joi.string().allow('').default(''),
  YAHOO_FINANCE_API_KEY: Joi.string().allow('').default(''),

  // Security
  BCRYPT_ROUNDS: Joi.number().default(12),
  RATE_LIMIT_WINDOW_MS: Joi.number().default(900000), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: Joi.number().default(100),
  CORS_ORIGIN: Joi.string().default('http://localhost:3000'),

  // Logging
  LOG_LEVEL: Joi.string().valid('error', 'warn', 'info', 'debug').default('info'),
  LOG_FILE: Joi.string().default('logs/app.log'),
  LOG_MAX_SIZE: Joi.string().default('10m'),
  LOG_MAX_FILES: Joi.number().default(5),

  // Monitoring
  SENTRY_DSN: Joi.string().allow('').default(''),
  ENABLE_MONITORING: Joi.boolean().default(true),

  // Background Jobs
  QUEUE_REDIS_URL: Joi.string().default('redis://localhost:6379'),
  QUEUE_CONCURRENCY: Joi.number().default(5),

  // WebSocket
  SOCKET_CORS_ORIGIN: Joi.string().default('http://localhost:3000'),

  // Development
  SWAGGER_ENABLED: Joi.boolean().default(true),
  DEBUG_MODE: Joi.boolean().default(false),
}).unknown();

/**
 * Validate and parse environment variables
 */
const { error, value: envVars } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

/**
 * Application configuration object
 * Centralized configuration for the entire application
 */
const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  app: {
    name: envVars.APP_NAME,
    version: envVars.APP_VERSION,
    apiBaseUrl: envVars.API_BASE_URL,
  },

  db: {
    host: envVars.DB_HOST,
    port: envVars.DB_PORT,
    name: envVars.DB_NAME,
    user: envVars.DB_USER,
    password: envVars.DB_PASSWORD,
    ssl: envVars.DB_SSL,
    poolMin: envVars.DB_POOL_MIN,
    poolMax: envVars.DB_POOL_MAX,
  },

  redis: {
    host: envVars.REDIS_HOST,
    port: envVars.REDIS_PORT,
    password: envVars.REDIS_PASSWORD,
    db: envVars.REDIS_DB,
  },

  jwt: {
    secret: envVars.JWT_SECRET,
    refreshSecret: envVars.JWT_REFRESH_SECRET,
    expiresIn: envVars.JWT_EXPIRES_IN,
    refreshExpiresIn: envVars.JWT_REFRESH_EXPIRES_IN,
  },

  openai: {
    apiKey: envVars.OPENAI_API_KEY,
    model: envVars.OPENAI_MODEL,
    maxTokens: envVars.OPENAI_MAX_TOKENS,
    temperature: envVars.OPENAI_TEMPERATURE,
  },

  upload: {
    maxFileSize: envVars.MAX_FILE_SIZE,
    allowedFileTypes: envVars.ALLOWED_FILE_TYPES.split(','),
    uploadPath: envVars.UPLOAD_PATH,
  },

  email: {
    service: envVars.EMAIL_SERVICE,
    apiKey: envVars.EMAIL_API_KEY,
    from: envVars.EMAIL_FROM,
    fromName: envVars.EMAIL_FROM_NAME,
  },

  externalApis: {
    alphaVantage: envVars.ALPHA_VANTAGE_API_KEY,
    polygon: envVars.POLYGON_API_KEY,
    yahooFinance: envVars.YAHOO_FINANCE_API_KEY,
  },

  security: {
    bcryptRounds: envVars.BCRYPT_ROUNDS,
    rateLimitWindowMs: envVars.RATE_LIMIT_WINDOW_MS,
    rateLimitMaxRequests: envVars.RATE_LIMIT_MAX_REQUESTS,
    corsOrigin: envVars.CORS_ORIGIN,
  },

  logging: {
    level: envVars.LOG_LEVEL,
    file: envVars.LOG_FILE,
    maxSize: envVars.LOG_MAX_SIZE,
    maxFiles: envVars.LOG_MAX_FILES,
  },

  monitoring: {
    sentryDsn: envVars.SENTRY_DSN,
    enabled: envVars.ENABLE_MONITORING,
  },

  queue: {
    redisUrl: envVars.QUEUE_REDIS_URL,
    concurrency: envVars.QUEUE_CONCURRENCY,
  },

  socket: {
    corsOrigin: envVars.SOCKET_CORS_ORIGIN,
  },

  development: {
    swaggerEnabled: envVars.SWAGGER_ENABLED,
    debugMode: envVars.DEBUG_MODE,
  },
};

/**
 * Validate configuration completeness
 */
const validateConfig = () => {
  const requiredConfigs = [
    'db.password',
    'jwt.secret',
    'jwt.refreshSecret',
    'openai.apiKey',
  ];

  const missing = requiredConfigs.filter(configPath => {
    const value = configPath.split('.').reduce((obj, key) => obj?.[key], config);
    return !value || value === 'your_secure_password' || value.includes('your_');
  });

  if (missing.length > 0) {
    throw new Error(`Missing required configuration: ${missing.join(', ')}`);
  }
};

/**
 * Get configuration for specific environment
 * @param {string} env - Environment name
 * @returns {Object} Environment-specific configuration
 */
const getConfigForEnv = (env = config.env) => {
  const envSpecificConfig = { ...config };
  
  if (env === 'production') {
    envSpecificConfig.development.debugMode = false;
    envSpecificConfig.development.swaggerEnabled = false;
    envSpecificConfig.logging.level = 'warn';
  }

  return envSpecificConfig;
};

// Validate configuration on startup (except in test environment)
if (config.env !== 'test') {
  validateConfig();
}

module.exports = {
  config,
  validateConfig,
  getConfigForEnv,
};