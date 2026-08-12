import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUserDocument extends Document {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone: string;
  role: 'customer' | 'admin';
  address?: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  };
  createdAt: string;
}

const UserSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String, required: true, enum: ['customer', 'admin'], default: 'customer' },
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      pincode: { type: String },
      landmark: { type: String }
    },
    createdAt: { type: String, default: () => new Date().toISOString() }
  },
  { timestamps: true }
);

export const UserModel: Model<IUserDocument> =
  mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema);
