'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Order, OrderStatus } from '@/lib/types';
import { ArrowLeft, CheckCircle2, Clock, Truck, MapPin, Search, Phone, Mail } from 'lucide-react';
import Link from 'next/link';

export default function AdminOrdersPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [search, setSearch] = useState('');

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.success) setOrders(data.orders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      router.push('/admin/login');
      return;
    }
    if (user?.role === 'admin') {
      fetchOrders();
    }
  }, [user, isLoading, router]);

  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        fetchOrders();
      } else {
        alert(data.error || 'Failed to update order status');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const statusOptions: OrderStatus[] = ['Placed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = filterStatus ? o.orderStatus === filterStatus : true;
    const matchesSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerPhone.includes(search) ||
      o.trackingCode.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <Link href="/admin" className="text-xs font-bold text-gray-500 hover:text-brand-dark flex items-center gap-1">
        <ArrowLeft className="w-4 h-4" /> Back to Admin Dashboard
      </Link>

      <div className="bg-white p-6 rounded-2xl border border-amber-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold font-serif text-brand-dark">Order Management System</h1>
          <p className="text-xs text-gray-500">View line items, delivery details, and update live shipment tracking status.</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 bg-white p-4 rounded-xl border border-amber-100 shadow-sm text-xs">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search by Order ID, Name, Phone, or Tracking code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-crimson"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-600">Filter Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 border border-amber-200 rounded-lg font-semibold bg-amber-50/60"
          >
            <option value="">All Statuses ({orders.length})</option>
            {statusOptions.map(st => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="py-12 text-center text-xs text-gray-500">Loading orders list...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center text-xs text-gray-500 border">
          No orders matching filter criteria.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((ord) => (
            <div key={ord.id} className="bg-white p-6 rounded-2xl border border-amber-100 shadow-sm space-y-4">
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-100 pb-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-base text-brand-dark">{ord.id}</span>
                    <span className="font-mono text-gray-500 bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold">
                      {ord.trackingCode}
                    </span>
                  </div>
                  <span className="text-gray-400">Placed on {new Date(ord.createdAt).toLocaleString()}</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-gray-400 block text-[10px]">Payment ({ord.paymentMethod})</span>
                    <span className="font-extrabold text-sm text-gray-900">₹{ord.totalAmount} ({ord.paymentStatus})</span>
                  </div>

                  {/* Status Dropdown selector */}
                  <div className="flex items-center gap-1 bg-amber-50 p-1.5 rounded-xl border border-amber-200">
                    <span className="font-bold text-gray-700">Status:</span>
                    <select
                      value={ord.orderStatus}
                      onChange={(e) => handleUpdateStatus(ord.id, e.target.value as OrderStatus)}
                      className="p-1 text-xs font-extrabold bg-brand-dark text-white rounded-lg focus:outline-none"
                    >
                      {statusOptions.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Order Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                {/* Line Items */}
                <div className="space-y-2">
                  <span className="font-bold text-gray-900 block">Ordered Pickles:</span>
                  <div className="space-y-2 bg-amber-50/40 p-3 rounded-xl border border-amber-100">
                    {ord.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between items-center text-gray-800">
                        <div className="flex items-center gap-2">
                          <img src={it.image} alt={it.productName} className="w-8 h-8 rounded object-cover border" />
                          <div>
                            <span className="font-bold">{it.productName}</span>
                            <span className="text-gray-500 block text-[11px]">{it.weight} • ₹{it.unitPrice} each</span>
                          </div>
                        </div>
                        <span className="font-extrabold text-brand-dark">x{it.quantity} (₹{it.totalPrice})</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Customer Shipping Address */}
                <div className="space-y-2">
                  <span className="font-bold text-gray-900 block">Customer & Shipping Address:</span>
                  <div className="bg-amber-50/40 p-3 rounded-xl border border-amber-100 space-y-1 text-gray-700">
                    <p className="font-bold text-gray-900 text-sm">{ord.customerName}</p>
                    <p className="flex items-center gap-1 text-gray-600">
                      <Phone className="w-3.5 h-3.5" /> {ord.customerPhone}
                    </p>
                    {ord.customerEmail && (
                      <p className="flex items-center gap-1 text-gray-600">
                        <Mail className="w-3.5 h-3.5" /> {ord.customerEmail}
                      </p>
                    )}
                    <p className="pt-1 border-t border-amber-100 flex items-start gap-1">
                      <MapPin className="w-3.5 h-3.5 text-brand-crimson flex-shrink-0 mt-0.5" />
                      <span>
                        {ord.shippingAddress.street}, {ord.shippingAddress.city}, {ord.shippingAddress.state} - {ord.shippingAddress.pincode}
                      </span>
                    </p>
                    {ord.notes && <p className="text-[11px] text-amber-800 italic pt-1">Note: "{ord.notes}"</p>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
