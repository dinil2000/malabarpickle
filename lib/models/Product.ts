import mongoose, { Schema, Document, Model } from 'mongoose';
import { SpiceLevel } from '../types';

export interface IProductDocument extends Document {
  id: string;
  name: string;
  malayalamName?: string;
  slug: string;
  description: string;
  categoryId: string;
  categoryName: string;
  spiceLevel: SpiceLevel;
  isVeg: boolean;
  isBestseller: boolean;
  image: string;
  rating: number;
  reviewsCount: number;
  stockQuantity: number;
  ingredients: string[];
  weights: { weight: '250g' | '500g' | '1kg'; price: number }[];
  createdAt: string;
}

const ProductSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    malayalamName: { type: String },
    slug: { type: String, required: true },
    description: { type: String, required: true },
    categoryId: { type: String, required: true },
    categoryName: { type: String, required: true },
    spiceLevel: { type: String, required: true, enum: ['Mild', 'Medium', 'Spicy', 'Extra Hot'] },
    isVeg: { type: Boolean, default: true },
    isBestseller: { type: Boolean, default: false },
    image: { type: String, required: true },
    rating: { type: Number, default: 5.0 },
    reviewsCount: { type: Number, default: 1 },
    stockQuantity: { type: Number, default: 100 },
    ingredients: [{ type: String }],
    weights: [
      {
        weight: { type: String, required: true },
        price: { type: Number, required: true }
      }
    ],
    createdAt: { type: String, default: () => new Date().toISOString() }
  },
  { timestamps: true }
);

export const ProductModel: Model<IProductDocument> =
  mongoose.models.Product || mongoose.model<IProductDocument>('Product', ProductSchema);
