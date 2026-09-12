# اردو کیلکولیٹر — Urdu Calculator

A free, offline calculator designed for Urdu users: full RTL layout, Nastaliq-friendly fonts,
Urdu-Indic digits (۰۱۲۳۴۵۶۷۸۹), and everyday tools beyond basic math.

---

**A project of Waraq Enterprises, Gilgit**
Developed by: **Syed Saif Ullah Jailani - Gilgit** (سید سیف اللہ جیلانی - گلگت)

- LinkedIn: [xl8saif](https://www.linkedin.com/in/xl8saif)
- GitHub: [xl8saif](https://github.com/xl8saif)
- Website: [xl8saif.github.io](https://xl8saif.github.io)
- ProZ: [3150554](https://www.proz.com/profile/3150554)
- Upwork: [011ed3711aa3cf98f4](https://www.upwork.com/freelancers/011ed3711aa3cf98f4)
- Facebook: [khalid.tasmim](https://www.facebook.com/khalid.tasmim)
- WhatsApp: [+92 310 0989830](https://wa.me/923100989830)
- Email: [xl8.saif@gmail.com](mailto:xl8.saif@gmail.com)

---

No install, no internet, no dependencies — open `index.html` in any browser and it works.

## Features

### 🧮 کیلکولیٹر — Calculator
- Urdu keypad (صاف، مٹائیں، ٫، ±، ٪) with correct operator precedence (۲ + ۳ × ۴ = ۱۴)
- Smart percent: ۱۰۰ + ۱۰٪ = ۱۱۰, ۲۰۰ − ۱۵٪ = ۱۷۰, ۴۰۰ × ۲۵٪ = ۱۰۰
- Divide-by-zero shows a friendly Urdu message ("صفر سے تقسیم نہیں ہو سکتا")
- Calculation history (last 20, saved in the browser) — tap any entry to reuse it
- "پچھلا جواب" button continues from the previous answer
- Full physical-keyboard support: digits, `+ - * / %`, Enter, Backspace, Escape

### 🎂 عمر — Age Calculator
- Age in years / months / days (e.g. ۲۶ سال ۷ ماہ ۲۸ دن)
- Total months, weeks, and days lived
- Next-birthday countdown with the weekday ("اگلا سالگرہ: ۱۲۵ دن بعد (جمعہ)")
- Rejects future dates with an Urdu error

### 🌙 زکوٰۃ — Zakat Calculator
- Cash, gold, silver, business stock, money lent, minus debts
- Silver-standard nisab (612.36 g) using **editable** per-gram gold/silver rates
- Clear verdict (زکوٰۃ فرض ہے / نہیں), the exact 2.5% amount, and a full breakdown table
- Reminder to consult a scholar for rulings

### ⚖️ کنورٹر — Unit Converter
- **Length**: میٹر، کلومیٹر، فٹ، انچ، گز، میل، کوس
- **Weight**: کلو، گرام، تولہ، سیر، من، پاؤنڈ، اونس، کوانٹل
- **Area**: مربع فٹ، مرلہ، کنال، ایکڑ، ہیکٹر، مربع
- **Volume**: لیٹر، گیلن، کپ، چمچ
- **Temperature**: °C ↔ °F ↔ Kelvin
- **Currency**: manual-rate converter (works offline; swap button inverts the rate for you)

## Shared UX
- **اردو / English toggle** — every label switches and the whole layout flips RTL ↔ LTR
- **Digit toggle** — all numbers everywhere switch between ۰-۹ and 0-9
- Both choices are remembered (localStorage); dark emerald-and-gold theme, mobile-first

## Run it

Option 1 — just open it:

> Double-click `index.html`

Option 2 — tiny local server (nicer for phones on the same Wi-Fi):

```bash
cd urdu-calculator
python -m http.server 8797
# open http://127.0.0.1:8797
```

## Project structure

```
urdu-calculator/
├── index.html            # app shell: header, tabs, 4 tool views
├── manifest.json         # PWA manifest (name, icons, theme)
├── sw.js                 # service worker (offline cache)
├── privacy.html          # privacy policy (required by Play Store)
├── css/style.css         # theme, keypad, cards, RTL/LTR
├── js/
│   ├── i18n.js           # translations + Urdu digit conversion + number formatting
│   ├── calculator.js     # expression engine, keypad, history, keyboard
│   ├── age.js            # age + birthday countdown
│   ├── zakat.js          # nisab check + 2.5% breakdown
│   ├── converter.js      # unit tables + currency rate mode
│   └── app.js            # tabs, toggles, persistence, boot
└── tests/
    └── engine.test.js    # node unit tests (no browser needed)
```

## Tests

```bash
node urdu-calculator/tests/engine.test.js
```

Covers digit conversion, number formatting, operator precedence, percent semantics,
and divide-by-zero.

## Customizing

- **Zakat rates**: defaults are PKR placeholders (24000/gold g, 90/silver g) — edit in the UI;
  they're meant to be updated by the user each time.
- **Units / conversion factors**: edit the `CATS` table at the top of `js/converter.js`.
- **Translations**: add or change keys in the `T` dictionary in `js/i18n.js`.

## Fonts & Credits

- **Urdu interface font: [Mehr Nastaliq Web](https://github.com/abbassiddiqi/mehr)** —
  calligraphy of Nasrullah Mehr, font by Muhammad Zeeshan Nasar.
  Licensed CC BY-SA 4.0; bundled locally in `fonts/` (mehr.woff + mehr.ttf, ~68 KB) so the
  app renders authentic Nastaliq fully offline. Credited in-app in the ڈیولپر کا تعارف modal.
- Fallbacks: Jameel Noori Nastaleeq / Noto Nastaliq Urdu if installed on the device.
- Brand icons in the About modal: [Simple Icons](https://simpleicons.org) (CC0);
  ProZ tile drawn in-repo.
