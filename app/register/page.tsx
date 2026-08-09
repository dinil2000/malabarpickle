'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { User, Phone, Mail, Lock, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('Kochi');
  const [state, setState] = useState('Kerala');
  const [pincode, setPincode] = useState('682016');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !phone || !password) {
      setError('Please fill in all required account fields.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name,
        email,
        phone,
        password,
        address: street ? { street, city, state, pincode } : undefined
      };

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.success) {
        // Automatically log user in
        login(data.user);
        router.push('/account');
      } else {
        setError(data.error || 'Registration failed.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred during account creation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 flex justify-center items-center">
      <div className="w-full max-w-lg bg-white p-8 rounded-3xl border border-amber-100 shadow-xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-brand-crimson text-white rounded-2xl flex items-center justify-center mx-auto text-xl shadow">
            🫙
          </div>
          <h1 className="text-2xl font-extrabold font-serif text-brand-dark">
            Create Malabar Pickle Account
          </h1>
          <p className="text-xs text-gray-500">
            Sign up to manage addresses, save order history, and receive exclusive offers.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-gray-700">Full Name *</label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="e.g. Ananya Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 border border-amber-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-crimson"
              />
              <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-gray-700">Email Address *</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="ananya@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border border-amber-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-crimson"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-gray-700">Phone Number *</label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  placeholder="+91 98888 77777"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border border-amber-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-crimson"
                />
                <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-gray-700">Password *</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 border border-amber-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-crimson"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100 space-y-3">
            <span className="font-bold text-gray-800 flex items-center gap-1">
              <MapPin className="w-4 h-4 text-brand-crimson" /> Default Delivery Address (Optional)
            </span>

            <div className="space-y-1">
              <input
                type="text"
                placeholder="Street address, house name, landmark"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="w-full p-2.5 border border-amber-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-crimson"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-2.5 border border-amber-200 rounded-xl"
              />
              <input
                type="text"
                placeholder="State"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full p-2.5 border border-amber-200 rounded-xl"
              />
              <input
                type="text"
                placeholder="Pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="w-full p-2.5 border border-amber-200 rounded-xl"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-brand-crimson text-white font-bold text-sm rounded-xl hover:bg-brand-dark transition shadow flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
              'Creating Account...'
            ) : (
              <>
                Create Free Account <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-[11px] text-gray-400 text-center flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Account details encrypted & saved in Vercel Storage
        </p>

        <div className="text-center pt-2 border-t border-gray-100 text-xs text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-brand-crimson hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
}
