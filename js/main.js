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
})();
