import { Router } from 'express';
import { createFeedback, getAllFeedback, updateFeedbackStatus } from '../controllers/feedback.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.post('/', createFeedback); // ඕනෑම කෙනෙක්ට පුළුවන්
router.get('/', protect, getAllFeedback); // Admin ට විතරයි
router.patch('/:id', protect, updateFeedbackStatus); // Admin ට විතරයි

export default router;