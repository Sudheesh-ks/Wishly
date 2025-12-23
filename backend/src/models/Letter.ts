import mongoose, { Schema, Document } from 'mongoose';

export interface ILetter extends Document {
    childName: string;
    location: string;
    wishList?: string;
    giftId?: mongoose.Types.ObjectId;
    status: 'Nice' | 'Naughty' | 'Sorting';
    isPacked: boolean;
    content?: string;
    createdAt: Date;
}

const LetterSchema: Schema = new Schema({
    childName: { type: String, required: true },
    location: { type: String, required: true },
    wishList: { type: String },
    giftId: { type: Schema.Types.ObjectId, ref: 'Gift' },
    status: { type: String, enum: ['Nice', 'Naughty', 'Sorting'], default: 'Sorting' },
    isPacked: { type: Boolean, default: false },
    content: { type: String },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<ILetter>('Letter', LetterSchema);
