'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { AdminStats, Order } from '@/lib/types';
import { DollarSign, ShoppingBag, Package, Users, Clock, CheckCircle, ArrowRight, Plus } from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isAdmin, isLoading } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      router.push('/login');
      return;
    }

    const loadDashboard = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          fetch('/api/admin/stats'),
          fetch('/api/orders')
        ]);
        const statsData = await statsRes.json();
        const ordersData = await ordersRes.json();

        if (statsData.success) setStats(statsData.stats);
        if (ordersData.success) setRecentOrders(ordersData.orders.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'admin') {
      loadDashboard();
    }
  }, [user, isLoading, router]);

  if (isLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center text-xs text-gray-500">
        Loading Admin Dashboard...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Admin Navbar Header */}
      <div className="bg-brand-dark text-white p-6 sm:p-8 rounded-3xl shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-bold text-brand-amber uppercase tracking-widest">
            Malabar Pickle Control Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif">Admin Dashboard</h1>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/products"
            className="px-4 py-2 bg-brand-crimson text-white text-xs font-bold rounded-xl hover:bg-red-800 transition flex items-center gap-1 shadow"
          >
            <Plus className="w-4 h-4" /> Manage Products
          </Link>
          <Link
            href="/admin/orders"
            className="px-4 py-2 bg-brand-amber text-gray-950 text-xs font-bold rounded-xl hover:bg-yellow-400 transition"
          >
            Manage Orders
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-white rounded-2xl border border-amber-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 font-medium">Total Revenue</span>
            <h3 className="text-2xl font-extrabold text-brand-dark mt-1">₹{stats?.totalRevenue}</h3>
          </div>
          <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-amber-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 font-medium">Total Orders</span>
            <h3 className="text-2xl font-extrabold text-gray-900 mt-1">{stats?.totalOrders}</h3>
          </div>
          <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-amber-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 font-medium">Active Products</span>
            <h3 className="text-2xl font-extrabold text-gray-900 mt-1">{stats?.totalProducts}</h3>
          </div>
          <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-2xl flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-amber-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 font-medium">Registered Customers</span>
            <h3 className="text-2xl font-extrabold text-gray-900 mt-1">{stats?.totalCustomers}</h3>
          </div>
          <div className="w-12 h-12 bg-purple-100 text-purple-700 rounded-2xl flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Admin Quick Management Links & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Navigation Sidebar */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wider">Management Modules</h3>

          <div className="space-y-2">
            <Link
              href="/admin/products"
              className="flex items-center justify-between p-4 bg-white rounded-2xl border border-amber-100 hover:bg-amber-50 transition shadow-sm"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">🫙</span>
                <div>
                  <span className="font-bold text-sm text-gray-900 block">Products Manager</span>
                  <span className="text-xs text-gray-500">Add, edit prices, weight options, stock</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </Link>

            <Link
              href="/admin/categories"
              className="flex items-center justify-between p-4 bg-white rounded-2xl border border-amber-100 hover:bg-amber-50 transition shadow-sm"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">📁</span>
                <div>
                  <span className="font-bold text-sm text-gray-900 block">Category Manager</span>
                  <span className="text-xs text-gray-500">Create & edit pickle categories</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </Link>

            <Link
              href="/admin/orders"
              className="flex items-center justify-between p-4 bg-white rounded-2xl border border-amber-100 hover:bg-amber-50 transition shadow-sm"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">📦</span>
                <div>
                  <span className="font-bold text-sm text-gray-900 block">Order Processing</span>
                  <span className="text-xs text-gray-500">Update status (Placed $\rightarrow$ Shipped $\rightarrow$ Delivered)</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </Link>

            <Link
              href="/admin/customers"
              className="flex items-center justify-between p-4 bg-white rounded-2xl border border-amber-100 hover:bg-amber-50 transition shadow-sm"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">👥</span>
                <div>
                  <span className="font-bold text-sm text-gray-900 block">Customer Directory</span>
                  <span className="text-xs text-gray-500">View user list saved in Vercel Storage</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </Link>
          </div>
        </div>

        {/* Recent Orders Overview */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wider">Recent Orders</h3>
            <Link href="/admin/orders" className="text-xs font-bold text-brand-crimson hover:underline">
              View All Orders →
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden divide-y divide-gray-100">
            {recentOrders.map((ord) => (
              <div key={ord.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-brand-dark">{ord.id}</span>
                    <span className="font-semibold text-gray-900">{ord.customerName}</span>
                  </div>
                  <span className="text-gray-500">{ord.customerPhone} • {ord.items.length} items</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-bold text-gray-900">₹{ord.totalAmount}</span>
                  <span className="px-2.5 py-0.5 rounded-full font-bold bg-amber-100 text-amber-900 text-[10px]">
                    {ord.orderStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
