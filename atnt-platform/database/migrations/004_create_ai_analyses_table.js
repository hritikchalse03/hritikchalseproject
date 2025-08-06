/**
 * AI Analyses table migration
 * Stores AI-generated analysis results for transcripts and other content
 * 
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
exports.up = async function(knex) {
  return knex.schema.createTable('ai_analyses', (table) => {
    // Primary key
    table.increments('id').primary();
    
    // Foreign keys
    table.integer('transcript_id').unsigned().references('id').inTable('transcripts').onDelete('CASCADE');
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.integer('company_id').unsigned().references('id').inTable('companies').onDelete('SET NULL');
    
    // Analysis details
    table.enum('analysis_type', [
      'summary',
      'sentiment',
      'key_points',
      'risks',
      'opportunities',
      'financial_metrics',
      'management_tone',
      'market_outlook',
      'competitive_analysis',
      'esg_analysis',
      'custom_query'
    ]).notNullable();
    
    table.string('title', 255).nullable();
    table.text('query').nullable(); // Original user query or prompt
    table.text('content').notNullable(); // AI-generated content
    table.text('raw_response').nullable(); // Raw AI response before processing
    
    // AI Model information
    table.string('ai_model', 100).notNullable(); // gpt-4, gpt-3.5-turbo, etc.
    table.string('ai_provider', 50).defaultTo('openai'); // openai, anthropic, etc.
    table.integer('tokens_used').nullable();
    table.decimal('cost', 10, 6).nullable(); // Cost in USD
    table.decimal('processing_time_ms', 10, 2).nullable();
    
    // Quality and confidence metrics
    table.decimal('confidence_score', 3, 2).nullable(); // 0-1
    table.decimal('relevance_score', 3, 2).nullable(); // 0-1
    table.decimal('accuracy_score', 3, 2).nullable(); // 0-1 (if validated)
    table.integer('quality_rating').nullable(); // 1-5 user rating
    table.text('quality_feedback').nullable(); // User feedback on quality
    
    // Structured analysis results
    table.json('structured_data').nullable(); // Structured/parsed results
    table.json('extracted_metrics').nullable(); // Financial metrics extracted
    table.json('entities').nullable(); // Named entities found
    table.json('topics').nullable(); // Key topics identified
    table.json('sentiment_breakdown').nullable(); // Detailed sentiment analysis
    
    // Analysis metadata
    table.json('analysis_parameters').nullable(); // Parameters used for analysis
    table.json('context_data').nullable(); // Additional context provided
    table.string('language', 10).defaultTo('en');
    table.integer('word_count').nullable();
    table.decimal('reading_time_minutes', 6, 2).nullable();
    
    // Validation and verification
    table.boolean('is_verified').defaultTo(false);
    table.integer('verified_by_user_id').unsigned().nullable();
    table.timestamp('verified_at').nullable();
    table.text('verification_notes').nullable();
    table.json('fact_check_results').nullable();
    
    // Usage and engagement
    table.integer('view_count').defaultTo(0);
    table.integer('share_count').defaultTo(0);
    table.integer('bookmark_count').defaultTo(0);
    table.integer('export_count').defaultTo(0);
    table.boolean('is_featured').defaultTo(false);
    table.boolean('is_public').defaultTo(false);
    
    // Versioning and updates
    table.integer('version').defaultTo(1);
    table.integer('parent_analysis_id').nullable(); // For version tracking
    table.boolean('is_latest_version').defaultTo(true);
    table.text('update_reason').nullable();
    table.json('change_history').nullable();
    
    // Status and flags
    table.enum('status', ['processing', 'completed', 'failed', 'archived', 'deleted']).defaultTo('processing');
    table.text('error_message').nullable();
    table.json('error_details').nullable();
    table.boolean('requires_review').defaultTo(false);
    table.text('review_notes').nullable();
    
    // Timestamps
    table.timestamps(true, true);
    table.timestamp('completed_at').nullable();
    table.timestamp('archived_at').nullable();
    table.timestamp('deleted_at').nullable();
    
    // Indexes for performance
    table.index(['transcript_id']);
    table.index(['user_id']);
    table.index(['company_id']);
    table.index(['analysis_type']);
    table.index(['ai_model']);
    table.index(['status']);
    table.index(['is_verified']);
    table.index(['is_featured']);
    table.index(['is_public']);
    table.index(['created_at']);
    table.index(['completed_at']);
    table.index(['confidence_score']);
    table.index(['quality_rating']);
    
    // Composite indexes
    table.index(['transcript_id', 'analysis_type']);
    table.index(['user_id', 'created_at']);
    table.index(['company_id', 'analysis_type']);
    table.index(['status', 'created_at']);
    table.index(['analysis_type', 'is_public']);
    table.index(['parent_analysis_id', 'version']);
    
    // Foreign key constraints
    table.foreign('verified_by_user_id').references('id').inTable('users').onDelete('SET NULL');
    table.foreign('parent_analysis_id').references('id').inTable('ai_analyses').onDelete('SET NULL');
  });
};

/**
 * Rollback ai_analyses table
 * 
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
exports.down = async function(knex) {
  return knex.schema.dropTableIfExists('ai_analyses');
};