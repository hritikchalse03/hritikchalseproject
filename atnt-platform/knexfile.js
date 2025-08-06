const { getDatabaseConfig } = require('./src/config/database');

/**
 * Knex configuration for database migrations and queries
 * Supports multiple environments with proper connection pooling
 */
module.exports = getDatabaseConfig();