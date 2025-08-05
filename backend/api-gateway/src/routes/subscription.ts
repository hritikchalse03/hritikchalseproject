import express from 'express';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  res.json({ subscription: null });
}));

export default router;