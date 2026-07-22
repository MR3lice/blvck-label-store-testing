/* =============================================================
   BLVCK LABEL — main.js
   Vanilla JS, no framework. One file for the whole site.
   -------------------------------------------------------------
   MODULE 2 — mobile nav toggle.
   Later modules add: shop filters (Module 6), fake cart drawer
   state (Module 8). The marquee ticker is pure CSS.
   ============================================================= */

(function () {
  "use strict";

  document.documentElement.classList.add("js");

  /* ---- Mobile nav overlay -------------------------------- */
  var overlay = document.querySelector("[data-nav-overlay]");
  var openBtn = document.querySelector("[data-nav-open]");
  var closeBtn = document.querySelector("[data-nav-close]");

  function setNav(open) {
    if (!overlay || !openBtn) return;
    overlay.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);
    openBtn.setAttribute("aria-expanded", String(open));
    if (open) {
      var first = overlay.querySelector("a, button");
      if (first) first.focus();
    } else {
      openBtn.focus();
    }
  }

  if (openBtn) openBtn.addEventListener("click", function () { setNav(true); });
  if (closeBtn) closeBtn.addEventListener("click", function () { setNav(false); });

  /* Close overlay when a nav link is tapped */
  if (overlay) {
    overlay.addEventListener("click", function (e) {
      if (e.target.closest("a")) setNav(false);
    });
  }

  /* Escape closes the overlay */
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && overlay && overlay.classList.contains("is-open")) {
      setNav(false);
    }
  });

  /* Close the overlay if the viewport grows back to desktop */
  var mq = window.matchMedia("(min-width: 768px)");
  var onChange = function (e) { if (e.matches) setNav(false); };
  if (mq.addEventListener) mq.addEventListener("change", onChange);
  else if (mq.addListener) mq.addListener(onChange);

  /* ---- Shop filters (show/hide by category) -------------- */
  var filterBtns = Array.prototype.slice.call(document.querySelectorAll("[data-filter]"));
  var shopGrid = document.querySelector("[data-shop-grid]");
  if (filterBtns.length && shopGrid) {
    var cards = Array.prototype.slice.call(shopGrid.querySelectorAll("[data-category]"));
    var empty = shopGrid.querySelector("[data-shop-empty]");

    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var filter = btn.getAttribute("data-filter");
        var shown = 0;

        filterBtns.forEach(function (b) {
          var on = b === btn;
          b.classList.toggle("is-active", on);
          b.setAttribute("aria-pressed", String(on));
        });

        cards.forEach(function (card) {
          var show = filter === "all" || card.getAttribute("data-category") === filter;
          card.classList.toggle("is-hidden", !show);
          if (show) shown++;
        });

        if (empty) empty.classList.toggle("is-hidden", shown > 0);
      });
    });
  }

  /* ---- Product catalog (shared data model) --------------- */
  var PRODUCTS = {
    "static-hoodie":       { name: "Static Hoodie",        price: 28, cat: "Hoodies & Sweats", sizes: ["S","M","L","XL"], tag: "New",
      desc: "Heavyweight pullover hood in washed black. Boxy, dropped shoulders, thumb-worn cuffs. The one you reach for first.",
      details: { Fabric: "420gsm brushed-back cotton fleece", Fit: "Oversized — size down for regular", Care: "Cold wash inside out. Hang dry." } },
    "null-hoodie":         { name: "Null Hoodie",          price: 28, cat: "Hoodies & Sweats", sizes: ["S","M","L","XL"],
      desc: "Blank-slate hood. No front hit, small mark at the nape. Same heavyweight build.",
      details: { Fabric: "420gsm brushed-back cotton fleece", Fit: "Oversized — size down for regular", Care: "Cold wash inside out. Hang dry." } },
    "signal-crewneck":     { name: "Signal Crewneck",      price: 26, cat: "Hoodies & Sweats", sizes: ["S","M","L","XL"],
      desc: "Crew-neck sweat with ribbed everything. Sits mid-hip, holds its shape.",
      details: { Fabric: "380gsm loopback cotton", Fit: "Regular", Care: "Cold wash. Hang dry." } },
    "grid-tee":            { name: "Grid Tee",             price: 16, cat: "Tees", sizes: ["S","M","L","XL"], tag: "New",
      desc: "Boxy tee with a faint grid print. Thick collar that won't roll.",
      details: { Fabric: "240gsm combed cotton", Fit: "Boxy — true to size", Care: "Cold wash inside out." } },
    "static-tee":          { name: "Static Tee",           price: 16, cat: "Tees", sizes: ["S","M","L","XL"],
      desc: "Washed-black staple tee. Heavy enough to stand on its own.",
      details: { Fabric: "220gsm ring-spun cotton", Fit: "Regular", Care: "Cold wash." } },
    "off-signal-tee":      { name: "Off-Signal Tee",       price: 18, cat: "Tees", sizes: ["S","M","L","XL"],
      desc: "Oversized tee with an off-signal back hit. Drops past the waist.",
      details: { Fabric: "240gsm combed cotton", Fit: "Oversized", Care: "Cold wash inside out." } },
    "blackout-cargo-pants":{ name: "Blackout Cargo Pants", price: 30, cat: "Bottoms", sizes: ["S","M","L","XL"], tag: "New",
      desc: "Blacked-out cargos with anchored pockets and a tapered leg. Move-first fit.",
      details: { Fabric: "320gsm cotton twill", Fit: "Relaxed, tapered", Care: "Cold wash. Hang dry." } },
    "deadstock-shorts":    { name: "Deadstock Shorts",     price: 22, cat: "Bottoms", sizes: ["S","M","L","XL"],
      desc: "Knee-length shorts cut from deadstock twill. Deep pockets, clean hem.",
      details: { Fabric: "300gsm cotton twill", Fit: "Relaxed", Care: "Cold wash." } },
    "void-cap":            { name: "Void Cap",             price: 15, cat: "Headwear", sizes: ["One Size"],
      desc: "Unstructured six-panel in flat black. Low crown, curved brim.",
      details: { Fabric: "Washed cotton, adjustable strap", Fit: "One size", Care: "Spot clean." } },
    "label-beanie":        { name: "Label Beanie",         price: 15, cat: "Headwear", sizes: ["One Size"],
      desc: "Ribbed cuff beanie with a woven label. Sits high or folded.",
      details: { Fabric: "Recycled acrylic knit", Fit: "One size", Care: "Cold wash. Reshape damp." } }
  };
  var PRODUCT_ORDER = Object.keys(PRODUCTS);
  function formatPrice(n) { return "BHD " + n.toFixed(3); }
  function imgFor(id) { return "assets/img/" + id + ".svg"; }

  /* ---- Cart (fake state, persisted in localStorage) ------ */
  var CART_KEY = "blvck_cart";
  var cartItems = readCart();
  var cartEls = buildCartDom();

  function readCart() {
    try { var v = JSON.parse(localStorage.getItem(CART_KEY)); return Array.isArray(v) ? v : []; }
    catch (e) { return []; }
  }
  function writeCart() {
    try { localStorage.setItem(CART_KEY, JSON.stringify(cartItems)); } catch (e) {}
  }
  function cartCount() { return cartItems.reduce(function (n, i) { return n + i.qty; }, 0); }
  function cartSubtotal() {
    return cartItems.reduce(function (s, i) {
      var p = PRODUCTS[i.id]; return s + (p ? p.price : 0) * i.qty;
    }, 0);
  }
  function findLine(id, size) {
    for (var i = 0; i < cartItems.length; i++) {
      if (cartItems[i].id === id && cartItems[i].size === size) return cartItems[i];
    }
    return null;
  }
  function cartAdd(id, size) {
    var line = findLine(id, size);
    if (line) line.qty++;
    else cartItems.push({ id: id, size: size, qty: 1 });
    writeCart(); renderCart();
  }
  function cartSetQty(id, size, qty) {
    var line = findLine(id, size);
    if (!line) return;
    line.qty = qty;
    if (line.qty <= 0) { cartRemove(id, size); return; }
    writeCart(); renderCart();
  }
  function cartRemove(id, size) {
    cartItems = cartItems.filter(function (i) { return !(i.id === id && i.size === size); });
    writeCart(); renderCart();
  }

  function buildCartDom() {
    var holder = document.createElement("div");
    holder.innerHTML =
      '<div class="cart-overlay" data-cart-overlay></div>' +
      '<aside class="cart" data-cart role="dialog" aria-modal="true" aria-label="Cart" aria-hidden="true">' +
        '<div class="cart__head">' +
          '<span class="cart__title">Cart <span class="cart__count" data-cart-title-count></span></span>' +
          '<button class="icon-btn" type="button" data-cart-close aria-label="Close cart">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
          '</button>' +
        '</div>' +
        '<div class="cart__body" data-cart-body></div>' +
        '<div class="cart__foot" data-cart-foot>' +
          '<div class="cart__subtotal"><span class="cart__subtotal-label">Subtotal</span><span class="cart__subtotal-val" data-cart-subtotal>BHD 0.000</span></div>' +
          '<button class="btn btn--primary cart__checkout" type="button" data-cart-checkout><span>Checkout</span></button>' +
          '<p class="cart__disclaimer">Demo — no real checkout.</p>' +
        '</div>' +
      '</aside>' +
      '<div class="toast" data-toast role="status" aria-live="polite"></div>';
    while (holder.firstChild) document.body.appendChild(holder.firstChild);
    return {
      overlay: document.querySelector("[data-cart-overlay]"),
      panel: document.querySelector("[data-cart]"),
      body: document.querySelector("[data-cart-body]"),
      foot: document.querySelector("[data-cart-foot]"),
      subtotal: document.querySelector("[data-cart-subtotal]"),
      titleCount: document.querySelector("[data-cart-title-count]"),
      toast: document.querySelector("[data-toast]")
    };
  }

  function renderCart() {
    var count = cartCount();
    document.querySelectorAll("[data-cart-count]").forEach(function (b) { b.textContent = count; });
    document.querySelectorAll(".cart-btn").forEach(function (b) {
      b.setAttribute("aria-label", "Cart, " + count + " item" + (count === 1 ? "" : "s"));
    });
    if (cartEls.titleCount) cartEls.titleCount.textContent = count ? "(" + count + ")" : "";

    if (!cartItems.length) {
      cartEls.body.innerHTML =
        '<div class="cart-empty"><p class="cart-empty__msg">Nothing here yet.</p>' +
        '<a class="btn btn--secondary" href="shop.html"><span>Shop All</span></a></div>';
      cartEls.foot.style.display = "none";
    } else {
      cartEls.foot.style.display = "";
      var html = "";
      cartItems.forEach(function (i) {
        var p = PRODUCTS[i.id];
        if (!p) return;
        html +=
          '<div class="cart-item" data-line-id="' + i.id + '" data-line-size="' + i.size + '">' +
            '<div class="cart-item__thumb"><img src="' + imgFor(i.id) + '" alt="" width="120" height="150" /></div>' +
            '<div class="cart-item__main">' +
              '<div class="cart-item__top">' +
                '<h3 class="cart-item__name">' + p.name + '</h3>' +
                '<button class="cart-item__remove" type="button" data-cart-remove aria-label="Remove ' + p.name + '">&times;</button>' +
              '</div>' +
              '<p class="cart-item__size">Size ' + i.size + '</p>' +
              '<div class="cart-item__bottom">' +
                '<div class="qty">' +
                  '<button type="button" data-qty-dec aria-label="Decrease quantity">&minus;</button>' +
                  '<span class="qty__val">' + i.qty + '</span>' +
                  '<button type="button" data-qty-inc aria-label="Increase quantity">+</button>' +
                '</div>' +
                '<span class="cart-item__price">' + formatPrice(p.price * i.qty) + '</span>' +
              '</div>' +
            '</div>' +
          '</div>';
      });
      cartEls.body.innerHTML = html;
    }
    cartEls.subtotal.textContent = formatPrice(cartSubtotal());
  }

  function cartOpen() {
    cartEls.overlay.classList.add("is-open");
    cartEls.panel.classList.add("is-open");
    cartEls.panel.setAttribute("aria-hidden", "false");
    document.body.classList.add("cart-open");
    var close = cartEls.panel.querySelector("[data-cart-close]");
    if (close) close.focus();
  }
  function cartClose() {
    cartEls.overlay.classList.remove("is-open");
    cartEls.panel.classList.remove("is-open");
    cartEls.panel.setAttribute("aria-hidden", "true");
    document.body.classList.remove("cart-open");
  }

  var toastTimer;
  function showToast(msg) {
    if (!cartEls.toast) return;
    cartEls.toast.textContent = msg;
    cartEls.toast.classList.add("is-open");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { cartEls.toast.classList.remove("is-open"); }, 2600);
  }

  document.querySelectorAll(".cart-btn").forEach(function (b) {
    b.addEventListener("click", function (e) { e.preventDefault(); cartOpen(); });
  });
  cartEls.overlay.addEventListener("click", cartClose);
  cartEls.panel.querySelector("[data-cart-close]").addEventListener("click", cartClose);
  cartEls.panel.querySelector("[data-cart-checkout]").addEventListener("click", function () {
    showToast("Demo — checkout disabled.");
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && cartEls.panel.classList.contains("is-open")) cartClose();
  });
  cartEls.body.addEventListener("click", function (e) {
    var row = e.target.closest("[data-line-id]");
    if (!row) return;
    var id = row.getAttribute("data-line-id");
    var size = row.getAttribute("data-line-size");
    var line = findLine(id, size);
    if (e.target.closest("[data-cart-remove]")) cartRemove(id, size);
    else if (e.target.closest("[data-qty-inc]")) cartSetQty(id, size, (line ? line.qty : 0) + 1);
    else if (e.target.closest("[data-qty-dec]")) cartSetQty(id, size, (line ? line.qty : 1) - 1);
  });

  renderCart(); // sync badge + drawer on every page load

  /* ---- Product page (PDP) -------------------------------- */
  var pdp = document.querySelector("[data-pdp]");
  if (pdp) initPDP();

  function initPDP() {
    var id = new URLSearchParams(location.search).get("id");
    if (!PRODUCTS[id]) id = PRODUCT_ORDER[0];
    var p = PRODUCTS[id];

    var $ = function (sel) { return pdp.querySelector(sel); };
    document.title = "BLVCK LABEL — " + p.name;

    // Text fields
    $("[data-pdp-crumb]").textContent = p.name;
    $("[data-pdp-category]").textContent = p.cat;
    $("[data-pdp-name]").textContent = p.name;
    $("[data-pdp-price]").textContent = formatPrice(p.price);
    $("[data-pdp-desc]").textContent = p.desc;
    var barPrice = document.querySelector("[data-pdp-bar-price]");
    if (barPrice) barPrice.textContent = formatPrice(p.price);

    // Images (main + thumbs) — placeholders share one source per product
    $("[data-pdp-img]").src = imgFor(id);
    $("[data-pdp-img]").alt = p.name;
    var mainImg = $("[data-pdp-img]");
    pdp.querySelectorAll(".pdp__thumb").forEach(function (thumb, i) {
      var timg = thumb.querySelector("img");
      timg.src = imgFor(id);
      timg.alt = "";
      thumb.addEventListener("click", function () {
        pdp.querySelectorAll(".pdp__thumb").forEach(function (t) { t.classList.remove("is-active"); });
        thumb.classList.add("is-active");
        mainImg.src = timg.src;
      });
    });

    // Details list
    var dl = $("[data-pdp-details]");
    dl.innerHTML = "";
    Object.keys(p.details).forEach(function (k) {
      var li = document.createElement("li");
      li.innerHTML = "<span></span><span></span>";
      li.children[0].textContent = k;
      li.children[1].textContent = p.details[k];
      dl.appendChild(li);
    });

    // Size options (rebuild for this product)
    var opts = $("[data-size-opts]");
    opts.innerHTML = "";
    var selected = null;
    p.sizes.forEach(function (size) {
      var b = document.createElement("button");
      b.className = "size-btn";
      b.type = "button";
      b.setAttribute("data-size", size);
      b.setAttribute("aria-pressed", "false");
      b.textContent = size;
      b.addEventListener("click", function () {
        selected = size;
        opts.querySelectorAll(".size-btn").forEach(function (s) {
          var on = s === b;
          s.classList.toggle("is-selected", on);
          s.setAttribute("aria-pressed", String(on));
        });
        clearNote();
      });
      opts.appendChild(b);
    });
    // Single-size items (headwear): preselect
    if (p.sizes.length === 1) opts.querySelector(".size-btn").click();

    // Add to cart (Module 8 wires the drawer + persistent state)
    var note = $("[data-pdp-note]");
    function clearNote() { if (note) { note.textContent = ""; note.removeAttribute("data-state"); } }
    function addToCart() {
      if (p.sizes.length > 1 && !selected) {
        note.textContent = "Select a size first.";
        note.setAttribute("data-state", "error");
        opts.querySelector(".size-btn").focus();
        return;
      }
      var size = selected || p.sizes[0];
      clearNote();
      cartAdd(id, size);   // updates state + badge
      cartOpen();          // slide the drawer in with the item
    }
    pdp.querySelectorAll("[data-add-to-cart]").forEach(function (btn) {
      btn.addEventListener("click", function (e) { e.preventDefault(); addToCart(); });
    });
    var form = $("[data-pdp-form]");
    if (form) form.addEventListener("submit", function (e) { e.preventDefault(); });

    // "Also in this drop" — 4 other products
    var also = document.querySelector("[data-also-grid]");
    if (also) {
      PRODUCT_ORDER.filter(function (pid) { return pid !== id; })
        .slice(0, 4)
        .forEach(function (pid) {
          var q = PRODUCTS[pid];
          var a = document.createElement("a");
          a.className = "p-card";
          a.href = "product.html?id=" + pid;
          a.innerHTML =
            '<div class="p-card__media">' +
              (q.tag ? '<span class="p-card__tag">' + q.tag + '</span>' : "") +
              '<img class="p-card__img" src="' + imgFor(pid) + '" alt="' + q.name + '" width="800" height="1000" loading="lazy" />' +
            '</div>' +
            '<div class="p-card__info">' +
              '<h3 class="p-card__name"></h3>' +
              '<p class="p-card__price"></p>' +
            '</div>';
          a.querySelector(".p-card__name").textContent = q.name;
          a.querySelector(".p-card__price").textContent = formatPrice(q.price);
          also.appendChild(a);
        });
    }
  }

  /* ---- Contact form (demo — no backend) ------------------ */
  var contactForm = document.querySelector("[data-contact-form]");
  if (contactForm) {
    var contactNote = contactForm.querySelector("[data-contact-note]");
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      // native-style validation without blocking the demo
      var missing = Array.prototype.slice.call(
        contactForm.querySelectorAll("[required]")
      ).filter(function (f) { return !f.value.trim(); });
      if (missing.length) {
        contactNote.textContent = "Fill in every field first.";
        contactNote.setAttribute("data-state", "error");
        missing[0].focus();
        return;
      }
      var done = document.createElement("p");
      done.className = "contact__done";
      done.setAttribute("role", "status");
      done.textContent = "Message sent. We'll hit you back.";
      contactForm.replaceWith(done);
    });
  }

  /* ---- Newsletter capture (demo — no backend) ------------ */
  var newsForm = document.querySelector("[data-news-form]");
  if (newsForm) {
    newsForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var done = document.createElement("p");
      done.className = "footer__news-done";
      done.setAttribute("role", "status");
      done.textContent = "You're on the list.";
      newsForm.replaceWith(done);
    });
  }
})();
