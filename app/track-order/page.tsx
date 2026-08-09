'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Order, OrderStatus } from '@/lib/types';
import { Search, Truck, CheckCircle2, Clock, PackageCheck, MapPin, AlertCircle } from 'lucide-react';

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialCode = searchParams.get('code') || searchParams.get('id') || '';

  const [searchQuery, setSearchQuery] = useState(initialCode);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchOrder = async (queryCode: string) => {
    if (!queryCode.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(queryCode.trim())}`);
      const data = await res.json();
      if (data.success) {
        setOrder(data.order);
      } else {
        setOrder(null);
        setError(data.error || 'Order not found. Please check your tracking code.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch tracking details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialCode) {
      fetchOrder(initialCode);
    }
  }, [initialCode]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(searchQuery);
  };

  const statusSteps: OrderStatus[] = ['Placed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];

  const getStepIndex = (status: OrderStatus) => {
    return statusSteps.indexOf(status);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 bg-amber-100 text-brand-dark rounded-full flex items-center justify-center mx-auto text-2xl">
          🚚
        </div>
        <h1 className="text-3xl font-extrabold font-serif text-brand-dark">
          Track Your Pickle Shipment
        </h1>
        <p className="text-xs text-gray-500 max-w-md mx-auto">
          Enter your Order ID (e.g. <span className="font-bold font-mono">ORD-98421</span>) or Tracking Code (e.g. <span className="font-bold font-mono">MP-TRK-98421</span>)
        </p>
      </div>

      {/* Search Input Card */}
      <div className="bg-white p-6 rounded-2xl border border-amber-100 shadow-sm">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="e.g. MP-TRK-98421 or ORD-98421"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-amber-200 rounded-xl text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-brand-crimson"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-brand-crimson text-white font-bold rounded-xl text-sm hover:bg-brand-dark transition shadow"
          >
            {loading ? 'Searching...' : 'Track'}
          </button>
        </form>

        {/* Demo shortcuts */}
        <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
          <span>Try demo tracking code:</span>
          <button
            onClick={() => {
              setSearchQuery('MP-TRK-98421');
              fetchOrder('MP-TRK-98421');
            }}
            className="font-mono text-brand-crimson underline font-bold"
          >
            MP-TRK-98421
          </button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2 font-medium">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tracking Results View */}
      {order && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-100 shadow-sm space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-4">
            <div>
              <span className="text-xs text-gray-400 font-medium">Tracking Number:</span>
              <h2 className="text-xl font-bold font-mono text-brand-dark">{order.trackingCode}</h2>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-400 font-medium block">Current Status:</span>
              <span className="inline-block px-3 py-1 bg-brand-amber text-gray-950 font-extrabold text-xs rounded-full uppercase tracking-wider">
                {order.orderStatus}
              </span>
            </div>
          </div>

          {/* Visual Progress Bar */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">Delivery Progress</h3>

            <div className="relative flex items-center justify-between">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gray-200 w-full z-0" />
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-emerald-500 z-0 transition-all duration-500"
                style={{
                  width: `${(getStepIndex(order.orderStatus) / (statusSteps.length - 1)) * 100}%`
                }}
              />

              {statusSteps.map((step, idx) => {
                const currentIndex = getStepIndex(order.orderStatus);
                const isCompleted = idx <= currentIndex;
                const isCurrent = idx === currentIndex;

                return (
                  <div key={step} className="relative z-10 flex flex-col items-center group">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${
                        isCompleted
                          ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-200'
                          : 'bg-white border-2 border-gray-300 text-gray-400'
                      }`}
                    >
                      {isCompleted ? '✓' : idx + 1}
                    </div>
                    <span
                      className={`mt-2 text-[11px] font-semibold text-center max-w-[70px] ${
                        isCurrent
                          ? 'text-brand-crimson font-bold'
                          : isCompleted
                          ? 'text-gray-900'
                          : 'text-gray-400'
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Shipping Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-gray-100 text-xs">
            <div className="space-y-2">
              <h4 className="font-bold text-gray-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-brand-crimson" /> Destination Address
              </h4>
              <p className="text-gray-700 leading-relaxed bg-amber-50/50 p-3 rounded-xl border border-amber-100">
                <strong className="block text-gray-900">{order.customerName}</strong>
                {order.shippingAddress.street}, {order.shippingAddress.city},{' '}
                {order.shippingAddress.state} - {order.shippingAddress.pincode}
                <br />
                <span className="text-gray-500">📞 Phone: {order.customerPhone}</span>
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-gray-900 flex items-center gap-1.5">
                <PackageCheck className="w-4 h-4 text-brand-amber" /> Package Line Items
              </h4>
              <div className="space-y-1.5 bg-amber-50/50 p-3 rounded-xl border border-amber-100">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-gray-800 font-medium">
                    <span>{item.productName} ({item.weight})</span>
                    <span className="font-bold">x{item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-gray-500">Loading tracking portal...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}
