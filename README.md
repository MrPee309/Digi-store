# DigiMart — EN Default + Dropdown Menu + Auth

This build adds a right-side dropdown with **Store / Services / Contact / Sign in / Register / Sign out**.
- EN is default, FR & HT available via selector.
- Firebase Google Sign-In (Register uses the same handler).
- Vercel proxy `/api/proxy` (+ `vercel.json` fixed) so static files load correctly.

Deploy → edit `firebase.js` (public config) → set ENV (`PROVIDER_BASE_URL`, `PROVIDER_API_KEY`) → edit `products.json`.
© 2025 DigiMart.
