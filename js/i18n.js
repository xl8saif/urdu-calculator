/* ============================================================
   i18n.js — translations, digit conversion, number formatting
   Exposes: window.I18N
   ============================================================ */
(function () {
  "use strict";

  var URDU_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

  var T = {
    // ---- header / chrome ----
    appTitle: { ur: "اردو کیلکولیٹر", en: "Urdu Calculator" },
    appSub: { ur: "روزمرہ حساب کتاب کا آسان ذریعہ", en: "Everyday math, the easy way" },
    tabCalc: { ur: "کیلکولیٹر", en: "Calculator" },
    tabAge: { ur: "عمر", en: "Age" },
    tabZakat: { ur: "زکوٰۃ", en: "Zakat" },
    tabConv: { ur: "کنورٹر", en: "Convert" },
    footer: { ur: "مفت اور آف لائن — اردو بولنے والوں کے لیے ❤️", en: "Free & offline — made for Urdu speakers ❤️" },

    // ---- about / credits ----
    aboutBtn: { ur: "ڈیولپر کا تعارف", en: "About the Developer" },
    aboutTitle: { ur: "ڈیولپر کا تعارف", en: "About the Developer" },
    aboutProject: { ur: "ورق انٹرپرائزز، گلگت", en: "WARAQ Enterprises, Gilgit" },
    aboutDevelopedBy: { ur: "ڈیولپر", en: "Developed by" },
    devName: { ur: "سید سیف اللہ جیلانی - گلگت", en: "Syed Saif Ullah Jailani - Gilgit" },
    aboutVersion: { ur: "ورژن", en: "Version" },
    fontCredit: { ur: "فونٹ: میہر نستعلیق ویب", en: "Font: Mehr Nastaliq Web" },
    aboutFindMe: { ur: "رابطہ اور پروفائلز", en: "Contact & profiles" },
    aboutClose: { ur: "بند کریں", en: "Close" },
    lnLinkedIn: { ur: "لنکڈان", en: "LinkedIn" },
    lnGitHub: { ur: "گٹ ہب", en: "GitHub" },
    lnProz: { ur: "پرو زیڈ", en: "ProZ" },
    lnUpwork: { ur: "اپ ورک", en: "Upwork" },
    lnFacebook: { ur: "فیس بک", en: "Facebook" },
    lnWebsite: { ur: "ویب سائٹ", en: "Website" },
    lnWhatsapp: { ur: "واٹس ایپ", en: "WhatsApp" },
    lnEmail: { ur: "ای میل", en: "Email" },

    // ---- calculator ----
    keyAC: { ur: "صاف", en: "AC" },
    key0: { ur: "۰", en: "0" }, key1: { ur: "۱", en: "1" },
    key2: { ur: "۲", en: "2" }, key3: { ur: "۳", en: "3" },
    key4: { ur: "۴", en: "4" }, key5: { ur: "۵", en: "5" },
    key6: { ur: "۶", en: "6" }, key7: { ur: "۷", en: "7" },
    key8: { ur: "۸", en: "8" }, key9: { ur: "۹", en: "9" },
    keyPct: { ur: "٪", en: "%" },
    keyEq: { ur: "=", en: "=" },
    keyBack: { ur: "مٹائیں ⌫", en: "Backspace ⌫" },
    keyHist: { ur: "تاریخ", en: "History" },
    keyAns: { ur: "پچھلا جواب", en: "Last answer" },
    historyTitle: { ur: "تاریخِ حساب", en: "History" },
    clearHist: { ur: "صاف کریں", en: "Clear" },
    divZero: { ur: "صفر سے تقسیم نہیں ہو سکتا", en: "Cannot divide by zero" },
    ansPrefix: { ur: "جواب", en: "Ans" },

    // ---- age ----
    ageTitle: { ur: "🎂 عمر کیلکولیٹر", en: "🎂 Age Calculator" },
    ageHint: { ur: "اپنی تاریخِ پیدائش منتخب کریں", en: "Pick your date of birth" },
    dob: { ur: "تاریخِ پیدائش", en: "Date of birth" },
    ageBtn: { ur: "عمر نکالیں", en: "Calculate age" },
    ageTotalMonths: { ur: "کل ماہ", en: "Total months" },
    ageTotalWeeks: { ur: "کل ہفتے", en: "Total weeks" },
    ageTotalDays: { ur: "کل دن", en: "Total days" },
    ageYears: { ur: "سال", en: "years" },
    ageMonths: { ur: "ماہ", en: "months" },
    ageDays: { ur: "دن", en: "days" },
    bdayIn: { ur: "اگلا سالگرہ: {n} دن بعد ({day}) 🎉", en: "Next birthday: {n} days to go ({day}) 🎉" },
    bdayToday: { ur: "آج آپ کا سالگرہ ہے! 🎂 مبارک ہو! 🎉", en: "Today is your birthday! 🎂 Happy birthday! 🎉" },
    wdSun: { ur: "اتوار", en: "Sunday" },
    wdMon: { ur: "پیر", en: "Monday" },
    wdTue: { ur: "منگل", en: "Tuesday" },
    wdWed: { ur: "بدھ", en: "Wednesday" },
    wdThu: { ur: "جمعرات", en: "Thursday" },
    wdFri: { ur: "جمعہ", en: "Friday" },
    wdSat: { ur: "ہفتہ", en: "Saturday" },
    errAge: { ur: "براہِ کرم درست تاریخِ پیدائش منتخب کریں۔", en: "Please choose a valid date of birth." },
    errFuture: { ur: "تاریخِ پیدائش مستقبل میں نہیں ہو سکتی۔", en: "Date of birth cannot be in the future." },

    // ---- zakat ----
    zakatTitle: { ur: "🌙 زکوٰۃ کیلکولیٹر", en: "🌙 Zakat Calculator" },
    zakatHint: { ur: "اپنے مال کی تفصیل درج کریں — خالی چھوٹا جائے تو صفر سمجھا جائے گا", en: "Enter your assets — empty fields count as zero" },
    zkCash: { ur: "نقدی اور بینک رقم", en: "Cash & bank balance" },
    zkGold: { ur: "سونا (گرام)", en: "Gold (grams)" },
    zkSilver: { ur: "چاندی (گرام)", en: "Silver (grams)" },
    zkBiz: { ur: "کاروباری مال و جدید ذخیرہ", en: "Business goods & stock" },
    zkLend: { ur: "دوسروں کو دیا قرض", en: "Money lent to others" },
    zkDebt: { ur: "مجھ پر قرض (منہا کریں)", en: "Debts I owe (deduct)" },
    zkRates: { ur: "آج کے ریٹ (فی گرام — خود درست کریں)", en: "Today's rates (per gram — edit me)" },
    zkGoldRate: { ur: "سونے کا ریٹ", en: "Gold rate" },
    zkSilverRate: { ur: "چاندی کا ریٹ", en: "Silver rate" },
    zakatBtn: { ur: "زکوٰۃ نکالیں", en: "Calculate Zakat" },
    zkDue: { ur: "زکوٰۃ فرض ہے", en: "Zakat is due" },
    zkNotDue: { ur: "زکوٰۃ فرض نہیں (نساب سے کم)", en: "Zakat not due (below nisab)" },
    zkAmount: { ur: "۲.۵٪ زکوٰۃ", en: "2.5% Zakat" },
    zkNisabRow: { ur: "نساب (چاندی کے حساب سے)", en: "Nisab (silver standard)" },
    zkAssetsRow: { ur: "قابلِ زکوٰۃ مال", en: "Zakatable wealth" },
    zkGoldRow: { ur: "سونے کی قیمت", en: "Gold value" },
    zkSilverRow: { ur: "چاندی کی قیمت", en: "Silver value" },
    zakatNote: { ur: "نوٹ: یہ تخمینہ ہے۔ زکوٰۃ کے احکام کے لیے اپنے عالم/مفتی سے رجوع کریں۔", en: "Note: this is an estimate. For rulings consult your scholar/mufti." },
    errZakatRates: { ur: "براہِ کرم سونے/چاندی کے ریٹ درج کریں (صفر سے زیادہ)۔", en: "Please enter gold/silver rates greater than zero." },
    errZakatNeg: { ur: "مال منفی نہیں ہو سکتا۔ مثبت اعداد درج کریں۔", en: "Wealth cannot be negative. Enter positive numbers." },

    // ---- converter ----
    convTitle: { ur: "⚖️ اکائی کنورٹر", en: "⚖️ Unit Converter" },
    catLength: { ur: "لمبائی", en: "Length" },
    catWeight: { ur: "وزن", en: "Weight" },
    catArea: { ur: "رقبہ", en: "Area" },
    catVolume: { ur: "حجم", en: "Volume" },
    catTemp: { ur: "درجہ حرارت", en: "Temperature" },
    catCurrency: { ur: "کرنسی", en: "Currency" },
    convFrom: { ur: "از", en: "From" },
    convFromUnit: { ur: "اکائی", en: "Unit" },
    convToUnit: { ur: "اکائی", en: "Unit" },
    convTo: { ur: "نتیجہ", en: "Result" },
    convSwap: { ur: "↔ بدلیں", en: "↔ Swap" },
    errConv: { ur: "براہِ کرم عدد درج کریں۔", en: "Please enter a number." },
    errConvRate: { ur: "کرنسی ریٹ درج کریں (صفر سے زیادہ)۔", en: "Enter the exchange rate (greater than zero)." },

    // ---- units (labels shown in selects) ----
    uM: { ur: "میٹر", en: "Meter" }, uKm: { ur: "کلومیٹر", en: "Kilometer" },
    uCm: { ur: "سینٹی میٹر", en: "Centimeter" }, uMm: { ur: "ملی میٹر", en: "Millimeter" },
    uFt: { ur: "فٹ", en: "Foot" }, uInch: { ur: "انچ", en: "Inch" },
    uYard: { ur: "گز", en: "Yard (gaz)" }, uMile: { ur: "میل", en: "Mile" },
    uKos: { ur: "کوس", en: "Kos" },

    uKg: { ur: "کلوگرام", en: "Kilogram" }, uG: { ur: "گرام", en: "Gram" },
    uTola: { ur: "تولہ", en: "Tola" }, uMun: { ur: "من", en: "Maund (mun)" },
    uSir: { ur: "سیر", en: "Seer" }, uLb: { ur: "پاؤنڈ", en: "Pound" },
    uOz: { ur: "اونس", en: "Ounce" }, uQuintal: { ur: "کوانٹل", en: "Quintal" },

    uSqm: { ur: "مربع میٹر", en: "Square meter" }, uSft: { ur: "مربع فٹ", en: "Square foot" },
    uSqYd: { ur: "مربع گز", en: "Square yard" }, uMarla: { ur: "مرلہ", en: "Marla" },
    uKanal: { ur: "کنال", en: "Kanal" }, uAcre: { ur: "ایکڑ", en: "Acre" },
    uHectare: { ur: "ہیکٹر", en: "Hectare" }, uMurabba: { ur: "مربع (murabba)", en: "Murabba (square)" },

    uL: { ur: "لیٹر", en: "Liter" }, uMl: { ur: "ملی لیٹر", en: "Milliliter" },
    uGal: { ur: "گیلن", en: "Gallon" }, uCup: { ur: "کپ (چائے)", en: "Cup (chai)" },
    uTsp: { ur: "چھوٹا چمچ", en: "Teaspoon" }, uTbsp: { ur: "بڑا چمچ", en: "Tablespoon" },

    uC: { ur: "درجہ سینٹی گریڈ (°C)", en: "Celsius (°C)" },
    uF: { ur: "درجہ فارن ہائٹ (°F)", en: "Fahrenheit (°F)" },
    uK: { ur: "کیلوِن (K)", en: "Kelvin (K)" },

    uPkr: { ur: "پاکستانی روپیہ (PKR)", en: "Pakistani Rupee (PKR)" },
    uUsd: { ur: "امریکی ڈالر (USD)", en: "US Dollar (USD)" },
    uSar: { ur: "سعودی ریال (SAR)", en: "Saudi Riyal (SAR)" },
    uAed: { ur: "متحدہ امارات درہم (AED)", en: "UAE Dirham (AED)" },
    uGbp: { ur: "برطانوی پاؤنڈ (GBP)", en: "British Pound (GBP)" },
    uEur: { ur: "یورو (EUR)", en: "Euro (EUR)" },
    rateHint: { ur: "1 {from} = ? {to} — ریٹ خود درج کریں", en: "1 {from} = ? {to} — enter the rate yourself" }
  };

  var lang = "ur";           // "ur" | "en"
  var digitMode = "urdu";    // "urdu" | "western"

  function tr(key) {
    var entry = T[key];
    if (!entry) return key;
    return entry[lang] || entry.ur;
  }

  function trFmt(key, vars) {
    var s = tr(key);
    Object.keys(vars || {}).forEach(function (k) {
      s = s.replace("{" + k + "}", vars[k]);
    });
    return s;
  }

  function unitLabel(key) { return tr(key); }

  // Convert western digits in a string to Urdu digits (or leave as-is)
  function toUrduDigits(str) {
    return String(str).replace(/[0-9]/g, function (d) { return URDU_DIGITS[+d]; });
  }

  // Render a numeric string per the active digit mode
  function fmtDigits(str) {
    return digitMode === "urdu" ? toUrduDigits(str) : String(str);
  }

  // Format a JS number with thousands separators, then apply digit mode
  function fmtNum(n, maxFrac) {
    if (typeof n !== "number" || !isFinite(n)) return "—";
    if (maxFrac === undefined) maxFrac = 4;
    var neg = n < 0;
    var abs = Math.abs(n);
    var fixed = abs.toFixed(maxFrac);
    // trim trailing zeros but keep at least integer part
    if (fixed.indexOf(".") >= 0) {
      fixed = fixed.replace(/0+$/, "").replace(/\.$/, "");
    }
    var parts = fixed.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    var out = parts.join(".");
    if (neg) out = "-" + out;
    return fmtDigits(out);
  }

  // Raw (western) formatting with separators — used internally before digit rendering
  function fmtRaw(n, maxFrac) {
    if (typeof n !== "number" || !isFinite(n)) return "—";
    if (maxFrac === undefined) maxFrac = 4;
    var neg = n < 0;
    var abs = Math.abs(n);
    var fixed = abs.toFixed(maxFrac);
    if (fixed.indexOf(".") >= 0) fixed = fixed.replace(/0+$/, "").replace(/\.$/, "");
    var parts = fixed.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    var out = parts.join(".");
    return (neg ? "-" : "") + out;
  }

  function setLang(l) {
    lang = l === "en" ? "en" : "ur";
  }
  function setDigitMode(m) {
    digitMode = m === "western" ? "western" : "urdu";
  }
  function getLang() { return lang; }
  function getDigitMode() { return digitMode; }
  function decimalSep() { return "٫"; }

  window.I18N = {
    tr: tr,
    trFmt: trFmt,
    unitLabel: unitLabel,
    toUrduDigits: toUrduDigits,
    fmtDigits: fmtDigits,
    fmtNum: fmtNum,
    fmtRaw: fmtRaw,
    setLang: setLang,
    setDigitMode: setDigitMode,
    getLang: getLang,
    getDigitMode: getDigitMode,
    decimalSep: decimalSep,
    URDU_DIGITS: URDU_DIGITS,
    // translated label for a UI key, applying nothing else
    t: tr
  };
})();
