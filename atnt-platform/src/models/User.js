const BaseModel = require('./BaseModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { config } = require('../config');
const { logger, logSecurityEvent } = require('../utils/logger');

/**
 * User Model
 * Handles user authentication, profile management, and relationships
 */
class User extends BaseModel {
  static tableName = 'users';
  static primaryKey = 'id';
  static timestamps = true;
  static softDeletes = true;
  
  static fillable = [
    'email',
    'password_hash',
    'first_name',
    'last_name',
    'display_name',
    'bio',
    'avatar_url',
    'phone',
    'timezone',
    'language',
    'subscription_type',
    'subscription_expires_at',
    'role',
    'permissions',
    'notification_preferences',
    'ui_preferences',
    'marketing_consent',
    'analytics_consent',
    'status',
    'metadata',
  ];

  static hidden = [
    'password_hash',
    'refresh_token_hash',
    'email_verification_token',
    'password_reset_token',
    'deleted_at',
  ];

  /**
   * Create a new user with hashed password
   * @param {Object} userData - User data
   * @returns {Promise<Object>} Created user
   */
  static async createUser(userData) {
    try {
      const { password, ...otherData } = userData;
      
      // Hash password
      const password_hash = await this.hashPassword(password);
      
      // Create user
      const user = await this.create({
        ...otherData,
        password_hash,
        email_verification_token: this.generateToken(),
        status: 'active',
      });

      logSecurityEvent('user_created', { userId: user.id, email: user.email });
      
      return this.hideFields(user);
    } catch (error) {
      logger.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Authenticate user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {Object} req - Express request object
   * @returns {Promise<Object|null>} User object or null
   */
  static async authenticate(email, password, req = {}) {
    try {
      const user = await this.findOneBy({ email, status: 'active' });
      
      if (!user) {
        logSecurityEvent('login_failed', { email, reason: 'user_not_found' }, req);
        return null;
      }

      // Check if account is locked
      if (user.locked_until && new Date() < new Date(user.locked_until)) {
        logSecurityEvent('login_failed', { 
          userId: user.id, 
          email, 
          reason: 'account_locked' 
        }, req);
        return null;
      }

      // Verify password
      const isValidPassword = await this.verifyPassword(password, user.password_hash);
      
      if (!isValidPassword) {
        await this.handleFailedLogin(user.id);
        logSecurityEvent('login_failed', { 
          userId: user.id, 
          email, 
          reason: 'invalid_password' 
        }, req);
        return null;
      }

      // Reset failed login attempts and update last login
      await this.update(user.id, {
        failed_login_attempts: 0,
        locked_until: null,
        last_login_at: new Date(),
        last_login_ip: req.ip,
      });

      logSecurityEvent('login_success', { userId: user.id, email }, req);
      
      return this.hideFields(user);
    } catch (error) {
      logger.error('Authentication error:', error);
      throw error;
    }
  }

  /**
   * Generate JWT tokens for user
   * @param {Object} user - User object
   * @returns {Object} Access and refresh tokens
   */
  static generateTokens(user) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      subscription_type: user.subscription_type,
    };

    const accessToken = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
      issuer: config.app.name,
      subject: user.id.toString(),
    });

    const refreshToken = jwt.sign(payload, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshExpiresIn,
      issuer: config.app.name,
      subject: user.id.toString(),
    });

    return { accessToken, refreshToken };
  }

  /**
   * Verify JWT token
   * @param {string} token - JWT token
   * @param {boolean} isRefreshToken - Whether this is a refresh token
   * @returns {Object|null} Decoded token or null
   */
  static verifyToken(token, isRefreshToken = false) {
    try {
      const secret = isRefreshToken ? config.jwt.refreshSecret : config.jwt.secret;
      return jwt.verify(token, secret);
    } catch (error) {
      logger.warn('Token verification failed:', error.message);
      return null;
    }
  }

  /**
   * Refresh access token using refresh token
   * @param {string} refreshToken - Refresh token
   * @returns {Promise<Object|null>} New tokens or null
   */
  static async refreshAccessToken(refreshToken) {
    try {
      const decoded = this.verifyToken(refreshToken, true);
      if (!decoded) return null;

      const user = await this.find(decoded.id);
      if (!user || user.status !== 'active') return null;

      // Verify refresh token hash matches stored hash
      const storedHash = user.refresh_token_hash;
      if (!storedHash || !await this.verifyPassword(refreshToken, storedHash)) {
        return null;
      }

      // Generate new tokens
      const tokens = this.generateTokens(user);
      
      // Update refresh token hash
      const newRefreshTokenHash = await this.hashPassword(tokens.refreshToken);
      await this.update(user.id, { refresh_token_hash: newRefreshTokenHash });

      return tokens;
    } catch (error) {
      logger.error('Token refresh error:', error);
      return null;
    }
  }

  /**
   * Hash password using bcrypt
   * @param {string} password - Plain text password
   * @returns {Promise<string>} Hashed password
   */
  static async hashPassword(password) {
    return await bcrypt.hash(password, config.security.bcryptRounds);
  }

  /**
   * Verify password against hash
   * @param {string} password - Plain text password
   * @param {string} hash - Hashed password
   * @returns {Promise<boolean>} Verification result
   */
  static async verifyPassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }

  /**
   * Handle failed login attempt
   * @param {number} userId - User ID
   */
  static async handleFailedLogin(userId) {
    const user = await this.find(userId);
    if (!user) return;

    const attempts = (user.failed_login_attempts || 0) + 1;
    const updateData = { failed_login_attempts: attempts };

    // Lock account after 5 failed attempts for 30 minutes
    if (attempts >= 5) {
      updateData.locked_until = new Date(Date.now() + 30 * 60 * 1000);
    }

    await this.update(userId, updateData);
  }

  /**
   * Generate secure random token
   * @param {number} length - Token length
   * @returns {string} Random token
   */
  static generateToken(length = 32) {
    const crypto = require('crypto');
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Find user by email
   * @param {string} email - User email
   * @returns {Promise<Object|null>} User or null
   */
  static async findByEmail(email) {
    return await this.findOneBy({ email });
  }

  /**
   * Update user password
   * @param {number} userId - User ID
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} Updated user
   */
  static async updatePassword(userId, newPassword) {
    const password_hash = await this.hashPassword(newPassword);
    return await this.update(userId, { 
      password_hash,
      password_reset_token: null,
      password_reset_expires: null,
    });
  }

  /**
   * Generate password reset token
   * @param {string} email - User email
   * @returns {Promise<string|null>} Reset token or null
   */
  static async generatePasswordResetToken(email) {
    const user = await this.findByEmail(email);
    if (!user) return null;

    const resetToken = this.generateToken();
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await this.update(user.id, {
      password_reset_token: resetToken,
      password_reset_expires: resetExpires,
    });

    return resetToken;
  }

  /**
   * Verify email with token
   * @param {string} token - Verification token
   * @returns {Promise<boolean>} Verification success
   */
  static async verifyEmail(token) {
    const user = await this.findOneBy({ email_verification_token: token });
    if (!user) return false;

    await this.update(user.id, {
      email_verified: true,
      email_verified_at: new Date(),
      email_verification_token: null,
    });

    return true;
  }

  /**
   * Get user's watchlists
   * @param {number} userId - User ID
   * @returns {Promise<Array>} User's watchlists
   */
  static async getWatchlists(userId) {
    return await this.db('watchlists')
      .where({ user_id: userId })
      .orderBy('is_default', 'desc')
      .orderBy('created_at', 'asc');
  }

  /**
   * Get user's smart alerts
   * @param {number} userId - User ID
   * @returns {Promise<Array>} User's alerts
   */
  static async getSmartAlerts(userId) {
    return await this.db('smart_alerts')
      .where({ user_id: userId, is_active: true })
      .orderBy('created_at', 'desc');
  }

  /**
   * Get user's transcripts
   * @param {number} userId - User ID
   * @param {Object} filters - Query filters
   * @returns {Promise<Array>} User's transcripts
   */
  static async getTranscripts(userId, filters = {}) {
    const query = this.db('transcripts')
      .where({ user_id: userId })
      .whereNull('deleted_at');

    if (filters.status) {
      query.where('status', filters.status);
    }

    if (filters.type) {
      query.where('type', filters.type);
    }

    return await query.orderBy('created_at', 'desc');
  }

  /**
   * Get user activity statistics
   * @param {number} userId - User ID
   * @returns {Promise<Object>} Activity statistics
   */
  static async getActivityStats(userId) {
    const [
      transcriptCount,
      analysisCount,
      watchlistCount,
      alertCount,
    ] = await Promise.all([
      this.db('transcripts').where({ user_id: userId }).count('* as count'),
      this.db('ai_analyses').where({ user_id: userId }).count('* as count'),
      this.db('watchlists').where({ user_id: userId }).count('* as count'),
      this.db('smart_alerts').where({ user_id: userId, is_active: true }).count('* as count'),
    ]);

    return {
      transcripts: parseInt(transcriptCount[0].count),
      analyses: parseInt(analysisCount[0].count),
      watchlists: parseInt(watchlistCount[0].count),
      alerts: parseInt(alertCount[0].count),
    };
  }

  /**
   * Check if user has permission
   * @param {Object} user - User object
   * @param {string} permission - Permission to check
   * @returns {boolean} Has permission
   */
  static hasPermission(user, permission) {
    if (user.role === 'super_admin') return true;
    if (user.role === 'admin' && !permission.startsWith('super_')) return true;
    
    const permissions = user.permissions || [];
    return permissions.includes(permission);
  }

  /**
   * Check if user has active subscription
   * @param {Object} user - User object
   * @returns {boolean} Has active subscription
   */
  static hasActiveSubscription(user) {
    if (user.subscription_type === 'free') return false;
    if (!user.subscription_expires_at) return true;
    return new Date() < new Date(user.subscription_expires_at);
  }
}

module.exports = User;