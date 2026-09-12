/* ============================================================
   zakat.js — nisab check, 2.5% amount, breakdown
   Exposes: window.Zakat
   ============================================================ */
(function () {
  "use strict";

  var ids = ["zkCash", "zkGold", "zkSilver", "zkBiz", "zkLend", "zkDebt", "zkGoldRate", "zkSilverRate"];
  var el = {};
  var elBtn, elResult, elError, elVerdict, elAmount, elTable;

  function num(id) {
    var v = parseFloat(el[id].value);
    return isFinite(v) && v > 0 ? v : 0;
  }

  function calculate() {
    elError.classList.add("hidden");
    elResult.classList.add("hidden");

    var cash = num("zkCash");
    var goldG = num("zkGold");
    var silverG = num("zkSilver");
    var biz = num("zkBiz");
    var lend = num("zkLend");
    var debt = num("zkDebt");
    var goldRate = num("zkGoldRate");
    var silverRate = num("zkSilverRate");

    if (goldRate <= 0 || silverRate <= 0) {
      showError(I18N.t("errZakatRates"));
      return;
    }
    if (debt > cash + goldG * goldRate + silverG * silverRate + biz + lend) {
      showError(I18N.t("errZakatNeg"));
      return;
    }

    var goldValue = goldG * goldRate;
    var silverValue = silverG * silverRate;
    var nisab = 612.36 * silverRate;        // silver standard: 612.36 g silver
    var wealth = cash + goldValue + silverValue + biz + lend - debt;

    var due = wealth >= nisab;
    var zakat = due ? wealth * 0.025 : 0;

    elVerdict.textContent = due ? "✅ " + I18N.t("zkDue") : "ℹ️ " + I18N.t("zkNotDue");
    elAmount.textContent = I18N.t("zkAmount") + ": " + I18N.fmtNum(zakat, 2);

    // breakdown table
    var rows = [
      [I18N.t("zkCash"), I18N.fmtNum(cash, 2)],
      [I18N.t("zkGoldRow"), I18N.fmtNum(goldValue, 2)],
      [I18N.t("zkSilverRow"), I18N.fmtNum(silverValue, 2)],
      [I18N.t("zkBiz"), I18N.fmtNum(biz, 2)],
      [I18N.t("zkLend"), I18N.fmtNum(lend, 2)],
      [I18N.t("zkDebt") + " (−)", I18N.fmtNum(debt, 2)],
      [I18N.t("zkAssetsRow"), I18N.fmtNum(wealth, 2)],
      [I18N.t("zkNisabRow"), I18N.fmtNum(nisab, 2)]
    ];
    elTable.innerHTML = "";
    rows.forEach(function (r) {
      var tr = document.createElement("tr");
      var td1 = document.createElement("td");
      td1.textContent = r[0];
      var td2 = document.createElement("td");
      td2.textContent = r[1];
      tr.appendChild(td1);
      tr.appendChild(td2);
      elTable.appendChild(tr);
    });

    elResult.classList.remove("hidden");
  }

  function showError(msg) {
    elError.textContent = msg;
    elError.classList.remove("hidden");
  }

  function init() {
    ids.forEach(function (id) { el[id] = document.getElementById(id); });
    elBtn = document.getElementById("btnCalcZakat");
    elResult = document.getElementById("zakatResult");
    elError = document.getElementById("zakatError");
    elVerdict = document.getElementById("zakatVerdict");
    elAmount = document.getElementById("zakatAmount");
    elTable = document.getElementById("zakatTable");

    // sensible default rates (PKR per gram, editable)
    el["zkGoldRate"].value = "24000";
    el["zkSilverRate"].value = "90";

    elBtn.addEventListener("click", calculate);
  }

  function onLanguageChange() {
    if (!elResult.classList.contains("hidden")) calculate();
  }

  window.Zakat = { init: init, onLanguageChange: onLanguageChange };
  window.Zakat.demo = function () {
    el["zkCash"].value = "250000";
    el["zkGold"].value = "40";
    el["zkSilver"].value = "500";
    el["zkGoldRate"].value = "24000";
    el["zkSilverRate"].value = "90";
    calculate();
  };
})();
