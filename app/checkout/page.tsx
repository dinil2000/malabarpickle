'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { ShieldCheck, Lock, CreditCard, Smartphone, Building, MessageSquare, ArrowRight, CheckCircle2 } from 'lucide-react';
import RazorpayCheckout from '@/components/RazorpayCheckout';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, discount, deliveryFee, totalAmount, clearCart } = useCart();
  const { user } = useAuth();

  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');

  // Shipping Address
  const [street, setStreet] = useState(user?.address?.street || '');
  const [city, setCity] = useState(user?.address?.city || 'Kochi');
  const [state, setState] = useState(user?.address?.state || 'Kerala');
  const [pincode, setPincode] = useState(user?.address?.pincode || '682016');
  const [notes, setNotes] = useState('');

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<'Razorpay' | 'UPI' | 'Card' | 'COD'>('Razorpay');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderCreated, setOrderCreated] = useState<{ id: string; trackingCode: string; paymentId: string } | null>(null);

  useEffect(() => {
    if (user) {
      if (!customerName) setCustomerName(user.name);
      if (!customerEmail) setCustomerEmail(user.email);
      if (!customerPhone) setCustomerPhone(user.phone);
    }
  }, [user]);

  if (cart.length === 0 && !orderCreated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Your cart is empty</h2>
        <button
          onClick={() => router.push('/products')}
          className="px-6 py-2.5 bg-brand-crimson text-white rounded-lg text-sm font-bold"
        >
          Go to Pickle Store
        </button>
      </div>
    );
  }

  // Called when Razorpay or COD payment completes
  const handlePaymentSuccess = async (razorpayPaymentId: string) => {
    setIsSubmitting(true);

    try {
      const orderPayload = {
        userId: user?.id || 'guest-user',
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim().toLowerCase(),
        customerPhone: customerPhone.trim(),
        shippingAddress: {
          street: street.trim(),
          city: city.trim(),
          state: state.trim(),
          pincode: pincode.trim()
        },
        items: cart.map(item => ({
          productId: item.productId,
          productName: item.productName,
          weight: item.weight,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
          totalPrice: item.unitPrice * item.quantity,
          image: item.image
        })),
        subtotal,
        discountAmount: discount,
        deliveryFee,
        totalAmount,
        paymentMethod: paymentMethod === 'COD' ? 'COD' : 'Razorpay (UPI/Card/NetBanking)',
        paymentStatus: paymentMethod === 'COD' ? 'COD' : 'Paid',
        transactionId: razorpayPaymentId,
        notes: notes.trim()
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      const data = await res.json();

      if (data.success) {
        setOrderCreated({
          id: data.order.id,
          trackingCode: data.order.trackingCode,
          paymentId: razorpayPaymentId
        });

        clearCart();
      } else {
        alert(data.error || 'Failed to record order.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while creating order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderCreated) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-lg text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold font-serif text-gray-900">Order Confirmed!</h1>
          <p className="text-sm text-gray-600">
            Thank you for ordering with Malabar Pickle. Your authentic pickle jars are being packed with care.
          </p>
        </div>

        <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200 text-left space-y-3 shadow-sm">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500">Order Number:</span>
            <span className="font-extrabold text-brand-dark">{orderCreated.id}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500">Razorpay Payment ID:</span>
            <span className="font-mono text-emerald-700 font-bold">{orderCreated.paymentId}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500">Tracking Code:</span>
            <span className="font-extrabold text-brand-crimson font-mono">{orderCreated.trackingCode}</span>
          </div>
          <div className="flex justify-between items-center text-xs pt-2 border-t border-amber-200">
            <span className="text-gray-500">Total Paid:</span>
            <span className="font-extrabold text-lg text-gray-900">₹{totalAmount}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => router.push(`/track-order?code=${orderCreated.trackingCode}`)}
            className="flex-1 py-3.5 bg-brand-crimson text-white rounded-xl font-bold text-sm hover:bg-brand-dark transition shadow"
          >
            Track Order Progress 🚚
          </button>
          <button
            onClick={() => router.push('/products')}
            className="px-6 py-3.5 border border-gray-300 text-gray-700 font-bold rounded-xl text-sm hover:bg-gray-100 transition"
          >
            Shop More
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="space-y-1 text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-brand-dark flex items-center gap-2 justify-center sm:justify-start">
          <Lock className="w-6 h-6 text-brand-crimson" /> Official Razorpay Checkout
        </h1>
        <p className="text-xs text-gray-500">Enter delivery address and complete payment via Razorpay Gateway.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 columns: Shipping Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-amber-100 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-dark text-white text-xs flex items-center justify-center font-bold">1</span>
              Shipping & Contact Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-gray-700">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Nair"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full p-2.5 border border-amber-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-crimson"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-700">Phone Number (WhatsApp) *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full p-2.5 border border-amber-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-crimson"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="font-semibold text-gray-700">Email Address (For Invoice & Receipt)</label>
                <input
                  type="email"
                  placeholder="rahul@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full p-2.5 border border-amber-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-crimson"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="font-semibold text-gray-700">Street Address & Landmark *</label>
                <input
                  type="text"
                  required
                  placeholder="House No, Apartment, Street, Landmark"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full p-2.5 border border-amber-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-crimson"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-700">City / Town *</label>
                <input
                  type="text"
                  required
                  placeholder="Kochi / Calicut / Bengaluru"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-2.5 border border-amber-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-crimson"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-700">State *</label>
                <input
                  type="text"
                  required
                  placeholder="Kerala"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full p-2.5 border border-amber-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-crimson"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-700">PIN Code *</label>
                <input
                  type="text"
                  required
                  placeholder="682016"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full p-2.5 border border-amber-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-crimson"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="font-semibold text-gray-700">Special Packing Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Extra seal on fish pickle jar please"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2.5 border border-amber-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-crimson"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white p-6 rounded-2xl border border-amber-100 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-dark text-white text-xs flex items-center justify-center font-bold">2</span>
              Select Payment Option
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <button
                type="button"
                onClick={() => setPaymentMethod('Razorpay')}
                className={`p-4 rounded-xl border text-left flex items-center gap-3 transition ${
                  paymentMethod === 'Razorpay'
                    ? 'border-brand-crimson bg-red-50/50 ring-1 ring-brand-crimson font-bold text-brand-dark'
                    : 'border-gray-200 text-gray-700 hover:bg-amber-50'
                }`}
              >
                <CreditCard className="w-6 h-6 text-brand-crimson" />
                <div>
                  <span className="block font-bold">Razorpay Online Gateway</span>
                  <span className="text-[11px] text-gray-500 font-normal">GPay, PhonePe, Cards, NetBanking</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('COD')}
                className={`p-4 rounded-xl border text-left flex items-center gap-3 transition ${
                  paymentMethod === 'COD'
                    ? 'border-brand-crimson bg-red-50/50 ring-1 ring-brand-crimson font-bold text-brand-dark'
                    : 'border-gray-200 text-gray-700 hover:bg-amber-50'
                }`}
              >
                <MessageSquare className="w-6 h-6 text-emerald-500" />
                <div>
                  <span className="block font-bold">Cash on Delivery (COD)</span>
                  <span className="text-[11px] text-gray-500 font-normal">Pay on doorstep delivery</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Right 1 column: Order Summary & Razorpay Trigger */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-amber-100 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-gray-900 border-b border-gray-100 pb-3">
              Order Summary ({cart.length} items)
            </h3>

            <div className="space-y-3 max-h-60 overflow-y-auto divide-y divide-gray-100 pr-1">
              {cart.map((item) => (
                <div key={item.id} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-gray-900">{item.productName}</p>
                    <p className="text-gray-500">
                      {item.weight} × {item.quantity}
                    </p>
                  </div>
                  <span className="font-bold text-gray-900">
                    ₹{item.unitPrice * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-gray-200 space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Discount</span>
                  <span>-₹{discount}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-200 flex justify-between items-center text-base font-extrabold text-gray-900">
              <span>Total Amount</span>
              <span className="text-xl text-brand-dark">₹{totalAmount}</span>
            </div>

            {paymentMethod === 'Razorpay' ? (
              <RazorpayCheckout
                totalAmount={totalAmount}
                customerName={customerName}
                customerPhone={customerPhone}
                customerEmail={customerEmail}
                street={street}
                city={city}
                pincode={pincode}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={(err) => alert(err)}
                isSubmitting={isSubmitting}
              />
            ) : (
              <button
                type="button"
                onClick={() => handlePaymentSuccess(`cod_${Date.now().toString().slice(-8)}`)}
                disabled={isSubmitting}
                className="w-full py-4 bg-brand-dark text-white rounded-xl font-bold text-sm hover:bg-black transition shadow flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Placing COD Order...' : <>Confirm Cash on Delivery (₹{totalAmount}) <ArrowRight className="w-4 h-4" /></>}
              </button>
            )}

            <p className="text-[11px] text-gray-400 text-center flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Razorpay 256-bit Encrypted Security
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
