
const products = [
  {
    id: 1,
    name: "Classic Sneakers",
    category: "Fashion",
    price: 1999,
    oldPrice: 2499,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    name: "Smart Watch",
    category: "Tech",
    price: 2999,
    oldPrice: 3999,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    name: "Travel Backpack",
    category: "Bags",
    price: 1499,
    oldPrice: 1999,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4,
    name: "Wireless Headphones",
    category: "Tech",
    price: 1799,
    oldPrice: 2499,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 5,
    name: "Sunglasses",
    category: "Fashion",
    price: 899,
    oldPrice: 1199,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 6,
    name: "Desk Lamp",
    category: "Lifestyle",
    price: 1299,
    oldPrice: 1599,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 7,
    name: "Canvas Tote Bag",
    category: "Bags",
    price: 599,
    oldPrice: 799,
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 8,
    name: "Water Bottle",
    category: "Lifestyle",
    price: 749,
    oldPrice: 999,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80"
  }
];

const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartSubtotal = document.getElementById("cartSubtotal");
const cartDrawer = document.getElementById("cartDrawer");
const cartBackdrop = document.getElementById("cartBackdrop");
const cartEmpty = document.getElementById("cartEmpty");
const cartSummary = document.getElementById("cartSummary");
const toast = document.getElementById("toast");

let activeCategory = "All";
let cart = loadCart();
let toastTimer;


function formatPrice(price) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(price);
}


function loadCart() {
  try {
    const saved = JSON.parse(
      localStorage.getItem("shopvibe-cart") || "[]"
    );

    if (!Array.isArray(saved)) return [];

    return saved.filter(item =>
      products.some(p => p.id === item.id) &&
      Number.isInteger(item.quantity) &&
      item.quantity > 0
    );
  } catch {
    return [];
  }
}

// Save cart to browser storage
function saveCart() {
  localStorage.setItem(
    "shopvibe-cart",
    JSON.stringify(cart)
  );
}

// Display products on the page
function displayProducts() {
  const searchText = searchInput.value
    .trim()
    .toLowerCase();

  const filteredProducts = products.filter(product => {
    const matchesCategory =
      activeCategory === "All" ||
      product.category === activeCategory;

    const matchesSearch =
      product.name.toLowerCase().includes(searchText) ||
      product.category.toLowerCase().includes(searchText);

    return matchesCategory && matchesSearch;
  });

  productGrid.innerHTML = filteredProducts.map(product => `
    <article class="product-card">
      <div class="product-image-wrap">
        <img
          class="product-image"
          src="${product.image}"
          alt="${product.name}"
          loading="lazy"
        >
      </div>

      <div class="product-info">
        <p class="product-category">${product.category}</p>
        <h3>${product.name}</h3>

        <div class="price-row">
          <span class="price">
            ${formatPrice(product.price)}
          </span>
          <span class="old-price">
            ${formatPrice(product.oldPrice)}
          </span>
        </div>

        <p class="rating">
          ★★★★★ <span>${product.rating}/5</span>
        </p>

        <button class="add-button" data-add="${product.id}">
          Add to Cart
        </button>
      </div>
    </article>
  `).join("");

  document.getElementById("resultCount").textContent =
    `${filteredProducts.length} products`;

  document.getElementById("emptyState").hidden =
    filteredProducts.length > 0;
}


function addToCart(id) {
  const existingItem = cart.find(item => item.id === id);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ id: id, quantity: 1 });
  }

  saveCart();
  updateCart();

  const product = products.find(p => p.id === id);
  showToast(product.name + " added to cart!");
}

// Update cart items, quantity and subtotal
function updateCart() {
  const totalQuantity = cart.reduce(
    (sum, item) => sum + item.quantity, 0
  );

  const subtotal = cart.reduce((sum, item) => {
    const product = products.find(p => p.id === item.id);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  cartCount.textContent = totalQuantity;
  document.getElementById("drawerCount").textContent =
    `(${totalQuantity})`;

  cartSubtotal.textContent = formatPrice(subtotal);

  cartEmpty.classList.toggle("show", cart.length === 0);
  cartSummary.style.display =
    cart.length === 0 ? "none" : "block";

  cartItems.style.display =
    cart.length === 0 ? "none" : "block";

  cartItems.innerHTML = cart.map(item => {
    const product = products.find(p => p.id === item.id);

    return `
      <article class="cart-item">
        <img src="${product.image}" alt="${product.name}">

        <div>
          <h3>${product.name}</h3>
          <p class="price">${formatPrice(product.price)}</p>

          <div class="quantity-control">
            <button
              data-quantity="${product.id}"
              data-change="-1"
              aria-label="Decrease quantity">−</button>

            <span>${item.quantity}</span>

            <button
              data-quantity="${product.id}"
              data-change="1"
              aria-label="Increase quantity">+</button>
          </div>
        </div>

        <button class="remove-item"
          data-remove="${product.id}"
          aria-label="Remove product">✕</button>
      </article>
    `;
  }).join("");
}

// Change the quantity of a product
function changeQuantity(id, change) {
  const item = cart.find(item => item.id === id);
  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    cart = cart.filter(item => item.id !== id);
  }

  saveCart();
  updateCart();
}

// Show a temporary notification
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

// Product button clicks
productGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");

  if (button) {
    addToCart(Number(button.dataset.add));
  }
});

// Search products
searchInput.addEventListener("input", displayProducts);

// Filter products by category
document.getElementById("categoryList")
  .addEventListener("click", event => {
    const button = event.target.closest("[data-category]");
    if (!button) return;

    activeCategory = button.dataset.category;

    document.querySelectorAll(".category-chip")
      .forEach(chip => {
        chip.classList.toggle("active", chip === button);
      });

    displayProducts();
  });

// Open shopping cart
function openCart() {
  cartDrawer.classList.add("open");
  cartBackdrop.classList.add("show");

  cartDrawer.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

// Close shopping cart
function closeCart() {
  cartDrawer.classList.remove("open");
  cartBackdrop.classList.remove("show");

  cartDrawer.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

document.getElementById("openCart")
  .addEventListener("click", openCart);

document.getElementById("closeCart")
  .addEventListener("click", closeCart);

document.getElementById("continueShopping")
  .addEventListener("click", closeCart);

cartBackdrop.addEventListener("click", closeCart);

// Cart quantity and remove buttons
cartItems.addEventListener("click", event => {
  const quantityButton =
    event.target.closest("[data-quantity]");

  const removeButton =
    event.target.closest("[data-remove]");

  if (quantityButton) {
    changeQuantity(
      Number(quantityButton.dataset.quantity),
      Number(quantityButton.dataset.change)
    );
  }

  if (removeButton) {
    const id = Number(removeButton.dataset.remove);

    cart = cart.filter(item => item.id !== id);

    saveCart();
    updateCart();
    showToast("Product removed from cart");
  }
});

// Clear the entire cart
document.getElementById("clearCart")
  .addEventListener("click", () => {
    cart = [];
    saveCart();
    updateCart();
    showToast("Cart cleared");
  });

// Demo checkout
const modal = document.getElementById("modalBackdrop");

document.getElementById("checkoutButton")
  .addEventListener("click", () => {
    closeCart();
    modal.classList.add("show");
    document.body.style.overflow = "hidden";
  });

function closeModal() {
  modal.classList.remove("show");
  document.body.style.overflow = "";
}

document.getElementById("closeModal")
  .addEventListener("click", closeModal);

document.getElementById("finishCheckout")
  .addEventListener("click", closeModal);

modal.addEventListener("click", event => {
  if (event.target === modal) closeModal();
});

// Newsletter form
document.getElementById("newsletterForm")
  .addEventListener("submit", event => {
    event.preventDefault();

    showToast("Thank you for subscribing!");

    event.target.reset();
  });

// Mobile navigation
document.getElementById("menuToggle")
  .addEventListener("click", () => {
    document.getElementById("navigation")
      .classList.toggle("open");
  });

document.querySelectorAll(".navigation a")
  .forEach(link => {
    link.addEventListener("click", () => {
      document.getElementById("navigation")
        .classList.remove("open");
    });
  });

// Close overlays using Escape
document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeCart();
    closeModal();
  }
});

// Initialize the website
displayProducts();
updateCart();
