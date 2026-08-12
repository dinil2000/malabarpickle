'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Lock, Mail, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (data.success) {
        if (data.user.role === 'admin') {
          login(data.user);
          router.push('/admin');
        } else {
          setError('Access Denied. You do not have Administrator permissions.');
        }
      } else {
        setError(data.error || 'Invalid administrator credentials');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center items-center">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-red-200 shadow-2xl space-y-6">
        {/* Admin Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-brand-dark text-amber-400 rounded-2xl flex items-center justify-center mx-auto text-2xl shadow-lg border border-amber-400/30">
            <KeyRound className="w-7 h-7 text-amber-400" />
          </div>
          <span className="text-[10px] font-extrabold tracking-widest text-brand-crimson uppercase">
            Restricted Access
          </span>
          <h1 className="text-2xl font-extrabold font-serif text-brand-dark">
            Admin Control Portal
          </h1>
          <p className="text-xs text-gray-500">
            Sign in with authorized administrator credentials to manage products, categories, and orders.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1 text-xs">
            <label className="font-semibold text-gray-700">Admin Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="admin@malabarpickle.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 border border-amber-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-crimson"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <label className="font-semibold text-gray-700">Admin Secret Password</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 border border-amber-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-crimson"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-brand-dark text-amber-400 font-bold text-sm rounded-xl hover:bg-black transition shadow-lg flex items-center justify-center gap-2 border border-amber-400/20"
          >
            {loading ? 'Verifying Admin Key...' : <>Authenticate Admin <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        <p className="text-[11px] text-gray-400 text-center flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Secure 256-bit encrypted administrator session
        </p>

        <div className="text-center pt-2 border-t border-gray-100 text-xs text-gray-500">
          Not an administrator?{' '}
          <Link href="/login" className="font-bold text-brand-crimson hover:underline">
            Go to Customer Login
          </Link>
        </div>
      </div>
    </div>
  );
}
