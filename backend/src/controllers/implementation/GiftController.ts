import { Request, Response } from 'express';
import { IGiftService } from '../../services/interface/IGiftService';

export class GiftController {
  constructor(private readonly _giftService: IGiftService) {}

  async getGifts(req: Request, res: Response): Promise<void> {
    const gifts = await this._giftService.getGifts();
    res.status(200).json(gifts);
  }

  async addGift(req: Request, res: Response): Promise<void> {
    const gift = await this._giftService.addGift(req.body);
    res.status(201).json(gift);
  }

  async updateGift(req: Request, res: Response): Promise<void> {
    const gift = await this._giftService.updateGift(req.params.id, req.body);
    res.status(200).json(gift);
  }
}

