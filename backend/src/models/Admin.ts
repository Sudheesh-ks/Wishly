import mongoose, { Schema, Document } from 'mongoose';

export interface AdminDocument extends Document {
    password: string;
}

const AdminSchema: Schema = new Schema({
    password: { type: String, required: true },
});

export default mongoose.model<AdminDocument>('Admin', AdminSchema, 'admins');
