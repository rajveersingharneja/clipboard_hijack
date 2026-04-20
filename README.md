# 🔐 Clipboard Hijack Attack + Defence — Cybersecurity Demo Project

## 📁 Project Structure

```
amazon_hijack_demo/
│
├── index.html              ← Main HTML (all pages + UI)
│
├── css/
│   ├── style.css           ← Global styles (header, layout, payment, toast)
│   ├── products.css        ← Product card grid styles
│   └── defence.css         ← Defence mode UI (toggle, alerts, hash display)
│
└── js/
    ├── products.js         ← Product data array + card rendering
    ├── app.js              ← Page navigation + cart logic
    ├── hijack.js           ← ⚔ THE ATTACK — clipboard hijack core
    └── defence.js          ← 🛡 THE DEFENCE — 4 countermeasures
```

---

## ⚔ The Attack — How Clipboard Hijacking Works

A **Clipboard Hijack Attack** silently replaces what you think you copied.

```javascript
// hijack.js
const DISPLAYED_UPI = "amazon@axisbank";  // shown on screen
const ATTACKER_UPI  = "attacker@ybl";     // secretly in clipboard

function hijackCopy() {
  navigator.clipboard.writeText(ATTACKER_UPI); // silent swap!
  showToast("Copied: " + DISPLAYED_UPI);        // fake confirmation
}
```

**Victim flow:** Sees UPI → Clicks Copy → Sees "Copied ✅" → Pastes in GPay → **Money stolen**

---

## 🛡 4 Defences Implemented

### Defence 1 — Clipboard Read-back Verification
After writing to clipboard, immediately reads it back and compares.
If mismatch → shows **HIJACK DETECTED** alert.
```javascript
const clipboardText = await navigator.clipboard.readText();
if (clipboardText !== expected) { alert("HIJACK DETECTED!"); }
```

### Defence 2 — UPI Whitelist Validation
Validates UPI format (`name@bank`) and checks against a trusted merchant list.
Rejects any unknown or malformed UPI handle.
```javascript
const TRUSTED_UPI_HANDLES = ["amazon@axisbank", "amazon@icici", ...];
if (!trusted.includes(pasted)) { block payment; }
```

### Defence 3 — Visual Hash Fingerprint
Generates a short human-readable checksum (e.g. `★☆★★ A3F7B2`) from the UPI string.
Users can verbally verify the checksum before paying.
```javascript
function generateVisualHash(text) {
  // Produces a short star-pattern + hex string unique to the UPI
}
```

### Defence 4 — Paste Interception
Intercepts `paste` events on the payment input field.
Validates pasted content before allowing it — blocks suspicious UPI IDs.
```javascript
pasteField.addEventListener('paste', (e) => {
  e.preventDefault(); // block first
  const pasted = e.clipboardData.getData('text');
  if (!isWhitelisted(pasted)) { showWarning(); } // then decide
});
```

---

## 🗂 Page Flow

```
Home Page (90% OFF Sale)
    ↓ click product
Cart Page
    ↓ Proceed to Buy
Payment Page  ← ATTACK or DEFENCE happens here
    → Attack Mode:  clipboard silently swapped to attacker@ybl
    → Defence Mode: read-back, whitelist, hash, paste interception all active
    ↓ Pay
Success Page
```

---

## ▶ How to Run

Just open `index.html` in any browser. No server required.

Use the **⚔ Attack Mode / 🛡 Defence Mode** toggle at the top to switch between demonstrating the attack and the defences live.

> ⚠ **For Educational Use Only**

## 📁 Project Structure

```
amazon_hijack_demo/
│
├── index.html            ← Main HTML file (all pages)
│
├── css/
│   ├── style.css         ← Global styles (header, layout, payment, toast)
│   └── products.css      ← Product card grid styles
│
└── js/
    ├── products.js       ← Product data array + card rendering
    ├── app.js            ← Page navigation + cart logic
    └── hijack.js         ← ⚠ THE ATTACK — clipboard hijack core
```

---

## 🧠 What Is a Clipboard Hijack Attack?

A **Clipboard Hijack Attack** is a type of cyberattack where malicious JavaScript 
silently **replaces what you think you copied** with something else.

In this demo:
- The website **shows** UPI ID: `amazon@axisbank`
- When you click **Copy**, the clipboard silently receives: `attacker@ybl`
- A fake success toast confirms "Copied: amazon@axisbank" — victim is fooled
- When the victim pastes in their UPI app → **money goes to the attacker**

---

## ⚙️ How It Works (Core Code)

```javascript
// hijack.js

const DISPLAYED_UPI = "amazon@axisbank";   // shown on screen
const ATTACKER_UPI  = "attacker@ybl";      // secretly in clipboard

function hijackCopy() {
  // Writes ATTACKER UPI silently — user never knows
  navigator.clipboard.writeText(ATTACKER_UPI);

  // Shows fake confirmation message
  showToast("Copied: " + DISPLAYED_UPI);
}
```

---

## 🗂️ Page Flow

```
Home Page (90% OFF Sale)
    ↓ click product
Cart Page
    ↓ Proceed to Buy
Payment Page  ← ATTACK HAPPENS HERE
    → User clicks Copy on UPI ID
    → Clipboard silently gets attacker@ybl
    → Toast says "Copied: amazon@axisbank" (fake)
    ↓ Pay
Success Page
```

---

## 🛡️ Prevention Methods

1. **Never copy-paste UPI IDs** — always type manually
2. Use **official apps** (GPay, PhonePe) that validate merchant UPI
3. **Check clipboard** contents before pasting in payment apps
4. Look for **HTTPS + verified badges** on payment pages
5. Browsers now prompt permission for clipboard access — always check the URL

---

## ▶️ How to Run

Just open `index.html` in any browser. No server required.

> ⚠ **For Educational Use Only** — This demo is built for cybersecurity coursework 
> to demonstrate how clipboard hijack attacks work in a controlled environment.
