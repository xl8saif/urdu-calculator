# Hosting + Play Store submission — Step by Step

You chose: **PWABuilder** route, and you already have a Play developer account.
`urdu-calculator-deploy.zip` (in the project root) contains exactly the files to upload.

---

## Step 1 — Host the app (free, ~5 minutes)

### Option A: Netlify Drop (easiest — no account code, drag & drop)

1. Go to **https://app.netlify.com/drop** (you'll sign in with email/Google).
2. **Unzip** `urdu-calculator-deploy.zip` on your computer.
3. Drag the **unzipped folder** onto the Netlify page.
4. Netlify gives you a URL like `https://random-name-123.netlify.app`.
5. Open that URL on your phone — the app should load in Urdu, right-to-left.
   Keep it on a bookmark tab; you'll need the URL next.

> Re-upload the same folder any time you update the app — Netlify updates instantly.

### Option B: GitHub Pages (if you prefer GitHub)

1. Create a new **public** repository on github.com, e.g. `urdu-calculator`.
2. Click **"uploading an existing file"** → drag in the unzipped contents of
   `urdu-calculator-deploy.zip` (index.html at the top level of the repo).
3. Repo **Settings → Pages** → Source **Deploy from a branch** → `main` → Save.
4. After ~1 minute your site is live at
   `https://<your-username>.github.io/urdu-calculator/`.

---

## Step 2 — Verify the hosted app

Open the hosted URL and check:
- [ ] App loads and works (try ۱۲ × ۴ = ۴۸)
- [ ] `https://<your-url>/privacy.html` opens (Netlify: `/privacy.html`, GitHub Pages: `/urdu-calculator/privacy.html`)
- [ ] Address bar shows a padlock (HTTPS) — required for the next step

---

## Step 3 — Generate the Android package (AAB) with PWABuilder

1. Go to **https://pwabuilder.com**
2. Paste your hosted URL (e.g. `https://random-name-123.netlify.app`) → **Start**
3. It scans the PWA (manifest + icons + service worker are already in place).
4. Go to the **Android tab** → **Download Android Package (AAB)**.
5. If prompted, follow the **Trusted Web Activity (TWA)** signing steps —
   PWABuilder signs it with their Play Store key (this is why the app is a TWA-ready PWA).
6. You get a `.aab` file.

> The AAB includes the PWA's name, icons, and offline support automatically.
> If PWABuilder asks for a "digital asset link", just point it at your hosted
> `manifest.json` (e.g. `https://<your-url>/manifest.json`).

---

## Step 4 — Upload to Play Store

1. Open **https://play.google.com/console** → **Add app**.
2. Upload the AAB under **Production → Android App Bundle**.
3. Fill the listing using `store-description.md` (bilingual, ready to paste):
   - Name: `Urdu Calculator`
   - Short description: `Calculator, age, Zakat and unit converter for Urdu speakers. Fully offline.`
   - Category: Tools / Education
   - **Privacy policy URL:** your hosted `privacy.html`
4. Content rating questionnaire: **Everyone** (no violence, no ads, no purchases).
5. Data safety form: everything **"No"** — app collects nothing.
6. Upload 2+ screenshots (take them from your phone: calculator tab + converter tab).
7. **Submit** — review usually takes 2–7 days.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| PWABuilder says "not a valid PWA" | Make sure you uploaded the **unzipped** folder so `index.html` is at the site root, and the URL is HTTPS. |
| App loads but looks wrong on phone | Open the hosted URL in Chrome → ⋮ → **Install app** to test the installed experience. |
| AAB rejected at upload | Re-download the AAB from PWABuilder (signed builds expire); make sure you used the same URL as your listing. |
| Urdu font looks thin on Android | Android has Noto Nastaliq Urdu built in — it's already in the font stack; no action needed. |