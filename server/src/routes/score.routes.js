import { Router } from 'express';
import { getTopScores, submitScore } from '../controllers/score.controller.js';
import { scoreLimiter } from '../middlewares/rateLimiter.middleware.js';

const router = Router();

router.get('/:game', getTopScores);
router.post('/', scoreLimiter, submitScore);

export default router;
