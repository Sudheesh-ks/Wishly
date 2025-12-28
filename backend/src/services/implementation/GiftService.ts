import { IGiftService } from "../interface/IGiftService";
import { IGiftRepository } from "../../repositories/interface/IGiftRepository";
import { toGiftDTO } from "../../mappers/gift.mapper";

export class GiftService implements IGiftService {
  constructor(private readonly _giftRepo: IGiftRepository) {}

  async getGifts() {
    const gifts = await this._giftRepo.findAll();
    return gifts.map(toGiftDTO);
  }

  async addGift(data: { title: string; image: string; stock?: number }) {
    const gift = await this._giftRepo.create({
      ...data,
      stock: data.stock ?? 0,
    });
    return toGiftDTO(gift);
  }

  async updateGift(
    id: string,
    data: { title?: string; image?: string; stock?: number }
  ) {
    const gift = await this._giftRepo.updateAndReturn(id, data);
    if (!gift) throw new Error("Gift not found");
    return toGiftDTO(gift);
  }
}
