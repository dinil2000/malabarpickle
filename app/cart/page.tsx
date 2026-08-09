'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { VegNonVegBadge } from '@/components/SpiceBadge';
import { Plus, Minus, Trash2, ArrowRight, Tag, ShoppingBag, Check } from 'lucide-react';

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    discount,
    couponCode,
    applyCoupon,
    removeCoupon,
    deliveryFee,
    totalAmount
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    if (!inputCoupon.trim()) return;

    const res = applyCoupon(inputCoupon);
    if (res) {
      setCouponSuccess(`Coupon ${inputCoupon.toUpperCase()} applied successfully!`);
      setInputCoupon('');
    } else {
      setCouponError('Invalid coupon code. Try MALABAR10 or KERALA10');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center space-y-4 max-w-md">
        <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center text-5xl mx-auto">
          🫙
        </div>
        <h1 className="text-2xl font-extrabold font-serif text-gray-900">Your Pickle Jar is Empty</h1>
        <p className="text-sm text-gray-600">
          Looks like you haven't added any delicious Kerala pickles to your cart yet.
        </p>
        <Link
          href="/products"
          className="inline-block px-8 py-3 bg-brand-crimson text-white font-bold rounded-xl hover:bg-brand-dark transition shadow"
        >
          Explore Pickle Store
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between border-b border-amber-200 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-brand-dark flex items-center gap-2">
          <ShoppingBag className="w-7 h-7 text-brand-crimson" /> Shopping Cart
        </h1>
        <button
          onClick={clearCart}
          className="text-xs font-bold text-red-600 hover:text-red-800 transition flex items-center gap-1"
        >
          <Trash2 className="w-4 h-4" /> Clear All Items
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 sm:p-5 rounded-2xl border border-amber-100 shadow-sm flex flex-col sm:flex-row items-center gap-4 justify-between"
            >
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <img
                  src={item.image}
                  alt={item.productName}
                  className="w-20 h-20 object-cover rounded-xl border border-amber-100 flex-shrink-0"
                />
                <div className="space-y-1">
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                    {item.productName}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 bg-amber-100 text-amber-900 rounded">
                      {item.weight}
                    </span>
                    <VegNonVegBadge isVeg={item.isVeg} />
                  </div>
                  <p className="text-xs text-gray-500 font-medium">
                    Unit Price: ₹{item.unitPrice}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between w-full sm:w-auto gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                {/* Quantity adjuster */}
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1.5 hover:bg-gray-200 text-gray-600 transition"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-bold text-gray-800">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1.5 hover:bg-gray-200 text-gray-600 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <span className="font-extrabold text-brand-dark text-base min-w-[70px] text-right">
                  ₹{item.unitPrice * item.quantity}
                </span>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-gray-400 hover:text-red-600 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <div className="pt-2">
            <Link
              href="/products"
              className="text-xs font-bold text-brand-crimson hover:underline inline-flex items-center gap-1"
            >
              ← Continue Shopping for Pickles
            </Link>
          </div>
        </div>

        {/* Order Summary & Coupon Box */}
        <div className="space-y-6">
          {/* Coupon Code Section */}
          <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
              <Tag className="w-4 h-4 text-brand-amber" /> Discount Coupon
            </h3>

            {couponCode ? (
              <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <div>
                  <span className="text-xs font-bold text-emerald-800 block">
                    COUPON APPLIED: {couponCode}
                  </span>
                  <span className="text-[11px] text-emerald-700">You saved ₹{discount}!</span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-xs text-red-600 hover:underline font-bold"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter Coupon (e.g. MALABAR10)"
                    value={inputCoupon}
                    onChange={(e) => setInputCoupon(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs border border-amber-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-crimson"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-brand-dark text-white rounded-lg text-xs font-bold hover:bg-gray-900 transition"
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-[11px] font-semibold text-red-600">{couponError}</p>}
                {couponSuccess && <p className="text-[11px] font-semibold text-emerald-600">{couponSuccess}</p>}
                <p className="text-[11px] text-gray-400">Try code <span className="font-bold text-gray-700">MALABAR10</span> for 10% discount!</p>
              </form>
            )}
          </div>

          {/* Pricing Breakdown Card */}
          <div className="bg-white p-6 rounded-2xl border border-amber-100 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-gray-900 border-b border-gray-100 pb-3">
              Order Summary
            </h3>

            <div className="space-y-2.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal ({cart.length} items)</span>
                <span className="font-bold text-gray-900">₹{subtotal}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Coupon Discount</span>
                  <span>-₹{discount}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Standard Delivery Fee</span>
                <span className="font-bold text-gray-900">
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-600 font-bold">FREE</span>
                  ) : (
                    `₹${deliveryFee}`
                  )}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-200 flex justify-between items-center text-sm font-extrabold text-gray-900">
              <span>Total Payable</span>
              <span className="text-xl text-brand-dark">₹{totalAmount}</span>
            </div>

            <Link
              href="/checkout"
              className="w-full py-3.5 bg-brand-crimson text-white rounded-xl font-bold text-sm hover:bg-brand-dark transition shadow flex items-center justify-center gap-2 text-center"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
