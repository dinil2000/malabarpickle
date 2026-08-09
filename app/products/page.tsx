'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Product, Category, SpiceLevel } from '@/lib/types';
import { ProductCard } from '@/components/ProductCard';
import { Search, Filter, SlidersHorizontal, RefreshCw } from 'lucide-react';

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const initialSearch = searchParams.get('search') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [selectedSpice, setSelectedSpice] = useState<string>('');
  const [selectedVegFilter, setSelectedVegFilter] = useState<string>(''); // '', 'veg', 'non-veg'
  const [sortBy, setSortBy] = useState<string>('popular'); // 'popular', 'price-low', 'price-high'

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        if (data.success) setCategories(data.categories);
      } catch (err) {
        console.error(err);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (selectedCategory) query.append('category', selectedCategory);
        if (searchQuery) query.append('search', searchQuery);
        if (selectedSpice) query.append('spice', selectedSpice);
        if (selectedVegFilter === 'veg') query.append('isVeg', 'true');
        if (selectedVegFilter === 'non-veg') query.append('isVeg', 'false');

        const res = await fetch(`/api/products?${query.toString()}`);
        const data = await res.json();
        if (data.success) {
          let list: Product[] = data.products;

          if (sortBy === 'price-low') {
            list = [...list].sort((a, b) => (a.weights[0]?.price || 0) - (b.weights[0]?.price || 0));
          } else if (sortBy === 'price-high') {
            list = [...list].sort((a, b) => (b.weights[0]?.price || 0) - (a.weights[0]?.price || 0));
          } else if (sortBy === 'rating') {
            list = [...list].sort((a, b) => b.rating - a.rating);
          }

          setProducts(list);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategory, searchQuery, selectedSpice, selectedVegFilter, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('');
    setSearchQuery('');
    setSelectedSpice('');
    setSelectedVegFilter('');
    setSortBy('popular');
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="bg-brand-dark text-white p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-xl space-y-2">
          <span className="text-xs font-bold text-brand-amber uppercase tracking-widest">
            100% Traditional Malabar Recipe
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif">
            Artisanal Pickle Store
          </h1>
          <p className="text-xs sm:text-sm text-amber-100/80">
            Browse our wide range of spicy, salted, cured, roasted Veg & Non-Veg pickles.
          </p>
        </div>
      </div>

      {/* Filter Toolbar & Search Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar Filters */}
        <div className="space-y-6 bg-white p-6 rounded-2xl border border-amber-100 shadow-sm h-fit">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <Filter className="w-4 h-4 text-brand-crimson" /> Filter Pickles
            </h3>
            {(selectedCategory || searchQuery || selectedSpice || selectedVegFilter) && (
              <button
                onClick={resetFilters}
                className="text-xs font-bold text-brand-crimson hover:underline flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Reset All
              </button>
            )}
          </div>

          {/* Search Box */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">Search Name</label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. Mango, Garlic, Beef..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs bg-amber-50/50 border border-amber-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-crimson"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          {/* Veg / Non-Veg Option */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-700">Dietary Preference</label>
            <div className="grid grid-cols-3 gap-1 bg-amber-50/60 p-1 rounded-lg">
              <button
                onClick={() => setSelectedVegFilter('')}
                className={`py-1 text-xs font-bold rounded ${
                  selectedVegFilter === ''
                    ? 'bg-brand-dark text-white'
                    : 'text-gray-600 hover:bg-amber-100'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedVegFilter('veg')}
                className={`py-1 text-xs font-bold rounded ${
                  selectedVegFilter === 'veg'
                    ? 'bg-emerald-700 text-white'
                    : 'text-emerald-800 hover:bg-emerald-100'
                }`}
              >
                🌱 Veg
              </button>
              <button
                onClick={() => setSelectedVegFilter('non-veg')}
                className={`py-1 text-xs font-bold rounded ${
                  selectedVegFilter === 'non-veg'
                    ? 'bg-red-700 text-white'
                    : 'text-red-800 hover:bg-red-100'
                }`}
              >
                🍖 Non-Veg
              </button>
            </div>
          </div>

          {/* Categories Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-700">Categories</label>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory('')}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition ${
                  selectedCategory === ''
                    ? 'bg-brand-crimson text-white font-bold'
                    : 'text-gray-700 hover:bg-amber-50'
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition ${
                    selectedCategory === cat.id
                      ? 'bg-brand-crimson text-white font-bold'
                      : 'text-gray-700 hover:bg-amber-50'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Spice Level Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-700">Spice Level</label>
            <select
              value={selectedSpice}
              onChange={(e) => setSelectedSpice(e.target.value)}
              className="w-full p-2 bg-amber-50/50 border border-amber-200 rounded-lg text-xs text-gray-800"
            >
              <option value="">Any Spice Level</option>
              <option value="Mild">Mild 🌶️</option>
              <option value="Medium">Medium 🌶️🌶️</option>
              <option value="Spicy">Spicy 🌶️🌶️🌶️</option>
              <option value="Extra Hot">Extra Hot 🔥🌶️🌶️🌶️</option>
            </select>
          </div>
        </div>

        {/* Right Main Grid */}
        <div className="lg:col-span-3 space-y-6">
          {/* Top Sort toolbar */}
          <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-xl border border-amber-100 gap-4 shadow-sm">
            <span className="text-xs text-gray-500 font-medium">
              Showing <span className="font-bold text-gray-900">{products.length}</span> pickles
            </span>

            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-gray-500" />
              <span className="text-xs text-gray-600 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="py-1 px-3 bg-amber-50/60 border border-amber-200 text-xs font-semibold rounded-lg focus:outline-none"
              >
                <option value="popular">Popularity</option>
                <option value="rating">Top Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 bg-gray-200/60 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center space-y-3 border border-amber-100 shadow-sm">
              <div className="text-4xl">🫙</div>
              <h3 className="text-lg font-bold text-gray-800">No pickles matched your filter</h3>
              <p className="text-xs text-gray-500">
                Try clearing your search query or choosing a different category.
              </p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-brand-crimson text-white rounded-lg text-xs font-bold hover:bg-brand-dark transition"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-gray-500">Loading pickles catalog...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
