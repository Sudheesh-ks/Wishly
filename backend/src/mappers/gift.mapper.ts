import { GiftDTO } from '../dtos/gift.dto';
import { GiftDocument } from '../models/Gift';

export const toGiftDTO = (gift: GiftDocument): GiftDTO => ({
  _id: gift._id.toString(),
  title: gift.title,
  image: gift.image,
  stock: gift.stock,
});
