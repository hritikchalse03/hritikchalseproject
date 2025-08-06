/**
 * Transcripts table migration
 * Stores earnings calls, conference transcripts, and financial documents
 * 
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
exports.up = async function(knex) {
  return knex.schema.createTable('transcripts', (table) => {
    // Primary key
    table.increments('id').primary();
    
    // Foreign keys
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.integer('company_id').unsigned().references('id').inTable('companies').onDelete('CASCADE');
    
    // Basic transcript information
    table.string('title', 500).notNullable();
    table.text('description').nullable();
    table.enum('type', [
      'earnings_call', 
      'conference_call', 
      'investor_day', 
      'shareholder_meeting',
      'analyst_call',
      'guidance_update',
      'other'
    ]).defaultTo('earnings_call');
    
    // Event details
    table.date('event_date').notNullable();
    table.time('event_time').nullable();
    table.string('event_timezone', 50).defaultTo('UTC');
    table.enum('quarter', ['Q1', 'Q2', 'Q3', 'Q4']).nullable();
    table.integer('fiscal_year').nullable();
    table.boolean('is_live').defaultTo(false);
    table.timestamp('live_start_time').nullable();
    table.timestamp('live_end_time').nullable();
    
    // File information
    table.string('original_filename', 255).nullable();
    table.string('file_path', 500).nullable();
    table.string('file_type', 50).nullable(); // pdf, docx, txt, audio, video
    table.bigInteger('file_size').nullable(); // in bytes
    table.string('file_hash', 64).nullable(); // SHA-256 for integrity
    table.string('mime_type', 100).nullable();
    
    // Content and processing
    table.text('raw_content').nullable(); // Extracted text content
    table.text('processed_content').nullable(); // Cleaned/processed content
    table.integer('word_count').nullable();
    table.integer('character_count').nullable();
    table.decimal('reading_time_minutes', 6, 2).nullable();
    table.string('language', 10).defaultTo('en');
    
    // Processing status
    table.enum('processing_status', [
      'uploaded',
      'extracting',
      'processing',
      'analyzing',
      'completed',
      'failed',
      'archived'
    ]).defaultTo('uploaded');
    table.text('processing_error').nullable();
    table.timestamp('processed_at').nullable();
    table.json('processing_metadata').nullable();
    
    // AI Analysis results
    table.boolean('ai_analyzed').defaultTo(false);
    table.timestamp('ai_analyzed_at').nullable();
    table.decimal('sentiment_score', 3, 2).nullable(); // -1 to 1
    table.enum('sentiment_label', ['very_negative', 'negative', 'neutral', 'positive', 'very_positive']).nullable();
    table.json('key_topics').nullable(); // Array of extracted topics
    table.json('entities').nullable(); // Named entities (people, companies, etc.)
    table.json('financial_metrics').nullable(); // Extracted financial data
    table.text('ai_summary').nullable();
    table.integer('confidence_score').nullable(); // 0-100
    
    // Audio/Video specific fields
    table.integer('duration_seconds').nullable();
    table.string('audio_url', 500).nullable();
    table.string('video_url', 500).nullable();
    table.json('speakers').nullable(); // Array of speaker information
    table.boolean('has_timestamps').defaultTo(false);
    table.json('transcript_segments').nullable(); // Timestamped segments
    
    // Engagement and analytics
    table.integer('view_count').defaultTo(0);
    table.integer('download_count').defaultTo(0);
    table.integer('share_count').defaultTo(0);
    table.integer('bookmark_count').defaultTo(0);
    table.decimal('average_rating', 3, 2).nullable(); // 1-5 stars
    table.integer('rating_count').defaultTo(0);
    
    // Search and indexing
    table.text('search_vector').nullable(); // Full-text search vector
    table.json('search_keywords').nullable(); // Extracted keywords for search
    table.integer('search_rank').defaultTo(0); // Search ranking score
    
    // Access control and privacy
    table.enum('visibility', ['public', 'private', 'company_only', 'premium_only']).defaultTo('private');
    table.boolean('is_featured').defaultTo(false);
    table.boolean('requires_subscription').defaultTo(false);
    table.json('access_permissions').nullable();
    
    // External references
    table.string('external_id', 100).nullable(); // ID from external source
    table.string('source_url', 500).nullable(); // Original source URL
    table.json('external_metadata').nullable(); // Metadata from external sources
    
    // Status and flags
    table.enum('status', ['active', 'archived', 'deleted', 'suspended']).defaultTo('active');
    table.boolean('is_verified').defaultTo(false); // Content verification
    table.boolean('contains_material_info').defaultTo(false); // Material information flag
    table.json('compliance_flags').nullable(); // Regulatory compliance flags
    table.json('quality_scores').nullable(); // Various quality metrics
    
    // Versioning and history
    table.integer('version').defaultTo(1);
    table.integer('parent_transcript_id').nullable(); // For versioning
    table.json('change_log').nullable(); // Track changes
    
    // Timestamps
    table.timestamps(true, true);
    table.timestamp('deleted_at').nullable();
    table.timestamp('archived_at').nullable();
    
    // Indexes for performance
    table.index(['user_id']);
    table.index(['company_id']);
    table.index(['type']);
    table.index(['event_date']);
    table.index(['quarter', 'fiscal_year']);
    table.index(['processing_status']);
    table.index(['ai_analyzed']);
    table.index(['visibility']);
    table.index(['status']);
    table.index(['is_featured']);
    table.index(['created_at']);
    table.index(['processed_at']);
    table.index(['view_count']);
    table.index(['search_rank']);
    table.index(['file_hash']);
    
    // Composite indexes for common queries
    table.index(['company_id', 'event_date']);
    table.index(['type', 'status']);
    table.index(['user_id', 'created_at']);
    table.index(['processing_status', 'created_at']);
    table.index(['visibility', 'is_featured']);
    table.index(['quarter', 'fiscal_year', 'company_id']);
    
    // Full-text search index (PostgreSQL specific)
    // This would be added in a separate migration or raw query
    // table.index(['search_vector'], null, 'gin');
  });
};

/**
 * Rollback transcripts table
 * 
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
exports.down = async function(knex) {
  return knex.schema.dropTableIfExists('transcripts');
};