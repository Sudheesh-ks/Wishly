import Letter, { LetterDocument } from '../../models/Letter';
import { BaseRepository } from '../BaseRepository';
import { ILetterRepository } from '../interface/ILetterRepository';

export class LetterRepository
  extends BaseRepository<LetterDocument>
  implements ILetterRepository
{
  constructor() {
    super(Letter);
  }

  async updateAndReturn(id: string, data: Partial<LetterDocument>) {
    return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async aggregate(pipeline: any[]) {
    return this.model.aggregate(pipeline);
  }
}
