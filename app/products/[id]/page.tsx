'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { SpiceBadge, VegNonVegBadge } from '@/components/SpiceBadge';
import {
  Star,
  ShoppingCart,
  Check,
  ShieldCheck,
  Truck,
  ArrowLeft,
  Flame,
  Plus,
  Minus,
  Award
} from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedWeight, setSelectedWeight] = useState<'250g' | '500g' | '1kg'>('250g');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${params.id}`);
        const data = await res.json();
        if (data.success) {
          setProduct(data.product);
          if (data.product.weights && data.product.weights.length > 0) {
            setSelectedWeight(data.product.weights[0].weight);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 border-4 border-brand-crimson border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-semibold text-gray-600">Fetching jar details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center space-y-4">
        <div className="text-4xl">🫙</div>
        <h2 className="text-2xl font-bold text-gray-800">Pickle jar not found</h2>
        <Link href="/products" className="inline-block px-6 py-2.5 bg-brand-crimson text-white rounded-lg text-sm font-bold">
          Back to Store
        </Link>
      </div>
    );
  }

  const activeWeightObj =
    product.weights.find((w) => w.weight === selectedWeight) || product.weights[0];
  const totalPrice = (activeWeightObj?.price || 0) * quantity;

  const handleAddToCart = () => {
    addToCart(product, selectedWeight, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedWeight, quantity);
    router.push('/checkout');
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Back button */}
      <Link
        href="/products"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-brand-crimson transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to All Pickles
      </Link>

      {/* Main product view */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white p-6 sm:p-8 rounded-3xl border border-amber-100 shadow-sm">
        {/* Left: Product Image */}
        <div className="space-y-4">
          <div className="relative h-96 sm:h-[450px] bg-amber-50 rounded-2xl overflow-hidden border border-amber-100 shadow-inner">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isBestseller && (
                <span className="bg-amber-500 text-white font-extrabold text-xs uppercase px-3 py-1 rounded-full shadow">
                  ★ Bestseller
                </span>
              )}
              <VegNonVegBadge isVeg={product.isVeg} />
            </div>

            <div className="absolute top-4 right-4">
              <SpiceBadge level={product.spiceLevel} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-amber-50/70 rounded-xl text-center border border-amber-200/60">
              <span className="block text-[11px] text-gray-500 font-medium">Authentic Origin</span>
              <span className="text-xs font-bold text-gray-900">Kozhikode, Kerala</span>
            </div>
            <div className="p-3 bg-amber-50/70 rounded-xl text-center border border-amber-200/60">
              <span className="block text-[11px] text-gray-500 font-medium">Oil Base</span>
              <span className="text-xs font-bold text-gray-900">Pure Gingelly Oil</span>
            </div>
            <div className="p-3 bg-amber-50/70 rounded-xl text-center border border-amber-200/60">
              <span className="block text-[11px] text-gray-500 font-medium">Shelf Life</span>
              <span className="text-xs font-bold text-gray-900">12 Months</span>
            </div>
          </div>
        </div>

        {/* Right: Product Details & Purchase Form */}
        <div className="space-y-6 flex flex-col justify-between">
          <div className="space-y-3">
            <span className="text-xs font-bold text-brand-crimson uppercase tracking-widest">
              {product.categoryName}
            </span>

            <h1 className="text-3xl font-extrabold font-serif text-gray-900">
              {product.name}
            </h1>

            {product.malayalamName && (
              <p className="text-sm font-serif font-semibold text-amber-900 bg-amber-100/70 px-3 py-1 rounded-lg w-fit">
                {product.malayalamName}
              </p>
            )}

            {/* Rating Stars */}
            <div className="flex items-center gap-2 pt-1">
              <div className="flex text-amber-400">
                {'★'.repeat(Math.floor(product.rating))}
              </div>
              <span className="text-xs font-bold text-gray-900">{product.rating}</span>
              <span className="text-xs text-gray-500">({product.reviewsCount} customer reviews)</span>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed pt-2">
              {product.description}
            </p>
          </div>

          {/* Weight Selection */}
          <div className="space-y-3 pt-4 border-t border-gray-100">
            <label className="text-xs font-extrabold uppercase text-gray-800 tracking-wider">
              Select Net Weight (Jar Size):
            </label>
            <div className="grid grid-cols-3 gap-3">
              {product.weights.map((w) => (
                <button
                  key={w.weight}
                  onClick={() => setSelectedWeight(w.weight)}
                  className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1 ${
                    selectedWeight === w.weight
                      ? 'border-brand-crimson bg-red-50/50 text-brand-crimson shadow-sm ring-1 ring-brand-crimson'
                      : 'border-gray-200 text-gray-700 hover:bg-amber-50'
                  }`}
                >
                  <span className="text-sm font-bold">{w.weight}</span>
                  <span className="text-xs font-extrabold text-gray-900">₹{w.price}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector & Price */}
          <div className="space-y-3 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-400 font-medium block">Total Price:</span>
                <span className="text-2xl font-extrabold text-brand-dark">₹{totalPrice}</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-700">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-200 text-gray-600 transition"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 text-sm font-bold text-gray-800">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-gray-200 text-gray-600 transition"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                className={`py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition shadow ${
                  isAdded
                    ? 'bg-emerald-700 text-white'
                    : 'bg-brand-dark text-white hover:bg-gray-900'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-5 h-5" /> Added to Jar!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" /> Add to Cart
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                className="py-3.5 px-4 rounded-xl bg-brand-crimson text-white font-bold text-sm hover:bg-red-800 transition shadow flex items-center justify-center gap-1"
              >
                Buy Now (Checkout)
              </button>
            </div>
          </div>

          {/* Value Badges */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100 text-xs text-gray-600">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> FSSAI Certified Kitchen
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Truck className="w-4 h-4 text-brand-amber" /> Express Sealed Delivery
            </span>
          </div>
        </div>
      </div>

      {/* Ingredients & Storage Info */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-100 shadow-sm space-y-6">
        <h3 className="text-lg font-bold font-serif text-gray-900 border-b border-amber-100 pb-3 flex items-center gap-2">
          <Award className="w-5 h-5 text-brand-crimson" /> Ingredients & Heritage Preparation
        </h3>

        <div className="space-y-4">
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
            All Natural Ingredients:
          </p>
          <div className="flex flex-wrap gap-2">
            {product.ingredients.map((ing, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold rounded-full"
              >
                ✓ {ing}
              </span>
            ))}
          </div>

          <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/60 text-xs text-gray-700 space-y-2 mt-4">
            <p className="font-bold text-brand-dark">💡 Storage & Handling Tip:</p>
            <p>
              Use a dry spoon every time. Do not expose jar to moisture or direct sunlight. Keep the top layer submerged in Gingelly oil for maximum natural shelf life without preservatives.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
