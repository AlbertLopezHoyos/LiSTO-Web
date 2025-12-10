// assets/js/cart.js

// Datos de productos (para evitar problemas de fetch en file://)
const PRODUCTS = [
  {
    id: "p1",
    name: "Menú del día",
    price: 10.0,
    description: "Plato casero completo del Comedor Popular.",
    image: "assets/img/productos/menu-dia.jpg",
  },
  {
    id: "p2",
    name: "Pan artesanal",
    price: 3.0,
    description: "Pan recién horneado, ideal para el desayuno.",
    image: "assets/img/productos/pan-artesanal.jpg",
  },
  {
    id: "p3",
    name: "Postre casero",
    price: 4.5,
    description: "Postres preparados en el comedor, variedad del día.",
    image: "assets/img/productos/postre-casero.jpg",
  },
  {
    id: "p4",
    name: "Pack despensa",
    price: 25.0,
    description: "Arroz, menestras y aceite para la semana.",
    image: "assets/img/productos/pack-despensa.jpg",
  },
  {
    id: "p5",
    name: "Plato para llevar",
    price: 8.0,
    description: "Ración para llevar y consumir luego.",
    image: "assets/img/productos/plato-llevar.jpg",
  },
  {
    id: "p6",
    name: "Menú solidario",
    price: 5.0,
    description: "Aporta directamente a un plato solidario.",
    image: "assets/img/productos/menu-solidario.jpg",
  },
];

const STORAGE_KEYS = {
  CART: "ls_cart",
  DONATION: "ls_donation",
  STATS: "ls_stats",
};

document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;

  if (page === "store") {
    initStorePage();
  }

  if (page === "impact") {
    renderImpactStats();
  }
});

/* ============= UTILIDADES DE CARRITO ============= */

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CART);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  // updateCartCount está definido en main.js
  if (typeof window.updateCartCount === "function") {
    window.updateCartCount();
  }
}

function findProduct(id) {
  return PRODUCTS.find((p) => p.id === id);
}

function calcSubtotal(cart) {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

/* ============= INICIALIZACIÓN DE LA PÁGINA TIENDA ============= */

function initStorePage() {
  renderProducts();
  setupCartListeners();      // listeners del tbody solo UNA vez
  setupDonationControls();   // radios y inputs de donación
  setupConfirmOrder();       // botón de confirmar
  renderCart();              // pintar carrito inicial
}

/* ============= RENDER DE PRODUCTOS ============= */

function renderProducts() {
  const grid = document.getElementById("productsGrid");
  if (!grid) return;

  grid.innerHTML = "";

  PRODUCTS.forEach((p) => {
    const card = document.createElement("article");
    card.className = "product-card";

    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <h3 class="product-name">${p.name}</h3>
      <p class="product-price">S/ ${p.price.toFixed(2)}</p>
      <p class="product-meta">${p.description}</p>
      <button class="btn-primary full-width" data-product-id="${p.id}">
        Agregar al carrito
      </button>
    `;

    grid.appendChild(card);
  });

  // Delegación de eventos para los botones "Agregar al carrito"
  grid.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-product-id]");
    if (!btn) return;
    const id = btn.getAttribute("data-product-id");
    addToCart(id);
  });
}

/* ============= GESTIÓN DE CARRITO ============= */

function addToCart(productId) {
  const product = findProduct(productId);
  if (!product) return;

  const cart = loadCart();
  const existing = cart.find((item) => item.id === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
    });
  }

  saveCart(cart);
  renderCart(); // actualiza tabla y totales
  // No mostramos alert ni confirm, solo actualizamos visualmente
}

function removeFromCart(productId) {
  let cart = loadCart();
  cart = cart.filter((item) => item.id !== productId);
  saveCart(cart);
  renderCart();
}

function updateQuantity(productId, newQty) {
  const qty = parseInt(newQty, 10);
  if (isNaN(qty) || qty <= 0) {
    removeFromCart(productId);
    return;
  }
  const cart = loadCart();
  const item = cart.find((i) => i.id === productId);
  if (item) {
    item.quantity = qty;
    saveCart(cart);
    renderCart();
  }
}

/* ============= LISTENERS DEL CARRITO (CAMBIO / ELIMINAR) ============= */

function setupCartListeners() {
  const tbody = document.getElementById("cartItems");
  if (!tbody) return;

  // Cambios en la cantidad
  tbody.addEventListener("change", (e) => {
    const input = e.target.closest("input[data-cart-id]");
    if (!input) return;
    const id = input.getAttribute("data-cart-id");
    updateQuantity(id, input.value);
  });

  // Eliminar ítems
  tbody.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-remove-id]");
    if (!btn) return;
    const id = btn.getAttribute("data-remove-id");
    removeFromCart(id);
  });
}

/* ============= RENDER DEL CARRITO + TOTALES ============= */

function renderCart() {
  const tbody = document.getElementById("cartItems");
  const emptyMsg = document.getElementById("emptyCartMessage");
  const subtotalSpan = document.getElementById("cartSubtotal");
  const donationSpan = document.getElementById("donationAmount");
  const totalSpan = document.getElementById("cartTotal");

  if (!tbody || !subtotalSpan || !donationSpan || !totalSpan) return;

  const cart = loadCart();
  tbody.innerHTML = "";

  if (cart.length === 0) {
    if (emptyMsg) emptyMsg.style.display = "block";
  } else {
    if (emptyMsg) emptyMsg.style.display = "none";
  }

  cart.forEach((item) => {
    const tr = document.createElement("tr");
    tr.className = "cart-row";
    tr.innerHTML = `
      <td class="cart-item-name">
        <span>${item.name}</span>
      </td>
      <td>
        <div class="cart-qty-wrapper">
          <input
            type="number"
            min="1"
            class="cart-qty"
            value="${item.quantity}"
            data-cart-id="${item.id}"
          >
        </div>
      </td>
      <td class="cart-item-price">
        S/ ${(item.price * item.quantity).toFixed(2)}
      </td>
      <td class="cart-item-action">
        <button class="cart-remove-btn" data-remove-id="${item.id}" aria-label="Quitar">
          &times;
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  const subtotal = calcSubtotal(cart);
  subtotalSpan.textContent = subtotal.toFixed(2);

  // Recalcular donación con la opción actual
  const donation = calculateDonation(subtotal);
  donationSpan.textContent = donation.toFixed(2);
  totalSpan.textContent = (subtotal + donation).toFixed(2);
}

/* ============= DONACIÓN ============= */

function getDonationMode() {
  const radios = document.querySelectorAll('input[name="donationMode"]');
  for (const r of radios) {
    if (r.checked) return r.value;
  }
  return "auto5";
}

function calculateDonation(subtotal) {
  const mode = getDonationMode();
  let donation = 0;

  if (mode === "auto5") {
    donation = subtotal * 0.05;
  } else if (mode === "fixed") {
    const input = document.getElementById("fixedDonationInput");
    const val = parseFloat(input?.value || "0");
    donation = isNaN(val) || val < 0 ? 0 : val;
  } else if (mode === "product") {
    const input = document.getElementById("productDonationInput");
    const qty = parseInt(input?.value || "0", 10);
    const validQty = isNaN(qty) || qty < 0 ? 0 : qty;
    const menuPrice = 5; // valor referencia menú solidario
    donation = validQty * menuPrice;
  }

  saveDonationChoice(mode, donation);
  return donation;
}

function saveDonationChoice(mode, donationAmount) {
  const info = { mode, donationAmount };
  localStorage.setItem(STORAGE_KEYS.DONATION, JSON.stringify(info));
}

function setupDonationControls() {
  const radios = document.querySelectorAll('input[name="donationMode"]');
  const fixedWrapper = document.getElementById("fixedAmountWrapper");
  const productWrapper = document.getElementById("productDonationWrapper");
  const fixedInput = document.getElementById("fixedDonationInput");
  const productInput = document.getElementById("productDonationInput");

  function refreshVisibility() {
    const mode = getDonationMode();
    if (fixedWrapper) {
      fixedWrapper.classList.toggle("hidden", mode !== "fixed");
    }
    if (productWrapper) {
      productWrapper.classList.toggle("hidden", mode !== "product");
    }

    // Recalcular donación y totales
    const cart = loadCart();
    const subtotal = calcSubtotal(cart);
    const donationSpan = document.getElementById("donationAmount");
    const totalSpan = document.getElementById("cartTotal");
    if (donationSpan && totalSpan) {
      const donation = calculateDonation(subtotal);
      donationSpan.textContent = donation.toFixed(2);
      totalSpan.textContent = (subtotal + donation).toFixed(2);
    }
  }

  radios.forEach((r) => {
    r.addEventListener("change", refreshVisibility);
  });

  if (fixedInput) {
    fixedInput.addEventListener("input", refreshVisibility);
  }

  if (productInput) {
    productInput.addEventListener("input", refreshVisibility);
  }

  // Inicial
  refreshVisibility();
}

/* ============= CONFIRMAR PEDIDO ============= */

function setupConfirmOrder() {
  const btn = document.getElementById("btnConfirmOrder");
  const msg = document.getElementById("orderMessage");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const cart = loadCart();
    if (cart.length === 0) {
      if (msg) {
        msg.style.color = "crimson";
        msg.textContent =
          "Tu carrito está vacío. Agrega productos antes de confirmar.";
        msg.classList.add("order-message-visible");
      }
      return;
    }

    const subtotal = calcSubtotal(cart);
    const donation = calculateDonation(subtotal);

    // Actualizar estadísticas de impacto
    updateImpactStats(subtotal, donation);

    // Limpiar carrito y donación
    saveCart([]);
    localStorage.removeItem(STORAGE_KEYS.DONATION);
    renderCart();

    if (msg) {
      msg.style.color = "#0c7c59";
      msg.textContent =
        "Pedido solidario registrado (simulado). ¡Gracias por tu apoyo 💚!";
      msg.classList.add("order-message-visible");
    }
  });
}

/* ============= IMPACTO: ESTADÍSTICAS ACUMULADAS ============= */

function loadStats() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STATS);
    if (!raw) {
      return {
        orders: 0,
        sales: 0,
        donation: 0,
        meals: 0,
      };
    }
    return JSON.parse(raw);
  } catch {
    return {
      orders: 0,
      sales: 0,
      donation: 0,
      meals: 0,
    };
  }
}

function saveStats(stats) {
  localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
}

function updateImpactStats(subtotal, donation) {
  const stats = loadStats();
  stats.orders += 1;
  stats.sales += subtotal;
  stats.donation += donation;
  const menusNew = donation / 5; // cada S/5 es un menú
  stats.meals += menusNew;
  saveStats(stats);
}

function renderImpactStats() {
  const stats = loadStats();
  const ordersEl = document.getElementById("impactOrders");
  const salesEl = document.getElementById("impactSales");
  const donationEl = document.getElementById("impactDonation");
  const mealsEl = document.getElementById("impactMeals");

  if (ordersEl) ordersEl.textContent = stats.orders;
  if (salesEl) salesEl.textContent = stats.sales.toFixed(2);
  if (donationEl) donationEl.textContent = stats.donation.toFixed(2);
  if (mealsEl) mealsEl.textContent = Math.floor(stats.meals);
}
