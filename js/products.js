/* ================================================
   products.js — Product Data + Card Rendering
   ================================================ */

const PRODUCTS = [
  {
    id: 1,
    name: "Apple iPhone 15 Pro Max (256GB) — Natural Titanium",
    image: "https://m.media-amazon.com/images/I/61bK6PMOC3L._AC_SY450_.jpg",
    fallback: "https://placehold.co/160x160?text=iPhone+15+Pro",
    originalPrice: 149999,
    salePrice: 14999,
    rating: "★★★★★",
    reviews: "12,847",
    discount: "90%"
  },
  {
    id: 2,
    name: "Apple MacBook Air M3 (13-inch, 8GB RAM, 256GB SSD)",
    image: "https://m.media-amazon.com/images/I/71vFKBpKakL._AC_SY450_.jpg",
    fallback: "https://placehold.co/160x160?text=MacBook+Air+M3",
    originalPrice: 114900,
    salePrice: 11490,
    rating: "★★★★★",
    reviews: "9,312",
    discount: "90%"
  },
  {
    id: 3,
    name: "Samsung Galaxy S24 Ultra (12GB RAM, 256GB, Titanium Black)",
    image: "https://m.media-amazon.com/images/I/71Sa3dqTqzL._AC_SY450_.jpg",
    fallback: "https://placehold.co/160x160?text=Galaxy+S24+Ultra",
    originalPrice: 129999,
    salePrice: 12999,
    rating: "★★★★☆",
    reviews: "7,521",
    discount: "90%"
  },
  {
    id: 4,
    name: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
    image: "https://m.media-amazon.com/images/I/61pMP+ACBXL._AC_SY450_.jpg",
    fallback: "https://placehold.co/160x160?text=Sony+WH-1000XM5",
    originalPrice: 29990,
    salePrice: 2999,
    rating: "★★★★★",
    reviews: "18,204",
    discount: "90%"
  },
  {
    id: 5,
    name: "Apple iPad Pro M4 (11-inch, Wi-Fi, 256GB) — Space Black",
    image: "https://m.media-amazon.com/images/I/71KS-J4OKCL._AC_SY450_.jpg",
    fallback: "https://placehold.co/160x160?text=iPad+Pro+M4",
    originalPrice: 99900,
    salePrice: 9990,
    rating: "★★★★★",
    reviews: "5,631",
    discount: "90%"
  },
  {
    id: 6,
    name: "Sony PlayStation 5 Console (Disc Edition) — White",
    image: "https://m.media-amazon.com/images/I/51Gh0HxJTQL._AC_SY450_.jpg",
    fallback: "https://placehold.co/160x160?text=PS5",
    originalPrice: 54990,
    salePrice: 5499,
    rating: "★★★★★",
    reviews: "32,100",
    discount: "90%"
  },
  {
    id: 7,
    name: "boAt Rockerz 550 Bluetooth Wireless Headphones",
    image: "https://m.media-amazon.com/images/I/61p3CTGBzLL._AC_SY450_.jpg",
    fallback: "https://placehold.co/160x160?text=boAt+Rockerz",
    originalPrice: 3990,
    salePrice: 399,
    rating: "★★★★☆",
    reviews: "41,200",
    discount: "90%"
  },
  {
    id: 8,
    name: "OnePlus 12 5G (16GB RAM, 512GB, Flowy Emerald)",
    image: "https://m.media-amazon.com/images/I/71e8uNJGBEL._AC_SY450_.jpg",
    fallback: "https://placehold.co/160x160?text=OnePlus+12",
    originalPrice: 64999,
    salePrice: 6499,
    rating: "★★★★☆",
    reviews: "6,820",
    discount: "90%"
  }
];

// Render all product cards into the grid
function renderProducts() {
  const container = document.getElementById('products-container');
  if (!container) return;

  container.innerHTML = PRODUCTS.map(p => `
    <div class="card" onclick="addToCart(${p.id})">
      <div class="badge">${p.discount} OFF</div>
      <img
        src="${p.image}"
        alt="${p.name}"
        onerror="this.src='${p.fallback}'"
      >
      <h3>${p.name}</h3>
      <div class="rating">
        ${p.rating}
        <span>(${p.reviews})</span>
      </div>
      <div class="price">₹${p.salePrice.toLocaleString('en-IN')}</div>
      <div class="original">M.R.P: ₹${p.originalPrice.toLocaleString('en-IN')}</div>
      <div class="discount">Save ₹${(p.originalPrice - p.salePrice).toLocaleString('en-IN')} (${p.discount})</div>
      <div class="prime">✔ Prime FREE Delivery</div>
      <button class="add-cart-btn">Add to Cart</button>
    </div>
  `).join('');
}

// Run on page load
renderProducts();
