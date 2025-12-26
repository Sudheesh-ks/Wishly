import { FilterQuery } from 'mongoose';
import { UserDocument } from '../../models/User';

export interface IUserRepository {
  findById(id: string): Promise<UserDocument | null>;
  findOne(filter: FilterQuery<UserDocument>): Promise<UserDocument | null>;
  create(data: Partial<UserDocument>): Promise<UserDocument>;
}
