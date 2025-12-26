import { FilterQuery } from 'mongoose';
import { GiftDocument } from '../../models/Gift';

export interface IGiftRepository {
  findAll(filter?: FilterQuery<GiftDocument>): Promise<GiftDocument[]>;
  findById(id: string): Promise<GiftDocument | null>;
  create(data: Partial<GiftDocument>): Promise<GiftDocument>;
  updateAndReturn(id: string, data: Partial<GiftDocument>): Promise<GiftDocument | null>;
}
