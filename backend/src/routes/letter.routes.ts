import express from 'express';
import { letterController } from '../dependencyHandlers/letter.dependencies';
import { authenticate, requireRole } from '../middlewares/authMiddleware';

const letterRouter = express.Router();

letterRouter.get('/', authenticate, requireRole('santa'), letterController.getLetters.bind(letterController));
letterRouter.post('/', authenticate, requireRole('user'), letterController.createLetter.bind(letterController));
letterRouter.patch('/:id/status', authenticate, requireRole('santa'), letterController.updateLetterStatus.bind(letterController));
letterRouter.patch('/:id/packed', authenticate, requireRole('santa'), letterController.togglePackedStatus.bind(letterController));

export default letterRouter;
