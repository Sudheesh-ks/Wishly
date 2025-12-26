import { FilterQuery } from 'mongoose';
import { AdminDocument } from '../../models/Admin';

export interface IAdminRepository {
  findById(id: string): Promise<AdminDocument | null>;
  findOne(filter: FilterQuery<AdminDocument>): Promise<AdminDocument | null>;
}
