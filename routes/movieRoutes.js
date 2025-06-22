import express from 'express';
import {
  createMovie,
  getMovies,
  getMovieById,
  updateMovie,
  deleteMovie,
  getMovieStats,
} from '../controllers/movieController.js';
import { authenticate } from '../middlewares/auth.js';
import { validateMovie } from '../middlewares/validation.js';

const router = express.Router();

// Apply authentication to all movie routes
router.use(authenticate);

router.post('/', validateMovie, createMovie);
router.get('/', getMovies);
router.get('/stats', getMovieStats);
router.get('/:id', getMovieById);
router.put('/:id', validateMovie, updateMovie);
router.delete('/:id', deleteMovie);

export default router;