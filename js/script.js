/* =========================================================
   VNDL — Streetwear Independente (Vanilla JS)
   ========================================================= */
"use strict";

/* ---------- CONFIGURAÇÃO ---------- */
// Troque aqui o nome da marca: atualiza todos os elementos com [data-brand]
const BRAND_NAME = "VNDL";
const STORAGE_KEY = "vndl_cart";
const SIZES = ["P", "M", "G", "GG"];
const IMG = (id) => `https://images.unsplash.com/${id}?w=800&q=80`;

/* ---------- CATÁLOGO (produtos fictícios) ---------- */
// tags: "new" entra no New Drop | "hot" entra nos Best Sellers
const PRODUCTS = [
  { id: 1, name: "Oversized Tee Concrete", price: 149.9, category: "oversized", tag: "new",
    desc: "Camiseta oversized em algodão pesado 240g, estampa serigrafada no peito e costura reforçada.", img: IMG("photo-1529374255404-311a2a4f1fd9") },
  { id: 2, name: "Oversized Tee Static", price: 139.9, category: "oversized",
    desc: "Modelagem ampla com ombro caído e estampa glitch nas costas. Pré-encolhida.", img: IMG("photo-1583743814966-8936f5b7be1a") },
  { id: 3, name: "Hoodie Underground", price: 349.9, category: "hoodies", tag: "hot",
    desc: "Moletom flanelado 400g, capuz forrado duplo e bordado tonal no capuz.", img: IMG("photo-1556821840-3a63f95609a7") },
  { id: 4, name: "Hoodie No Signal", price: 329.9, category: "hoodies",
    desc: "Moletom com estampa desgastada estilo pôster de rua e punhos canelados.", img: IMG("photo-1620799140408-edc6dcb6d633") },
  { id: 5, name: "Baggy Pants District", price: 299.9, category: "baggy",
    desc: "Calça baggy em sarja pesada, cintura com elástico interno e barra ajustável.", img: IMG("photo-1594633312681-425c7b97ccd1") },
  { id: 6, name: "Cargo Utility 04", price: 319.9, category: "cargo", tag: "hot",
    desc: "Cargo com 6 bolsos, fivelas plásticas e tecido ripstop resistente.", img: IMG("photo-1517445312882-bc9910d016b7") },
  { id: 7, name: "Jacket Night Shift", price: 549.9, category: "jackets", tag: "new",
    desc: "Jaqueta worker em lona encerada, forro acolchoado e zíper YKK.", img: IMG("photo-1591047139829-d91aecb6caea") },
  { id: 8, name: "Denim Jacket Riot", price: 499.9, category: "jackets",
    desc: "Jaqueta jeans oversized com lavagem stone e pences nas costas.", img: IMG("photo-1551028719-00167b16eac5") },
  { id: 9, name: "Cap Logo 5-Panel", price: 119.9, category: "caps", tag: "hot",
    desc: "Boné 5-panel em brim com logo bordado 3D e regulagem em fivela metálica.", img: IMG("photo-1588850561407-ed78c282e89b") },
  { id: 10, name: "Beanie Cold City", price: 89.9, category: "accessories",
    desc: "Gorro em tricô acrílico duplo com etiqueta tecida na aba.", img: IMG("photo-1576871337622-98d48d1cf531") },
  { id: 11, name: "Bag Transit", price: 189.9, category: "accessories",
    desc: "Shoulder bag em nylon balístico, alça regulável e bolso antifurto.", img: IMG("photo-1553062407-98eeb64c6a62") },
  { id: 12, name: "Oversized Tee Vandal Club", price: 159.9, category: "oversized", tag: "hot",
    desc: "Edição do clube: estampa frente e verso em tinta puff, gola reforçada.", img: IMG("photo-1503342217505-b0a15ec3261c") },
  { id: 13, name: "Hoodie Ash", price: 369.9, category: "hoodies", tag: "new",
    desc: "Moletom cinza mescla com lavagem enzimática e corte boxy.", img: IMG("photo-1618354691373-d851c5c3a990") },
  { id: 14, name: "Cargo Blackout", price: 339.9, category: "cargo",
    desc: "Cargo all-black com cordões de ajuste na barra e joelhos articulados.", img: IMG("photo-1624378439575-d8705ad7ae80") },
];

const CATEGORY_LABELS = {
  oversized: "Oversized Tees",
  hoodies: "Hoodies",
  baggy: "Baggy Pants",
  cargo: "Cargo Pants",
  jackets: "Jackets",
  caps: "Caps",
  accessories: "Accessories",
};

/* ---------- HELPERS ---------- */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const formatBRL = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/* ---------- ESTADO (carrinho + filtros) ---------- */
let cart = loadCart();
let activeFilter = "all";
let searchTerm = "";

function loadCart() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}
function saveCart() { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); }

/* ---------- RENDERIZAÇÃO DOS PRODUTOS ---------- */
// Um único template de card evita código duplicado entre as seções
function productCardHTML(p) {
  return `
    <article class="product-card reveal" data-id="${p.id}" data-category="${p.category}">
      <div class="product-card__media">
        <img src="${p.img}" alt="${p.name}" loading="lazy">
        ${p.tag ? `<span class="product-card__tag">${p.tag === "new" ? "New" : "Hot"}</span>` : ""}
        <button class="product-card__view" data-view="${p.id}">Quick view</button>
      </div>
      <div class="product-card__body">
        <p class="product-card__cat">${CATEGORY_LABELS[p.category]}</p>
        <div class="product-card__row">
          <h3 class="product-card__name">${p.name}</h3>
          <span class="product-card__price">${formatBRL(p.price)}</span>
        </div>
        <div class="sizes" role="group" aria-label="Tamanhos">
          ${SIZES.map((s) => `<button class="size-btn" data-size="${s}" aria-pressed="false">${s}</button>`).join("")}
        </div>
        <button class="add-btn">Add to cart</button>
      </div>
    </article>`;
}

function renderProducts() {
  $("#newDropGrid").innerHTML = PRODUCTS.filter((p) => p.tag === "new").map(productCardHTML).join("");
  $("#bestSellersGrid").innerHTML = PRODUCTS.filter((p) => p.tag === "hot").map(productCardHTML).join("");
  renderShop();
}

// Catálogo respeita filtro de categoria + termo de busca
function renderShop() {
  const term = searchTerm.trim().toLowerCase();
  const list = PRODUCTS.filter((p) => {
    const matchFilter = activeFilter === "all" || p.category === activeFilter;
    const matchSearch = !term || p.name.toLowerCase().includes(term) || CATEGORY_LABELS[p.category].toLowerCase().includes(term);
    return matchFilter && matchSearch;
  });
  $("#shopGrid").innerHTML = list.map(productCardHTML).join("");
  $("#shopEmpty").hidden = list.length > 0;
  observeReveals($("#shopGrid"));
}

/* ---------- MODAL DE PRODUTO (página de produto) ---------- */
let modalProduct = null;
let modalQty = 1;

function openProductModal(id) {
  const p = PRODUCTS.find((x) => x.id === id);
  if (!p) return;
  modalProduct = p;
  modalQty = 1;

  $("#modalImg").src = p.img;
  $("#modalImg").alt = p.name;
  $("#modalTag").textContent = p.tag === "new" ? "New drop" : p.tag === "hot" ? "Best seller" : "";
  $("#modalCategory").textContent = CATEGORY_LABELS[p.category];
  $("#modalName").textContent = p.name;
  $("#modalPrice").textContent = formatBRL(p.price);
  $("#modalDesc").textContent = p.desc;
  $("#qtyValue").textContent = modalQty;
  $("#modalSizes").innerHTML = SIZES.map((s) => `<button class="size-btn" data-size="${s}" aria-pressed="false">${s}</button>`).join("");

  toggleModal(true);
}

function toggleModal(open) {
  $("#productModal").classList.toggle("is-open", open);
  $("#modalBackdrop").classList.toggle("is-open", open);
  $("#productModal").setAttribute("aria-hidden", String(!open));
  document.body.classList.toggle("no-scroll", open);
}

/* ---------- CLIQUES NOS CARDS (delegação de eventos) ---------- */
function handleProductClick(e) {
  const viewBtn = e.target.closest("[data-view]");
  if (viewBtn) { openProductModal(Number(viewBtn.dataset.view)); return; }

  const card = e.target.closest(".product-card");
  if (!card) return;

  // Seleção de tamanho
  const sizeBtn = e.target.closest(".size-btn");
  if (sizeBtn) {
    $$(".size-btn", card).forEach((b) => { b.classList.remove("is-selected"); b.setAttribute("aria-pressed", "false"); });
    sizeBtn.classList.add("is-selected");
    sizeBtn.setAttribute("aria-pressed", "true");
    return;
  }

  // Adicionar ao carrinho (exige tamanho)
  if (e.target.closest(".add-btn")) {
    const selected = $(".size-btn.is-selected", card);
    if (!selected) {
      card.classList.remove("shake"); void card.offsetWidth; card.classList.add("shake");
      showToast("Selecione um tamanho primeiro");
      return;
    }
    addToCart(Number(card.dataset.id), selected.dataset.size, 1);
  }
}

/* ---------- OPERAÇÕES DO CARRINHO ---------- */
function addToCart(id, size, qty) {
  const item = cart.find((i) => i.id === id && i.size === size);
  if (item) item.qty += qty;
  else cart.push({ id, size, qty });
  updateCart();
  const p = PRODUCTS.find((x) => x.id === id);
  showToast(`${p.name} (${size}) na bag`);
  bumpCounter();
}

function changeQty(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty <= 0) cart.splice(index, 1);
  updateCart();
}

function removeItem(index) { cart.splice(index, 1); updateCart(); }

// Recalcula total, contador, salva e redesenha
function updateCart() {
  saveCart();
  const count = cart.reduce((sum, i) => sum + i.qty, 0);
  const total = cart.reduce((sum, i) => sum + i.qty * PRODUCTS.find((p) => p.id === i.id).price, 0);
  $("#cartCount").textContent = count;
  $("#cartTotal").textContent = formatBRL(total);
  renderCartItems();
}

function renderCartItems() {
  const list = $("#cartItems");
  if (!cart.length) { list.innerHTML = `<li class="cart__empty">Sua bag está vazia.</li>`; return; }
  list.innerHTML = cart.map((item, idx) => {
    const p = PRODUCTS.find((x) => x.id === item.id);
    return `
      <li class="cart-item" data-index="${idx}">
        <img src="${p.img}" alt="${p.name}">
        <div>
          <p class="cart-item__name">${p.name}</p>
          <p class="cart-item__meta">Tam ${item.size} · ${formatBRL(p.price)}</p>
          <div class="qty">
            <button data-action="dec" aria-label="Diminuir">−</button>
            <span>${item.qty}</span>
            <button data-action="inc" aria-label="Aumentar">+</button>
          </div>
        </div>
        <div class="cart-item__side">
          <strong>${formatBRL(p.price * item.qty)}</strong>
          <button class="cart-item__remove" data-action="remove">Remover</button>
        </div>
      </li>`;
  }).join("");
}

function handleCartClick(e) {
  const btn = e.target.closest("[data-action]");
  if (!btn) return;
  const idx = Number(btn.closest(".cart-item").dataset.index);
  const actions = { inc: () => changeQty(idx, 1), dec: () => changeQty(idx, -1), remove: () => removeItem(idx) };
  actions[btn.dataset.action]();
}

function toggleCart(open) {
  $("#cart").classList.toggle("is-open", open);
  $("#cartBackdrop").classList.toggle("is-open", open);
  $("#cart").setAttribute("aria-hidden", String(!open));
  document.body.classList.toggle("no-scroll", open);
}

/* ---------- FILTROS + BUSCA ---------- */
function applyFilter(category) {
  activeFilter = category;
  $$(".filter-btn").forEach((b) => b.classList.toggle("is-active", b.dataset.filter === category));
  renderShop();
}

function toggleSearch(force) {
  const bar = $("#searchBar");
  const open = typeof force === "boolean" ? force : !bar.classList.contains("is-open");
  bar.classList.toggle("is-open", open);
  if (open) $("#searchInput").focus();
  else { $("#searchInput").value = ""; searchTerm = ""; renderShop(); }
}

/* ---------- MENU MOBILE ---------- */
function toggleMenu(force) {
  const nav = $("#nav"), btn = $("#menuToggle");
  const open = typeof force === "boolean" ? force : !nav.classList.contains("is-open");
  nav.classList.toggle("is-open", open);
  btn.classList.toggle("is-open", open);
  btn.setAttribute("aria-expanded", String(open));
}

/* ---------- ANIMAÇÕES DE ENTRADA (IntersectionObserver) ---------- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) { entry.target.classList.add("is-visible"); revealObserver.unobserve(entry.target); }
  });
}, { threshold: 0.1 });

function observeReveals(ctx = document) {
  $$(".reveal:not(.is-visible)", ctx).forEach((el) => revealObserver.observe(el));
}

/* ---------- FEEDBACK VISUAL ---------- */
let toastTimer;
function showToast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("is-visible"), 2400);
}
function bumpCounter() {
  const c = $("#cartCount");
  c.classList.add("bump");
  setTimeout(() => c.classList.remove("bump"), 300);
}

/* ---------- INICIALIZAÇÃO ---------- */
document.addEventListener("DOMContentLoaded", () => {
  $$("[data-brand]").forEach((el) => (el.textContent = BRAND_NAME));
  $("#year").textContent = new Date().getFullYear();

  renderProducts();
  updateCart();
  observeReveals();

  // Cards de produto (todas as grades)
  $$(".product-grid").forEach((grid) => grid.addEventListener("click", handleProductClick));

  // Modal de produto
  $("#modalClose").addEventListener("click", () => toggleModal(false));
  $("#modalBackdrop").addEventListener("click", () => toggleModal(false));
  $("#modalSizes").addEventListener("click", (e) => {
    const btn = e.target.closest(".size-btn");
    if (!btn) return;
    $$("#modalSizes .size-btn").forEach((b) => { b.classList.remove("is-selected"); b.setAttribute("aria-pressed", "false"); });
    btn.classList.add("is-selected");
    btn.setAttribute("aria-pressed", "true");
  });
  $("#qtyDec").addEventListener("click", () => { if (modalQty > 1) { modalQty--; $("#qtyValue").textContent = modalQty; } });
  $("#qtyInc").addEventListener("click", () => { modalQty++; $("#qtyValue").textContent = modalQty; });
  $("#modalAdd").addEventListener("click", () => {
    const selected = $("#modalSizes .size-btn.is-selected");
    if (!selected) return showToast("Selecione um tamanho primeiro");
    addToCart(modalProduct.id, selected.dataset.size, modalQty);
    toggleModal(false);
  });

  // Carrinho
  $("#cartToggle").addEventListener("click", () => toggleCart(true));
  $("#cartClose").addEventListener("click", () => toggleCart(false));
  $("#cartBackdrop").addEventListener("click", () => toggleCart(false));
  $("#cartItems").addEventListener("click", handleCartClick);
  $("#clearCart").addEventListener("click", () => { cart = []; updateCart(); });
  $("#checkoutBtn").addEventListener("click", () => {
    if (!cart.length) return showToast("Sua bag está vazia");
    showToast("Pedido recebido! Valeu por apoiar a cena.");
    cart = []; updateCart(); toggleCart(false);
  });

  // Busca
  $("#searchToggle").addEventListener("click", () => toggleSearch());
  $("#searchClose").addEventListener("click", () => toggleSearch(false));
  $("#searchInput").addEventListener("input", (e) => { searchTerm = e.target.value; renderShop(); });

  // Conta (demonstração)
  $("#accountBtn").addEventListener("click", () => showToast("Área de conta em breve — drop 05"));

  // Filtros
  $$(".filter-btn").forEach((b) => b.addEventListener("click", () => applyFilter(b.dataset.filter)));

  // Menu mobile
  $("#menuToggle").addEventListener("click", () => toggleMenu());
  $$(".nav__link").forEach((a) => a.addEventListener("click", () => toggleMenu(false)));

  // Tecla ESC fecha tudo
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { toggleCart(false); toggleMenu(false); toggleModal(false); toggleSearch(false); }
  });
});
