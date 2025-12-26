export interface LetterDTO {
  id: string;
  childName: string;
  location: string;
  wishList?: string;
  giftId?: string;
  status: string;
  isPacked: boolean;
  content?: string;
  createdAt: Date;
}
