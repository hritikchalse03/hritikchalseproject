const knex = require('../config/database').knex;
const { logger } = require('../utils/logger');

/**
 * Base Model class with common database operations
 * Provides a foundation for all data models in the application
 */
class BaseModel {
  constructor() {
    this.tableName = this.constructor.tableName;
    this.primaryKey = this.constructor.primaryKey || 'id';
    this.fillable = this.constructor.fillable || [];
    this.hidden = this.constructor.hidden || [];
    this.timestamps = this.constructor.timestamps !== false;
    this.softDeletes = this.constructor.softDeletes || false;
  }

  /**
   * Get the database connection
   * @returns {Object} Knex instance
   */
  static get db() {
    return knex;
  }

  /**
   * Get query builder for the model's table
   * @returns {Object} Knex query builder
   */
  static query() {
    return this.db(this.tableName);
  }

  /**
   * Get query builder instance
   * @returns {Object} Knex query builder
   */
  query() {
    return this.constructor.query();
  }

  /**
   * Find a record by primary key
   * @param {number|string} id - Primary key value
   * @param {Array} columns - Columns to select
   * @returns {Promise<Object|null>} Record or null
   */
  static async find(id, columns = ['*']) {
    try {
      const query = this.query().where(this.primaryKey, id).first();
      
      if (columns.length > 0 && !columns.includes('*')) {
        query.select(columns);
      }

      if (this.softDeletes) {
        query.whereNull('deleted_at');
      }

      const result = await query;
      return result || null;
    } catch (error) {
      logger.error(`Error finding ${this.tableName} record:`, error);
      throw error;
    }
  }

  /**
   * Find a record by primary key or throw error
   * @param {number|string} id - Primary key value
   * @param {Array} columns - Columns to select
   * @returns {Promise<Object>} Record
   * @throws {Error} If record not found
   */
  static async findOrFail(id, columns = ['*']) {
    const record = await this.find(id, columns);
    if (!record) {
      throw new Error(`${this.tableName} record with ${this.primaryKey} ${id} not found`);
    }
    return record;
  }

  /**
   * Find records by criteria
   * @param {Object} criteria - Search criteria
   * @param {Array} columns - Columns to select
   * @returns {Promise<Array>} Array of records
   */
  static async findBy(criteria, columns = ['*']) {
    try {
      const query = this.query().where(criteria);
      
      if (columns.length > 0 && !columns.includes('*')) {
        query.select(columns);
      }

      if (this.softDeletes) {
        query.whereNull('deleted_at');
      }

      return await query;
    } catch (error) {
      logger.error(`Error finding ${this.tableName} records:`, error);
      throw error;
    }
  }

  /**
   * Find first record by criteria
   * @param {Object} criteria - Search criteria
   * @param {Array} columns - Columns to select
   * @returns {Promise<Object|null>} Record or null
   */
  static async findOneBy(criteria, columns = ['*']) {
    const records = await this.findBy(criteria, columns);
    return records.length > 0 ? records[0] : null;
  }

  /**
   * Get all records
   * @param {Array} columns - Columns to select
   * @returns {Promise<Array>} Array of records
   */
  static async all(columns = ['*']) {
    try {
      const query = this.query();
      
      if (columns.length > 0 && !columns.includes('*')) {
        query.select(columns);
      }

      if (this.softDeletes) {
        query.whereNull('deleted_at');
      }

      return await query;
    } catch (error) {
      logger.error(`Error getting all ${this.tableName} records:`, error);
      throw error;
    }
  }

  /**
   * Create a new record
   * @param {Object} data - Record data
   * @returns {Promise<Object>} Created record
   */
  static async create(data) {
    try {
      const filteredData = this.filterFillable(data);
      
      if (this.timestamps) {
        filteredData.created_at = new Date();
        filteredData.updated_at = new Date();
      }

      const [id] = await this.query().insert(filteredData).returning(this.primaryKey);
      return await this.find(id);
    } catch (error) {
      logger.error(`Error creating ${this.tableName} record:`, error);
      throw error;
    }
  }

  /**
   * Update a record by primary key
   * @param {number|string} id - Primary key value
   * @param {Object} data - Update data
   * @returns {Promise<Object>} Updated record
   */
  static async update(id, data) {
    try {
      const filteredData = this.filterFillable(data);
      
      if (this.timestamps) {
        filteredData.updated_at = new Date();
      }

      const query = this.query().where(this.primaryKey, id);
      
      if (this.softDeletes) {
        query.whereNull('deleted_at');
      }

      await query.update(filteredData);
      return await this.find(id);
    } catch (error) {
      logger.error(`Error updating ${this.tableName} record:`, error);
      throw error;
    }
  }

  /**
   * Delete a record by primary key
   * @param {number|string} id - Primary key value
   * @returns {Promise<boolean>} Success status
   */
  static async delete(id) {
    try {
      const query = this.query().where(this.primaryKey, id);
      
      if (this.softDeletes) {
        await query.update({ deleted_at: new Date() });
      } else {
        await query.del();
      }
      
      return true;
    } catch (error) {
      logger.error(`Error deleting ${this.tableName} record:`, error);
      throw error;
    }
  }

  /**
   * Paginate records
   * @param {number} page - Page number (1-based)
   * @param {number} limit - Records per page
   * @param {Object} criteria - Search criteria
   * @param {Array} columns - Columns to select
   * @returns {Promise<Object>} Pagination result
   */
  static async paginate(page = 1, limit = 20, criteria = {}, columns = ['*']) {
    try {
      const offset = (page - 1) * limit;
      
      const baseQuery = this.query();
      if (Object.keys(criteria).length > 0) {
        baseQuery.where(criteria);
      }
      
      if (this.softDeletes) {
        baseQuery.whereNull('deleted_at');
      }

      // Get total count
      const countQuery = baseQuery.clone().count('* as total');
      const [{ total }] = await countQuery;

      // Get records
      const dataQuery = baseQuery.clone().offset(offset).limit(limit);
      if (columns.length > 0 && !columns.includes('*')) {
        dataQuery.select(columns);
      }
      
      const data = await dataQuery;

      return {
        data,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: parseInt(total),
          pages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      logger.error(`Error paginating ${this.tableName} records:`, error);
      throw error;
    }
  }

  /**
   * Count records
   * @param {Object} criteria - Search criteria
   * @returns {Promise<number>} Record count
   */
  static async count(criteria = {}) {
    try {
      const query = this.query();
      
      if (Object.keys(criteria).length > 0) {
        query.where(criteria);
      }
      
      if (this.softDeletes) {
        query.whereNull('deleted_at');
      }

      const [{ count }] = await query.count('* as count');
      return parseInt(count);
    } catch (error) {
      logger.error(`Error counting ${this.tableName} records:`, error);
      throw error;
    }
  }

  /**
   * Check if record exists
   * @param {Object} criteria - Search criteria
   * @returns {Promise<boolean>} Existence status
   */
  static async exists(criteria) {
    const count = await this.count(criteria);
    return count > 0;
  }

  /**
   * Filter data to only include fillable fields
   * @param {Object} data - Input data
   * @returns {Object} Filtered data
   */
  static filterFillable(data) {
    if (!this.fillable || this.fillable.length === 0) {
      return data;
    }

    const filtered = {};
    for (const field of this.fillable) {
      if (data.hasOwnProperty(field)) {
        filtered[field] = data[field];
      }
    }
    return filtered;
  }

  /**
   * Hide specified fields from record
   * @param {Object} record - Database record
   * @returns {Object} Record with hidden fields removed
   */
  static hideFields(record) {
    if (!this.hidden || this.hidden.length === 0) {
      return record;
    }

    const cleaned = { ...record };
    for (const field of this.hidden) {
      delete cleaned[field];
    }
    return cleaned;
  }

  /**
   * Execute raw SQL query
   * @param {string} sql - SQL query
   * @param {Array} bindings - Query parameters
   * @returns {Promise<Array>} Query results
   */
  static async raw(sql, bindings = []) {
    try {
      const result = await this.db.raw(sql, bindings);
      return result.rows || result;
    } catch (error) {
      logger.error('Error executing raw query:', error);
      throw error;
    }
  }

  /**
   * Begin database transaction
   * @returns {Promise<Object>} Transaction object
   */
  static async beginTransaction() {
    return await this.db.transaction();
  }

  /**
   * Execute callback within transaction
   * @param {Function} callback - Transaction callback
   * @returns {Promise<any>} Callback result
   */
  static async transaction(callback) {
    return await this.db.transaction(callback);
  }
}

module.exports = BaseModel;