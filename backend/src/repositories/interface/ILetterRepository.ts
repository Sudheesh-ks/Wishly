import { LetterDocument } from '../../models/Letter';

export interface ILetterRepository {
  findById(id: string): Promise<LetterDocument | null>;
  create(data: Partial<LetterDocument>): Promise<LetterDocument>;
  updateAndReturn(id: string, data: Partial<LetterDocument>): Promise<LetterDocument | null>;
  findOne(query: any): Promise<LetterDocument | null>;
  aggregate(pipeline: any[]): Promise<any[]>;
}
