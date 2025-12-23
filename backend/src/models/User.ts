import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    email: string;
    googleId: string;
    role: 'user' | 'santa' | 'admin';
    createdAt: Date;
}

const UserSchema: Schema = new Schema({
    email: { type: String, required: true, unique: true },
    googleId: { type: String, required: true, unique: true },
    role: { type: String, enum: ['user', 'santa', 'admin'], default: 'user' },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IUser>('User', UserSchema);
