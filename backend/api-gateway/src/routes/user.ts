import express from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();

router.get('/profile', asyncHandler(async (req: AuthenticatedRequest, res) => {
  res.json({ user: req.user });
}));

router.get('/watchlist', asyncHandler(async (req: AuthenticatedRequest, res) => {
  res.json({ watchlist: [] });
}));

export default router;