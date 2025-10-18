import { Router } from 'express';
import {
  createMoodHandler,
  listMoodsHandler
} from '../controllers/moodController';
import { auth } from '../middleware/auth';
import validateRequest from '../middleware/validateRequest';
import { CreateMoodSchema } from '../validation/authSchemas';

const router = Router();

// Mood operations
router.post("/", auth(true), validateRequest(CreateMoodSchema), createMoodHandler);
router.get("/", auth(true), listMoodsHandler);

export default router;
