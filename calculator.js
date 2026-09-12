/* ============================================================
   calculator.js — expression engine + keypad + history
   Exposes: window.Calc
   ============================================================ */
(function () {
  "use strict";

  // ---- state ----
  var expr = [];          // tokens: {t:'num', v:'123'} | {t:'op', v:'+'} | {t:'pct'}
  var lastResult = null;  // numeric value of last computed answer
  var lastResultRaw = null; // formatted string of last result (for re-render on digit toggle)
  var justEvaluated = false;
  var history = [];       // {exprStr, resultNum, resultStr}
  var historyOpen = false;
  var LS_HIST = "uc_hist";

  var elExpr, elResult, elHistoryStrip, elHistoryPanel, elHistoryList;

  // ---------- display helpers ----------

  function tokenToDisplay(tok) {
    if (tok.t === "op") return tok.v;
    if (tok.t === "pct") return I18N.t("keyPct");
    return tok.v.replace(/\./g, I18N.decimalSep());
  }

  function displayStringOf(toks) {
    return I18N.fmtDigits(rawStringOf(toks));
  }

  function rawStringOf(toks) {
    return toks.map(tokenToDisplay).join("");
  }

  function renderExpr() {
    var s = expr.length ? displayStringOf(expr) : I18N.fmtDigits("0");
    elExpr.textContent = s;
    // numbers read better LTR even inside an RTL page
    if (I18N.getLang() === "ur") elExpr.setAttribute("dir", "ltr");
    else elExpr.removeAttribute("dir");
  }

  // ---------- evaluation ----------

  function applyOp(op, b, a) {
    switch (op) {
      case "+": return a + b;
      case "-": return a - b;
      case "*": return a * b;
      case "/":
        if (b === 0) throw { divZero: true };
        return a / b;
    }
    throw { divZero: false };
  }

  function rawOp(tok) {
    if (tok.v === "−") return "-";
    if (tok.v === "×") return "*";
    if (tok.v === "÷") return "/";
    if (tok.v === "+") return "+";
    throw { badOp: tok.v };
  }

  // Expand % tokens into concrete numbers, then evaluate with precedence.
  //   a + b% = a + (a×b/100)   a − b% = a − (a×b/100)
  //   a × b% , a ÷ b%          → b/100
  //   standalone 50%           → 0.5
  // The additive base is the evaluated prefix before the pending operator,
  // so chains like 100+10%+20% compound like mainstream calculators.
  function evaluateClean(tokens) {
    var t = tokens.map(function (tk) { return { t: tk.t, v: tk.v }; });

    var expanded = [];
    for (var i = 0; i < t.length; i++) {
      var tk = t[i];
      if (tk.t !== "pct") { expanded.push(tk); continue; }

      // number directly before the %, and the operator before that number
      var numTok = null;
      var opIdx = -1;
      for (var j = expanded.length - 1; j >= 0; j--) {
        if (expanded[j].t === "num") { numTok = expanded[j]; opIdx = j - 1; break; }
        if (expanded[j].t === "op") break;
      }
      if (!numTok) continue; // % without a number: ignore

      var b = parseFloat(numTok.v);
      var prevOp = opIdx >= 0 && expanded[opIdx] && expanded[opIdx].t === "op" ? expanded[opIdx] : null;
      var opRaw = prevOp ? rawOp(prevOp) : null;

      if (opRaw === "+" || opRaw === "-") {
        var base = computeTokens(expanded.slice(0, opIdx));
        numTok.v = String(base * b / 100);
      } else {
        numTok.v = String(b / 100);
      }
    }

    // collapse to values + operators
    var vals = [];
    var ops = [];
    var cur = null;
    for (var k = 0; k < expanded.length; k++) {
      var e = expanded[k];
      if (e.t === "num") cur = parseFloat(e.v);
      else if (e.t === "op") { vals.push(cur); ops.push(rawOp(e)); cur = null; }
    }
    vals.push(cur);

    // pass 1: × and ÷
    var vals1 = [vals[0]];
    var ops1 = [];
    for (var p = 1; p < vals.length; p++) {
      var op = ops[p - 1];
      if (op === "*" || op === "/") {
        vals1[vals1.length - 1] = applyOp(op, vals[p], vals1[vals1.length - 1]);
      } else {
        vals1.push(vals[p]);
        ops1.push(op);
      }
    }

    // pass 2: + and −
    var acc = vals1[0];
    for (var q = 1; q < vals1.length; q++) {
      acc = applyOp(ops1[q - 1], vals1[q], acc);
    }
    return acc;
  }

  function computeTokens(toks) {
    var val = evaluateClean(toks);
    if (typeof val !== "number" || !isFinite(val)) throw { divZero: true };
    return val;
  }

  // ---------- input handlers ----------

  function inputNum(d) {
    if (justEvaluated) { expr = []; justEvaluated = false; }
    var last = expr[expr.length - 1];
    if (last && last.t === "num") {
      if (last.v === "0" && d !== ".") last.v = d;
      else if (last.v === "0" && d === ".") last.v = "0.";
      else last.v += d;
    } else {
      expr.push({ t: "num", v: d === "." ? "0." : d });
    }
    render();
  }

  function inputOp(opChar) {
    if (justEvaluated) justEvaluated = false;
    if (!expr.length) {
      // continuing from a previous answer
      if (lastResult !== null) {
        expr.push({ t: "num", v: String(lastResult) });
        expr.push({ t: "op", v: opChar });
        render();
      }
      return;
    }
    var last = expr[expr.length - 1];
    if (last.t === "op") {
      last.v = opChar; // replace the pending operator
    } else {
      expr.push({ t: "op", v: opChar });
    }
    render();
  }

  function inputPct() {
    var last = expr[expr.length - 1];
    if (!last || last.t !== "num") return;
    expr.push({ t: "pct" });
    render();
  }

  function inputDot() {
    if (justEvaluated) { expr = []; justEvaluated = false; }
    var last = expr[expr.length - 1];
    if (last && last.t === "num") {
      if (last.v.indexOf(".") >= 0) return; // already has a decimal point
      last.v += ".";
    } else {
      expr.push({ t: "num", v: "0." });
    }
    render();
  }

  function toggleSign() {
    var last = expr[expr.length - 1];
    if (!last || last.t !== "num") return;
    justEvaluated = false;
    if (last.v.charAt(0) === "-") last.v = last.v.slice(1);
    else last.v = "-" + last.v;
    render();
  }

  function backspace() {
    if (justEvaluated) { expr = []; justEvaluated = false; render(); return; }
    var last = expr[expr.length - 1];
    if (!last) return;
    if (last.t === "num" && last.v.length > 1) {
      last.v = last.v.slice(0, -1);
      if (last.v === "-") expr.pop();
    } else {
      expr.pop();
    }
    render();
  }

  function clearAll() {
    expr = [];
    justEvaluated = false;
    lastResultRaw = null;
    elResult.textContent = "\u00A0";
    elResult.style.color = "";
    render();
  }

  function equals() {
    if (!expr.length) return;
    var hasOp = expr.some(function (tk) { return tk.t === "op"; });
    var hasPct = expr.some(function (tk) { return tk.t === "pct"; });
    if (!hasOp && !hasPct) return;
    // trailing operator: drop it
    var toks = expr.slice();
    while (toks.length && toks[toks.length - 1].t === "op") toks.pop();

    try {
      var val = computeTokens(toks);
      var raw = I18N.fmtRaw(val, 10);
      var rawExpr = rawStringOf(toks);
      lastResult = val;
      lastResultRaw = raw;
      pushHistory(rawExpr, val, raw);
      elExpr.textContent = I18N.fmtDigits(rawExpr);
      elResult.textContent = "= " + I18N.fmtDigits(raw);
      expr = [{ t: "num", v: String(val) }];
      justEvaluated = true;
    } catch (e) {
      showError(I18N.t("divZero"));
    }
  }

  function showError(msg) {
    elResult.textContent = msg;
    elResult.style.color = "var(--red)";
    expr = [];
    justEvaluated = false;
    lastResultRaw = null;
    renderExpr();
    setTimeout(function () {
      elResult.textContent = "\u00A0";
      elResult.style.color = "";
    }, 2500);
  }

  // ---------- history ----------

  function pushHistory(exprStr, resultNum, resultStr) {
    history.unshift({ exprStr: exprStr, resultNum: resultNum, resultStr: resultStr });
    if (history.length > 20) history.pop();
    saveHistory();
    renderHistory();
  }

  function renderHistory() {
    elHistoryList.innerHTML = "";
    history.forEach(function (h) {
      var li = document.createElement("li");
      var e = document.createElement("span");
      e.className = "h-expr";
      e.textContent = I18N.fmtDigits(h.exprStr);
      var r = document.createElement("span");
      r.textContent = "= " + I18N.fmtDigits(h.resultStr);
      li.appendChild(e);
      li.appendChild(r);
      li.addEventListener("click", function () {
        expr = [{ t: "num", v: String(h.resultNum) }];
        justEvaluated = false;
        elResult.textContent = "\u00A0";
        render();
      });
      elHistoryList.appendChild(li);
    });
    renderHistoryStrip();
  }

  function renderHistoryStrip() {
    elHistoryStrip.textContent = history.length
      ? I18N.t("ansPrefix") + ": " + I18N.fmtDigits(history[0].resultStr)
      : "";
  }

  function saveHistory() {
    try { localStorage.setItem(LS_HIST, JSON.stringify(history)); } catch (err) { /* private mode */ }
  }

  function loadHistory() {
    try {
      var raw = localStorage.getItem(LS_HIST);
      if (raw) history = JSON.parse(raw) || [];
    } catch (err) { history = []; }
  }

  // ---------- keyboard ----------

  function isTypingInField() {
    var a = document.activeElement;
    return !!(a && (a.tagName === "INPUT" || a.tagName === "SELECT" || a.tagName === "TEXTAREA"));
  }

  function onKey(e) {
    if (isTypingInField()) return;
    var k = e.key;
    if (k >= "0" && k <= "9") { inputNum(k); e.preventDefault(); }
    else if (k === "." || k === ",") { inputDot(); e.preventDefault(); }
    else if (k === "+") { inputOp("+"); e.preventDefault(); }
    else if (k === "-") { inputOp("−"); e.preventDefault(); }
    else if (k === "*" || k === "x" || k === "X") { inputOp("×"); e.preventDefault(); }
    else if (k === "/") { inputOp("÷"); e.preventDefault(); }
    else if (k === "%") { inputPct(); e.preventDefault(); }
    else if (k === "Enter" || k === "=") { equals(); e.preventDefault(); }
    else if (k === "Backspace") { backspace(); e.preventDefault(); }
    else if (k === "Escape") { clearAll(); e.preventDefault(); }
  }

  // ---------- init ----------

  function init() {
    elExpr = document.getElementById("calcExpr");
    elResult = document.getElementById("calcResult");
    elHistoryStrip = document.getElementById("calcHistory");
    elHistoryPanel = document.getElementById("historyPanel");
    elHistoryList = document.getElementById("historyList");

    loadHistory();
    renderHistory();
    render();

    document.getElementById("calcKeypad").addEventListener("click", function (ev) {
      var btn = ev.target.closest("button.key");
      if (!btn) return;
      if (btn.dataset.num !== undefined && btn.dataset.num !== "") inputNum(btn.dataset.num);
      else if (btn.dataset.op) inputOp(btn.dataset.op);
      else if (btn.dataset.act === "dot") inputDot();
      else if (btn.dataset.act === "equals") equals();
      else if (btn.dataset.act === "clear") clearAll();
      else if (btn.dataset.act === "sign") toggleSign();
      else if (btn.dataset.act === "percent") inputPct();
    });

    document.querySelectorAll(".calc-tools [data-act]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (btn.dataset.act === "history") toggleHistory();
        else if (btn.dataset.act === "back") backspace();
        else if (btn.dataset.act === "ans") {
          if (lastResult !== null) {
            expr = [{ t: "num", v: String(lastResult) }];
            justEvaluated = false;
            render();
          }
        }
      });
    });

    document.getElementById("btnClearHist").addEventListener("click", function () {
      history = [];
      saveHistory();
      renderHistory();
    });

    document.addEventListener("keydown", onKey);
  }

  function toggleHistory() {
    historyOpen = !historyOpen;
    elHistoryPanel.classList.toggle("hidden", !historyOpen);
  }

  function render() {
    renderExpr();
    renderHistoryStrip();
    if (justEvaluated && lastResultRaw !== null) {
      elResult.textContent = "= " + I18N.fmtDigits(lastResultRaw);
    }
  }

  // ---------- public API ----------

  window.Calc = {
    init: init,
    onLanguageChange: function () { if (elExpr) { render(); renderHistory(); } },
    computeTokens: computeTokens,
    demo: function () {
      // friendly pre-filled state for screenshots/deep links
      inputNum("1"); inputNum("2");
      inputOp("×");
      inputNum("4");
      equals();
    }
  };
})();
