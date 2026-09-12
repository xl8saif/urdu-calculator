/* ============================================================
   app.js — tabs, language & digit toggles, persistence, boot
   Exposes: window.App
   ============================================================ */
(function () {
  "use strict";

  var LS_LANG = "uc_lang";
  var LS_DIGITS = "uc_digits";

  function $(sel) { return document.querySelector(sel); }
  function $all(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }

  function applyTranslations() {
    $all("[data-i18n]").forEach(function (elm) {
      var key = elm.getAttribute("data-i18n");
      elm.textContent = I18N.t(key);
    });
  }

  function applyDirection() {
    var ur = I18N.getLang() === "ur";
    document.documentElement.setAttribute("lang", ur ? "ur" : "en");
    document.documentElement.setAttribute("dir", ur ? "rtl" : "ltr");
  }

  function updateDigitLabel() {
    $("#digitLabel").textContent =
      I18N.getDigitMode() === "urdu" ? "123" : "۱۲۳";
  }

  function refreshModules() {
    applyDirection();
    applyTranslations();
    updateDigitLabel();
    Calc.onLanguageChange();
    AgeCalc.onLanguageChange();
    Zakat.onLanguageChange();
    Conv.onLanguageChange();
  }

  function loadPrefs() {
    var lang = null, digits = null;
    try {
      lang = localStorage.getItem(LS_LANG);
      digits = localStorage.getItem(LS_DIGITS);
    } catch (e) {}

    I18N.setLang(lang === "en" ? "en" : "ur");
    if (digits === "western") I18N.setDigitMode("western");
    else I18N.setDigitMode("urdu");
  }

  function savePref(key, val) {
    try { localStorage.setItem(key, val); } catch (e) {}
  }

  function activateTab(name) {
    $all(".tab").forEach(function (t) {
      t.classList.toggle("active", t.dataset.tab === name);
      t.setAttribute("aria-selected", t.dataset.tab === name ? "true" : "false");
    });
    $all(".view").forEach(function (v) {
      v.classList.toggle("active", v.id === "view-" + name);
    });
  }

  function initTabs() {
    $all(".tab").forEach(function (tab) {
      tab.addEventListener("click", function () {
        activateTab(tab.dataset.tab);
      });
    });
  }

  function applyHash() {
    var h = location.hash.replace(/^#/, "");
    if (!h) return;
    var params = {};
    h.split("&").forEach(function (p) {
      var kv = p.split("=");
      params[kv[0]] = kv.length > 1 ? kv[1] : "1";
    });
    if (params.tab && document.getElementById("view-" + params.tab)) {
      activateTab(params.tab);
    }
    if (params.demo === "1") {
      if (params.tab === "calculator" || !params.tab) {
        if (window.Calc && Calc.demo) Calc.demo();
      } else if (params.tab === "converter" && window.Conv) {
        Conv.demo();
      } else if (params.tab === "zakat" && window.Zakat) {
        Zakat.demo();
      } else if (params.tab === "age" && window.AgeCalc) {
        AgeCalc.demo();
      }
    }
    if (params.about === "1") {
      var m = document.getElementById("aboutModal");
      if (m) m.classList.remove("hidden");
    }
  }

  function initControls() {
    $("#btnLang").addEventListener("click", function () {
      var next = I18N.getLang() === "ur" ? "en" : "ur";
      I18N.setLang(next);
      savePref(LS_LANG, next);
      refreshModules();
    });

    $("#btnDigits").addEventListener("click", function () {
      var next = I18N.getDigitMode() === "urdu" ? "western" : "urdu";
      I18N.setDigitMode(next);
      savePref(LS_DIGITS, next);
      refreshModules();
    });
  }

  function initAbout() {
    var modal = document.getElementById("aboutModal");
    if (!modal) return;

    // Google Play requires a privacy-policy link to be accessible from within the app.
    var closeBtn = document.getElementById("btnCloseAbout");
    if (closeBtn && !document.getElementById("btnPrivacyPolicy")) {
      var privacy = document.createElement("a");
      privacy.id = "btnPrivacyPolicy";
      privacy.className = "primary-btn";
      privacy.href = "privacy.html";
      privacy.target = "_blank";
      privacy.rel = "noopener";
      privacy.textContent = I18N.getLang() === "ur" ? "پرائیویسی پالیسی" : "Privacy Policy";
      closeBtn.parentNode.insertBefore(privacy, closeBtn);
    }

    document.getElementById("btnAbout").addEventListener("click", function () {
      modal.classList.remove("hidden");
    });
    document.getElementById("btnCloseAbout").addEventListener("click", function () {
      modal.classList.add("hidden");
    });
    modal.addEventListener("click", function (e) {
      if (e.target === modal) modal.classList.add("hidden");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !modal.classList.contains("hidden")) {
        modal.classList.add("hidden");
      }
    });
  }

  function init() {
    loadPrefs();
    Calc.init();
    AgeCalc.init();
    Zakat.init();
    Conv.init();
    initTabs();
    initControls();
    initAbout();
    refreshModules();
    applyHash();
  }

  document.addEventListener("DOMContentLoaded", init);

  window.App = { refreshModules: refreshModules };
})();
