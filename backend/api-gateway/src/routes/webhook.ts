import express from 'express';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();

router.post('/stripe', asyncHandler(async (req, res) => {
  res.json({ received: true });
}));

export default router;