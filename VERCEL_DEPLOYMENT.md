# Vercel Online Deployment Guide

Follow these steps to deploy your ShopBuilder platform online with fully functional dynamic wildcard subdomain routing.

---

## Step 1: Push Your Code to GitHub

Next.js integrates natively with Vercel via GitHub. Run the following commands in this directory to initialize a git repository and push it to your GitHub account:

```bash
git init
git add .
git commit -m "Launch ShopBuilder platform with Google Drive and Proxy routing"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

---

## Step 2: Import Project to Vercel

1. Log into your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New... > Project**.
3. Import the GitHub repository you created in Step 1.
4. Keep the framework preset as **Next.js** and build settings as default.

---

## Step 3: Add Environment Variables in Vercel

Before clicking **Deploy**, scroll down to the **Environment Variables** section and input the keys exactly as shown in your local `.env.local` file:

### 1. Firebase Client Credentials (Public)
* `NEXT_PUBLIC_FIREBASE_API_KEY` = `AIzaSyBDFCqpZlwr9mOXtJvMs5pVJnN6D5E9kwA`
* `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` = `pkcreative-project2026.firebaseapp.com`
* `NEXT_PUBLIC_FIREBASE_PROJECT_ID` = `pkcreative-project2026`
* `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` = `pkcreative-project2026.firebasestorage.app`
* `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` = `1022429307683`
* `NEXT_PUBLIC_FIREBASE_APP_ID` = `1:1022429307683:web:1d8e9749f5be7cf119e296`
* `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` = `G-XWMTLWRJ3V`

### 2. Google Drive API Service Account Credentials (Server-Side Only)
* `GOOGLE_DRIVE_CLIENT_EMAIL` = *(Your Google Cloud Service Account Email)*
* `GOOGLE_DRIVE_PRIVATE_KEY` = *(Your Service Account JSON private key in double quotes. E.g., `"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"`)*
* `GOOGLE_DRIVE_PARENT_FOLDER_ID` = *(The Google Drive Folder ID of your parent folder where all client folders will be created)*

Click **Deploy** and wait for Vercel to compile and publish the project.

---

## Step 4: Configure Wildcard Subdomain in Vercel

To allow clients to visit `clientname.yourdomain.com` and load their specific website instantly, you must configure a **wildcard domain** on Vercel:

1. In your Vercel Project Dashboard, navigate to **Settings > Domains**.
2. Click **Add**.
3. Enter your custom domain prefix with a wildcard: **`*.yourdomain.com`** (replace `yourdomain.com` with your actual domain).
4. Select the option to map it to your main deployment.
5. Vercel will ask you to add a DNS entry at your domain registrar.
6. Open your Domain Registrar control panel (GoDaddy, Namecheap, Cloudflare, Hostinger, etc.) and create a new **CNAME DNS Record**:
   * **Type:** `CNAME`
   * **Name / Host:** `*`
   * **Target / Value:** `cname.vercel-dns.com`
   * **TTL:** `Automatic` or `3600`
7. Once DNS propagates, Vercel will generate SSL certificates for all subdomains automatically!

---

## Step 5: Enable Firebase Admin User Sign-In

To lock the Admin Panel so that only you can log in when the app is online:

1. Open the [Firebase Console](https://console.firebase.google.com/).
2. Select your project **pkcreative-project2026**.
3. Navigate to **Build > Authentication** in the left sidebar.
4. Select the **Users** tab.
5. Click **Add User**.
6. Enter an email and password (e.g. `admin@pkcreative.in` and a strong password).
7. Now, when you visit your main domain on Vercel, the login page will require this email/password to enter!
