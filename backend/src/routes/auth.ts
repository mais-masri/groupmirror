import { Router } from 'express';
import {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword
} from '../controllers/authController';
import { auth } from '../middleware/auth';
import validateRequest from '../middleware/validateRequest';
import { RegisterSchema, LoginSchema } from '../validation/authSchemas';

const router = Router();

// Public routes with validation
router.post('/register', validateRequest(RegisterSchema), register);
router.post('/login', validateRequest(LoginSchema), login);

// Protected routes (require authentication)
router.get('/profile', auth(), getProfile);
router.put('/profile', auth(), updateProfile);
router.put('/change-password', auth(), changePassword);

export default router;
