'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { User } from '@/lib/types';
import { ArrowLeft, Users, Mail, Phone, MapPin, Search, Eye, EyeOff, ShoppingBag, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

interface ExtendedUser extends User {
  password?: string;
  totalOrdersCount?: number;
  totalSpent?: number;
}

export default function AdminCustomersPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [customers, setCustomers] = useState<ExtendedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      router.push('/admin/login');
      return;
    }
    if (user?.role === 'admin') {
      const fetchCustomers = async () => {
        try {
          const res = await fetch('/api/admin/customers');
          const data = await res.json();
          if (data.success) setCustomers(data.customers);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchCustomers();
    }
  }, [user, isLoading, router]);

  const togglePasswordVisibility = (id: string) => {
    setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredCustomers = customers.filter(c => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.includes(q)
    );
  });

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <Link href="/admin" className="text-xs font-bold text-gray-500 hover:text-brand-dark flex items-center gap-1">
        <ArrowLeft className="w-4 h-4" /> Back to Admin Dashboard
      </Link>

      <div className="bg-white p-6 rounded-2xl border border-amber-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold font-serif text-brand-dark">Registered Customer Directory</h1>
          <p className="text-xs text-gray-500">View customer accounts, order history, passwords, and addresses stored in MongoDB Atlas.</p>
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-amber-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-crimson"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-gray-500">Loading registered customers from MongoDB...</div>
      ) : filteredCustomers.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center text-xs text-gray-500 border">
          No registered users matched your search query.
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-amber-50 text-brand-dark font-extrabold uppercase border-b border-amber-100">
              <tr>
                <th className="p-4">Customer Info</th>
                <th className="p-4">Role</th>
                <th className="p-4">Contact (Email & Phone)</th>
                <th className="p-4">Password</th>
                <th className="p-4">Saved Shipping Address</th>
                <th className="p-4">Orders Placed</th>
                <th className="p-4 text-right">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCustomers.map((cust) => (
                <tr key={cust.id} className="hover:bg-amber-50/40">
                  <td className="p-4 font-bold text-gray-900">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-brand-dark text-white text-xs flex items-center justify-center font-bold">
                        {cust.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span className="block font-bold">{cust.name}</span>
                        <span className="text-[10px] text-gray-400 font-mono">ID: {cust.id}</span>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        cust.role === 'admin'
                          ? 'bg-amber-400 text-gray-950'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {cust.role}
                    </span>
                  </td>

                  <td className="p-4 space-y-0.5">
                    <p className="font-medium text-gray-900 flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-gray-400" /> {cust.email}
                    </p>
                    <p className="text-gray-600 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-gray-400" /> {cust.phone}
                    </p>
                  </td>

                  {/* Plain text / Masked Password toggle */}
                  <td className="p-4 font-mono text-gray-800">
                    <div className="flex items-center gap-2 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/80 w-fit">
                      <span>{showPasswords[cust.id] ? cust.password : '••••••••'}</span>
                      <button
                        onClick={() => togglePasswordVisibility(cust.id)}
                        className="text-gray-400 hover:text-brand-crimson transition"
                        title={showPasswords[cust.id] ? 'Hide Password' : 'Show Plain Text Password'}
                      >
                        {showPasswords[cust.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </td>

                  <td className="p-4 text-gray-600 max-w-xs">
                    {cust.address ? (
                      <div>
                        <p className="font-medium text-gray-900">{cust.address.street}</p>
                        <p className="text-[11px]">
                          {cust.address.city}, {cust.address.state} - {cust.address.pincode}
                        </p>
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">No address provided</span>
                    )}
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-1 font-bold text-gray-900">
                      <ShoppingBag className="w-3.5 h-3.5 text-brand-crimson" />
                      <span>{cust.totalOrdersCount || 0} orders</span>
                    </div>
                    {(cust.totalSpent || 0) > 0 && (
                      <span className="text-[11px] font-bold text-emerald-700 block">
                        ₹{cust.totalSpent} spent
                      </span>
                    )}
                  </td>

                  <td className="p-4 text-right font-mono text-gray-500">
                    {new Date(cust.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
