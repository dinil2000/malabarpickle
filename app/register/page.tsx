'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { User as UserIcon, Phone, Mail, Lock, MapPin, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle, KeyRound, RotateCcw } from 'lucide-react';
import GoogleAuthButton from '@/components/GoogleAuthButton';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  // Registration Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('Kochi');
  const [state, setState] = useState('Kerala');
  const [pincode, setPincode] = useState('682016');

  // OTP Verification State
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [otpInput, setOtpInput] = useState('');
  const [testOtp, setTestOtp] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Resend Timer Countdown
  useEffect(() => {
    let interval: any = null;
    if (step === 'otp' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  // Step 1: Send OTP to Email
  const handleSendOTP = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!name.trim() || !email.trim() || !phone.trim() || !password || !confirmPassword) {
      setError('Please fill in all required account fields.');
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address (e.g. name@example.com).');
      return;
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match! Please verify your password.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), name: name.trim() })
      });

      const data = await res.json();

      if (data.success) {
        setStep('otp');
        setSuccessMsg(data.message || `6-digit verification code sent to ${email}`);
        if (data.testOtp) {
          setTestOtp(data.testOtp);
        }
        setResendTimer(60);
        setCanResend(false);
      } else {
        setError(data.error || 'Failed to send OTP code.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while sending verification code.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP & Create Account in MongoDB
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!otpInput.trim() || otpInput.trim().length !== 6) {
      setError('Please enter the full 6-digit verification code.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        password,
        otp: otpInput.trim(),
        address: street.trim() ? { street: street.trim(), city, state, pincode } : undefined
      };

      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.success) {
        login(data.user);
        router.push('/account');
      } else {
        setError(data.error || 'Invalid or expired OTP code.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred during account verification.');
    } finally {
      setLoading(false);
    }
  };

  const isPasswordMatching = confirmPassword.length > 0 && password === confirmPassword;
  const isPasswordMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  return (
    <div className="container mx-auto px-4 py-12 flex justify-center items-center">
      <div className="w-full max-w-lg bg-white p-8 rounded-3xl border border-amber-100 shadow-xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-brand-crimson text-white rounded-2xl flex items-center justify-center mx-auto text-xl shadow">
            🫙
          </div>
          <h1 className="text-2xl font-extrabold font-serif text-brand-dark">
            {step === 'form' ? 'Create Malabar Pickle Account' : 'Verify Email Address'}
          </h1>
          <p className="text-xs text-gray-500">
            {step === 'form'
              ? 'Sign up to track orders, save shipping address, and get exclusive pickle offers.'
              : `Enter the 6-digit code sent to ${email}`}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* STEP 1: Registration Form */}
        {step === 'form' && (
          <>
            {/* 1-Click Google / Gmail Registration */}
            <GoogleAuthButton mode="register" />

            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink mx-3 text-[11px] text-gray-400 font-bold uppercase tracking-wider">
                Or Register With Email OTP
              </span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <form onSubmit={handleSendOTP} className="space-y-4 text-xs">
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
                  <UserIcon className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
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

              {/* Password Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">Password *</label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      minLength={6}
                      placeholder="Min 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 border border-amber-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-crimson"
                    />
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">Repeat Password *</label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full pl-9 pr-3 py-2.5 border rounded-xl focus:outline-none focus:ring-1 ${
                        isPasswordMatching
                          ? 'border-emerald-500 ring-emerald-500 bg-emerald-50/20'
                          : isPasswordMismatch
                          ? 'border-red-500 ring-red-500 bg-red-50/20'
                          : 'border-amber-200 focus:ring-brand-crimson'
                      }`}
                    />
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  </div>
                </div>
              </div>

              {/* Password Match Status Indicator */}
              {confirmPassword.length > 0 && (
                <div className="text-[11px] font-semibold flex items-center gap-1 pt-0.5">
                  {isPasswordMatching ? (
                    <span className="text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Passwords Match
                    </span>
                  ) : (
                    <span className="text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Passwords do not match
                    </span>
                  )}
                </div>
              )}

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
                  'Sending Verification Code...'
                ) : (
                  <>
                    Send Email Verification OTP <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </>
        )}

        {/* STEP 2: Enter 6-Digit Email OTP Screen */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOTP} className="space-y-5 text-xs">
            {/* Demo / Test OTP Banner if SMTP not configured */}
            {testOtp && (
              <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl text-center space-y-1">
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                  💡 Test Mode Demo OTP Code:
                </span>
                <span className="text-2xl font-mono font-extrabold tracking-widest text-brand-crimson">
                  {testOtp}
                </span>
                <p className="text-[10px] text-gray-500">
                  (Copy and paste this code to verify your registration)
                </p>
              </div>
            )}

            <div className="space-y-2 text-center">
              <label className="font-bold text-gray-800 block text-sm">
                Enter 6-Digit Verification Code:
              </label>
              <div className="relative max-w-xs mx-auto">
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  placeholder="e.g. 584920"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full py-3 px-4 text-center font-mono font-extrabold text-2xl tracking-[0.5em] border-2 border-brand-crimson rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-400 bg-amber-50/30"
                />
                <KeyRound className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || otpInput.length !== 6}
              className="w-full py-3.5 bg-brand-crimson text-white font-bold text-sm rounded-xl hover:bg-brand-dark transition shadow flex items-center justify-center gap-2"
            >
              {loading ? 'Verifying Code...' : <>Verify & Complete Registration <ArrowRight className="w-4 h-4" /></>}
            </button>

            <div className="flex justify-between items-center text-xs pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setStep('form')}
                className="text-gray-500 hover:text-brand-dark font-medium"
              >
                ← Change Email Details
              </button>

              <button
                type="button"
                disabled={!canResend || loading}
                onClick={() => handleSendOTP()}
                className={`font-bold flex items-center gap-1 ${
                  canResend ? 'text-brand-crimson hover:underline' : 'text-gray-400 cursor-not-allowed'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                {canResend ? 'Resend OTP' : `Resend in ${resendTimer}s`}
              </button>
            </div>
          </form>
        )}

        <p className="text-[11px] text-gray-400 text-center flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Account details encrypted & saved in MongoDB Cloud Database
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
