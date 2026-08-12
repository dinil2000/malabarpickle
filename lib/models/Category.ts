import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICategoryDocument extends Document {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  itemCount?: number;
}

const CategorySchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    itemCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const CategoryModel: Model<ICategoryDocument> =
  mongoose.models.Category || mongoose.model<ICategoryDocument>('Category', CategorySchema);
