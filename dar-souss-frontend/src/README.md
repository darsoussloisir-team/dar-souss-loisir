# Dar Souss Loisir — Frontend

React + Vite frontend for the Dar Souss Loisir tourism website.

## Quick Start

```bash
npm install
npm run dev
```

Visit http://localhost:5173 — the Vite dev server proxies `/api/*` to your FastAPI backend on port 8000.

## Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx / .css     — sticky nav, mobile menu
│   │   └── Footer.jsx / .css     — links, contact, WhatsApp CTA
│   ├── sections/
│   │   ├── Hero.jsx / .css       — full-bleed cinematic hero
│   │   ├── Story.jsx / .css      — about / our values
│   │   ├── Experiences.jsx / .css — 3 package cards
│   │   ├── Journey.jsx / .css    — step-by-step process + map
│   │   └── Contact.jsx / .css    — contact form
│   └── ui/
│       ├── BookingModal.jsx / .css — full booking form modal
│       └── WhatsAppButton.jsx / .css — floating WhatsApp button
├── hooks/
│   └── useScrollReveal.js        — intersection observer fade-up
├── pages/
│   └── Home.jsx                  — assembles all sections
├── services/
│   └── api.js                    — axios calls to FastAPI backend
└── styles/
    └── globals.css               — design system, CSS variables, typography
```

## Replacing Placeholder Images

The hero and section images currently use Unsplash placeholders. Replace them with your own photos:

1. Put your photos in `src/assets/`
2. Import them: `import heroImg from '../assets/hero.jpg'`
3. Use as `src={heroImg}` on the `<img>` tag

Recommended photos:
- Hero: wide landscape shot of camels at sunset
- Story main: camel trek through dunes or eucalyptus forest
- Story accent: mint tea or ranch detail
- Journey strip: silhouette of camels against the sky

## Build for Production

```bash
npm run build
```

Output goes to `dist/`. Deploy this folder to any static host (Netlify, Vercel, Hostinger static).

Make sure your backend CORS allows your production domain.

## Design System

All design tokens are in `src/styles/globals.css`:

```css
--green-deep:  #365a1a   /* brand primary — used sparingly */
--green-gold:  #9f9003   /* brand accent — dividers, dots */
--sand-50:     #faf8f4   /* page background */
--ink-900:     #1a1208   /* headings, dark elements */
--terra-500:   #a67c52   /* body text */
```

Fonts: Cormorant Garamond (display) + Jost (body) — loaded from Google Fonts.