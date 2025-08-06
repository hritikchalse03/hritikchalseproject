/**
 * Companies table migration
 * Stores comprehensive company information and financial data
 * 
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
exports.up = async function(knex) {
  return knex.schema.createTable('companies', (table) => {
    // Primary key
    table.increments('id').primary();
    
    // Basic company information
    table.string('symbol', 10).notNullable().unique();
    table.string('name', 255).notNullable();
    table.string('legal_name', 255).nullable();
    table.string('exchange', 50).nullable(); // NYSE, NASDAQ, etc.
    table.string('currency', 3).defaultTo('USD');
    table.string('country', 2).nullable(); // ISO country code
    
    // Business information
    table.string('sector', 100).nullable();
    table.string('industry', 100).nullable();
    table.text('description').nullable();
    table.string('website', 500).nullable();
    table.string('headquarters', 255).nullable();
    table.integer('employees').nullable();
    table.date('founded_date').nullable();
    table.date('ipo_date').nullable();
    
    // Financial metrics
    table.decimal('market_cap', 20, 2).nullable();
    table.decimal('enterprise_value', 20, 2).nullable();
    table.decimal('revenue_ttm', 20, 2).nullable(); // Trailing twelve months
    table.decimal('net_income_ttm', 20, 2).nullable();
    table.decimal('total_assets', 20, 2).nullable();
    table.decimal('total_debt', 20, 2).nullable();
    table.decimal('cash_and_equivalents', 20, 2).nullable();
    table.decimal('book_value_per_share', 10, 4).nullable();
    
    // Stock price information
    table.decimal('current_price', 10, 4).nullable();
    table.decimal('day_change', 10, 4).nullable();
    table.decimal('day_change_percent', 8, 4).nullable();
    table.decimal('week_52_high', 10, 4).nullable();
    table.decimal('week_52_low', 10, 4).nullable();
    table.bigInteger('volume').nullable();
    table.bigInteger('avg_volume').nullable();
    table.decimal('beta', 6, 4).nullable();
    
    // Valuation ratios
    table.decimal('pe_ratio', 8, 2).nullable();
    table.decimal('forward_pe', 8, 2).nullable();
    table.decimal('peg_ratio', 6, 2).nullable();
    table.decimal('price_to_book', 6, 2).nullable();
    table.decimal('price_to_sales', 6, 2).nullable();
    table.decimal('ev_to_revenue', 6, 2).nullable();
    table.decimal('ev_to_ebitda', 6, 2).nullable();
    
    // Dividend information
    table.decimal('dividend_yield', 6, 4).nullable();
    table.decimal('dividend_per_share', 8, 4).nullable();
    table.date('ex_dividend_date').nullable();
    table.date('dividend_payment_date').nullable();
    
    // Analyst coverage
    table.integer('analyst_count').nullable();
    table.decimal('target_price_mean', 10, 4).nullable();
    table.decimal('target_price_high', 10, 4).nullable();
    table.decimal('target_price_low', 10, 4).nullable();
    table.enum('recommendation', ['strong_buy', 'buy', 'hold', 'sell', 'strong_sell']).nullable();
    
    // ESG and sustainability
    table.integer('esg_score').nullable();
    table.integer('environment_score').nullable();
    table.integer('social_score').nullable();
    table.integer('governance_score').nullable();
    
    // Platform-specific data
    table.integer('earnings_calls_count').defaultTo(0);
    table.timestamp('last_earnings_date').nullable();
    table.timestamp('next_earnings_date').nullable();
    table.integer('followers_count').defaultTo(0);
    table.integer('watchlist_count').defaultTo(0);
    table.decimal('platform_sentiment', 3, 2).nullable(); // -1 to 1
    
    // External data sources
    table.json('external_ids').nullable(); // Store IDs from various APIs
    table.json('data_sources').nullable(); // Track where data comes from
    table.timestamp('last_data_update').nullable();
    
    // Status and metadata
    table.enum('status', ['active', 'inactive', 'delisted', 'suspended']).defaultTo('active');
    table.boolean('is_featured').defaultTo(false);
    table.integer('priority_score').defaultTo(0); // For ranking/sorting
    table.json('tags').nullable(); // Flexible tagging system
    table.json('metadata').nullable();
    
    // Timestamps
    table.timestamps(true, true);
    table.timestamp('deleted_at').nullable();
    
    // Indexes for performance
    table.index(['symbol']);
    table.index(['name']);
    table.index(['exchange']);
    table.index(['sector']);
    table.index(['industry']);
    table.index(['market_cap']);
    table.index(['status']);
    table.index(['is_featured']);
    table.index(['priority_score']);
    table.index(['last_earnings_date']);
    table.index(['next_earnings_date']);
    table.index(['created_at']);
    table.index(['last_data_update']);
    
    // Composite indexes for common queries
    table.index(['exchange', 'sector']);
    table.index(['status', 'is_featured']);
    table.index(['market_cap', 'sector']);
  });
};

/**
 * Rollback companies table
 * 
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
exports.down = async function(knex) {
  return knex.schema.dropTableIfExists('companies');
};