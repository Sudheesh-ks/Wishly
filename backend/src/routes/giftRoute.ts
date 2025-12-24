import express from 'express';
import { getGifts, addGift, updateGift } from '../controllers/giftController';

const router = express.Router();

router.get('/', getGifts);
router.post('/', addGift);
router.patch('/:id', updateGift);

export default router;
