/**
 * User features tables migration
 * Creates watchlists, alerts, and user interaction tables
 * 
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
exports.up = async function(knex) {
  // Watchlists table
  await knex.schema.createTable('watchlists', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.string('name', 255).notNullable();
    table.text('description').nullable();
    table.boolean('is_default').defaultTo(false);
    table.boolean('is_public').defaultTo(false);
    table.json('settings').nullable(); // Display preferences, sorting, etc.
    table.timestamps(true, true);
    
    table.index(['user_id']);
    table.index(['user_id', 'is_default']);
  });

  // Watchlist items table
  await knex.schema.createTable('watchlist_items', (table) => {
    table.increments('id').primary();
    table.integer('watchlist_id').unsigned().references('id').inTable('watchlists').onDelete('CASCADE');
    table.integer('company_id').unsigned().references('id').inTable('companies').onDelete('CASCADE');
    table.text('notes').nullable();
    table.decimal('target_price', 10, 4).nullable();
    table.json('custom_alerts').nullable();
    table.timestamps(true, true);
    
    table.unique(['watchlist_id', 'company_id']);
    table.index(['watchlist_id']);
    table.index(['company_id']);
  });

  // Smart alerts table
  await knex.schema.createTable('smart_alerts', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.integer('company_id').unsigned().references('id').inTable('companies').onDelete('CASCADE');
    
    table.string('name', 255).notNullable();
    table.text('description').nullable();
    
    table.enum('alert_type', [
      'price_change',
      'volume_spike',
      'earnings_date',
      'transcript_available',
      'analyst_rating',
      'news_sentiment',
      'financial_metric',
      'custom_condition'
    ]).notNullable();
    
    table.json('conditions').notNullable(); // Alert trigger conditions
    table.json('notification_methods').nullable(); // email, push, sms, etc.
    
    table.boolean('is_active').defaultTo(true);
    table.integer('trigger_count').defaultTo(0);
    table.timestamp('last_triggered_at').nullable();
    table.timestamp('expires_at').nullable();
    
    table.timestamps(true, true);
    
    table.index(['user_id']);
    table.index(['company_id']);
    table.index(['alert_type']);
    table.index(['is_active']);
    table.index(['last_triggered_at']);
  });

  // User bookmarks table
  await knex.schema.createTable('user_bookmarks', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    
    table.enum('bookmark_type', ['transcript', 'analysis', 'company', 'event']).notNullable();
    table.integer('bookmark_id').notNullable(); // ID of bookmarked item
    
    table.text('notes').nullable();
    table.json('tags').nullable();
    table.timestamps(true, true);
    
    table.unique(['user_id', 'bookmark_type', 'bookmark_id']);
    table.index(['user_id', 'bookmark_type']);
    table.index(['bookmark_type', 'bookmark_id']);
  });

  // User activity log table
  await knex.schema.createTable('user_activity_log', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    
    table.enum('activity_type', [
      'login',
      'logout',
      'view_transcript',
      'download_transcript',
      'create_analysis',
      'share_content',
      'add_to_watchlist',
      'create_alert',
      'search_query',
      'profile_update',
      'subscription_change'
    ]).notNullable();
    
    table.string('entity_type', 50).nullable(); // What was acted upon
    table.integer('entity_id').nullable(); // ID of the entity
    table.json('metadata').nullable(); // Additional activity data
    table.string('ip_address', 45).nullable();
    table.string('user_agent', 500).nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    table.index(['user_id', 'created_at']);
    table.index(['activity_type']);
    table.index(['entity_type', 'entity_id']);
    table.index(['created_at']);
  });

  // User preferences table
  await knex.schema.createTable('user_preferences', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').unique();
    
    // Notification preferences
    table.json('email_notifications').nullable();
    table.json('push_notifications').nullable();
    table.json('sms_notifications').nullable();
    
    // Display preferences
    table.string('theme', 20).defaultTo('dark');
    table.string('language', 10).defaultTo('en');
    table.string('timezone', 50).defaultTo('UTC');
    table.string('date_format', 20).defaultTo('YYYY-MM-DD');
    table.string('currency', 3).defaultTo('USD');
    
    // Content preferences
    table.json('default_sectors').nullable();
    table.json('hidden_companies').nullable();
    table.boolean('show_beta_features').defaultTo(false);
    table.integer('items_per_page').defaultTo(20);
    
    // Privacy preferences
    table.boolean('profile_public').defaultTo(false);
    table.boolean('activity_public').defaultTo(false);
    table.boolean('analytics_tracking').defaultTo(true);
    
    table.timestamps(true, true);
    
    table.index(['user_id']);
  });

  return Promise.resolve();
};

/**
 * Rollback user features tables
 * 
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('user_preferences');
  await knex.schema.dropTableIfExists('user_activity_log');
  await knex.schema.dropTableIfExists('user_bookmarks');
  await knex.schema.dropTableIfExists('smart_alerts');
  await knex.schema.dropTableIfExists('watchlist_items');
  await knex.schema.dropTableIfExists('watchlists');
};