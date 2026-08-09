import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';

export const metadata: Metadata = {
  title: 'Malabar Pickle - Authentic Kerala Handcrafted Pickles',
  description: 'Order 100% authentic Kerala Mango, Garlic, King Fish, and Beef pickles online. Made with cold-pressed Gingelly oil & traditional Malabar spice recipes.',
  keywords: ['Malabar Pickle', 'Kerala Pickle', 'Mango Pickle', 'Fish Pickle', 'Beef Pickle', 'Kadumango', 'Garlic Pickle'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col justify-between selection:bg-brand-crimson selection:text-white">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <CartDrawer />
            <main className="flex-1">{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
