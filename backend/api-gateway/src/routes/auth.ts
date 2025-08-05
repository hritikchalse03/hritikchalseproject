import express from 'express';
import { body, validationResult } from 'express-validator';
import { authService } from '../services/authService';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth';

const router = express.Router();

// Register new user
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('firstName').trim().isLength({ min: 1 }),
  body('lastName').trim().isLength({ min: 1 }),
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw createError('Validation failed', 400);
  }

  const { email, password, firstName, lastName } = req.body;
  
  const result = await authService.register({
    email,
    password,
    firstName,
    lastName,
  });

  res.status(201).json({
    message: 'User registered successfully',
    user: result.user,
    tokens: result.tokens,
  });
}));

// Login user
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw createError('Validation failed', 400);
  }

  const { email, password } = req.body;
  
  const result = await authService.login(email, password);

  res.json({
    message: 'Login successful',
    user: result.user,
    tokens: result.tokens,
  });
}));

// Refresh token
router.post('/refresh', [
  body('refreshToken').notEmpty(),
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw createError('Validation failed', 400);
  }

  const { refreshToken } = req.body;
  
  const result = await authService.refreshToken(refreshToken);

  res.json({
    message: 'Token refreshed successfully',
    tokens: result,
  });
}));

// Logout
router.post('/logout', authMiddleware, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const token = req.headers.authorization?.substring(7);
  
  if (token) {
    await authService.logout(token);
  }

  res.json({
    message: 'Logout successful',
  });
}));

// Get current user
router.get('/me', authMiddleware, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const user = await authService.getCurrentUser(req.user!.id);

  res.json({
    user,
  });
}));

export default router;