/* ============================================================
   converter.js — length, weight, area, volume, temp, currency
   Exposes: window.Conv
   South-Asian units included: tola, seer, maund, marla, kanal, kos
   ============================================================ */
(function () {
  "use strict";

  // f = how many base units in one of this unit (base: meter / kg / m² / liter)
  var CATS = {
    length: {
      units: [
        { id: "uM", f: 1 },
        { id: "uKm", f: 1000 },
        { id: "uCm", f: 0.01 },
        { id: "uMm", f: 0.001 },
        { id: "uFt", f: 0.3048 },
        { id: "uInch", f: 0.0254 },
        { id: "uYard", f: 0.9144 },
        { id: "uMile", f: 1609.344 },
        { id: "uKos", f: 2400 }
      ]
    },
    weight: {
      units: [
        { id: "uKg", f: 1 },
        { id: "uG", f: 0.001 },
        { id: "uTola", f: 0.0116638 },
        { id: "uSir", f: 0.9331 },
        { id: "uMun", f: 37.3242 },
        { id: "uLb", f: 0.45359237 },
        { id: "uOz", f: 0.0283495 },
        { id: "uQuintal", f: 100 }
      ]
    },
    area: {
      units: [
        { id: "uSqm", f: 1 },
        { id: "uSft", f: 0.09290304 },
        { id: "uSqYd", f: 0.83612736 },
        { id: "uMarla", f: 25.29285264 },
        { id: "uKanal", f: 505.8570528 },
        { id: "uAcre", f: 4046.8564224 },
        { id: "uHectare", f: 10000 },
        { id: "uMurabba", f: 101171.41056 }
      ]
    },
    volume: {
      units: [
        { id: "uL", f: 1 },
        { id: "uMl", f: 0.001 },
        { id: "uGal", f: 3.785411784 },
        { id: "uCup", f: 0.24 },
        { id: "uTsp", f: 0.00492892 },
        { id: "uTbsp", f: 0.0147868 }
      ]
    },
    temp: {
      units: [
        { id: "uC" },
        { id: "uF" },
        { id: "uK" }
      ]
    },
    currency: {
      units: [
        { id: "uPkr" },
        { id: "uUsd" },
        { id: "uSar" },
        { id: "uAed" },
        { id: "uGbp" },
        { id: "uEur" }
      ]
    }
  };

  var elFromVal, elFromUnit, elToUnit, elToVal, elFacts, elError;
  var elRateRow, elRateLabel, elRate, elCats;
  var elRateRow, elRateLabel, elRate;
  var currentCat = "length";

  function factorOf(cat, unitId) {
    var found = null;
    CATS[cat].units.forEach(function (u) {
      if (u.id === unitId) found = u.f;
    });
    return found;
  }

  function convertTemp(v, from, to) {
    var c;
    if (from === "uC") c = v;
    else if (from === "uF") c = (v - 32) * 5 / 9;
    else c = v - 273.15;

    if (to === "uC") return c;
    if (to === "uF") return c * 9 / 5 + 32;
    return c + 273.15;
  }

  function convert(v, fromId, toId) {
    if (currentCat === "temp") return convertTemp(v, fromId, toId);
    if (currentCat === "currency") {
      var rate = parseFloat(elRate.value);
      if (!isFinite(rate) || rate <= 0) return null;
      return v * rate; // rate = 1 from-unit in to-units
    }
    var f = factorOf(currentCat, fromId);
    var t = factorOf(currentCat, toId);
    return v * f / t;
  }

  function fillSelects() {
    var keepFrom = elFromUnit.value;
    var keepTo = elToUnit.value;
    elFromUnit.innerHTML = "";
    elToUnit.innerHTML = "";
    CATS[currentCat].units.forEach(function (u, idx) {
      var label = I18N.unitLabel(u.id);
      var o1 = new Option(label, u.id);
      var o2 = new Option(label, u.id);
      elFromUnit.add(o1);
      elToUnit.add(o2);
      if (u.id === keepFrom) elFromUnit.value = u.id;
      if (u.id === keepTo) elToUnit.value = u.id;
    });
    // sensible defaults per category
    if (elFromUnit.selectedIndex < 0) elFromUnit.selectedIndex = 0;
    if (elToUnit.selectedIndex < 0) elToUnit.selectedIndex = Math.min(1, CATS[currentCat].units.length - 1);
  }

  function updateRateRow() {
    var isCurrency = currentCat === "currency";
    if (isCurrency) {
      elRateRow.classList.remove("hidden");
      elRateLabel.textContent = I18N.trFmt("rateHint", {
        from: I18N.unitLabel(elFromUnit.value),
        to: I18N.unitLabel(elToUnit.value)
      });
    } else {
      elRateRow.classList.add("hidden");
    }
  }

  function renderFacts(out, fromId, toId) {
    elFacts.innerHTML = "";
    if (currentCat === "temp" || currentCat === "currency") return;

    var f = factorOf(currentCat, fromId);
    var t = factorOf(currentCat, toId);
    if (!f || !t) return;

    var ratio = f / t;             // 1 from = ratio to
    var rev = 1 / ratio;           // 1 to = rev from

    var d1 = document.createElement("div");
    d1.textContent = "1 " + I18N.unitLabel(fromId) + " = " +
      I18N.fmtNum(ratio, 6) + " " + I18N.unitLabel(toId);

    var d2 = document.createElement("div");
    d2.textContent = "1 " + I18N.unitLabel(toId) + " = " +
      I18N.fmtNum(rev, 6) + " " + I18N.unitLabel(fromId);

    elFacts.appendChild(d1);
    elFacts.appendChild(d2);
  }

  function recompute() {
    elError.classList.add("hidden");
    var raw = elFromVal.value.trim();
    var v = parseFloat(raw);
    var fromId = elFromUnit.value;
    var toId = elToUnit.value;

    updateRateRow();

    if (raw === "" || !isFinite(v)) {
      elToVal.value = "";
      elFacts.innerHTML = "";
      if (raw !== "") showError(I18N.t("errConv"));
      return;
    }

    if (currentCat === "currency" && !(parseFloat(elRate.value) > 0)) {
      elToVal.value = "";
      elFacts.innerHTML = "";
      showError(I18N.t("errConvRate"));
      return;
    }

    var out = convert(v, fromId, toId);
    if (out === null || !isFinite(out)) {
      elToVal.value = "";
      return;
    }
    elToVal.value = I18N.fmtRaw(out, 6);
    renderFacts(out, fromId, toId);
  }

  function showError(msg) {
    elError.textContent = msg;
    elError.classList.remove("hidden");
  }

  function setCategory(cat) {
    currentCat = cat;
    elCats.querySelectorAll(".cat").forEach(function (b) {
      b.classList.toggle("active", b.dataset.cat === cat);
    });
    fillSelects();
    updateRateRow();
    recompute();
  }

  function init() {
    elFromVal = document.getElementById("convFromVal");
    elFromUnit = document.getElementById("convFromUnit");
    elToUnit = document.getElementById("convToUnit");
    elToVal = document.getElementById("convToVal");
    elFacts = document.getElementById("convFacts");
    elError = document.getElementById("convError");
    elRateRow = document.getElementById("convRateRow");
    elRateLabel = document.getElementById("convRateLabel");
    elRate = document.getElementById("convRate");
    elCats = document.getElementById("convCats");

    elCats.addEventListener("click", function (ev) {
      var btn = ev.target.closest("button.cat");
      if (btn) setCategory(btn.dataset.cat);
    });

    elFromVal.addEventListener("input", recompute);
    elFromUnit.addEventListener("change", recompute);
    elToUnit.addEventListener("change", recompute);
    elRate.addEventListener("input", recompute);

    document.getElementById("btnSwap").addEventListener("click", function () {
      var tmp = elFromUnit.value;
      elFromUnit.value = elToUnit.value;
      elToUnit.value = tmp;
      // in currency mode the rate meaning flips: invert it so the math stays right
      if (currentCat === "currency") {
        var r = parseFloat(elRate.value);
        if (isFinite(r) && r > 0) elRate.value = String(1 / r);
      }
      updateRateRow();
      recompute();
    });

    fillSelects();
  }

  function onLanguageChange() {
    var keepFrom = elFromUnit.value;
    var keepTo = elToUnit.value;
    fillSelects();
    elFromUnit.value = keepFrom;
    elToUnit.value = keepTo;
    updateRateRow();
    recompute();
  }

  window.Conv = { init: init, onLanguageChange: onLanguageChange };
  window.Conv.demo = function () {
    setCategory("weight");
    elFromUnit.value = "uTola";
    elToUnit.value = "uKg";
    elFromVal.value = "10";
    updateRateRow();
    recompute();
  };
})();
