import React from 'react';
import Link from 'next/link';
import { Truck, ShieldCheck, RefreshCw, Award, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-dark text-amber-100 pt-12 pb-8 border-t-4 border-brand-amber">
      <div className="container mx-auto px-4">
        {/* Value Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 pb-10 border-b border-amber-900/60">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-500/20 text-brand-amber rounded-full flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Traditional Heritage</h4>
              <p className="text-xs text-amber-200/70">Authentic Malabar recipes since 1978</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-500/20 text-brand-amber rounded-full flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">100% Pure & Natural</h4>
              <p className="text-xs text-amber-200/70">No synthetic colors or chemical preservatives</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-500/20 text-brand-amber rounded-full flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Pan-India Delivery</h4>
              <p className="text-xs text-amber-200/70">Leak-proof double sealed jar packaging</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-500/20 text-brand-amber rounded-full flex items-center justify-center">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Fresh Batches</h4>
              <p className="text-xs text-amber-200/70">Small batch artisanal slow marinades</p>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-10">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🫙</span>
              <span className="text-xl font-bold font-serif text-white">
                Malabar<span className="text-brand-amber">Pickle</span>
              </span>
            </div>
            <p className="text-xs text-amber-200/80 leading-relaxed">
              Bringing the spicy, fiery, authentic flavors of Malabar straight from Grandma's kitchen jar to your dining table. Made with pure cold-pressed Gingelly oil and handpicked spices.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-sm text-white mb-3 uppercase tracking-wider">Top Pickle Categories</h4>
            <ul className="space-y-2 text-xs text-amber-200/70">
              <li><Link href="/products?category=cat-veg" className="hover:text-amber-400 transition">Traditional Mango Pickles</Link></li>
              <li><Link href="/products?category=cat-veg" className="hover:text-amber-400 transition">Fiery Garlic & Lemon</Link></li>
              <li><Link href="/products?category=cat-non-veg" className="hover:text-amber-400 transition">Malabar King Fish Pickle</Link></li>
              <li><Link href="/products?category=cat-non-veg" className="hover:text-amber-400 transition">Kerala Roasted Beef Pickle</Link></li>
              <li><Link href="/products?category=cat-gourmet" className="hover:text-amber-400 transition">Tender Kadumango Specials</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm text-white mb-3 uppercase tracking-wider">Customer Support</h4>
            <ul className="space-y-2 text-xs text-amber-200/70">
              <li><Link href="/track-order" className="hover:text-amber-400 transition">Track Your Order Status</Link></li>
              <li><Link href="/account" className="hover:text-amber-400 transition">Customer Account & Login</Link></li>
              <li><Link href="/cart" className="hover:text-amber-400 transition">View Shopping Cart</Link></li>
              <li><Link href="/admin" className="hover:text-amber-400 transition">Admin Portal</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-sm text-white uppercase tracking-wider">Contact Malabar Pickle</h4>
            <p className="text-xs text-amber-200/70">
              📍 Malabar Foods Pvt Ltd, Beach Road, Kozhikode (Calicut), Kerala - 673001
            </p>
            <p className="text-xs text-amber-200/70">
              📞 Phone: +91 98765 43210
            </p>
            <p className="text-xs text-amber-200/70">
              ✉️ Email: orders@malabarpickle.com
            </p>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-amber-900/60 text-center text-xs text-amber-200/50 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} Malabar Pickle. All Rights Reserved. Crafted with <Heart className="w-3 h-3 text-red-500 inline fill-red-500" /> in Kerala.</p>
          <p className="text-[11px]">Deployable on Vercel & Netlify | Serverless Ready</p>
        </div>
      </div>
    </footer>
  );
};
