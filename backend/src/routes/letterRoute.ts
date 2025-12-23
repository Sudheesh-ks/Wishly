import express from 'express';
import { getLetters, createLetter, updateLetterStatus, togglePackedStatus } from '../controllers/letterController';

const router = express.Router();

router.get('/', getLetters);
router.post('/', createLetter);
router.patch('/:id/status', updateLetterStatus);
router.patch('/:id/packed', togglePackedStatus);

export default router;
