// Interacciones UI: menú, reveal, contador de carrito animado

function getCartFromStorage() {
  try {
    const data = localStorage.getItem("ls_cart");
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Error leyendo carrito", e);
    return [];
  }
}

function updateCartCount() {
  const cart = getCartFromStorage();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const badge = document.getElementById("cartCount");
  if (!badge) return;
  // animación cuando cambia
  const prev = parseInt(badge.textContent || "0", 10) || 0;
  badge.textContent = totalItems;
  if (totalItems !== prev) {
    badge.classList.remove("pulse");
    // reflow to restart animation
    void badge.offsetWidth;
    badge.classList.add("pulse");
  }
}

// Init UI behaviors
document.addEventListener("DOMContentLoaded", () => {
  const burgerBtn = document.getElementById("burgerBtn");
  const mainNav = document.getElementById("mainNav");

  if (burgerBtn && mainNav) {
    burgerBtn.addEventListener("click", () => {
      const open = mainNav.classList.toggle("open");
      burgerBtn.classList.toggle("is-open", open);
      burgerBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  // Añadir clase reveal a elementos clave y observar con IntersectionObserver
  const revealSelector = [
    ".section",
    ".card",
    ".product-card",
    ".hero-text",
    ".hero-image img",
    ".impact-card",
    ".contact-form",
  ].join(",");

  const toReveal = document.querySelectorAll(revealSelector);
  toReveal.forEach((el) => el.classList.add("reveal"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 }
  );

  toReveal.forEach((el) => observer.observe(el));

  // Smooth anchor scrolling for in-page anchors
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // Update cart count initially and on storage change
  updateCartCount();
  window.addEventListener("storage", (e) => {
    if (e.key === "ls_cart") updateCartCount();
  });
});

// Expose updateCartCount globally in case other modules call it
window.updateCartCount = updateCartCount;
