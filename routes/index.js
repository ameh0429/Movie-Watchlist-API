import express from 'express';
import authRoutes from './authRoutes.js';
import movieRoutes from './movieRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/movies', movieRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

export default router;