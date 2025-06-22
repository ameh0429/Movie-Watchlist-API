import express from 'express';
import { register, login, getProfile } from '../controllers/authController.js';
import { authenticate } from '../middlewares/auth.js';
import { validateUser, validateLogin } from '../middlewares/validation.js';

const router = express.Router();

router.post('/register', validateUser, register);
router.post('/login', validateLogin, login);
router.get('/profile', authenticate, getProfile);

export default router;