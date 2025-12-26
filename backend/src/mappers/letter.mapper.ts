import { LetterDTO } from '../dtos/letter.dto';
import { LetterDocument } from '../models/Letter';

export const toLetterDTO = (letter: LetterDocument): LetterDTO => ({
  id: letter._id.toString(),
  childName: letter.childName,
  location: letter.location,
  wishList: letter.wishList,
  giftId: letter.giftId?.toString(),
  status: letter.status,
  isPacked: letter.isPacked,
  content: letter.content,
  createdAt: letter.createdAt,
});
