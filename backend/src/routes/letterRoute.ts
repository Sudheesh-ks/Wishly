import express from 'express';
import { getLetters, createLetter, updateLetterStatus, togglePackedStatus } from '../controllers/letterController';
import { authenticate, requireRole } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/', authenticate, requireRole('santa'), getLetters);
router.post('/', authenticate, requireRole('user'), createLetter);
router.patch('/:id/status', authenticate, requireRole('santa'), updateLetterStatus);
router.patch('/:id/packed', authenticate, requireRole('santa'), togglePackedStatus);

export default router;
