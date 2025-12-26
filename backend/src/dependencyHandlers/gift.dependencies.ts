import { GiftService } from '../services/implementation/GiftService';
import { GiftRepository } from '../repositories/implementation/GiftRepository';
import { GiftController } from '../controllers/implementation/GiftController';

const giftRepo = new GiftRepository();
const giftService = new GiftService(giftRepo);

export const giftController = new GiftController(giftService);
