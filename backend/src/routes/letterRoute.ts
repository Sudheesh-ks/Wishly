import express from 'express';
import { getLetters, createLetter, updateLetterStatus } from '../controllers/letterController';

const router = express.Router();

router.get('/', getLetters);
router.post('/', createLetter);
router.patch('/:id/status', updateLetterStatus);

export default router;
