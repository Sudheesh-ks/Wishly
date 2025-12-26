import { LetterDTO } from '../../dtos/letter.dto';
import { LetterStatus } from '../../types/letter.types';

export interface ILetterService {
  getLetters(query: any): Promise<any>;
  createLetter(data: any): Promise<LetterDTO>;
  updateLetterStatus(id: string, status: LetterStatus): Promise<LetterDTO>;
  togglePackedStatus(id: string, isPacked: boolean): Promise<LetterDTO>;
}
