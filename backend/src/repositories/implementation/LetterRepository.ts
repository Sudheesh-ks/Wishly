import Letter, { LetterDocument } from "../../models/Letter";
import { BaseRepository } from "../BaseRepository";
import { ILetterRepository } from "../interface/ILetterRepository";

export class LetterRepository
  extends BaseRepository<LetterDocument>
  implements ILetterRepository
{
  constructor() {
    super(Letter);
  }

  async updateAndReturn(id: string, data: any): Promise<LetterDocument | null> {
    return await Letter.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async findOne(query: any): Promise<LetterDocument | null> {
    return await Letter.findOne(query).exec();
  }

  async aggregate(pipeline: any[]) {
    return this.model.aggregate(pipeline);
  }
}
