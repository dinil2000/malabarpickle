'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Product, Category } from '@/lib/types';
import { ProductCard } from '@/components/ProductCard';
import { ArrowRight, Flame, Shield, Sparkles, Star, Award, Truck } from 'lucide-react';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories')
        ]);
        const prodData = await prodRes.json();
        const catData = await catRes.json();

        if (prodData.success) setProducts(prodData.products);
        if (catData.success) setCategories(catData.categories);
      } catch (err) {
        console.error('Failed to load home page data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const bestsellers = products.filter(p => p.isBestseller).slice(0, 4);

  return (
    <div className="space-y-12 pb-12">
      {/* HERO BANNER */}
      <section className="relative bg-gradient-to-r from-brand-dark via-brand-red to-brand-dark text-white py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
        
        <div className="container mx-auto px-4 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-brand-amber text-xs font-bold border border-amber-400/30">
              <Sparkles className="w-4 h-4" /> Authentic Kerala Heritage Pickle Recipes
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-serif leading-tight">
              Fiery, Tangy & <span className="text-brand-amber">Unforgettably</span> Authentic
            </h1>

            <p className="text-amber-100/90 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans">
              Handcrafted in Kozhikode with sun-cured fruits, wild coastal spices, and simmered in 100% pure cold-pressed Gingelly sesame oil.
            </p>

            <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-2">
              <Link
                href="/products"
                className="px-8 py-3.5 bg-brand-amber text-gray-950 font-bold rounded-xl hover:bg-yellow-400 transition shadow-lg flex items-center gap-2 text-base"
              >
                Shop All Pickles <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/products?category=cat-non-veg"
                className="px-6 py-3.5 border-2 border-white/40 hover:border-white text-white font-bold rounded-xl hover:bg-white/10 transition text-base"
              >
                Non-Veg Pickles 🍖
              </Link>
            </div>

            <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-amber-200/80 font-medium">
              <span className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-brand-amber" /> 0% Preservatives
              </span>
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-brand-amber" /> Free Shipping Above ₹999
              </span>
              <span className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-brand-amber fill-brand-amber" /> 4.9 ★ (1,200+ Reviews)
              </span>
            </div>
          </div>

          {/* Hero Image Collage */}
          <div className="relative flex justify-center">
            <div className="w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-amber-500/20 absolute -inset-4 blur-2xl -z-10" />
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-400/30 max-w-md">
              <img
                src="https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80"
                alt="Malabar Mango Pickle Jar"
                className="w-full h-80 sm:h-96 object-cover hover:scale-105 transition duration-700"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 text-white flex justify-between items-center">
                <div>
                  <p className="text-xs text-amber-300 font-medium">Most Loved Bestseller</p>
                  <p className="text-sm font-bold font-serif">Cut Mango & King Fish Duo</p>
                </div>
                <span className="bg-brand-crimson px-3 py-1 rounded-lg text-xs font-bold">
                  From ₹180
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROMO CODE STRIP */}
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-amber-500 via-brand-amber to-amber-600 rounded-2xl p-4 sm:p-6 text-gray-950 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-12 h-12 bg-white/30 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
              🎁
            </div>
            <div>
              <h3 className="font-extrabold text-lg">Special Welcome Offer!</h3>
              <p className="text-xs sm:text-sm text-gray-900 font-medium">
                Get <span className="font-extrabold underline">10% OFF</span> on your order. Use code{' '}
                <span className="bg-black text-white px-2 py-0.5 rounded font-mono font-bold tracking-wider">
                  MALABAR10
                </span>
              </p>
            </div>
          </div>
          <Link
            href="/products"
            className="px-5 py-2.5 bg-gray-950 text-white text-xs font-bold rounded-lg hover:bg-gray-800 transition whitespace-nowrap"
          >
            Claim Offer Now
          </Link>
        </div>
      </div>

      {/* CATEGORIES SECTION */}
      <section className="container mx-auto px-4 space-y-6">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-brand-dark">
            Explore Pickle Categories
          </h2>
          <p className="text-sm text-gray-600">
            From traditional tangy raw mangoes to savory sea-side prawn pickles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.id}`}
              className="group relative rounded-2xl overflow-hidden h-64 shadow-md border border-amber-100 block"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-6 flex flex-col justify-end text-white">
                <h3 className="text-xl font-bold font-serif group-hover:text-brand-amber transition">
                  {cat.name}
                </h3>
                <p className="text-xs text-gray-200 mt-1 line-clamp-2">{cat.description}</p>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-amber mt-3">
                  Browse Collection <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* BESTSELLERS SECTION */}
      <section className="container mx-auto px-4 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-amber-200/60 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-crimson flex items-center gap-1">
              <Flame className="w-4 h-4 fill-brand-crimson text-brand-crimson" /> Top Favorites
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-brand-dark">
              Malabar Bestsellers
            </h2>
          </div>
          <Link
            href="/products"
            className="text-xs font-bold text-brand-crimson hover:text-brand-dark flex items-center gap-1"
          >
            View All Pickles <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-80 bg-gray-200/60 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {bestsellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* WHY MALABAR PICKLE */}
      <section className="bg-amber-100/50 py-16 border-y border-amber-200/60">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-crimson">
              Grandma's Secret Recipe
            </span>
            <h2 className="text-3xl font-extrabold font-serif text-brand-dark leading-snug">
              Why Malabar Pickles Taste Superior
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              Unlike factory-produced pickles full of acidity regulators and synthetic vinegar, Malabar Pickles are crafted using traditional Kerala sun-drying techniques, hand-ground Kashmiri chilies, and tempered in unrefined Gingelly (Sesame) oil.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-white rounded-xl border border-amber-200/80 shadow-sm">
                <div className="text-2xl mb-1">🌿</div>
                <h4 className="font-bold text-sm text-gray-900">Zero Chemicals</h4>
                <p className="text-xs text-gray-500 mt-1">100% natural vinegar & sun-cured spices only.</p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-amber-200/80 shadow-sm">
                <div className="text-2xl mb-1">🛢️</div>
                <h4 className="font-bold text-sm text-gray-900">Pure Gingelly Oil</h4>
                <p className="text-xs text-gray-500 mt-1">Cold-pressed sesame oil enhances rich aroma.</p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-amber-200/80 shadow-sm">
                <div className="text-2xl mb-1">📦</div>
                <h4 className="font-bold text-sm text-gray-900">Double-Sealed Jars</h4>
                <p className="text-xs text-gray-500 mt-1">Leak-proof food-grade glass & pet jar packaging.</p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-amber-200/80 shadow-sm">
                <div className="text-2xl mb-1">🚀</div>
                <h4 className="font-bold text-sm text-gray-900">Express Delivery</h4>
                <p className="text-xs text-gray-500 mt-1">Shipped directly from Malabar coast within 24h.</p>
              </div>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white">
            <img
              src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80"
              alt="Malabar Spice Roasting"
              className="w-full h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent p-6 flex flex-col justify-end text-white">
              <p className="text-xs text-brand-amber font-bold">Malabar Heritage</p>
              <h3 className="text-xl font-bold font-serif">Roasted Seafood & Meat Pickles</h3>
              <p className="text-xs text-gray-200 mt-1">Slow roasted with crunchy coconut chips and black pepper.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CUSTOMER REVIEWS */}
      <section className="container mx-auto px-4 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-crimson">
            Real Customer Words
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-brand-dark">
            Loved Across India & Overseas
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-amber-100 shadow-sm space-y-3">
            <div className="flex text-amber-400">
              {'★'.repeat(5)}
            </div>
            <p className="text-xs text-gray-700 italic leading-relaxed">
              "The King Fish pickle tastes exactly like my grandmother used to prepare in Kannur! The fish chunks are juicy, non-rubbery, and spicy."
            </p>
            <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
              <span className="font-bold text-xs text-gray-900">Dr. Vivek Menon</span>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded">Verified Buyer</span>
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-amber-100 shadow-sm space-y-3">
            <div className="flex text-amber-400">
              {'★'.repeat(5)}
            </div>
            <p className="text-xs text-gray-700 italic leading-relaxed">
              "Ordered Kadumango and Garlic pickle. Packaging was top-notch—zero oil leakage in transit to Delhi! Absolutely ordering 1kg jar next."
            </p>
            <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
              <span className="font-bold text-xs text-gray-900">Pooja Sharma</span>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded">Verified Buyer</span>
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-amber-100 shadow-sm space-y-3">
            <div className="flex text-amber-400">
              {'★'.repeat(5)}
            </div>
            <p className="text-xs text-gray-700 italic leading-relaxed">
              "The Kerala Beef Roast pickle with coconut pieces is out of this world! Perfect accompaniment for hot boiled rice and ghee."
            </p>
            <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
              <span className="font-bold text-xs text-gray-900">Mathew Joseph</span>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded">Verified Buyer</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
