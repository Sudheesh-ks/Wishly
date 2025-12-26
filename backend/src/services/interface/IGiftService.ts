import { GiftDTO } from '../../dtos/gift.dto';

export interface IGiftService {
  getGifts(): Promise<GiftDTO[]>;
  addGift(data: { title: string; image: string; stock?: number }): Promise<GiftDTO>;
  updateGift(id: string, data: { title?: string; image?: string; stock?: number }): Promise<GiftDTO>;
}
