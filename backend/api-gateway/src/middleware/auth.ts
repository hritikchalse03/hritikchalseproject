import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { prisma } from '../config/database';
import { redis } from '../config/redis';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    subscriptionTier: string;
    isActive: boolean;
  };
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Access token is required',
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Check if token is blacklisted
    const isBlacklisted = await redis.get(`blacklist:${token}`);
    if (isBlacklisted) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Token has been revoked',
      });
    }

    // Verify the token
    const decoded = jwt.verify(token, config.jwt.secret) as any;
    
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        subscriptionTier: true,
        isActive: true,
        emailVerified: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User not found',
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Account is deactivated',
      });
    }

    // Attach user to request
    req.user = user;
    next();
    
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid token',
      });
    }
    
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Token has expired',
      });
    }
    
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Authentication failed',
    });
  }
};

export const requireSubscription = (requiredTier: 'CORE' | 'PRO') => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required',
      });
    }

    const tierHierarchy = { FREE: 0, CORE: 1, PRO: 2 };
    const userTierLevel = tierHierarchy[req.user.subscriptionTier as keyof typeof tierHierarchy];
    const requiredTierLevel = tierHierarchy[requiredTier];

    if (userTierLevel < requiredTierLevel) {
      return res.status(403).json({
        error: 'Forbidden',
        message: `${requiredTier} subscription required`,
        currentTier: req.user.subscriptionTier,
        requiredTier,
      });
    }

    next();
  };
};

export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(); // Continue without authentication
    }

    const token = authHeader.substring(7);
    
    // Check if token is blacklisted
    const isBlacklisted = await redis.get(`blacklist:${token}`);
    if (isBlacklisted) {
      return next(); // Continue without authentication
    }

    try {
      const decoded = jwt.verify(token, config.jwt.secret) as any;
      
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          subscriptionTier: true,
          isActive: true,
        },
      });

      if (user && user.isActive) {
        req.user = user;
      }
    } catch (error) {
      // Token is invalid, but we continue without authentication
    }

    next();
    
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    next(); // Continue without authentication on error
  }
};