'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import GoogleAuthButton from '@/components/GoogleAuthButton';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password })
      });

      const data = await res.json();

      if (data.success) {
        login(data.user);
        if (data.user.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/account');
        }
      } else {
        setError(data.error || 'Invalid email or password. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred during sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 flex justify-center items-center">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-amber-100 shadow-xl space-y-6">
        {/* Customer Login Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-brand-crimson text-white rounded-2xl flex items-center justify-center mx-auto text-xl shadow">
            🫙
          </div>
          <h1 className="text-2xl font-extrabold font-serif text-brand-dark">
            Customer Sign In
          </h1>
          <p className="text-xs text-gray-500">
            Sign in to view saved orders, manage delivery addresses, and reorder pickles.
          </p>
        </div>

        {/* Google & Gmail Login Button */}
        <GoogleAuthButton mode="login" />

        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="flex-shrink mx-3 text-[11px] text-gray-400 font-bold uppercase tracking-wider">
            Or Sign In With Email
          </span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1 text-xs">
            <label className="font-semibold text-gray-700">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="yourname@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 border border-amber-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-crimson"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <label className="font-semibold text-gray-700">Password</label>
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
            className="w-full py-3.5 bg-brand-crimson text-white font-bold text-sm rounded-xl hover:bg-brand-dark transition shadow flex items-center justify-center gap-2"
          >
            {loading ? 'Signing In...' : <>Sign In <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        <p className="text-[11px] text-gray-400 text-center flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Secure customer session saved in MongoDB
        </p>

        <div className="text-center pt-2 border-t border-gray-100 text-xs text-gray-600">
          Don't have an account yet?{' '}
          <Link href="/register" className="font-bold text-brand-crimson hover:underline">
            Register Free Account
          </Link>
        </div>
      </div>
    </div>
  );
}
