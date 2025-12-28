import { LetterService } from "../services/implementation/LetterService";
import { LetterRepository } from "../repositories/implementation/LetterRepository";
import { GiftRepository } from "../repositories/implementation/GiftRepository";
import { LetterController } from "../controllers/implementation/LetterController";

const letterRepo = new LetterRepository();
const giftRepo = new GiftRepository();

const letterService = new LetterService(letterRepo, giftRepo);

export const letterController = new LetterController(letterService);
