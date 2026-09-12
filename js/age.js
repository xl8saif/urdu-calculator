/* ============================================================
   age.js — age in years/months/days, totals, next birthday
   Exposes: window.AgeCalc
   ============================================================ */
(function () {
  "use strict";

  var elDob, elBtn, elResult, elError;
  var elMain, elMonths, elWeeks, elDays, elBday;

  function pad(n) { return String(n); }

  function daysInMonth(y, m) { // m: 0-based month
    return new Date(y, m + 1, 0).getDate();
  }

  // Whole years/months/days between two dates
  function diffYMD(from, to) {
    var y = to.getFullYear() - from.getFullYear();
    var m = to.getMonth() - from.getMonth();
    var d = to.getDate() - from.getDate();

    if (d < 0) {
      m -= 1;
      d += daysInMonth(
        to.getMonth() === 0 ? to.getFullYear() - 1 : to.getFullYear(),
        to.getMonth() === 0 ? 11 : to.getMonth() - 1
      );
    }
    if (m < 0) { y -= 1; m += 12; }
    return { y: y, m: m, d: d };
  }

  function nextBirthdayInfo(dob, today) {
    // build this year's birthday
    var y = today.getFullYear();
    var candidate = new Date(y, dob.getMonth(), dob.getDate());
    // Feb 29 → Mar 1 on non-leap years
    if (dob.getMonth() === 1 && dob.getDate() === 29 &&
        candidate.getMonth() !== 1) {
      candidate = new Date(y, 2, 1);
    }
    var isToday = candidate.getTime() ===
      new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();

    if (!isToday && candidate < today) {
      y += 1;
      candidate = new Date(y, dob.getMonth(), dob.getDate());
      if (dob.getMonth() === 1 && dob.getDate() === 29 &&
          candidate.getMonth() !== 1) {
        candidate = new Date(y, 2, 1);
      }
    }
    var diffDays = Math.round(
      (candidate - new Date(today.getFullYear(), today.getMonth(), today.getDate()))
      / 86400000
    );
    return { isToday: isToday, days: diffDays, date: candidate };
  }

  function weekdayName(date) {
    var keys = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    var day = date.getDay();
    var key = "wd" + ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][day];
    return I18N.t(key);
  }

  function calculate() {
    var v = elDob.value;
    elError.classList.add("hidden");
    elResult.classList.add("hidden");
    if (!v) { showError(I18N.t("errAge")); return; }

    var parts = v.split("-");
    var dob = new Date(+parts[0], +parts[1] - 1, +parts[2]);
    var today = new Date();

    if (isNaN(dob.getTime())) { showError(I18N.t("errAge")); return; }
    if (dob > today) { showError(I18N.t("errFuture")); return; }

    var r = diffYMD(dob, today);
    elMain.textContent =
      I18N.fmtDigits(pad(r.y)) + " " + I18N.t("ageYears") + " " +
      I18N.fmtDigits(pad(r.m)) + " " + I18N.t("ageMonths") + " " +
      I18N.fmtDigits(pad(r.d)) + " " + I18N.t("ageDays");

    var totalDays = Math.floor((today - dob) / 86400000);
    elMonths.textContent = I18N.fmtNum(r.y * 12 + r.m, 0);
    elWeeks.textContent = I18N.fmtNum(Math.floor(totalDays / 7), 0);
    elDays.textContent = I18N.fmtNum(totalDays, 0);

    var nb = nextBirthdayInfo(dob, today);
    if (nb.isToday) {
      elBday.textContent = I18N.t("bdayToday");
    } else {
      elBday.textContent = I18N.trFmt("bdayIn", {
        n: I18N.fmtDigits(String(nb.days)),
        day: weekdayName(nb.date)
      });
    }

    elResult.classList.remove("hidden");
  }

  function showError(msg) {
    elError.textContent = msg;
    elError.classList.remove("hidden");
  }

  function init() {
    elDob = document.getElementById("dobInput");
    elBtn = document.getElementById("btnCalcAge");
    elResult = document.getElementById("ageResult");
    elError = document.getElementById("ageError");
    elMain = document.getElementById("ageMain");
    elMonths = document.getElementById("ageMonths");
    elWeeks = document.getElementById("ageWeeks");
    elDays = document.getElementById("ageDays");
    elBday = document.getElementById("ageBday");

    elBtn.addEventListener("click", calculate);
    elDob.addEventListener("change", calculate);

    // cap the date picker at today
    elDob.max = new Date().toISOString().slice(0, 10);
  }

  function onLanguageChange() {
    // re-render last result if visible
    if (!elResult.classList.contains("hidden")) calculate();
  }

  window.AgeCalc = { init: init, onLanguageChange: onLanguageChange };
  window.AgeCalc.demo = function () {
    elDob.value = "2000-01-15";
    calculate();
  };
})();
