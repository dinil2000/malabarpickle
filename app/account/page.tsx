'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Order } from '@/lib/types';
import { User, Package, MapPin, Truck, LogOut, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AccountPage() {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      const fetchUserOrders = async () => {
        try {
          const res = await fetch(`/api/orders?userId=${user?.id}`);
          const data = await res.json();
          if (data.success) {
            setOrders(data.orders);
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoadingOrders(false);
        }
      };
      fetchUserOrders();
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-brand-crimson border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-gray-500 font-semibold">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Account Banner */}
      <div className="bg-brand-dark text-white p-6 sm:p-8 rounded-3xl shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-brand-amber text-gray-950 font-extrabold text-2xl rounded-2xl flex items-center justify-center shadow">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold font-serif">{user.name}</h1>
              <span className="bg-amber-400/20 text-brand-amber text-[10px] font-bold uppercase px-2 py-0.5 rounded border border-amber-400/30">
                {user.role}
              </span>
            </div>
            <p className="text-xs text-amber-200/80 mt-0.5">{user.email} • {user.phone}</p>
          </div>
        </div>

        <button
          onClick={() => {
            logout();
            router.push('/login');
          }}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Account Info & Saved Address */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-amber-100 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-brand-crimson" /> Profile Details
            </h3>

            <div className="space-y-2 text-xs text-gray-700">
              <div>
                <span className="text-gray-400 block">Name:</span>
                <span className="font-bold text-gray-900">{user.name}</span>
              </div>
              <div>
                <span className="text-gray-400 block">Email Address:</span>
                <span className="font-bold text-gray-900">{user.email}</span>
              </div>
              <div>
                <span className="text-gray-400 block">Phone Number:</span>
                <span className="font-bold text-gray-900">{user.phone}</span>
              </div>
              <div>
                <span className="text-gray-400 block">Member Since:</span>
                <span className="font-bold text-gray-900">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-amber-100 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-crimson" /> Saved Shipping Address
            </h3>

            {user.address ? (
              <div className="text-xs text-gray-700 space-y-1 bg-amber-50/50 p-4 rounded-xl border border-amber-100">
                <p className="font-bold text-gray-900">{user.name}</p>
                <p>{user.address.street}</p>
                <p>
                  {user.address.city}, {user.address.state} - {user.address.pincode}
                </p>
              </div>
            ) : (
              <p className="text-xs text-gray-500 italic">No saved address yet.</p>
            )}
          </div>
        </div>

        {/* Right 2 Columns: Order History */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-amber-100 shadow-sm space-y-6">
            <h3 className="font-bold text-base text-gray-900 border-b border-gray-100 pb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Package className="w-5 h-5 text-brand-crimson" /> Order History ({orders.length})
              </span>
            </h3>

            {loadingOrders ? (
              <div className="py-8 text-center text-xs text-gray-500">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <div className="text-3xl">📦</div>
                <h4 className="font-bold text-sm text-gray-800">No orders placed yet</h4>
                <p className="text-xs text-gray-500">Order your first jar of Malabar Mango or Fish pickle!</p>
                <Link
                  href="/products"
                  className="inline-block px-5 py-2 bg-brand-crimson text-white rounded-lg text-xs font-bold"
                >
                  Shop Pickles Now
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-4 sm:p-5 rounded-2xl border border-amber-100 bg-amber-50/30 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-amber-100 pb-3 text-xs">
                      <div>
                        <span className="font-extrabold text-brand-dark">{ord.id}</span>
                        <span className="text-gray-400 ml-2">
                          • {new Date(ord.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900">Total: ₹{ord.totalAmount}</span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-gray-950 uppercase">
                          {ord.orderStatus}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {ord.items.map((it, i) => (
                        <div key={i} className="flex items-center justify-between text-xs text-gray-700">
                          <div className="flex items-center gap-2">
                            <img
                              src={it.image}
                              alt={it.productName}
                              className="w-8 h-8 rounded object-cover border"
                            />
                            <span className="font-semibold">{it.productName} ({it.weight})</span>
                          </div>
                          <span className="font-bold text-gray-900">x{it.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-amber-100 flex justify-between items-center text-xs">
                      <span className="font-mono text-gray-500">Tracking Code: {ord.trackingCode}</span>
                      <Link
                        href={`/track-order?code=${ord.trackingCode}`}
                        className="font-bold text-brand-crimson hover:underline flex items-center gap-1"
                      >
                        Track Shipment <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
