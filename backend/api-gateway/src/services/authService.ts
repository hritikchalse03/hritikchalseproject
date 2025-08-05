import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../config/database';
import { redis } from '../config/redis';
import { config } from '../config/config';
import { createError } from '../middleware/errorHandler';

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface LoginResult {
  user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    subscriptionTier: string;
    emailVerified: boolean;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

class AuthService {
  async register(data: RegisterData): Promise<LoginResult> {
    const { email, password, firstName, lastName } = data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw createError('User already exists with this email', 409);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, config.bcrypt.rounds);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        subscriptionTier: true,
        emailVerified: true,
      },
    });

    // Generate tokens
    const tokens = await this.generateTokens(user.id);

    return {
      user,
      tokens,
    };
  }

  async login(email: string, password: string): Promise<LoginResult> {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        firstName: true,
        lastName: true,
        subscriptionTier: true,
        emailVerified: true,
        isActive: true,
      },
    });

    if (!user) {
      throw createError('Invalid email or password', 401);
    }

    if (!user.isActive) {
      throw createError('Account is deactivated', 401);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw createError('Invalid email or password', 401);
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Generate tokens
    const tokens = await this.generateTokens(user.id);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      tokens,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as any;
      
      // Check if refresh token exists in database
      const session = await prisma.session.findUnique({
        where: { token: refreshToken },
        include: { user: true },
      });

      if (!session || session.expiresAt < new Date()) {
        throw createError('Invalid or expired refresh token', 401);
      }

      if (!session.user.isActive) {
        throw createError('Account is deactivated', 401);
      }

      // Generate new tokens
      const tokens = await this.generateTokens(session.userId);

      // Delete old refresh token
      await prisma.session.delete({
        where: { id: session.id },
      });

      return tokens;
      
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw createError('Invalid refresh token', 401);
      }
      throw error;
    }
  }

  async logout(accessToken: string) {
    // Add token to blacklist
    const decoded = jwt.decode(accessToken) as any;
    if (decoded && decoded.exp) {
      const ttl = decoded.exp - Math.floor(Date.now() / 1000);
      if (ttl > 0) {
        await redis.setex(`blacklist:${accessToken}`, ttl, 'true');
      }
    }

    // Remove all refresh tokens for this user
    if (decoded && decoded.userId) {
      await prisma.session.deleteMany({
        where: { userId: decoded.userId },
      });
    }
  }

  async getCurrentUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
        subscriptionTier: true,
        emailVerified: true,
        createdAt: true,
        lastLoginAt: true,
      },
    });

    if (!user) {
      throw createError('User not found', 404);
    }

    return user;
  }

  private async generateTokens(userId: string) {
    // Generate access token
    const accessToken = jwt.sign(
      { userId, type: 'access' },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    // Generate refresh token
    const refreshToken = jwt.sign(
      { userId, type: 'refresh', jti: uuidv4() },
      config.jwt.refreshSecret,
      { expiresIn: config.jwt.refreshExpiresIn }
    );

    // Store refresh token in database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

    await prisma.session.create({
      data: {
        userId,
        token: refreshToken,
        expiresAt,
      },
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async requestPasswordReset(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists
      return;
    }

    // Generate reset token
    const resetToken = uuidv4();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour

    // Store reset token in Redis
    await redis.setex(`password_reset:${resetToken}`, 3600, user.id);

    // TODO: Send email with reset link
    console.log(`Password reset token for ${email}: ${resetToken}`);
  }

  async resetPassword(token: string, newPassword: string) {
    // Get user ID from Redis
    const userId = await redis.get(`password_reset:${token}`);
    
    if (!userId) {
      throw createError('Invalid or expired reset token', 400);
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, config.bcrypt.rounds);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    // Delete reset token
    await redis.del(`password_reset:${token}`);

    // Invalidate all sessions for this user
    await prisma.session.deleteMany({
      where: { userId },
    });
  }

  async verifyEmail(token: string) {
    // Get user ID from Redis
    const userId = await redis.get(`email_verification:${token}`);
    
    if (!userId) {
      throw createError('Invalid or expired verification token', 400);
    }

    // Update email verification status
    await prisma.user.update({
      where: { id: userId },
      data: { emailVerified: true },
    });

    // Delete verification token
    await redis.del(`email_verification:${token}`);
  }
}

export const authService = new AuthService();