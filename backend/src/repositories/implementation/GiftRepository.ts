import Gift, { GiftDocument } from "../../models/Gift";
import { BaseRepository } from "../BaseRepository";
import { IGiftRepository } from "../interface/IGiftRepository";

export class GiftRepository
  extends BaseRepository<GiftDocument>
  implements IGiftRepository
{
  constructor() {
    super(Gift);
  }

  async updateAndReturn(id: string, data: Partial<GiftDocument>) {
    return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }
}
