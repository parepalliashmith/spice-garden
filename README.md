# 🍽️ Spice Garden — Restaurant App

A self-contained restaurant web app: online ordering with payment, table reservations,
and a role-based admin dashboard. Runs in any browser — no build step, no server.

## Run locally
Just open **`index.html`** in Chrome (double-click it). That's it.

## Features
- **Menu & online ordering** — cart, quantities, Takeaway / Dine-in / Home delivery
- **Online payment (demo)** — Pay Online (UPI / Card) or Cash; paid orders are flagged in admin
- **Table reservations** — date & time default to "now", past dates blocked
- **Roles** — Super Admin, Admin, Staff (see logins below)

### Default logins (Admin tab)
| Role | Username | Password |
|------|----------|----------|
| 👑 Super Admin | `superadmin` | `super123` |
| 🛠️ Admin | `admin` | `admin123` |
| 🧑‍🍳 Staff | `staff` | `staff123` |

> Data (menu, orders, reservations, users) is saved in the browser via `localStorage`.

---

## Put it online (free)

This is a static site (`index.html`, `styles.css`, `app.js`), so any static host works.

### Option A — Netlify Drop (easiest, ~1 minute, no account needed to start)
1. Go to **https://app.netlify.com/drop**
2. Drag the **`Restaurant` folder** (or `spice-garden.zip`) onto the page.
3. You get a public link like `https://your-name.netlify.app` — share it with anyone.

### Option B — GitHub Pages (uses your GitHub account)
1. Create a new repo on GitHub and upload these 3 files.
2. Repo → **Settings → Pages → Build from branch → `main` / root → Save**.
3. Your site goes live at `https://<username>.github.io/<repo>/`.

### Option C — GitHub + Render (recommended here)
1. Create a new **empty** repo on GitHub (no README/.gitignore), e.g. `spice-garden`.
2. Push this folder to it:
   ```
   git remote add origin https://github.com/<you>/spice-garden.git
   git branch -M main
   git push -u origin main
   ```
3. On **Render** → **New → Static Site** → connect the repo →
   **Build command:** *(leave empty)* · **Publish directory:** `.` → **Create Static Site**.
4. Your site goes live at `https://spice-garden.onrender.com` (free, auto-HTTPS).
   A `render.yaml` is included, so you can also use **New → Blueprint** for one-click setup.

---

## 📱 Real SMS OTP (backend)

`server.js` is a tiny Node backend that serves the app **and** handles OTP at
`/api/otp/send` and `/api/otp/verify`. It auto-selects an SMS provider from env vars;
with none set it runs in **DEMO mode** (code shown on screen).

### Run locally
```
npm start        # serves on http://localhost:3000
```

### Deploy on Render as a Web Service
1. Render → **New → Web Service** → connect this repo (or **New → Blueprint** — `render.yaml` is included).
2. **Start command:** `node server.js`  ·  **Build command:** `npm install`
3. (A static site can't run a backend — this must be a Web Service.)

### Turn on real SMS — add env vars in Render (Service → Environment)
Pick ONE provider:

**Twilio Verify** (global)
```
TWILIO_ACCOUNT_SID        = AC...
TWILIO_AUTH_TOKEN         = ...
TWILIO_VERIFY_SERVICE_SID = VA...
```
**Fast2SMS** (India, simplest)
```
FAST2SMS_API_KEY = ...
```
**Email OTP** (free, no DLT — code is emailed instead of texted)
```
BREVO_API_KEY = ...          # Brevo: 300 emails/day free, single-sender verify (no domain)
FROM_EMAIL    = you@...       # a sender you verified in Brevo
# or RESEND_API_KEY instead of BREVO_API_KEY
```
Optional: `COUNTRY_CODE` (default `+91`). When email mode is on, the login asks for an email and the code is sent there.

Once a provider's keys are set, OTPs are texted for real and are **not** shown on screen.
Check the mode any time at `/api/health`.

## ⚠️ Notes
- The online payment is a **demo** — it simulates a successful payment and charges no real money. For real payments you'd integrate a gateway (Razorpay / Stripe) on a backend.
- Logins are stored in the browser, fine for a demo. For real multi-device security, add a server-side login.
