const { config } = require('./index');
const { logger } = require('../utils/logger');
const knexLib = require('knex');

/**
 * Database configuration for different environments
 * Supports PostgreSQL with connection pooling, SSL, and migrations
 */
const databaseConfig = {
  development: {
    client: 'postgresql',
    connection: {
      host: config.db.host,
      port: config.db.port,
      database: config.db.name,
      user: config.db.user,
      password: config.db.password,
      ssl: config.db.ssl ? { rejectUnauthorized: false } : false,
    },
    pool: {
      min: config.db.poolMin,
      max: config.db.poolMax,
      createTimeoutMillis: 3000,
      acquireTimeoutMillis: 30000,
      idleTimeoutMillis: 30000,
      reapIntervalMillis: 1000,
      createRetryIntervalMillis: 100,
      propagateCreateError: false,
    },
    migrations: {
      directory: './database/migrations',
      tableName: 'knex_migrations',
    },
    seeds: {
      directory: './database/seeds',
    },
    debug: config.env === 'development',
    asyncStackTraces: config.env === 'development',
  },

  test: {
    client: 'postgresql',
    connection: {
      host: config.db.host,
      port: config.db.port,
      database: `${config.db.name}_test`,
      user: config.db.user,
      password: config.db.password,
      ssl: false,
    },
    pool: {
      min: 1,
      max: 1,
    },
    migrations: {
      directory: './database/migrations',
      tableName: 'knex_migrations',
    },
    seeds: {
      directory: './database/seeds',
    },
  },

  production: {
    client: 'postgresql',
    connection: {
      host: config.db.host,
      port: config.db.port,
      database: config.db.name,
      user: config.db.user,
      password: config.db.password,
      ssl: { rejectUnauthorized: false },
    },
    pool: {
      min: config.db.poolMin,
      max: config.db.poolMax,
      createTimeoutMillis: 3000,
      acquireTimeoutMillis: 30000,
      idleTimeoutMillis: 30000,
      reapIntervalMillis: 1000,
      createRetryIntervalMillis: 100,
      propagateCreateError: false,
    },
    migrations: {
      directory: './database/migrations',
      tableName: 'knex_migrations',
    },
    seeds: {
      directory: './database/seeds',
    },
    debug: false,
  },
};

/**
 * Get database configuration for current environment
 * @returns {Object} Database configuration
 */
const getDatabaseConfig = () => {
  const envConfig = databaseConfig[config.env];
  
  if (!envConfig) {
    logger.error(`Database configuration not found for environment: ${config.env}`);
    throw new Error(`Invalid environment: ${config.env}`);
  }

  logger.info(`Database configuration loaded for environment: ${config.env}`);
  return envConfig;
};

/**
 * Initialize Knex instance
 */
const knex = knexLib(getDatabaseConfig());

/**
 * Database connection health check
 * @param {Object} knexInstance - Knex instance
 * @returns {Promise<boolean>} Connection status
 */
const checkDatabaseConnection = async (knexInstance = knex) => {
  try {
    await knexInstance.raw('SELECT 1');
    logger.info('Database connection successful');
    return true;
  } catch (error) {
    logger.error('Database connection failed:', error.message);
    return false;
  }
};

/**
 * Initialize database with migrations and seeds (development only)
 * @param {Object} knexInstance - Knex instance
 */
const initializeDatabase = async (knexInstance = knex) => {
  try {
    if (config.env === 'development') {
      logger.info('Running database migrations...');
      await knexInstance.migrate.latest();
      
      logger.info('Running database seeds...');
      await knexInstance.seed.run();
      
      logger.info('Database initialization completed');
    }
  } catch (error) {
    logger.error('Database initialization failed:', error.message);
    throw error;
  }
};

/**
 * Gracefully close database connection
 */
const closeDatabase = async () => {
  try {
    await knex.destroy();
    logger.info('Database connection closed');
  } catch (error) {
    logger.error('Error closing database connection:', error);
  }
};

module.exports = {
  knex,
  getDatabaseConfig,
  checkDatabaseConnection,
  initializeDatabase,
  closeDatabase,
  databaseConfig,
};