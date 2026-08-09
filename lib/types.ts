export type SpiceLevel = 'Mild' | 'Medium' | 'Spicy' | 'Extra Hot';

export interface WeightOption {
  weight: '250g' | '500g' | '1kg';
  price: number;
}

export interface Product {
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
  weights: WeightOption[];
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  itemCount?: number;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Hashed/stored for verification
  phone: string;
  role: 'customer' | 'admin';
  address?: ShippingAddress;
  createdAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  weight: '250g' | '500g' | '1kg';
  unitPrice: number;
  quantity: number;
  image: string;
  isVeg: boolean;
}

export type OrderStatus = 'Placed' | 'Packed' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  weight: '250g' | '500g' | '1kg';
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  image: string;
}

export interface Order {
  id: string;
  trackingCode: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
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

export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  pendingOrdersCount: number;
  deliveredOrdersCount: number;
}
