'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { SpiceBadge, VegNonVegBadge } from './SpiceBadge';
import { Star, ShoppingCart, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [selectedWeight, setSelectedWeight] = useState<'250g' | '500g' | '1kg'>(
    product.weights[0]?.weight || '250g'
  );
  const [isAdded, setIsAdded] = useState(false);

  const activeWeightObj =
    product.weights.find((w) => w.weight === selectedWeight) || product.weights[0];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, selectedWeight, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  return (
    <div className="group bg-white rounded-2xl border border-amber-100/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative">
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
        {product.isBestseller && (
          <span className="bg-amber-500 text-white font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded shadow">
            ★ Bestseller
          </span>
        )}
        <VegNonVegBadge isVeg={product.isVeg} />
      </div>

      <div className="absolute top-3 right-3 z-10">
        <SpiceBadge level={product.spiceLevel} />
      </div>

      {/* Image container */}
      <Link href={`/products/${product.id}`} className="relative block h-52 bg-amber-50 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </Link>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold mb-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{product.rating}</span>
            <span className="text-gray-400">({product.reviewsCount} reviews)</span>
          </div>

          <Link href={`/products/${product.id}`}>
            <h3 className="font-bold text-gray-900 group-hover:text-brand-crimson transition line-clamp-1">
              {product.name}
            </h3>
          </Link>
          {product.malayalamName && (
            <p className="text-xs text-amber-800 font-serif font-medium mt-0.5">
              {product.malayalamName}
            </p>
          )}

          <p className="text-xs text-gray-500 line-clamp-2 mt-1.5">
            {product.description}
          </p>
        </div>

        {/* Weight Selector */}
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1 font-medium">
            <span>Select Weight:</span>
          </div>
          <div className="grid grid-cols-3 gap-1 bg-amber-50/60 p-1 rounded-lg">
            {product.weights.map((w) => (
              <button
                key={w.weight}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedWeight(w.weight);
                }}
                className={`py-1 text-xs font-bold rounded transition ${
                  selectedWeight === w.weight
                    ? 'bg-brand-dark text-white shadow-sm'
                    : 'text-gray-700 hover:bg-amber-100'
                }`}
              >
                {w.weight}
              </button>
            ))}
          </div>
        </div>

        {/* Price & Add to Cart button */}
        <div className="flex items-center justify-between pt-2">
          <div>
            <span className="text-xs text-gray-400 block font-medium">Price</span>
            <span className="text-lg font-bold text-brand-dark">
              ₹{activeWeightObj?.price}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow-sm ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-brand-crimson text-white hover:bg-brand-dark'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" /> Added!
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" /> Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
