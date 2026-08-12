import { Product, Category, User, Order, AdminStats } from './types';
import { connectToDatabase } from './mongodb';
import { ProductModel } from './models/Product';
import { CategoryModel } from './models/Category';
import { UserModel } from './models/User';
import { OrderModel } from './models/Order';
import fs from 'fs';
import path from 'path';

// Pre-seeded Initial Categories
export const initialCategories: Category[] = [
  {
    id: 'cat-veg',
    name: 'Vegetarian Pickles',
    slug: 'veg-pickles',
    description: 'Authentic Kerala veg pickles made with raw mangoes, tender lemon, spicy garlic, and traditional spices.',
    image: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80',
    itemCount: 4
  },
  {
    id: 'cat-non-veg',
    name: 'Non-Veg Pickles',
    slug: 'non-veg-pickles',
    description: 'Malabar coastal delicacy meat & seafood pickles cooked in roasted spice coconut oil.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    itemCount: 4
  },
  {
    id: 'cat-gourmet',
    name: 'Gourmet Specials',
    slug: 'gourmet-specials',
    description: 'Special heritage recipes like Kadumango Tender Mango, Dates Lemon, and Prawns Roast pickle.',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
    itemCount: 3
  }
];

// Pre-seeded Initial Products
export const initialProducts: Product[] = [
  {
    id: 'prod-mango-cut',
    name: 'Malabar Traditional Cut Mango Pickle',
    malayalamName: 'തനി നാടൻ മാങ്ങാ അച്ചാർ',
    slug: 'cut-mango-pickle',
    description: 'Hand-picked farm fresh raw mangoes diced into bite-sized pieces, sun-cured with red chili powder, ginger, fenugreek, and tempered in pure sesame Gingelly oil.',
    categoryId: 'cat-veg',
    categoryName: 'Vegetarian Pickles',
    spiceLevel: 'Spicy',
    isVeg: true,
    isBestseller: true,
    image: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 142,
    stockQuantity: 50,
    ingredients: ['Raw Mango', 'Gingelly Sesame Oil', 'Red Chili Powder', 'Fenugreek', 'Asafoetida (Kayam)', 'Garlic', 'Salt', 'Vinegar'],
    weights: [
      { weight: '250g', price: 180 },
      { weight: '500g', price: 340 },
      { weight: '1kg', price: 650 }
    ],
    createdAt: '2024-01-15'
  },
  {
    id: 'prod-kadumango',
    name: 'Heritage Tender Mango (Kadumango) Pickle',
    malayalamName: 'കടുമാങ്ങാ അച്ചാർ',
    slug: 'tender-mango-kadumango',
    description: 'Whole tiny baby mangoes marinated whole in mustard brine and crushed Kashmiri red peppers. A festive Kerala feast delicacy.',
    categoryId: 'cat-gourmet',
    categoryName: 'Gourmet Specials',
    spiceLevel: 'Spicy',
    isVeg: true,
    isBestseller: true,
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
    rating: 5.0,
    reviewsCount: 210,
    stockQuantity: 35,
    ingredients: ['Tender Whole Baby Mangoes', 'Mustard Seeds', 'Crushed Kashmiri Red Chili', 'Sesame Oil', 'Salt'],
    weights: [
      { weight: '250g', price: 240 },
      { weight: '500g', price: 450 },
      { weight: '1kg', price: 850 }
    ],
    createdAt: '2024-01-20'
  },
  {
    id: 'prod-garlic',
    name: 'Fiery Malabar Garlic Pickle',
    malayalamName: 'വെളുത്തുള്ളി അച്ചാർ',
    slug: 'fiery-garlic-pickle',
    description: 'Whole peeled aromatic garlic cloves slow-cooked in aromatic mustard oil with curry leaves, tamarind paste, and roasted spices.',
    categoryId: 'cat-veg',
    categoryName: 'Vegetarian Pickles',
    spiceLevel: 'Medium',
    isVeg: true,
    isBestseller: false,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewsCount: 98,
    stockQuantity: 40,
    ingredients: ['Peeled Garlic Cloves', 'Curry Leaves', 'Tamarind', 'Chili Powder', 'Gingelly Oil', 'Mustard', 'Turmeric'],
    weights: [
      { weight: '250g', price: 190 },
      { weight: '500g', price: 360 },
      { weight: '1kg', price: 680 }
    ],
    createdAt: '2024-02-01'
  },
  {
    id: 'prod-fish-king',
    name: 'Malabar King Fish (Meen) Pickle',
    malayalamName: 'സ്പെഷ്യൽ മീൻ അച്ചാർ',
    slug: 'king-fish-pickle',
    description: 'Premium fresh King Fish (Neymeen) boneless cubes marinated in ginger-garlic pepper, deep-fried to golden crispness, and infused in spicy pickle gravy.',
    categoryId: 'cat-non-veg',
    categoryName: 'Non-Veg Pickles',
    spiceLevel: 'Spicy',
    isVeg: false,
    isBestseller: true,
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 320,
    stockQuantity: 30,
    ingredients: ['King Fish (Neymeen)', 'Ginger & Garlic Paste', 'Green Chilies', 'Fenugreek', 'Curry Leaves', 'Gingelly Oil', 'Kashmiri Chili'],
    weights: [
      { weight: '250g', price: 380 },
      { weight: '500g', price: 720 },
      { weight: '1kg', price: 1390 }
    ],
    createdAt: '2024-01-10'
  },
  {
    id: 'prod-beef-roast',
    name: 'Kerala Spicy Beef Roast Pickle',
    malayalamName: 'നാടൻ ബീഫ് അച്ചാർ',
    slug: 'kerala-beef-pickle',
    description: 'Tender beef morsels stir-fried with crunchy coconut slices (Thengakothu), pepper, green chilies, and tempered with Kerala masala.',
    categoryId: 'cat-non-veg',
    categoryName: 'Non-Veg Pickles',
    spiceLevel: 'Extra Hot',
    isVeg: false,
    isBestseller: true,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    rating: 5.0,
    reviewsCount: 450,
    stockQuantity: 25,
    ingredients: ['Prime Tender Beef', 'Roasted Coconut Bits', 'Crushed Black Pepper', 'Garlic', 'Chili Flakes', 'Mustard Oil'],
    weights: [
      { weight: '250g', price: 390 },
      { weight: '500g', price: 750 },
      { weight: '1kg', price: 1450 }
    ],
    createdAt: '2024-01-05'
  },
  {
    id: 'prod-prawns',
    name: 'Coastal Spicy Prawns (Chemmeen) Pickle',
    malayalamName: 'ചെമ്മീൻ അച്ചാർ',
    slug: 'spicy-prawns-pickle',
    description: 'Juicy coastal prawns pan-roasted with curry leaves, sliced shallots, garlic, and tangy garcinia cambogian tamarind (Kudampuli).',
    categoryId: 'cat-non-veg',
    categoryName: 'Non-Veg Pickles',
    spiceLevel: 'Spicy',
    isVeg: false,
    isBestseller: true,
    image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 280,
    stockQuantity: 20,
    ingredients: ['Fresh Prawns', 'Garcinia Tamarind (Kudampuli)', 'Ginger', 'Chili Powder', 'Fenugreek', 'Curry Leaves'],
    weights: [
      { weight: '250g', price: 420 },
      { weight: '500g', price: 800 },
      { weight: '1kg', price: 1550 }
    ],
    createdAt: '2024-01-18'
  },
  {
    id: 'prod-lemon-dates',
    name: 'Sweet & Tangy Dates Lemon Pickle',
    malayalamName: 'ഈന്തപ്പഴം നാരങ്ങ അച്ചാർ',
    slug: 'dates-lemon-pickle',
    description: 'Salt-cured yellow lemons blended with rich Arabian black dates and mild Kerala aromatic spices. Perfect balance of sweet, tangy & spicy.',
    categoryId: 'cat-gourmet',
    categoryName: 'Gourmet Specials',
    spiceLevel: 'Mild',
    isVeg: true,
    isBestseller: false,
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewsCount: 115,
    stockQuantity: 45,
    ingredients: ['Yellow Lemons', 'Arabian Dates', 'Jaggery Syrup', 'Chili Powder', 'Asafoetida', 'Sesame Oil'],
    weights: [
      { weight: '250g', price: 210 },
      { weight: '500g', price: 390 },
      { weight: '1kg', price: 740 }
    ],
    createdAt: '2024-02-10'
  },
  {
    id: 'prod-chicken',
    name: 'Special Boneless Chicken Pickle',
    malayalamName: 'കോഴി അച്ചാർ',
    slug: 'boneless-chicken-pickle',
    description: 'Crispy fried boneless chicken bites tossed in dark spicy masala, green peppers, and gingelly oil marinade.',
    categoryId: 'cat-non-veg',
    categoryName: 'Non-Veg Pickles',
    spiceLevel: 'Spicy',
    isVeg: false,
    isBestseller: false,
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewsCount: 195,
    stockQuantity: 30,
    ingredients: ['Boneless Chicken', 'Ginger Garlic', 'Kashmiri Chili', 'Coriander', 'Curry Leaves', 'Gingelly Oil'],
    weights: [
      { weight: '250g', price: 320 },
      { weight: '500g', price: 610 },
      { weight: '1kg', price: 1180 }
    ],
    createdAt: '2024-02-15'
  }
];

// Pre-seeded Initial Users (Admin & Customer)
export const initialUsers: User[] = [
  {
    id: 'usr-admin-1',
    name: 'Malabar Admin',
    email: 'admin@malabarpickle.com',
    password: 'admin',
    phone: '+91 98765 43210',
    role: 'admin',
    createdAt: '2024-01-01'
  },
  {
    id: 'usr-cust-1',
    name: 'Rahul Nair',
    email: 'rahul@example.com',
    password: 'password123',
    phone: '+91 91234 56789',
    role: 'customer',
    address: {
      street: 'Flat 4B, Emerald Heights, MG Road',
      city: 'Kochi',
      state: 'Kerala',
      pincode: '682016',
      landmark: 'Near Metro Station'
    },
    createdAt: '2024-02-01'
  }
];

// Pre-seeded Initial Demo Orders
export const initialOrders: Order[] = [
  {
    id: 'ORD-98421',
    trackingCode: 'MP-TRK-98421',
    userId: 'usr-cust-1',
    customerName: 'Rahul Nair',
    customerEmail: 'rahul@example.com',
    customerPhone: '+91 91234 56789',
    shippingAddress: {
      street: 'Flat 4B, Emerald Heights, MG Road',
      city: 'Kochi',
      state: 'Kerala',
      pincode: '682016'
    },
    items: [
      {
        productId: 'prod-fish-king',
        productName: 'Malabar King Fish (Meen) Pickle',
        weight: '500g',
        unitPrice: 720,
        quantity: 1,
        totalPrice: 720,
        image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80'
      },
      {
        productId: 'prod-mango-cut',
        productName: 'Malabar Traditional Cut Mango Pickle',
        weight: '250g',
        unitPrice: 180,
        quantity: 2,
        totalPrice: 360,
        image: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80'
      }
    ],
    subtotal: 1080,
    discountAmount: 100,
    deliveryFee: 50,
    totalAmount: 1030,
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    orderStatus: 'Shipped',
    notes: 'Please double wrap the jar to prevent spill.',
    createdAt: '2024-03-01T10:30:00Z',
    updatedAt: '2024-03-02T14:20:00Z'
  },
  {
    id: 'ORD-98422',
    trackingCode: 'MP-TRK-98422',
    userId: 'usr-cust-1',
    customerName: 'Ananya Sharma',
    customerEmail: 'ananya@example.com',
    customerPhone: '+91 98888 77777',
    shippingAddress: {
      street: '12th Cross, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560038'
    },
    items: [
      {
        productId: 'prod-beef-roast',
        productName: 'Kerala Spicy Beef Roast Pickle',
        weight: '500g',
        unitPrice: 750,
        quantity: 1,
        totalPrice: 750,
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80'
      }
    ],
    subtotal: 750,
    discountAmount: 0,
    deliveryFee: 60,
    totalAmount: 810,
    paymentMethod: 'Card',
    paymentStatus: 'Paid',
    orderStatus: 'Placed',
    createdAt: '2024-03-04T08:15:00Z',
    updatedAt: '2024-03-04T08:15:00Z'
  }
];

// Memory/File Fallback Setup
const DATA_DIR = process.env.VERCEL ? '/tmp/malabarpickle_data' : path.join(process.cwd(), 'data_store');
const memoryCache: Record<string, any> = {};

function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err) {
    console.error('Error creating data directory:', err);
  }
}

async function fallbackRead<T>(key: string, defaultValue: T): Promise<T> {
  if (memoryCache[key] !== undefined) {
    return memoryCache[key] as T;
  }
  try {
    ensureDataDir();
    const filePath = path.join(DATA_DIR, `${key}.json`);
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(data);
      memoryCache[key] = parsed;
      return parsed;
    }
  } catch (e) {
    console.error(`Fallback read error for ${key}:`, e);
  }
  memoryCache[key] = defaultValue;
  return defaultValue;
}

async function fallbackWrite<T>(key: string, data: T): Promise<boolean> {
  memoryCache[key] = data;
  try {
    ensureDataDir();
    const filePath = path.join(DATA_DIR, `${key}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (e) {
    console.error(`Fallback write error for ${key}:`, e);
    return false;
  }
}

// Data Access Service with MongoDB Atlas Integration & Fallback
export const db = {
  // PRODUCTS
  getProducts: async (): Promise<Product[]> => {
    const conn = await connectToDatabase();
    if (conn) {
      try {
        let products = await ProductModel.find().lean();
        if (!products || products.length === 0) {
          // Auto-seed initial products to MongoDB
          await ProductModel.insertMany(initialProducts);
          products = await ProductModel.find().lean();
        }
        return JSON.parse(JSON.stringify(products));
      } catch (err) {
        console.error('MongoDB getProducts error:', err);
      }
    }
    return await fallbackRead<Product[]>('products', initialProducts);
  },

  getProductById: async (id: string): Promise<Product | undefined> => {
    const products = await db.getProducts();
    return products.find(p => p.id === id || p.slug === id);
  },

  saveProducts: async (products: Product[]): Promise<boolean> => {
    const conn = await connectToDatabase();
    if (conn) {
      try {
        await ProductModel.deleteMany({});
        await ProductModel.insertMany(products);
        return true;
      } catch (err) {
        console.error('MongoDB saveProducts error:', err);
      }
    }
    return await fallbackWrite('products', products);
  },

  addProduct: async (product: Omit<Product, 'id' | 'createdAt'>): Promise<Product> => {
    const newProduct: Product = {
      ...product,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    const conn = await connectToDatabase();
    if (conn) {
      try {
        await ProductModel.create(newProduct);
        return newProduct;
      } catch (err) {
        console.error('MongoDB addProduct error:', err);
      }
    }
    const products = await db.getProducts();
    products.unshift(newProduct);
    await fallbackWrite('products', products);
    return newProduct;
  },

  updateProduct: async (id: string, updates: Partial<Product>): Promise<Product | null> => {
    const conn = await connectToDatabase();
    if (conn) {
      try {
        const updated = await ProductModel.findOneAndUpdate({ id }, updates, { new: true }).lean();
        if (updated) return JSON.parse(JSON.stringify(updated));
      } catch (err) {
        console.error('MongoDB updateProduct error:', err);
      }
    }
    const products = await db.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;
    products[index] = { ...products[index], ...updates };
    await fallbackWrite('products', products);
    return products[index];
  },

  deleteProduct: async (id: string): Promise<boolean> => {
    const conn = await connectToDatabase();
    if (conn) {
      try {
        await ProductModel.deleteOne({ id });
        return true;
      } catch (err) {
        console.error('MongoDB deleteProduct error:', err);
      }
    }
    const products = await db.getProducts();
    const filtered = products.filter(p => p.id !== id);
    return await fallbackWrite('products', filtered);
  },

  // CATEGORIES
  getCategories: async (): Promise<Category[]> => {
    const conn = await connectToDatabase();
    if (conn) {
      try {
        let categories = await CategoryModel.find().lean();
        if (!categories || categories.length === 0) {
          await CategoryModel.insertMany(initialCategories);
          categories = await CategoryModel.find().lean();
        }
        return JSON.parse(JSON.stringify(categories));
      } catch (err) {
        console.error('MongoDB getCategories error:', err);
      }
    }
    return await fallbackRead<Category[]>('categories', initialCategories);
  },

  saveCategories: async (categories: Category[]): Promise<boolean> => {
    const conn = await connectToDatabase();
    if (conn) {
      try {
        await CategoryModel.deleteMany({});
        await CategoryModel.insertMany(categories);
        return true;
      } catch (err) {
        console.error('MongoDB saveCategories error:', err);
      }
    }
    return await fallbackWrite('categories', categories);
  },

  addCategory: async (category: Omit<Category, 'id'>): Promise<Category> => {
    const newCat: Category = {
      ...category,
      id: `cat-${Date.now()}`
    };
    const conn = await connectToDatabase();
    if (conn) {
      try {
        await CategoryModel.create(newCat);
        return newCat;
      } catch (err) {
        console.error('MongoDB addCategory error:', err);
      }
    }
    const categories = await db.getCategories();
    categories.push(newCat);
    await fallbackWrite('categories', categories);
    return newCat;
  },

  deleteCategory: async (id: string): Promise<boolean> => {
    const conn = await connectToDatabase();
    if (conn) {
      try {
        await CategoryModel.deleteOne({ id });
        return true;
      } catch (err) {
        console.error('MongoDB deleteCategory error:', err);
      }
    }
    const categories = await db.getCategories();
    const filtered = categories.filter(c => c.id !== id);
    return await fallbackWrite('categories', filtered);
  },

  // USERS / AUTH
  getUsers: async (): Promise<User[]> => {
    const conn = await connectToDatabase();
    if (conn) {
      try {
        let users = await UserModel.find().lean();
        if (!users || users.length === 0) {
          await UserModel.insertMany(initialUsers);
          users = await UserModel.find().lean();
        }
        return JSON.parse(JSON.stringify(users));
      } catch (err) {
        console.error('MongoDB getUsers error:', err);
      }
    }
    return await fallbackRead<User[]>('users', initialUsers);
  },

  saveUsers: async (users: User[]): Promise<boolean> => {
    const conn = await connectToDatabase();
    if (conn) {
      try {
        await UserModel.deleteMany({});
        await UserModel.insertMany(users);
        return true;
      } catch (err) {
        console.error('MongoDB saveUsers error:', err);
      }
    }
    return await fallbackWrite('users', users);
  },

  findUserByEmail: async (email: string): Promise<User | undefined> => {
    const conn = await connectToDatabase();
    if (conn) {
      try {
        const user = await UserModel.findOne({ email: new RegExp(`^${email}$`, 'i') }).lean();
        if (user) return JSON.parse(JSON.stringify(user));
      } catch (err) {
        console.error('MongoDB findUserByEmail error:', err);
      }
    }
    const users = await db.getUsers();
    return users.find(u => u.email.toLowerCase() === email.toLowerCase());
  },

  createUser: async (user: Omit<User, 'id' | 'createdAt'>): Promise<User> => {
    const newUser: User = {
      ...user,
      id: `usr-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    const conn = await connectToDatabase();
    if (conn) {
      try {
        await UserModel.create(newUser);
        return newUser;
      } catch (err) {
        console.error('MongoDB createUser error:', err);
      }
    }
    const users = await db.getUsers();
    users.push(newUser);
    await fallbackWrite('users', users);
    return newUser;
  },

  // ORDERS
  getOrders: async (): Promise<Order[]> => {
    const conn = await connectToDatabase();
    if (conn) {
      try {
        let orders = await OrderModel.find().sort({ createdAt: -1 }).lean();
        if (!orders || orders.length === 0) {
          await OrderModel.insertMany(initialOrders);
          orders = await OrderModel.find().sort({ createdAt: -1 }).lean();
        }
        return JSON.parse(JSON.stringify(orders));
      } catch (err) {
        console.error('MongoDB getOrders error:', err);
      }
    }
    return await fallbackRead<Order[]>('orders', initialOrders);
  },

  saveOrders: async (orders: Order[]): Promise<boolean> => {
    const conn = await connectToDatabase();
    if (conn) {
      try {
        await OrderModel.deleteMany({});
        await OrderModel.insertMany(orders);
        return true;
      } catch (err) {
        console.error('MongoDB saveOrders error:', err);
      }
    }
    return await fallbackWrite('orders', orders);
  },

  getOrderByIdOrTracking: async (query: string): Promise<Order | undefined> => {
    const conn = await connectToDatabase();
    if (conn) {
      try {
        const clean = query.trim();
        const order = await OrderModel.findOne({
          $or: [
            { id: new RegExp(`^${clean}$`, 'i') },
            { trackingCode: new RegExp(`^${clean}$`, 'i') }
          ]
        }).lean();
        if (order) return JSON.parse(JSON.stringify(order));
      } catch (err) {
        console.error('MongoDB getOrderByIdOrTracking error:', err);
      }
    }
    const orders = await db.getOrders();
    const cleanQuery = query.trim().toUpperCase();
    return orders.find(o => o.id.toUpperCase() === cleanQuery || o.trackingCode.toUpperCase() === cleanQuery);
  },

  createOrder: async (orderData: Omit<Order, 'id' | 'trackingCode' | 'createdAt' | 'updatedAt'>): Promise<Order> => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const id = `ORD-${randomNum}`;
    const trackingCode = `MP-TRK-${randomNum}`;
    const now = new Date().toISOString();

    const newOrder: Order = {
      ...orderData,
      id,
      trackingCode,
      createdAt: now,
      updatedAt: now
    };

    const conn = await connectToDatabase();
    if (conn) {
      try {
        await OrderModel.create(newOrder);
        return newOrder;
      } catch (err) {
        console.error('MongoDB createOrder error:', err);
      }
    }

    const orders = await db.getOrders();
    orders.unshift(newOrder);
    await fallbackWrite('orders', orders);
    return newOrder;
  },

  updateOrderStatus: async (id: string, status: Order['orderStatus']): Promise<Order | null> => {
    const conn = await connectToDatabase();
    if (conn) {
      try {
        const updated = await OrderModel.findOneAndUpdate(
          { id },
          { orderStatus: status, updatedAt: new Date().toISOString() },
          { new: true }
        ).lean();
        if (updated) return JSON.parse(JSON.stringify(updated));
      } catch (err) {
        console.error('MongoDB updateOrderStatus error:', err);
      }
    }

    const orders = await db.getOrders();
    const index = orders.findIndex(o => o.id === id);
    if (index === -1) return null;
    orders[index].orderStatus = status;
    orders[index].updatedAt = new Date().toISOString();
    await fallbackWrite('orders', orders);
    return orders[index];
  },

  // ADMIN DASHBOARD METRICS
  getAdminStats: async (): Promise<AdminStats> => {
    const orders = await db.getOrders();
    const products = await db.getProducts();
    const users = await db.getUsers();

    const totalRevenue = orders
      .filter(o => o.paymentStatus === 'Paid')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const pendingOrdersCount = orders.filter(o => o.orderStatus === 'Placed' || o.orderStatus === 'Packed').length;
    const deliveredOrdersCount = orders.filter(o => o.orderStatus === 'Delivered').length;

    return {
      totalRevenue,
      totalOrders: orders.length,
      totalProducts: products.length,
      totalCustomers: users.filter(u => u.role === 'customer').length,
      pendingOrdersCount,
      deliveredOrdersCount
    };
  }
};
