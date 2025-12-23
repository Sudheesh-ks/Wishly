import express from 'express';
import { getGifts, addGift } from '../controllers/giftController';

const router = express.Router();

router.get('/', getGifts);
router.post('/', addGift);

export default router;
