'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Product, Category, SpiceLevel } from '@/lib/types';
import { SpiceBadge, VegNonVegBadge } from '@/components/SpiceBadge';
import { Plus, Trash2, Edit, X, Check, RefreshCw, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminProductsPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [spiceLevel, setSpiceLevel] = useState<SpiceLevel>('Spicy');
  const [isVeg, setIsVeg] = useState(true);
  const [image, setImage] = useState('');
  const [price250, setPrice250] = useState(180);
  const [price500, setPrice500] = useState(340);
  const [price1kg, setPrice1kg] = useState(650);

  const fetchProducts = async () => {
    try {
      const [pRes, cRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories')
      ]);
      const pData = await pRes.json();
      const cData = await cRes.json();

      if (pData.success) setProducts(pData.products);
      if (cData.success) {
        setCategories(cData.categories);
        if (cData.categories.length > 0) setCategoryId(cData.categories[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      router.push('/login');
      return;
    }
    if (user?.role === 'admin') {
      fetchProducts();
    }
  }, [user, isLoading, router]);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !categoryId) {
      alert('Please complete all required fields.');
      return;
    }

    const categoryObj = categories.find(c => c.id === categoryId);

    const payload = {
      name,
      description,
      categoryId,
      categoryName: categoryObj?.name || 'Vegetarian Pickles',
      spiceLevel,
      isVeg,
      image: image || 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80',
      weights: [
        { weight: '250g', price: Number(price250) },
        { weight: '500g', price: Number(price500) },
        { weight: '1kg', price: Number(price1kg) }
      ]
    };

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        setName('');
        setDescription('');
        fetchProducts();
      } else {
        alert(data.error || 'Failed to add product');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this pickle product?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchProducts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <Link href="/admin" className="text-xs font-bold text-gray-500 hover:text-brand-dark flex items-center gap-1">
        <ArrowLeft className="w-4 h-4" /> Back to Admin Dashboard
      </Link>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-amber-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold font-serif text-brand-dark">Pickle Product Manager</h1>
          <p className="text-xs text-gray-500">Add, update prices, weights, spice levels, and catalog items.</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 bg-brand-crimson text-white font-bold rounded-xl text-xs hover:bg-brand-dark transition shadow flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add New Pickle Product
        </button>
      </div>

      {/* Product List Table */}
      <div className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-amber-50 text-brand-dark font-extrabold uppercase border-b border-amber-100">
            <tr>
              <th className="p-4">Product Info</th>
              <th className="p-4">Category</th>
              <th className="p-4">Diet & Spice</th>
              <th className="p-4">Weight Pricing</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-amber-50/40">
                <td className="p-4 flex items-center gap-3">
                  <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded-lg border" />
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{p.name}</p>
                    <p className="text-gray-400 text-[11px] font-serif">{p.malayalamName}</p>
                  </div>
                </td>
                <td className="p-4 font-semibold text-gray-700">{p.categoryName}</td>
                <td className="p-4 space-y-1">
                  <VegNonVegBadge isVeg={p.isVeg} />
                  <div><SpiceBadge level={p.spiceLevel} /></div>
                </td>
                <td className="p-4 font-mono font-bold text-gray-900">
                  {p.weights.map(w => `${w.weight}: ₹${w.price}`).join(' | ')}
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => handleDeleteProduct(p.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Delete product"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-extrabold text-lg font-serif text-brand-dark">Add New Pickle Product</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-gray-700">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Special Prawns Roast Pickle"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 border border-amber-200 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-700">Description *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Enter pickle details and ingredients..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 border border-amber-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">Category *</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full p-2.5 border border-amber-200 rounded-xl"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">Spice Level</label>
                  <select
                    value={spiceLevel}
                    onChange={(e) => setSpiceLevel(e.target.value as SpiceLevel)}
                    className="w-full p-2.5 border border-amber-200 rounded-xl"
                  >
                    <option value="Mild">Mild 🌶️</option>
                    <option value="Medium">Medium 🌶️🌶️</option>
                    <option value="Spicy">Spicy 🌶️🌶️🌶️</option>
                    <option value="Extra Hot">Extra Hot 🔥🌶️🌶️🌶️</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">Dietary Type</label>
                  <select
                    value={isVeg ? 'veg' : 'non-veg'}
                    onChange={(e) => setIsVeg(e.target.value === 'veg')}
                    className="w-full p-2.5 border border-amber-200 rounded-xl"
                  >
                    <option value="veg">🌱 100% Veg</option>
                    <option value="non-veg">🍖 Non-Veg (Seafood/Meat)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">Image URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full p-2.5 border border-amber-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100">
                <label className="font-extrabold text-gray-800 block mb-2">Variant Prices (₹):</label>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <span className="text-[11px] text-gray-500">250g Jar Price</span>
                    <input
                      type="number"
                      value={price250}
                      onChange={(e) => setPrice250(Number(e.target.value))}
                      className="w-full p-2 border border-amber-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-500">500g Jar Price</span>
                    <input
                      type="number"
                      value={price500}
                      onChange={(e) => setPrice500(Number(e.target.value))}
                      className="w-full p-2 border border-amber-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-500">1kg Jar Price</span>
                    <input
                      type="number"
                      value={price1kg}
                      onChange={(e) => setPrice1kg(Number(e.target.value))}
                      className="w-full p-2 border border-amber-200 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-brand-crimson text-white rounded-xl font-bold hover:bg-brand-dark transition"
                >
                  Save Pickle Product
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-3 border border-gray-300 rounded-xl font-bold text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
