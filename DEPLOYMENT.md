# Malabar Pickle - Free Vercel & Netlify Deployment Guide

This document provides step-by-step instructions on deploying the **Malabar Pickle** web application to **Vercel** or **Netlify** for 100% FREE, including free server setup, user login/registration data storage, and domain hosting.

---

## 🚀 Step 1: Deploying to Vercel (Recommended - 100% Free)

Vercel provides free hosting, automatic SSL certificates, global CDN, and built-in serverless functions for Next.js out of the box.

### Method A: Deploy via Vercel Web Dashboard (Easiest - 2 Minutes)
1. Push your project directory `pickleNEW` to GitHub or GitLab:
   ```bash
   git init
   git add .
   git commit -m "Initial Malabar Pickle E-Commerce commit"
   git remote add origin https://github.com/your-username/malabarpickle.git
   git push -u origin main
   ```
2. Go to [vercel.com](https://vercel.com) and log in (or create a free account).
3. Click **"Add New Project"** $\rightarrow$ **"Import Git Repository"**.
4. Select your `malabarpickle` repository.
5. Keep default settings (Framework Preset: **Next.js**).
6. Click **Deploy**.
7. In ~60 seconds, your site will be live at:
   `https://malabarpickle.vercel.app` 🎉

---

### Method B: Deploy via Vercel CLI (Command Line)
1. Install Vercel CLI globally:
   ```bash
   npm i -g vercel
   ```
2. Run the deployment command inside your project directory:
   ```bash
   vercel
   ```
3. Follow the quick terminal prompts (press Enter for default options).
4. Deploy to production:
   ```bash
   vercel --prod
   ```

---

## 💾 Step 2: Enabling 100% Free Permanent Storage on Vercel (1-Click Setup)

> [!IMPORTANT]
> **Why did data reset in Vercel previously?**
> Serverless platforms like Vercel run on temporary (ephemeral) lambda containers. Files saved in local `/tmp` folders are cleared whenever a serverless function spins down or re-deploys.

To make user registrations, new products, and customer orders **100% permanent across all cold starts for free**:

### 1-Click Free Vercel KV Setup (Recommended):
1. Go to your [Vercel Dashboard](https://vercel.com/dashboard) and select your **`malabarpickle`** project.
2. Click on the **Storage** tab at the top of your project menu.
3. Click **"Create Database"** $\rightarrow$ select **"Vercel KV"** (Redis - 100% Free Tier).
4. Click **"Create & Connect"**. Select your `malabarpickle` project and environment (Production, Preview, Development).
5. Click **Connect**. Vercel will automatically inject `KV_REST_API_URL` and `KV_REST_API_TOKEN` into your project settings.
6. Click **Redeploy** on Vercel.

That's it! Your application will automatically route all read/write operations for Users, Products, Categories, and Orders directly to Vercel's free persistent database over high-speed REST.

---

## 🌐 Step 3: Custom Domain Setup on Vercel (Free)

1. In your Vercel project dashboard, go to **Settings** $\rightarrow$ **Domains**.
2. Vercel automatically gives you a free `.vercel.app` domain (e.g. `malabarpickle.vercel.app`).
3. If you own a custom domain (e.g. `malabarpickle.com`), type your domain name in the input box and click **Add**.
4. Follow the DNS instructions (add CNAME `cname.vercel-dns.com` or A record `76.76.21.21`). Vercel generates free automatic SSL certificates (HTTPS).

---

## 🌿 Step 4: Deploying to Netlify (Alternative Option)

1. Sign in to [netlify.com](https://netlify.com).
2. Click **"Add new site"** $\rightarrow$ **"Import an existing project"**.
3. Connect your GitHub repository.
4. Set Build Command: `npm run build`
5. Set Publish Directory: `.next`
6. Click **Deploy Site**.

---

## 🔑 Default Test Accounts & Admin Credentials

| User Type | Email | Password | Role |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@malabarpickle.com` | `admin` | Admin Dashboard Access (`/admin`) |
| **Customer** | `customer@example.com` | `password123` | Customer Account & Saved Orders (`/account`) |

---

## 🧪 Verifying Build Locally

Before deploying, test the production build locally:
```bash
npm run build
npm run start
```
Open `http://localhost:3000` to verify static & dynamic routes.
