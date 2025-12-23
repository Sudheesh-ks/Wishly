import mongoose, { Schema, Document } from 'mongoose';

export interface ILetter extends Document {
    childName: string;
    location: string;
    wishList: string;
    status: 'Nice' | 'Naughty' | 'Sorting';
    content?: string;
    createdAt: Date;
}

const LetterSchema: Schema = new Schema({
    childName: { type: String, required: true },
    location: { type: String, required: true },
    wishList: { type: String, required: true },
    status: { type: String, enum: ['Nice', 'Naughty', 'Sorting'], default: 'Sorting' },
    content: { type: String },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<ILetter>('Letter', LetterSchema);
