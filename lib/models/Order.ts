import mongoose, { Schema, Document, Model } from 'mongoose';
import { OrderStatus } from '../types';

export interface IOrderDocument extends Document {
  id: string;
  trackingCode: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  };
  items: {
    productId: string;
    productName: string;
    weight: '250g' | '500g' | '1kg';
    unitPrice: number;
    quantity: number;
    totalPrice: number;
    image: string;
  }[];
  subtotal: number;
  discountAmount: number;
  deliveryFee: number;
  totalAmount: number;
  paymentMethod: 'Card' | 'UPI' | 'Netbanking' | 'WhatsApp';
  paymentStatus: 'Paid' | 'Pending' | 'COD';
  orderStatus: OrderStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const OrderSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    trackingCode: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, default: '' },
    customerPhone: { type: String, required: true },
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      landmark: { type: String }
    },
    items: [
      {
        productId: { type: String, required: true },
        productName: { type: String, required: true },
        weight: { type: String, required: true },
        unitPrice: { type: Number, required: true },
        quantity: { type: Number, required: true },
        totalPrice: { type: Number, required: true },
        image: { type: String, required: true }
      }
    ],
    subtotal: { type: Number, required: true },
    discountAmount: { type: Number, default: 0 },
    deliveryFee: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    paymentStatus: { type: String, required: true, default: 'Paid' },
    orderStatus: { type: String, required: true, default: 'Placed' },
    notes: { type: String },
    createdAt: { type: String, default: () => new Date().toISOString() },
    updatedAt: { type: String, default: () => new Date().toISOString() }
  },
  { timestamps: true }
);

export const OrderModel: Model<IOrderDocument> =
  mongoose.models.Order || mongoose.model<IOrderDocument>('Order', OrderSchema);
