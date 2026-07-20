# BLVCK LABEL

Static streetwear demo storefront. Bahrain/GCC, mobile-first. Plain HTML/CSS/JS — no
framework, no backend, no Shopify. Cart is fake (styled drawer with JS-only state).

**"Move first."**

## Stack

- HTML + one stylesheet (`css/style.css`, mobile-first, all design tokens in `:root`)
- Vanilla JS (`js/main.js`)
- Bebas Neue (display) · Helvetica Neue stack (body)
- Deploy target (later): Vercel

## Structure

```
index.html        → Home
shop.html         → Shop All            (Module 6)
product.html      → Product page        (Module 7)
about.html        → About               (Module 9)
contact.html      → Contact             (Module 9)
css/style.css     → single stylesheet, :root tokens at top
js/main.js        → ticker, mobile nav, filters, cart drawer state
assets/img/       → real photos land here later (placeholders for now)
```

## Build progress

Built one module at a time, approved before the next:

- [x] **1 — Foundation** · tokens, fonts, base reset
- [ ] 2 — Ticker + header + mobile nav
- [ ] 3 — Hero
- [ ] 4 — New Drop grid
- [ ] 5 — Archive list + brand strip + footer
- [ ] 6 — Shop All + filter bar
- [ ] 7 — Product page + size selector
- [ ] 8 — Cart drawer (fake state)
- [ ] 9 — About + Contact
- [ ] 10 — Mobile polish pass

## Viewing

Open `index.html` in a browser. No build step.
