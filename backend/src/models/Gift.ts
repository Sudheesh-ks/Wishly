import mongoose, { Schema, Document } from "mongoose";

export interface GiftDocument extends Document {
  title: string;
  image: string;
  stock: number;
}

const GiftSchema: Schema = new Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  stock: { type: Number, default: 0 },
});

export default mongoose.model<GiftDocument>("Gift", GiftSchema);
