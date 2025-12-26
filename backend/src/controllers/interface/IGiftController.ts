import { Request, Response } from 'express';

export interface IGiftController {
    getGifts(req: Request, res: Response): Promise<void>;
    addGift(req: Request, res: Response): Promise<void>;
    updateGift(req: Request, res: Response): Promise<void>;
}