# 🌐 How to Enable Official Google Account Chooser Popup Window (100% Free)

To get the exact **Google Account Chooser Popup Window** (`accounts.google.com/v3/signin/accountchooser`) shown in your screenshot, follow these 3 simple steps to get your 100% Free Google OAuth Client ID:

---

### Step 1: Create OAuth Client ID in Google Cloud Console (1 Minute)

1. Open **[console.cloud.google.com](https://console.cloud.google.com)** (Log in with your Gmail `dinil2000@gmail.com`).
2. Click **Select a Project** $\rightarrow$ Click **New Project** $\rightarrow$ Name it **`Malabar Pickle`** $\rightarrow$ Click **Create**.
3. Go to **APIs & Services** $\rightarrow$ **OAuth consent screen**:
   - Select **External** $\rightarrow$ Click **Create**.
   - App Name: `Malabar Pickle`
   - User Support Email: `dinil2000@gmail.com`
   - Click **Save and Continue**.
4. Go to **Credentials** $\rightarrow$ Click **+ CREATE CREDENTIALS** $\rightarrow$ Select **OAuth client ID**:
   - Application type: **Web application**
   - Name: `Malabar Pickle Web App`
   - **Authorized JavaScript origins:**
     - `http://localhost:3000`
     - `https://malabarpickle.vercel.app` (your Vercel live domain)
   - **Authorized redirect URIs:**
     - `http://localhost:3000`
     - `https://malabarpickle.vercel.app`
5. Click **Create**! Copy your **Client ID** (e.g. `66110113461-v3um81e...apps.googleusercontent.com`).

---

### Step 2: Add Client ID to `.env.local` and Vercel Environment Variables

#### In `.env.local`:
```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=YOUR_COPIED_CLIENT_ID.apps.googleusercontent.com
```

#### In Vercel Settings:
1. Go to **Vercel Dashboard** $\rightarrow$ **`malabarpickle`** $\rightarrow$ **Settings** $\rightarrow$ **Environment Variables**.
2. Add Variable:
   - **Key:** `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
   - **Value:** `YOUR_COPIED_CLIENT_ID.apps.googleusercontent.com`
3. Click **Save** and **Redeploy** on Vercel!

---

### 🎉 Result
When users click **Continue with Google**, the official **Google Account Chooser Window** (`accounts.google.com/v3/signin/accountchooser`) will open automatically!
