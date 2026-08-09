'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Category } from '@/lib/types';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminCategoriesPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success) setCategories(data.categories);
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
      fetchCategories();
    }
  }, [user, isLoading, router]);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description) return;

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, image })
      });
      const data = await res.json();
      if (data.success) {
        setName('');
        setDescription('');
        setImage('');
        fetchCategories();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Delete this pickle category?')) return;
    try {
      const res = await fetch(`/api/categories?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <Link href="/admin" className="text-xs font-bold text-gray-500 hover:text-brand-dark flex items-center gap-1">
        <ArrowLeft className="w-4 h-4" /> Back to Admin Dashboard
      </Link>

      <div className="bg-white p-6 rounded-2xl border border-amber-100 shadow-sm space-y-1">
        <h1 className="text-2xl font-extrabold font-serif text-brand-dark">Pickle Categories Manager</h1>
        <p className="text-xs text-gray-500">Organize pickles by Veg, Non-Veg, Gourmet Specials, and Chutneys.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form to Add Category */}
        <div className="bg-white p-6 rounded-2xl border border-amber-100 shadow-sm space-y-4 h-fit">
          <h3 className="font-bold text-sm text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-brand-crimson" /> Add New Category
          </h3>

          <form onSubmit={handleAddCategory} className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-gray-700">Category Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Seafood & Fish Pickles"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 border border-amber-200 rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-gray-700">Description *</label>
              <textarea
                required
                rows={3}
                placeholder="Category summary..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2.5 border border-amber-200 rounded-xl"
              />
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

            <button
              type="submit"
              className="w-full py-3 bg-brand-crimson text-white rounded-xl font-bold hover:bg-brand-dark transition shadow"
            >
              Save Category
            </button>
          </form>
        </div>

        {/* Existing Categories Cards */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wider">Active Categories ({categories.length})</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categories.map((cat) => (
              <div key={cat.id} className="bg-white rounded-2xl border border-amber-100 overflow-hidden shadow-sm flex flex-col justify-between">
                <div className="h-32 bg-amber-50 relative">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                </div>

                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{cat.name}</h4>
                    <p className="text-xs text-gray-500 line-clamp-2 mt-1">{cat.description}</p>
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex justify-between items-center text-xs">
                    <span className="font-mono text-gray-400">ID: {cat.id}</span>
                    <button
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="text-red-600 font-bold hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
