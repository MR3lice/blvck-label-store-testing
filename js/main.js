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
