/**
 * Users table migration
 * Stores user authentication and profile information
 * 
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
exports.up = async function(knex) {
  return knex.schema.createTable('users', (table) => {
    // Primary key
    table.increments('id').primary();
    
    // Authentication fields
    table.string('email', 255).notNullable().unique();
    table.string('password_hash', 255).notNullable();
    table.boolean('email_verified').defaultTo(false);
    table.string('email_verification_token', 255).nullable();
    table.timestamp('email_verified_at').nullable();
    
    // Profile information
    table.string('first_name', 100).nullable();
    table.string('last_name', 100).nullable();
    table.string('display_name', 200).nullable();
    table.text('bio').nullable();
    table.string('avatar_url', 500).nullable();
    table.string('phone', 20).nullable();
    table.string('timezone', 50).defaultTo('UTC');
    table.string('language', 10).defaultTo('en');
    
    // Subscription and permissions
    table.enum('subscription_type', ['free', 'basic', 'premium', 'enterprise']).defaultTo('free');
    table.timestamp('subscription_expires_at').nullable();
    table.enum('role', ['user', 'analyst', 'admin', 'super_admin']).defaultTo('user');
    table.json('permissions').nullable();
    
    // Security and tracking
    table.string('refresh_token_hash', 255).nullable();
    table.timestamp('last_login_at').nullable();
    table.string('last_login_ip', 45).nullable(); // IPv6 support
    table.integer('failed_login_attempts').defaultTo(0);
    table.timestamp('locked_until').nullable();
    table.string('password_reset_token', 255).nullable();
    table.timestamp('password_reset_expires').nullable();
    
    // Preferences
    table.json('notification_preferences').nullable();
    table.json('ui_preferences').nullable();
    table.boolean('marketing_consent').defaultTo(false);
    table.boolean('analytics_consent').defaultTo(true);
    
    // Status and metadata
    table.enum('status', ['active', 'inactive', 'suspended', 'deleted']).defaultTo('active');
    table.json('metadata').nullable(); // For extensibility
    
    // Timestamps
    table.timestamps(true, true); // created_at, updated_at with default values
    table.timestamp('deleted_at').nullable(); // Soft delete support
    
    // Indexes for performance
    table.index(['email']);
    table.index(['subscription_type']);
    table.index(['role']);
    table.index(['status']);
    table.index(['created_at']);
    table.index(['last_login_at']);
    table.index(['email_verification_token']);
    table.index(['password_reset_token']);
    table.index(['refresh_token_hash']);
  });
};

/**
 * Rollback users table
 * 
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
exports.down = async function(knex) {
  return knex.schema.dropTableIfExists('users');
};