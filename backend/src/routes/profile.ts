import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  getUserStats,
  deleteAccount,
  exportUserData
} from '../controllers/profileController';
import { verifyTokenMiddleware } from '../controllers/authController';

const router = Router();

// All profile routes require authentication
router.use(verifyTokenMiddleware);

// Profile management
router.get('/', getProfile);
router.put('/', updateProfile);
router.get('/stats', getUserStats);
router.get('/export', exportUserData);
router.delete('/', deleteAccount);

export default router;
