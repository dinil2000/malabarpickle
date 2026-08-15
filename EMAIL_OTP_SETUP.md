# 📧 How to Enable Real Email OTP Delivery to Customer Inboxes

Your **Malabar Pickle** web app is configured to send real 6-digit verification codes to any email address using **Nodemailer**!

To allow your website to send real emails to your customers' inboxes (Gmail, Outlook, Yahoo, etc.), set up a free **Gmail App Password** in 1 minute:

---

### 🔑 1-Minute Setup Guide (Gmail App Password)

1. Open your Gmail account (`dinil2000@gmail.com`).
2. Go to **[myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)**.
3. If prompted, turn on **2-Step Verification** on your Google Account.
4. Select **App name**: Type `Malabar Pickle` and click **Create**.
5. Copy the 16-character App Password (e.g., `abcd efgh ijkl mnop`).

---

### 🌐 Add Keys to Vercel (or `.env.local`)

#### 1️⃣ In Local Development ([`.env.local`](file:///d:/antigravity/pickleNEW/.env.local)):
```env
GMAIL_USER=dinil2000@gmail.com
GMAIL_APP_PASSWORD=abcdefghijklmnop
```

#### 2️⃣ In Vercel Environment Variables:
1. Go to **Vercel Dashboard** $\rightarrow$ **`malabarpickle`** $\rightarrow$ **Settings** $\rightarrow$ **Environment Variables**.
2. Add Variable 1:
   - **Key:** `GMAIL_USER`
   - **Value:** `dinil2000@gmail.com`
3. Add Variable 2:
   - **Key:** `GMAIL_APP_PASSWORD`
   - **Value:** `abcdefghijklmnop` (Your 16-character App Password)
4. Click **Save** and **Redeploy** on Vercel!

---

### 🎉 Result:
When any customer registers on `/register`, they will receive a real HTML email titled:
**"123456 is your Malabar Pickle Account Verification Code"** straight in their inbox! 🚀
