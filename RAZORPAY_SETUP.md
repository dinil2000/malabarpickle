# 💳 Razorpay Official Payment Gateway Integration Guide

Your **Malabar Pickle** web app is now integrated with the **Official Razorpay Standard Checkout SDK (`https://checkout.razorpay.com/v1/checkout.js`)**!

---

### 🌐 How It Works

When a customer fills in their address and clicks **"Pay ₹Amount via Official Razorpay Gateway"**:
1. The **Official Razorpay Checkout Modal** opens directly on the website.
2. Supports all Indian payment methods out of the box:
   - **UPI Apps:** Google Pay (GPay), PhonePe, PayTM, BHIM, WhatsApp UPI.
   - **Credit / Debit Cards:** Visa, MasterCard, RuPay, Maestro.
   - **NetBanking:** All major Indian banks (HDFC, SBI, ICICI, Axis, Federal, etc.).
   - **Wallets & Pay Later:** PayTM Wallet, Mobikwik, LazyPay.
3. Upon successful payment, Razorpay generates a unique `razorpay_payment_id` (e.g. `pay_N8aK1x90Z12`).
4. The backend automatically saves the order in **MongoDB Atlas** as `paymentStatus: "Paid"` and generates the real-time order tracking code (`MP-TRK-XXXXX`).

---

### 🔑 How to Add Your Live / Test Razorpay Keys (1 Minute)

1. Open **[dashboard.razorpay.com](https://dashboard.razorpay.com)** and log in.
2. Go to **Settings** $\rightarrow$ **API Keys** $\rightarrow$ Click **Generate Key**.
3. Copy your **Key ID** (e.g. `rzp_test_1234567890` or `rzp_live_1234567890`).

#### 1️⃣ Add Key ID in `.env.local`:
```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_HERE
```

#### 2️⃣ Add Key ID in Vercel Project Settings:
1. Go to **Vercel Dashboard** $\rightarrow$ **`malabarpickle`** $\rightarrow$ **Settings** $\rightarrow$ **Environment Variables**.
2. Add Variable:
   - **Key:** `NEXT_PUBLIC_RAZORPAY_KEY_ID`
   - **Value:** `rzp_test_YOUR_KEY_HERE`
3. Click **Save** and **Redeploy** on Vercel!
