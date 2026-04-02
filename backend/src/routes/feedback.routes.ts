import { Router } from 'express';
import { createFeedback } from '../controllers/feedback.controller';

const router = Router();

// POST /api/feedback
router.post('/', createFeedback);

export default router;