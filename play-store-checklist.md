# Google Play Store — Publishing Checklist (اردو کیلکولیٹر)

The app is already a complete PWA (manifest + service worker + icons + offline cache).
This checklist covers everything needed to get it live on the Play Store.

## 1. Prerequisites (you must do these — they cost money/accounts)

- [ ] **Google Play developer account** — https://play.google.com/console
      One-time **$25 USD** fee. Use a Google account you want tied to the app.
- [ ] **Host the app on public HTTPS** (required for any web-based route).
      Free options: GitHub Pages, Netlify, Cloudflare Pages, Vercel.
      Upload the `urdu-calculator/` folder (index.html + css/ + js/ + icons/ + manifest.json + sw.js).
- [ ] **Privacy policy page** — even though the app collects *no data*, Play requires a URL.
      Host a simple page (see section 4) and link it in the store listing.

## 2. Pick how to build the Android package (AAB)

| Route | Effort | Notes |
|-------|--------|-------|
| **PWABuilder (recommended)** | Low | Go to https://pwabuilder.com → paste your hosted URL → it generates a signed **Trusted Web Activity (TWA)** AAB with a Play Store badge. No local Android toolchain needed. |
| **Capacitor local build** | Medium | Requires installing JDK 17+ and Android SDK on this PC (~3 GB). I can scaffold the Capacitor project and generate the signing keystore; you approve the installs. |
| **Bubblewrap CLI** | Medium | Google's official TWA builder (what PWABuilder uses under the hood). Same requirements as PWABuilder but from the command line. |

> Note: PWABuilder's TWA uses the PWA's manifest and icons automatically — which is exactly
> why we added `manifest.json`, `sw.js` and `icons/` already.

## 3. Store listing (copy-paste ready)

- **App name (30 chars max):** `Urdu Calculator`
- **Short description (80 chars max):**
  `Calculator, age, Zakat and unit converter for Urdu speakers. Fully offline.`
- **Full description:** see `store-description.md` (bilingual, ready to paste)
- **Category:** Tools / Education
- **Content rating:** Everyone (E)
- **Data safety form:** No data collected — select "No" for everything, privacy policy URL required anyway.

### Screenshots (min 2, 1080×1920 or 1920×1080)
- Calculator tab (Urdu, RTL) — 1080×1920
- Converter tab or Zakat result — 1080×1920
- Optional feature graphic 1024×500: app icon on emerald background.

## 4. Privacy policy (required even with zero data)

Host any HTML page stating: "This app collects no personal data, stores nothing on
servers, and works fully offline. All calculations happen on your device."
A one-page `privacy.html` is included in this project — upload it next to the app.

## 5. Final steps

- [ ] Upload AAB in Play Console → Production → Android App Bundle
- [ ] Fill listing, pricing (Free), content rating questionnaire
- [ ] Submit for review (usually 2–7 days)

## Why this app will pass review easily
- Works fully offline — no network permission needed
- No accounts, no ads, no microtransactions
- No data collection at all