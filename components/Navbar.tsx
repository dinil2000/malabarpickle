'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import {
  ShoppingBag,
  User as UserIcon,
  Search,
  Truck,
  ShieldCheck,
  Menu,
  X,
  LogOut,
  ChevronDown
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const router = useRouter();
  const { user, isAdmin, logout } = useAuth();
  const { totalCount, setIsCartOpen } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-amber-100 shadow-sm">
      {/* Top Banner */}
      <div className="bg-brand-dark text-amber-200 text-xs py-1.5 px-4 font-medium flex items-center justify-between">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              🌶️ 100% Homemade Kerala Malabar Pickles
            </span>
            <span className="hidden md:inline text-amber-400/50">|</span>
            <span className="hidden md:flex items-center gap-1 text-white">
              <Truck className="w-3.5 h-3.5 text-brand-amber" /> Free Shipping Above ₹999
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/track-order"
              className="hover:text-white transition flex items-center gap-1 text-xs"
            >
              <Truck className="w-3.5 h-3.5" /> Track Order
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                className="bg-brand-amber text-gray-900 font-bold px-2 py-0.5 rounded text-[11px] hover:bg-yellow-400 transition"
              >
                Admin Panel
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-brand-crimson rounded-xl flex items-center justify-center text-white shadow group-hover:scale-105 transition duration-300">
            <span className="text-xl">🫙</span>
          </div>
          <div>
            <span className="text-xl font-bold font-serif tracking-tight text-brand-dark group-hover:text-brand-crimson transition">
              Malabar<span className="text-brand-amber">Pickle</span>
            </span>
            <span className="block text-[10px] tracking-widest uppercase font-semibold text-gray-500">
              Taste of Heritage Kerala
            </span>
          </div>
        </Link>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 max-w-md items-center relative"
        >
          <input
            type="text"
            placeholder="Search Mango, Garlic, Fish, Beef pickle..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-amber-50/70 border border-amber-200/80 rounded-full text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-crimson/50 focus:bg-white transition"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3" />
          <button
            type="submit"
            className="absolute right-1.5 bg-brand-crimson text-white px-3 py-1 rounded-full text-xs font-semibold hover:bg-brand-dark transition"
          >
            Search
          </button>
        </form>

        {/* Navigation Links & User Menu */}
        <div className="flex items-center gap-3">
          <nav className="hidden lg:flex items-center gap-6 font-semibold text-sm text-gray-700">
            <Link href="/" className="hover:text-brand-crimson transition">
              Home
            </Link>
            <Link href="/products" className="hover:text-brand-crimson transition">
              All Pickles
            </Link>
            <Link href="/products?category=cat-veg" className="hover:text-brand-crimson transition">
              Veg Pickles
            </Link>
            <Link href="/products?category=cat-non-veg" className="hover:text-brand-crimson transition">
              Non-Veg Pickles
            </Link>
          </nav>

          {/* User Profile / Auth */}
          <div className="relative">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-lg border border-amber-200 hover:bg-amber-50 transition text-sm font-semibold text-gray-800"
                >
                  <div className="w-7 h-7 rounded-full bg-brand-dark text-white text-xs flex items-center justify-center font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline line-clamp-1 max-w-[100px]">{user.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl py-1.5 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs font-semibold text-gray-900">{user.name}</p>
                      <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                    </div>

                    <Link
                      href="/account"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-4 py-2 text-xs text-gray-700 hover:bg-amber-50 font-medium"
                    >
                      My Account & Orders
                    </Link>

                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2 text-xs text-brand-dark hover:bg-amber-50 font-bold"
                      >
                        Admin Dashboard
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 font-medium flex items-center gap-1 border-t border-gray-100 mt-1"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3 py-1.5 text-xs font-bold text-brand-dark border border-brand-dark/30 rounded-lg hover:bg-amber-50 transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="hidden sm:inline-block px-3 py-1.5 text-xs font-bold text-white bg-brand-crimson rounded-lg hover:bg-brand-dark transition shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Cart Icon */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 rounded-xl bg-amber-100/70 text-brand-dark hover:bg-amber-200 transition"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-brand-crimson text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow">
                {totalCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-700 hover:text-brand-dark"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-amber-50/90 border-t border-amber-200 px-4 py-4 space-y-3">
          <form onSubmit={handleSearch} className="flex relative">
            <input
              type="text"
              placeholder="Search pickles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-amber-200 rounded-lg text-sm"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          </form>

          <nav className="flex flex-col space-y-2 font-medium text-sm text-gray-800">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-brand-crimson"
            >
              Home
            </Link>
            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-brand-crimson"
            >
              All Pickles
            </Link>
            <Link
              href="/products?category=cat-veg"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-brand-crimson"
            >
              Vegetarian Pickles
            </Link>
            <Link
              href="/products?category=cat-non-veg"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-brand-crimson"
            >
              Non-Veg Seafood & Meat Pickles
            </Link>
            <Link
              href="/track-order"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-brand-crimson"
            >
              Track Order Status
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};
