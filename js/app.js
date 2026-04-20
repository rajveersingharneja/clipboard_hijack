/* ================================================
   app.js — Page Navigation & Cart Logic
   ================================================ */

function showPage(id) {
  document.querySelectorAll(".page").forEach(function(p) {
    p.classList.remove("active");
  });
  var target = document.getElementById("page-" + id);
  if (target) target.classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function addToCart(productId) {
  var product = PRODUCTS.find(function(p) { return p.id === productId; });
  if (!product) return;

  document.getElementById("cart-img").src       = product.image;
  document.getElementById("cart-img").onerror   = function() { this.src = product.fallback; };
  document.getElementById("cart-name").textContent  = product.name;
  document.getElementById("cart-price").textContent = "₹" + product.salePrice.toLocaleString("en-IN");
  document.getElementById("cart-total").textContent = "₹" + product.salePrice.toLocaleString("en-IN");
  document.getElementById("pay-amount").textContent  = product.salePrice.toLocaleString("en-IN");

  showPage("cart");
}

function selectMethod(type) {
  document.querySelectorAll(".pay-method").forEach(function(m) {
    m.classList.remove("selected");
  });
  if (type === "upi") {
    document.getElementById("upi-method").classList.add("selected");
    document.getElementById("upi-section").classList.add("show");
  } else {
    document.getElementById("upi-method").classList.remove("selected");
    document.getElementById("upi-section").classList.remove("show");
  }
}
