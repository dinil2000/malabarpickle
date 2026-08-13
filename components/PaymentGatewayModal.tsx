'use client';

import React, { useState } from 'react';
import { Smartphone, CreditCard, Building, MessageSquare, ShieldCheck, Lock, CheckCircle2, QrCode, ArrowRight, X } from 'lucide-react';

interface PaymentGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  onPaymentSuccess: (paymentMethod: string, transactionId: string) => void;
}

export default function PaymentGatewayModal({
  isOpen,
  onClose,
  totalAmount,
  customerName,
  customerPhone,
  customerEmail,
  onPaymentSuccess
}: PaymentGatewayModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<'UPI' | 'Card' | 'Netbanking' | 'COD'>('UPI');
  const [upiOption, setUpiOption] = useState<'qr' | 'gpay' | 'phonepe' | 'paytm' | 'id'>('qr');
  const [upiIdInput, setUpiIdInput] = useState('');
  
  // Card Inputs
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC');

  const [processing, setProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'select' | 'processing' | 'success'>('select');

  if (!isOpen) return null;

  // Dynamic UPI URL for GPay / PhonePe / QR Code
  const upiUri = `upi://pay?pa=malabarpickle@upi&pn=Malabar%20Pickle%20Store&am=${totalAmount}&cu=INR&tn=Order%20Payment`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUri)}`;

  const handleProcessPayment = () => {
    setProcessing(true);
    setPaymentStep('processing');

    setTimeout(() => {
      setPaymentStep('success');
      setTimeout(() => {
        const txId = `TXN-${Date.now().toString().slice(-8)}`;
        onPaymentSuccess(selectedMethod, txId);
      }, 1200);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-amber-200 space-y-0">
        
        {/* Gateway Header */}
        <div className="bg-brand-dark text-white p-5 flex justify-between items-center border-b border-amber-400/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-crimson text-white rounded-xl flex items-center justify-center text-lg font-bold shadow">
              🫙
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-widest text-brand-amber uppercase block">
                Razorpay / PhonePe Secured Gateway
              </span>
              <h2 className="text-lg font-extrabold font-serif">Malabar Pickle Checkout</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={processing}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Amount Banner */}
        <div className="bg-amber-50 px-6 py-3 border-b border-amber-100 flex justify-between items-center text-xs font-bold text-gray-800">
          <div>
            <span className="text-gray-500 font-normal">Paying for order: </span>
            <span>{customerName}</span>
          </div>
          <div className="text-right">
            <span className="text-gray-500 font-normal block text-[10px]">Total Amount</span>
            <span className="text-lg font-extrabold text-brand-crimson">₹{totalAmount}</span>
          </div>
        </div>

        {/* Payment Processing State */}
        {paymentStep === 'processing' && (
          <div className="p-12 text-center space-y-4">
            <div className="w-16 h-16 border-4 border-brand-crimson border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-gray-900">Connecting to Payment Gateway...</h3>
              <p className="text-xs text-gray-500">Please do not refresh or close this window.</p>
            </div>
          </div>
        )}

        {/* Payment Success State */}
        {paymentStep === 'success' && (
          <div className="p-12 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-gray-900">Payment Approved!</h3>
              <p className="text-xs text-emerald-700 font-bold">Transaction Successful • ₹{totalAmount}</p>
            </div>
          </div>
        )}

        {/* Payment Selection Tabs State */}
        {paymentStep === 'select' && (
          <div className="p-6 space-y-5">
            {/* Method Tabs */}
            <div className="grid grid-cols-4 gap-2 text-xs font-bold">
              <button
                type="button"
                onClick={() => setSelectedMethod('UPI')}
                className={`py-2.5 px-2 rounded-xl border flex flex-col items-center gap-1 transition ${
                  selectedMethod === 'UPI'
                    ? 'border-brand-crimson bg-red-50 text-brand-dark ring-1 ring-brand-crimson'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span>UPI / GPay</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('Card')}
                className={`py-2.5 px-2 rounded-xl border flex flex-col items-center gap-1 transition ${
                  selectedMethod === 'Card'
                    ? 'border-brand-crimson bg-red-50 text-brand-dark ring-1 ring-brand-crimson'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <CreditCard className="w-4 h-4 text-brand-crimson" />
                <span>Cards</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('Netbanking')}
                className={`py-2.5 px-2 rounded-xl border flex flex-col items-center gap-1 transition ${
                  selectedMethod === 'Netbanking'
                    ? 'border-brand-crimson bg-red-50 text-brand-dark ring-1 ring-brand-crimson'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Building className="w-4 h-4 text-amber-600" />
                <span>NetBanking</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('COD')}
                className={`py-2.5 px-2 rounded-xl border flex flex-col items-center gap-1 transition ${
                  selectedMethod === 'COD'
                    ? 'border-brand-crimson bg-red-50 text-brand-dark ring-1 ring-brand-crimson'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <MessageSquare className="w-4 h-4 text-emerald-500" />
                <span>COD</span>
              </button>
            </div>

            {/* TAB CONTENT 1: UPI / GPay / QR Code */}
            {selectedMethod === 'UPI' && (
              <div className="space-y-4">
                <div className="flex justify-center gap-2 border-b border-gray-100 pb-3 text-xs">
                  <button
                    onClick={() => setUpiOption('qr')}
                    className={`px-3 py-1.5 rounded-lg font-bold ${
                      upiOption === 'qr' ? 'bg-brand-dark text-white' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    Scan QR Code
                  </button>
                  <button
                    onClick={() => setUpiOption('gpay')}
                    className={`px-3 py-1.5 rounded-lg font-bold ${
                      upiOption === 'gpay' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    Google Pay
                  </button>
                  <button
                    onClick={() => setUpiOption('phonepe')}
                    className={`px-3 py-1.5 rounded-lg font-bold ${
                      upiOption === 'phonepe' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    PhonePe
                  </button>
                </div>

                {upiOption === 'qr' ? (
                  <div className="text-center space-y-2">
                    <div className="p-3 bg-white border border-amber-200 rounded-2xl w-fit mx-auto shadow-md">
                      <img src={qrCodeUrl} alt="UPI QR Code" className="w-44 h-44 mx-auto rounded-lg" />
                    </div>
                    <p className="text-[11px] text-gray-500 font-medium">
                      Scan with any UPI App (GPay, PhonePe, PayTM, BHIM) to pay <strong className="text-gray-900">₹{totalAmount}</strong>
                    </p>
                  </div>
                ) : (
                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-3 text-xs">
                    <p className="font-bold text-gray-800">
                      Pay using {upiOption === 'gpay' ? 'Google Pay (GPay)' : upiOption === 'phonepe' ? 'PhonePe' : 'UPI ID'}
                    </p>
                    <input
                      type="text"
                      placeholder="Enter your VPA / UPI ID (e.g. mobile@upi)"
                      value={upiIdInput}
                      onChange={(e) => setUpiIdInput(e.target.value)}
                      className="w-full p-2.5 border border-amber-300 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-brand-crimson"
                    />
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT 2: Credit / Debit Card */}
            {selectedMethod === 'Card' && (
              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">Card Number</label>
                  <input
                    type="text"
                    maxLength={19}
                    placeholder="4532 0000 0000 8892"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full p-2.5 border border-amber-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-crimson font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-gray-700">Expiry (MM/YY)</label>
                    <input
                      type="text"
                      placeholder="08/28"
                      maxLength={5}
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full p-2.5 border border-amber-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-crimson font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-gray-700">CVV</label>
                    <input
                      type="password"
                      placeholder="•••"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full p-2.5 border border-amber-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-crimson font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 3: Net Banking */}
            {selectedMethod === 'Netbanking' && (
              <div className="space-y-3 text-xs">
                <label className="font-semibold text-gray-700 block">Select Your Bank:</label>
                <div className="grid grid-cols-2 gap-2">
                  {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Kotak Bank', 'Federal Bank'].map((bank) => (
                    <button
                      key={bank}
                      type="button"
                      onClick={() => setSelectedBank(bank)}
                      className={`p-2.5 rounded-xl border text-left font-bold transition ${
                        selectedBank === bank
                          ? 'border-brand-crimson bg-red-50 text-brand-dark'
                          : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {bank}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT 4: COD */}
            {selectedMethod === 'COD' && (
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs space-y-2 text-emerald-900">
                <p className="font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Cash on Delivery (COD) Selected
                </p>
                <p className="text-emerald-700">
                  Pay <strong>₹{totalAmount}</strong> in cash or via UPI to the delivery executive when your pickle jars arrive at your doorstep.
                </p>
              </div>
            )}

            {/* Pay Button */}
            <button
              type="button"
              onClick={handleProcessPayment}
              className="w-full py-4 bg-brand-crimson text-white rounded-2xl font-bold text-sm hover:bg-brand-dark transition shadow-lg flex items-center justify-center gap-2 mt-2"
            >
              Pay ₹{totalAmount} Now <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center text-[10px] text-gray-400 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> PCI-DSS Compliant 256-Bit SSL Encrypted Payment
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
