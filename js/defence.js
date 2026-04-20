/* ================================================
   defence.js — 4 Defences Against Clipboard Hijack
   ================================================ */

var defenceEnabled = false;


function toggleDefence(enable) {
  defenceEnabled = enable;

  var badge   = document.getElementById("defence-status");
  var btnAtk  = document.getElementById("mode-attack");
  var btnDef  = document.getElementById("mode-defence");
  var hashBox = document.getElementById("hash-display");
  var upiBox  = document.getElementById("upi-address-box");

  if (enable) {
    badge.textContent = "🛡 DEFENCE MODE — ON";
    badge.className   = "defence-badge on";
    btnAtk.classList.remove("active-mode");
    btnDef.classList.add("active-mode");
    upiBox.classList.add("secure");
    // Reset hash display
    if (hashBox) { hashBox.innerHTML = ""; hashBox.style.display = "none"; }
  } else {
    badge.textContent = "⚠ ATTACK MODE — Defence OFF";
    badge.className   = "defence-badge off";
    btnDef.classList.remove("active-mode");
    btnAtk.classList.add("active-mode");
    upiBox.classList.remove("secure");
    if (hashBox) { hashBox.innerHTML = ""; hashBox.style.display = "none"; }
  }
}

// ── Main Copy Button Handler ──────────────────────
// Called by the Copy button in index.html
function safeCopy() {
  if (!defenceEnabled) {
    // ATTACK MODE: hijack the clipboard
    doHijackCopy();
    return;
  }

  // DEFENCE MODE: copy the real UPI safely
  defence_doCopy();
}

// ── Defence Copy ──────────────────────────────────
function defence_doCopy() {
  var realUPI = DISPLAYED_UPI; // "amazon@axisbank"

  // Write REAL UPI to clipboard using execCommand (reliable, no permission needed)
  var ta = document.createElement("textarea");
  ta.value = realUPI;
  ta.style.cssText = "position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;";
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  var ok = false;
  try { ok = document.execCommand("copy"); } catch(e) {}
  document.body.removeChild(ta);

  // Also try modern API
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(realUPI)
      .then(function() { defence_verifyClipboard(realUPI); })
      .catch(function() {
        // Can't read back without permission, just show hash
        defence_showHashAndToast(realUPI, false);
      });
  } else {
    // No modern API — use hash only
    defence_showHashAndToast(realUPI, false);
  }
}

// ── Defence 1: Read-back Verification ────────────
function defence_verifyClipboard(expected) {
  if (navigator.clipboard && navigator.clipboard.readText) {
    navigator.clipboard.readText()
      .then(function(actual) {
        if (actual.trim() !== expected.trim()) {
          // MISMATCH — hijack detected!
          showDefenceAlert(
            "🚨 CLIPBOARD HIJACK DETECTED!",
            "Expected in clipboard:\n  " + expected +
            "\n\nActual clipboard contents:\n  " + actual +
            "\n\nYour clipboard was tampered!\nDO NOT paste this into your payment app.",
            "danger"
          );
        } else {
          // Match — safe!
          defence_showHashAndToast(expected, true);
        }
      })
      .catch(function() {
        // readText requires explicit permission — show hash without verification
        defence_showHashAndToast(expected, false);
      });
  } else {
    defence_showHashAndToast(expected, false);
  }
}

// ── Defence 3: Visual Hash Fingerprint ───────────
function defence_generateHash(text) {
  var h = 0;
  for (var i = 0; i < text.length; i++) {
    h = Math.imul(31, h) + text.charCodeAt(i) | 0;
  }
  var hex   = Math.abs(h).toString(16).toUpperCase().padStart(8,"0").slice(0,6);
  var stars = (Math.abs(h) % 16).toString(2).padStart(4,"0")
                .split("").map(function(b){ return b==="1"?"★":"☆"; }).join("");
  return stars + " " + hex;
}

function defence_showHashAndToast(upi, verified) {
  var hash   = defence_generateHash(upi);
  var hashBox = document.getElementById("hash-display");
  if (hashBox) {
    hashBox.innerHTML =
      '<span class="hash-label">🔑 Visual Checksum (Defence 3):</span>' +
      '<span class="hash-value">' + hash + '</span>' +
      '<span class="hash-hint">Ask the merchant to confirm this checksum matches</span>';
    hashBox.style.display = "flex";
  }

  var msg = verified
    ? "✅ Verified! Clipboard matches displayed UPI.\n" + upi + "\nChecksum: " + hash
    : "📋 Copied: " + upi + "\nChecksum: " + hash + "\n(Manual verify recommended)";

  showDefenceToast("success", msg);
}

// ── Defence 2 + 4: Paste Interception ────────────
// Attached to UPI input field — intercepts paste event
document.addEventListener("DOMContentLoaded", function() {
  var input = document.getElementById("upi-input");
  if (!input) return;

  input.addEventListener("paste", function(e) {
    if (!defenceEnabled) return; // only active in defence mode

    e.preventDefault();
    var pasted = (e.clipboardData || window.clipboardData).getData("text").trim();

    var result = defence_validateUPI(pasted);
    if (!result.valid) {
      // Block the paste and warn
      input.value = "";
      showDefenceAlert(
        "🚫 Paste Blocked! (Defence 4)",
        "Suspicious UPI detected in clipboard:\n  \"" + pasted + "\"\n\n" +
        result.reason +
        "\n\nThe paste was blocked to protect you.\nExpected: " + DISPLAYED_UPI,
        "danger"
      );
    } else {
      input.value = pasted;
      showDefenceToast("success", "✅ UPI Verified & Pasted Safely\n" + result.reason);
    }
  });
});

// ── Defence 2: UPI Whitelist Validation ──────────
var TRUSTED_UPIS = [
  "amazon@axisbank", "amazon@icici", "amazon@ybl",
  "amazon@oksbi",    "amazon@okaxis"
];

function defence_validateUPI(upi) {
  if (!upi) return { valid: false, reason: "UPI ID is empty." };
  var lower = upi.toLowerCase();
  var fmtOK = /^[a-z0-9._\-]+@[a-z]+$/.test(lower);
  if (!fmtOK) return { valid: false, reason: "Invalid UPI format. Must be name@bank." };
  if (TRUSTED_UPIS.indexOf(lower) === -1) {
    return { valid: false, reason: '"' + upi + '" is NOT in the trusted merchant list.\nOnly amazon@axisbank and similar are accepted.' };
  }
  return { valid: true, reason: "UPI verified against trusted merchant whitelist ✅" };
}

// ── Pay Button Handler ────────────────────────────
function validateAndPay() {
  if (!defenceEnabled) {
    showPage("success");
    return;
  }
  var typed = document.getElementById("upi-input").value.trim();
  if (typed) {
    var result = defence_validateUPI(typed);
    if (!result.valid) {
      showDefenceAlert("⛔ Payment Blocked!", result.reason, "danger");
      return;
    }
  }
  showPage("success");
}

// ── UI Helpers ────────────────────────────────────
function showDefenceToast(type, message) {
  var t = document.getElementById("defence-toast");
  if (!t) return;
  t.className   = "defence-toast show " + type;
  t.textContent = message;
  clearTimeout(window._defToastTimer);
  window._defToastTimer = setTimeout(function() { t.className = "defence-toast"; }, 5500);
}

function showDefenceAlert(title, message, type) {
  document.getElementById("defence-alert-title").textContent = title;
  document.getElementById("defence-alert-msg").textContent   = message;
  document.getElementById("defence-alert-box").className     = "defence-alert-box " + type;
  document.getElementById("defence-alert-overlay").style.display = "flex";
}

function closeDefenceAlert() {
  document.getElementById("defence-alert-overlay").style.display = "none";
}
