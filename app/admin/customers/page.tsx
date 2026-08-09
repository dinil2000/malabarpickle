'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { User } from '@/lib/types';
import { ArrowLeft, Users, Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function AdminCustomersPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [customers, setCustomers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      router.push('/login');
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

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <Link href="/admin" className="text-xs font-bold text-gray-500 hover:text-brand-dark flex items-center gap-1">
        <ArrowLeft className="w-4 h-4" /> Back to Admin Dashboard
      </Link>

      <div className="bg-white p-6 rounded-2xl border border-amber-100 shadow-sm space-y-1">
        <h1 className="text-2xl font-extrabold font-serif text-brand-dark">Registered Customer Directory</h1>
        <p className="text-xs text-gray-500">List of customer registrations saved in Vercel serverless storage.</p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-gray-500">Loading customer list...</div>
      ) : (
        <div className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-amber-50 text-brand-dark font-extrabold uppercase border-b border-amber-100">
              <tr>
                <th className="p-4">Customer Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Saved Address</th>
                <th className="p-4 text-right">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {customers.map((cust) => (
                <tr key={cust.id} className="hover:bg-amber-50/40">
                  <td className="p-4 font-bold text-gray-900 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-brand-dark text-white text-xs flex items-center justify-center font-bold">
                      {cust.name.charAt(0).toUpperCase()}
                    </div>
                    {cust.name}
                  </td>
                  <td className="p-4 font-medium text-gray-700">{cust.email}</td>
                  <td className="p-4 font-medium text-gray-700">{cust.phone}</td>
                  <td className="p-4 text-gray-600">
                    {cust.address
                      ? `${cust.address.street}, ${cust.address.city}, ${cust.address.pincode}`
                      : 'No address recorded'}
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
