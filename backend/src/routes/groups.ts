import { Router } from 'express';
import {
  createGroup,
  getUserGroups
} from '../controllers/groupController';
import { verifyTokenMiddleware } from '../controllers/authController';

const router = Router();

// All group routes require authentication
router.use(verifyTokenMiddleware);

// Group CRUD operations
router.post('/', createGroup);
router.get('/mine', getUserGroups);

export default router;
