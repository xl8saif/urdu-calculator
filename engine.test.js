/* ============================================================
   engine.test.js — unit tests for i18n helpers + calculator engine
   Run:  node urdu-calculator/tests/engine.test.js
   No DOM needed — loads i18n.js and the pure parts of calculator.js
   ============================================================ */
"use strict";

// Minimal browser stubs so the IIFEs can load in Node
global.window = {};
global.document = {
  getElementById: function () { return null; },
  addEventListener: function () {},
  querySelectorAll: function () { return []; },
  createElement: function () {
    return {
      style: {},
      classList: { add: function () {}, remove: function () {}, toggle: function () {} },
      appendChild: function () {},
      addEventListener: function () {}
    };
  }
};
global.localStorage = { getItem: function () { return null; }, setItem: function () {} };

var path = require("path");
require(path.join(__dirname, "..", "js", "i18n.js"));
require(path.join(__dirname, "..", "js", "calculator.js"));

var I = window.I18N;
var C = window.Calc;

var failures = 0;
function ok(cond, label, extra) {
  if (cond) { console.log("  ✓ " + label); }
  else { failures++; console.error("  ✗ " + label + (extra !== undefined ? "  → got: " + extra : "")); }
}
function near(a, b, label) { ok(Math.abs(a - b) < 1e-9, label, a); }

console.log("i18n helpers:");
ok(I.toUrduDigits("123") === "۱۲۳", "toUrduDigits converts 0-9 → ۰-۹");
ok(I.fmtDigits("1,234.5") === "۱,۲۳۴.۵", "fmtDigits in urdu mode");
I.setDigitMode("western");
ok(I.fmtDigits("1,234.5") === "1,234.5", "fmtDigits in western mode");
I.setDigitMode("urdu");
ok(I.fmtRaw(1234567.891, 2) === "1,234,567.89", "fmtRaw thousands separators");
ok(I.fmtRaw(0.5, 4) === "0.5", "fmtRaw trims trailing zeros");
ok(I.fmtRaw(-42, 2) === "-42", "fmtRaw negative");
ok(I.t("appTitle").length > 0, "t() returns Urdu for appTitle");

console.log("calculator engine:");
// token helper for tests: '2+3x4', '10/4', '50%' → proper tokens
function tk(s) {
  var toks = [];
  (s.match(/(\d+\.?\d*|[-+x×÷\/%])/g) || []).forEach(function (r) {
    if (r === "%") { toks.push({ t: "pct" }); return; }
    if ("-+x×÷/".indexOf(r) >= 0) {
      var v = r === "-" ? "−" : r === "+" ? "+" : (r === "x" || r === "×") ? "×" : "÷";
      toks.push({ t: "op", v: v });
    } else {
      toks.push({ t: "num", v: r });
    }
  });
  return toks;
}

near(C.computeTokens(tk("2+3x4")), 14, "precedence: 2+3×4 = 14");
near(C.computeTokens(tk("10/4")), 2.5, "division: 10÷4 = 2.5");
near(C.computeTokens(tk("100+10%")), 110, "percent add: 100+10% = 110");
near(C.computeTokens(tk("200-15%")), 170, "percent subtract: 200−15% = 170");
near(C.computeTokens(tk("50%")), 0.5, "percent standalone: 50% = 0.5");
near(C.computeTokens(tk("400x25%")), 100, "percent multiply: 400×25% = 100");
near(C.computeTokens(tk("2+3x4-5")), 9, "mixed: 2+3×4−5 = 9");
near(C.computeTokens(tk("7-2x3")), 1, "precedence: 7−2×3 = 1");

// divide by zero must throw
var threw = false;
try { C.computeTokens(tk("5/0")); } catch (e) { threw = true; }
ok(threw, "divide by zero throws");

console.log(failures === 0 ? "\nALL TESTS PASSED" : "\n" + failures + " TEST(S) FAILED");
process.exit(failures === 0 ? 0 : 1);
