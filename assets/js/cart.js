// assets/js/cart.js

// ✅ Fallback de productos (por si falla fetch o estás en file://)
const PRODUCTS_FALLBACK = [
  { id: "p1", name: "Menú del día", price: 10.0, description: "Plato casero completo del Comedor Popular.", image: "assets/img/productos/menu-dia.jpg" },
  { id: "p2", name: "Pan artesanal", price: 3.0, description: "Pan recién horneado, ideal para el desayuno.", image: "assets/img/productos/pan-artesanal.jpg" },
  { id: "p3", name: "Postre casero", price: 4.5, description: "Postres preparados en el comedor, variedad del día.", image: "assets/img/productos/postre-casero.jpg" },
  { id: "p4", name: "Pack despensa", price: 25.0, description: "Arroz, menestras y aceite para la semana.", image: "assets/img/productos/pack-despensa.jpg" },
  { id: "p5", name: "Plato para llevar", price: 8.0, description: "Ración para llevar y consumir luego.", image: "assets/img/productos/plato-llevar.jpg" },
  { id: "p6", name: "Menú solidario", price: 5.0, description: "Aporta directamente a un plato solidario.", image: "assets/img/productos/menu-solidario.jpg" },

  { id: "p7", name: "Hamburguesa clásica", price: 12.0, description: "Hamburguesa con carne, queso, lechuga y salsas.", image: "assets/img/productos/hamburguesa-clasica.jpg" },
  { id: "p8", name: "Hamburguesa doble queso", price: 16.0, description: "Doble carne, doble queso y papas al hilo.", image: "assets/img/productos/hamburguesa-doble.jpg" },
  { id: "p9", name: "Salchipapa", price: 11.0, description: "Papas crocantes con hot dog y salsas al gusto.", image: "assets/img/productos/salchipapa.jpg" },
  { id: "p10", name: "Salchipapa especial", price: 15.0, description: "Papas, hot dog, huevo y queso derretido.", image: "assets/img/productos/salchipapa-especial.png" },
  { id: "p11", name: "Alitas BBQ (6 unidades)", price: 18.0, description: "Alitas jugosas bañadas en salsa BBQ.", image: "assets/img/productos/alitas-bbq.jpg" },
  { id: "p12", name: "Nuggets (8 unidades)", price: 10.0, description: "Nuggets crocantes con salsa de la casa.", image: "assets/img/productos/nuggets.jpg" },
  { id: "p13", name: "Papas fritas grandes", price: 8.0, description: "Porción grande de papas fritas crocantes.", image: "assets/img/productos/papas-grandes.jpg" },
  { id: "p14", name: "Tequeños (6 unidades)", price: 12.0, description: "Tequeños rellenos de queso, doraditos.", image: "assets/img/productos/tequenos.jpg" },
  { id: "p15", name: "Chicharrón de pollo", price: 14.0, description: "Trozos de pollo crocantes con salsas.", image: "assets/img/productos/chicharron-pollo.jpg" },
  { id: "p16", name: "Sándwich de pollo", price: 10.0, description: "Sándwich con pollo, lechuga y mayonesa.", image: "assets/img/productos/sandwich-pollo.jpg" },
  { id: "p17", name: "Sándwich mixto", price: 9.0, description: "Jamón, queso, tomate y lechuga en pan suave.", image: "assets/img/productos/sandwich-mixto.jpg" },
  { id: "p18", name: "Empanada de pollo", price: 6.0, description: "Empanada horneada rellena de pollo sazonado.", image: "assets/img/productos/empanada-pollo.jpg" },
  { id: "p19", name: "Empanada de carne", price: 6.5, description: "Empanada horneada rellena de carne jugosa.", image: "assets/img/productos/empanada-carne.jpg" },
  { id: "p20", name: "Hot dog clásico", price: 7.0, description: "Hot dog con papitas al hilo y salsas.", image: "assets/img/productos/hotdog.jpg" },
  { id: "p21", name: "Nachos con queso", price: 12.0, description: "Nachos crocantes con queso derretido y jalapeños.", image: "assets/img/productos/nachos-queso.jpg" },
  { id: "p22", name: "Canchita salada", price: 4.0, description: "Canchita crujiente para acompañar.", image: "assets/img/productos/canchita.jpg" },
  { id: "p23", name: "Chifles (bolsa)", price: 5.0, description: "Chifles crocantes, perfectos para piqueo.", image: "assets/img/productos/chifles.jpg" },
  { id: "p24", name: "Gaseosa 500 ml", price: 4.0, description: "Bebida gaseosa fría para acompañar tu pedido.", image: "assets/img/productos/gaseosa-500.jpg" },
  { id: "p25", name: "Agua 600 ml", price: 2.5, description: "Agua sin gas, ideal para cualquier momento.", image: "assets/img/productos/agua-600.jpg" },
  { id: "p26", name: "Jugo natural", price: 6.0, description: "Jugo natural del día (según disponibilidad).", image: "assets/img/productos/jugo-natural.jpg" },
  { id: "p27", name: "Combo Hamburguesa + Papas + Gaseosa", price: 20.0, description: "Combo completo para una comida rápida y rica.", image: "assets/img/productos/combo-hamburguesa.jpg" },
  { id: "p28", name: "Combo Salchipapa + Gaseosa", price: 16.0, description: "Salchipapa con gaseosa fría incluida.", image: "assets/img/productos/combo-salchipapa.jpg" },
  { id: "p29", name: "Brownie", price: 5.5, description: "Brownie de chocolate suave por dentro.", image: "assets/img/productos/brownie.jpg" },
  { id: "p30", name: "Alfajor", price: 3.5, description: "Alfajor clásico con manjar blanco.", image: "assets/img/productos/alfajor.jpg" },
];

// ✅ Aquí se guardarán los productos cargados desde JSON o fallback
let PRODUCTS = [];

const STORAGE_KEYS = {
  CART: "ls_cart",
  DONATION: "ls_donation",
  STATS: "ls_stats",
};

document.addEventListener("DOMContentLoaded", async () => {
  const page = document.body.dataset.page;

  await loadProducts();

  if (page === "store") initStorePage();
  if (page === "impact") renderImpactStats();
});

/* ============= CARGA DE PRODUCTOS (JSON + FALLBACK) ============= */

async function loadProducts() {
  const JSON_PATH = "productos.json";

  try {
    const res = await fetch(JSON_PATH, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) throw new Error("JSON inválido");

    PRODUCTS = data.map((p) => ({
      id: String(p.id),
      name: String(p.name || "Producto"),
      price: Number(p.price || 0),
      description: String(p.description || ""),
      image: String(p.image || ""),
    }));
  } catch (err) {
    console.warn("No se pudo cargar productos.json, usando fallback:", err);
    PRODUCTS = PRODUCTS_FALLBACK;
  }
}

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
  setupCartListeners();
  setupDonationControls();
  setupConfirmOrder();
  renderCart();
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
      <img src="${p.image}" alt="${escapeHtml(p.name)}">
      <h3 class="product-name">${escapeHtml(p.name)}</h3>
      <p class="product-price">S/ ${Number(p.price).toFixed(2)}</p>
      <p class="product-meta">${escapeHtml(p.description)}</p>
      <button class="btn-primary full-width" data-product-id="${p.id}">
        Agregar al carrito
      </button>
    `;

    grid.appendChild(card);
  });

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

  if (existing) existing.quantity += 1;
  else {
    cart.push({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      quantity: 1,
    });
  }

  saveCart(cart);
  renderCart();
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

  tbody.addEventListener("change", (e) => {
    const input = e.target.closest("input[data-cart-id]");
    if (!input) return;
    const id = input.getAttribute("data-cart-id");
    updateQuantity(id, input.value);
  });

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
      <td class="cart-item-name"><span>${escapeHtml(item.name)}</span></td>
      <td>
        <div class="cart-qty-wrapper">
          <input type="number" min="1" class="cart-qty"
                 value="${item.quantity}" data-cart-id="${item.id}"/>
        </div>
      </td>
      <td class="cart-item-price">S/ ${(item.price * item.quantity).toFixed(2)}</td>
      <td class="cart-item-action">
        <button class="cart-remove-btn" data-remove-id="${item.id}" aria-label="Quitar">&times;</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  const subtotal = calcSubtotal(cart);
  subtotalSpan.textContent = subtotal.toFixed(2);

  const donation = calculateDonation(subtotal);
  donationSpan.textContent = donation.toFixed(2);
  totalSpan.textContent = (subtotal + donation).toFixed(2);
}

/* ============= DONACIÓN ============= */

function getDonationMode() {
  const radios = document.querySelectorAll('input[name="donationMode"]');
  for (const r of radios) if (r.checked) return r.value;
  return "none";
}

function calculateDonation(subtotal) {
  const mode = getDonationMode();
  let donation = 0;

  if (mode === "none") donation = 0;
  else if (mode === "auto5") donation = subtotal * 0.05;
  else if (mode === "fixed") {
    const input = document.getElementById("fixedDonationInput");
    const val = parseFloat(input?.value || "0");
    donation = isNaN(val) || val < 0 ? 0 : val;
  } else if (mode === "product") {
    const input = document.getElementById("productDonationInput");
    const qty = parseInt(input?.value || "0", 10);
    const validQty = isNaN(qty) || qty < 0 ? 0 : qty;
    donation = validQty * 5;
  }

  saveDonationChoice(mode, donation);
  return donation;
}

function saveDonationChoice(mode, donationAmount) {
  localStorage.setItem(STORAGE_KEYS.DONATION, JSON.stringify({ mode, donationAmount }));
}

function setupDonationControls() {
  const radios = document.querySelectorAll('input[name="donationMode"]');
  const fixedWrapper = document.getElementById("fixedAmountWrapper");
  const productWrapper = document.getElementById("productDonationWrapper");
  const fixedInput = document.getElementById("fixedDonationInput");
  const productInput = document.getElementById("productDonationInput");

  function refreshVisibility() {
    const mode = getDonationMode();

    if (fixedWrapper) fixedWrapper.classList.toggle("hidden", mode !== "fixed");
    if (productWrapper) productWrapper.classList.toggle("hidden", mode !== "product");

    if (mode !== "fixed" && fixedInput) fixedInput.value = "";
    if (mode !== "product" && productInput) productInput.value = "";

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

  radios.forEach((r) => r.addEventListener("change", refreshVisibility));
  if (fixedInput) fixedInput.addEventListener("input", refreshVisibility);
  if (productInput) productInput.addEventListener("input", refreshVisibility);

  refreshVisibility();
}

/* ============= IR A PAGAR (ABRE MODAL) ============= */

function setupConfirmOrder() {
  const btn = document.getElementById("btnConfirmOrder");
  const msg = document.getElementById("orderMessage");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const cart = loadCart();
    if (cart.length === 0) {
      if (msg) {
        msg.style.color = "crimson";
        msg.textContent = "Tu carrito está vacío. Agrega productos antes de continuar.";
        msg.classList.add("order-message-visible");
      }
      return;
    }

    const subtotal = calcSubtotal(cart);
    const donation = calculateDonation(subtotal);
    const total = subtotal + donation;

    // ✅ SOLO abre el modal
    openCheckoutModal({ subtotal, donation, total, cart });
  });
}

/* ============= MODAL CHECKOUT (PAGO + QR RECOJO) ============= */

function openCheckoutModal({ subtotal, donation, total, cart }) {
  const modal = document.getElementById("checkoutModal");
  if (!modal) return;

  const closeBtn = document.getElementById("closeModalBtn");
  const backdrop = modal.querySelector("[data-close-modal='true']");

  const mSubtotal = document.getElementById("mSubtotal");
  const mDonation = document.getElementById("mDonation");
  const mTotal = document.getElementById("mTotal");

  const payResult = document.getElementById("payResult");
  const payTitle = document.getElementById("payTitle");
  const modalMessage = document.getElementById("modalMessage");

  const cashBox = document.getElementById("cashBox");
  const cashCode = document.getElementById("cashCode");

  const qrPayBox = document.getElementById("qrPayBox");
  const qrPayLabel = document.getElementById("qrPayLabel");
  const qrPayImg = document.getElementById("qrPayImg");

  const qrPickupBox = document.getElementById("qrPickupBox");
  const qrPickupImg = document.getElementById("qrPickupImg");
  const orderIdText = document.getElementById("orderIdText");

  const btnFinish = document.getElementById("btnFinish");

  // ✅ Rutas de imágenes QR (mock)
  const QR_IMAGES = {
    yape: "assets/img/qr/qr.jpg",
    plin: "assets/img/qr/qr.jpg",
    recojo: "assets/img/qr/qr.jpg",
  };

  // Estado del modal
  let selectedPayMode = null;
  let generated = false;

  function closeCheckoutModal() {
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
  }

  // Reset UI + abrir
  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");

  if (payResult) payResult.classList.add("hidden");
  if (modalMessage) modalMessage.textContent = "";
  hideAll([cashBox, qrPayBox, qrPickupBox]);

  if (mSubtotal) mSubtotal.textContent = subtotal.toFixed(2);
  if (mDonation) mDonation.textContent = donation.toFixed(2);
  if (mTotal) mTotal.textContent = total.toFixed(2);

  // Generar ID pedido
  const orderId = generateOrderId();
  if (orderIdText) orderIdText.textContent = orderId;

  // Botón final: deshabilitado hasta elegir método
  if (btnFinish) {
    btnFinish.disabled = true;
    btnFinish.textContent = "Generar QR de recojo";
  }

  // ✅ Evita acumular listeners al abrir modal varias veces
  if (closeBtn) closeBtn.onclick = closeCheckoutModal;
  if (backdrop) backdrop.onclick = closeCheckoutModal;

  // Botones de pago
  const optionButtons = modal.querySelectorAll(".pay-btn");

  optionButtons.forEach((b) => {
    b.onclick = () => {
      const mode = b.getAttribute("data-pay");
      if (!mode) return;

      if (mode === "cancel") {
        closeCheckoutModal();
        return;
      }

      selectedPayMode = mode;
      generated = false;

      // Mostrar resultados
      if (payResult) payResult.classList.remove("hidden");
      hideAll([cashBox, qrPayBox, qrPickupBox]);

      if (modalMessage) modalMessage.textContent = "";

      // habilitar botón final
      if (btnFinish) {
        btnFinish.disabled = false;
        btnFinish.textContent = "Generar QR de recojo";
      }

      if (mode === "store") {
        if (payTitle) payTitle.textContent = "✅ Pagarás en tienda al recoger";
        if (modalMessage) {
          modalMessage.textContent =
            "Cuando estés listo, genera tu QR de recojo para retirar tu pedido.";
        }
      }

      if (mode === "cash") {
        const code = generateCashCode();
        if (payTitle) payTitle.textContent = "💵 Pago en efectivo (código)";
        if (cashCode) cashCode.textContent = code;
        if (cashBox) cashBox.classList.remove("hidden");
        if (modalMessage) {
          modalMessage.textContent =
            "Guarda tu código. Luego genera tu QR de recojo para retirar en tienda.";
        }
      }

      if (mode === "yape" || mode === "plin") {
        const label = mode === "yape" ? "📱 Yape" : "📱 Plin";
        if (payTitle) payTitle.textContent = `${label} (QR de pago)`;

        if (qrPayLabel) {
          qrPayLabel.textContent =
            `Escanea para pagar con ${mode.toUpperCase()} (simulado):`;
        }

        // ✅ USAR IMAGEN (más fácil)
        if (qrPayImg) qrPayImg.src = QR_IMAGES[mode];
        if (qrPayBox) qrPayBox.classList.remove("hidden");

        if (modalMessage) {
          modalMessage.textContent =
            "Luego de pagar, genera tu QR de recojo para retirar en tienda.";
        }
      }
    };
  });

  // ✅ Confirmar y generar QR de recojo recién aquí (SIN acumular listeners)
  if (btnFinish) {
    btnFinish.onclick = () => {
      if (!selectedPayMode) {
        if (modalMessage) modalMessage.textContent = "Primero elige un método de pago.";
        return;
      }
      if (generated) return;

      // ✅ Mostrar QR de recojo (imagen)
      if (qrPickupImg) qrPickupImg.src = QR_IMAGES.recojo;
      if (qrPickupBox) qrPickupBox.classList.remove("hidden");

      // ✅ Confirmar ahora sí (stats + limpiar carrito)
      confirmAndClearOrder(subtotal, donation);
      generated = true;

      btnFinish.textContent = "Pedido confirmado ✅";
      btnFinish.disabled = true;

      btnFinish.textContent = "Pedido confirmado ✅";
      btnFinish.disabled = true;

      // ✅ cerrar modal y mostrar mensaje centrado
      setTimeout(() => {
        closeCheckoutModal();
        showCenterToast("¡Gracias por su compra! 💚", 2.2);
      }, 300);

      if (modalMessage) {
        modalMessage.textContent =
          "✅ Pedido confirmado. Guarda tu QR de recojo para retirar en tienda.";
      }

      // Mensaje en la página
      const pageMsg = document.getElementById("orderMessage");
      if (pageMsg) {
        pageMsg.style.color = "#0c7c59";
        pageMsg.textContent = "Pedido confirmado. QR de recojo generado ✅";
        pageMsg.classList.add("order-message-visible");
      }
    };
  }
}

/* ============= CONFIRMAR (STATS + LIMPIAR) ============= */

function confirmAndClearOrder(subtotal, donation) {
  updateImpactStats(subtotal, donation);
  saveCart([]);
  localStorage.removeItem(STORAGE_KEYS.DONATION);
  renderCart();
}

/* ============= HELPERS: IDs / CÓDIGOS / PAYLOADS ============= */

function generateOrderId() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `LS-${y}${m}${day}-${rand}`;
}

function generateCashCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function buildPickupPayload({ orderId, total, cart }) {
  const items = cart.map((i) => `${i.id}:${i.quantity}`).join(",");
  return `LISTO|PICKUP|${orderId}|TOTAL:${total.toFixed(2)}|ITEMS:${items}`;
}

function buildPayPayload({ method, amount, orderId }) {
  return `LISTO|PAY|${method.toUpperCase()}|ORDER:${orderId}|AMOUNT:${amount.toFixed(2)}`;
}

/* ============= QR: convertir texto a IMG DATAURL (OPCIONAL) ============= */
/* Si ya usas IMÁGENES, esta función no se usa. La dejo por si luego quieres generar QR real. */

async function makeQrToImg(imgEl, text) {
  if (!imgEl) return;

  const QR = (typeof QRCode !== "undefined" ? QRCode : window.QRCode);
  if (!QR) {
    console.error("❌ No se cargó la librería QRCode. Revisa el <script> del CDN en tienda.html");
    return;
  }

  try {
    const dataUrl = await QR.toDataURL(text, {
      errorCorrectionLevel: "M",
      margin: 1,
      width: 220,
    });
    imgEl.src = dataUrl;
  } catch (e) {
    console.error("Error QR:", e);
  }
}

function hideAll(els) {
  els.forEach((el) => el && el.classList.add("hidden"));
}
function showCenterToast(message = "¡Gracias por su compra! 💚", seconds = 2) {
  const toast = document.getElementById("centerToast");
  if (!toast) return;

  const title = toast.querySelector("h3");
  if (title) title.textContent = message;

  toast.classList.remove("hidden");

  // cerrar con click
  toast.onclick = () => toast.classList.add("hidden");

  // cerrar automático
  setTimeout(() => {
    toast.classList.add("hidden");
  }, seconds * 1000);
}


/* ============= IMPACTO: ESTADÍSTICAS ACUMULADAS ============= */

function loadStats() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STATS);
    if (!raw) return { orders: 0, sales: 0, donation: 0, meals: 0 };
    return JSON.parse(raw);
  } catch {
    return { orders: 0, sales: 0, donation: 0, meals: 0 };
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
  stats.meals += donation / 5;
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

/* ============= UTIL: ESCAPAR HTML ============= */

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
