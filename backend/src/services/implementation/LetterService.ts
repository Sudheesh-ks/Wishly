import mongoose from 'mongoose';
import { ILetterService } from '../interface/ILetterService';
import { ILetterRepository } from '../../repositories/interface/ILetterRepository';
import { IGiftRepository } from '../../repositories/interface/IGiftRepository';
import { toLetterDTO } from '../../mappers/letter.mapper';
import { LetterStatus } from '../../types/letter.types';
import { analyzeLetterContent } from './AiService';

export class LetterService implements ILetterService {
  constructor(
    private readonly _letterRepo: ILetterRepository,
    private readonly _giftRepo: IGiftRepository
  ) { }

  async getLetters(query: any) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const search = query.search || '';
    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder === 'asc' ? 1 : -1;
    const status = query.status || '';
    const gift = query.gift || '';

    const skip = (page - 1) * limit;

    const pipeline: any[] = [
      {
        $lookup: {
          from: 'gifts',
          localField: 'giftId',
          foreignField: '_id',
          as: 'gift',
        },
      },
      { $unwind: { path: '$gift', preserveNullAndEmptyArrays: true } },
      {
        $match: {
          childName: { $regex: search, $options: 'i' },
          ...(status && { status }),
          ...(gift && { 'gift._id': new mongoose.Types.ObjectId(gift) }),
        },
      },
      { $sort: { [sortBy]: sortOrder } },
      {
        $project: {
          childName: 1,
          location: 1,
          wishList: 1,
          content: 1,
          status: 1,
          isPacked: 1,
          gift: 1,
          createdAt: 1,
          popularity: 1,
        }
      }
    ];

    const countResult = await this._letterRepo.aggregate([...pipeline, { $count: 'total' }]);
    const total = countResult[0]?.total || 0;

    const letters = await this._letterRepo.aggregate([
      ...pipeline,
      { $skip: skip },
      { $limit: limit },
    ]);

    return {
      letters,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async createLetter(data: any) {
    const { childName, location, wishList, content, giftId } = data;

    // Check for duplicate letter
    const existingLetter = await this._letterRepo.findOne({
      childName: { $regex: new RegExp(`^${childName}$`, 'i') },
      location: { $regex: new RegExp(`^${location}$`, 'i') }
    });

    if (existingLetter) {
      throw new Error('You have already sent a letter! Santa is busy checking it.');
    }

    const analysisText = content || (typeof wishList === 'string' ? wishList : '');
    const status: LetterStatus = await analyzeLetterContent(analysisText);

    if (giftId && mongoose.isValidObjectId(giftId)) {
      if (status === 'Nice') {
        const gift = await this._giftRepo.findById(giftId);
        if (!gift) throw new Error('Gift not found'); // Check existence first
        if (gift.stock <= 0) throw new Error('Gift out of stock');

        await this._giftRepo.updateAndReturn(giftId, { stock: gift.stock - 1 });
      }
    }

    const letter = await this._letterRepo.create({
      childName,
      location,
      wishList,
      content,
      status,
      giftId,
    });

    return toLetterDTO(letter);
  }

  async updateLetterStatus(id: string, status: LetterStatus) {
    const letter = await this._letterRepo.updateAndReturn(id, { status });
    if (!letter) throw new Error('Letter not found');
    return toLetterDTO(letter);
  }

  async togglePackedStatus(id: string, isPacked: boolean) {
    const letter = await this._letterRepo.updateAndReturn(id, { isPacked });
    if (!letter) throw new Error('Letter not found');
    return toLetterDTO(letter);
  }
}
