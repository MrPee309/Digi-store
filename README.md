# DigiMart Pro — English-first, Multi-language, Firebase Login, API Proxy

A professional static shop for **email-only digital delivery**. English is default; switch FR/HT via dropdown. Includes:
- 🔐 Firebase Auth (Google sign-in)
- 🌍 Language switcher (EN default + FR + HT)
- 🛒 Store with auth-gated “Buy now” buttons
- 🔌 Services page that calls external providers via a Vercel **Serverless Function proxy**

## 1) Deploy
- Upload to Vercel → Project → Deploy. (This repo includes `vercel.json` for static + functions.)

## 2) Firebase Auth Setup
- Create a Firebase project → Enable **Google** provider (Authentication).
- Copy config to `firebase.js`:
  ```js
  const firebaseConfig = {
    apiKey: "…", authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID", appId: "…"
  };
  ```
- No secrets are stored in the client; it's OK to expose this public config.

## 3) API Proxy (secure keys)
- In Vercel Project → **Settings → Environment Variables** set:
  - `PROVIDER_BASE_URL` = e.g. `https://api.yourprovider.com/v1`
  - `PROVIDER_API_KEY` = your secret key
- The function `/api/proxy` forwards requests, keeps your key private, and avoids CORS issues.
- Example form on **services.html** posts `{ imei }` to `/api/proxy`.

## 4) Products
- Edit `products.json` → replace `buy_url` with your Gumroad/Payhip links (which email the file/code automatically).

## 5) Language
- Default is English. Dropdown writes to `localStorage`.
- To edit text, update `i18n.json`.

© 2025 DigiMart.
