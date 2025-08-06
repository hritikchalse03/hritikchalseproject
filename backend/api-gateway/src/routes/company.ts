import express from 'express';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  res.json({ companies: [] });
}));

router.get('/:symbol', asyncHandler(async (req, res) => {
  res.json({ company: { symbol: req.params.symbol } });
}));

export default router;