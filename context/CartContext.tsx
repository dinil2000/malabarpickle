'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '@/lib/types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, weight: '250g' | '500g' | '1kg', quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  totalCount: number;
  subtotal: number;
  discount: number;
  couponCode: string;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  deliveryFee: number;
  totalAmount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState<string>('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('malabar_cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (e) {
      console.error('Failed to load cart', e);
    }
  }, []);

  const saveCartToStorage = (updatedCart: CartItem[]) => {
    setCart(updatedCart);
    localStorage.setItem('malabar_cart', JSON.stringify(updatedCart));
  };

  const addToCart = (product: Product, weight: '250g' | '500g' | '1kg', quantity: number = 1) => {
    const selectedWeightObj = product.weights.find(w => w.weight === weight) || product.weights[0];
    const unitPrice = selectedWeightObj.price;
    const cartItemId = `${product.id}-${weight}`;

    const existingIndex = cart.findIndex(item => item.id === cartItemId);

    let updatedCart: CartItem[];
    if (existingIndex > -1) {
      updatedCart = [...cart];
      updatedCart[existingIndex].quantity += quantity;
    } else {
      const newItem: CartItem = {
        id: cartItemId,
        productId: product.id,
        productName: product.name,
        weight,
        unitPrice,
        quantity,
        image: product.image,
        isVeg: product.isVeg
      };
      updatedCart = [...cart, newItem];
    }

    saveCartToStorage(updatedCart);
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    const updatedCart = cart.filter(item => item.id !== cartItemId);
    saveCartToStorage(updatedCart);
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    const updatedCart = cart.map(item => {
      if (item.id === cartItemId) {
        return { ...item, quantity };
      }
      return item;
    });
    saveCartToStorage(updatedCart);
  };

  const clearCart = () => {
    saveCartToStorage([]);
    setCouponCode('');
    setDiscountPercent(0);
  };

  const applyCoupon = (code: string): boolean => {
    const clean = code.trim().toUpperCase();
    if (clean === 'MALABAR10' || clean === 'KERALA10') {
      setCouponCode(clean);
      setDiscountPercent(10);
      return true;
    } else if (clean === 'PICKLE15' || clean === 'WELCOME15') {
      setCouponCode(clean);
      setDiscountPercent(15);
      return true;
    }
    return false;
  };

  const removeCoupon = () => {
    setCouponCode('');
    setDiscountPercent(0);
  };

  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const discount = Math.round((subtotal * discountPercent) / 100);
  const deliveryFee = subtotal > 999 || subtotal === 0 ? 0 : 50;
  const totalAmount = Math.max(0, subtotal - discount + deliveryFee);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalCount,
        subtotal,
        discount,
        couponCode,
        applyCoupon,
        removeCoupon,
        deliveryFee,
        totalAmount,
        isCartOpen,
        setIsCartOpen
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
