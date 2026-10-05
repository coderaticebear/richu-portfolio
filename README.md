# Richu Thankachan — portfolio

Single-page portfolio for a Technical Support Engineer and full-stack developer. Built with Next.js 16 (App Router), React 19, Tailwind CSS 4, Motion and Lenis, with six hand-written canvas and WebGL effects and no 3D library.

## Running it

```bash
npm install
npm run dev            # http://localhost:3000
npm run build && npm run start
npm run lint
```

### Tests

The end-to-end suite uses Playwright with Chromium:

```bash
npx playwright install chromium   # once
npm run test:e2e                  # builds, starts, and tests the production site
npm run test:e2e:update-snapshots # after an intentional visual change
```

Visual baselines mask every canvas, since GPU output varies between machines.

## Configuration

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Absolute base URL for share-card links, e.g. `https://example.com`. Falls back to the Vercel production URL, then `http://localhost:3000`. |

## Where things live

- `lib/content.ts` holds all copy and data: experience, skills and how they link, projects, credentials. It's the single source of truth, written from the résumé.
- `components/` has one file per page section.
- `components/effects/` has the six effects (table below), each a plain module loaded on demand.
- `lib/canvas/` is the runtime every effect shares: `use-canvas-effect.ts` (lazy loading, on-screen-only loop, pause, reduced motion, resizing, theme colors), plus WebGL, noise, and theme helpers.
- `components/reveal.tsx`, `components/reveal-observer.tsx` and `app/globals.css` implement the scroll reveals. Content is only hidden after JavaScript has run, so the page is complete without it.
- `e2e/` contains the Playwright specs.

## The effects

| Section | Effect | Built with |
| --- | --- | --- |
| Hero | Signal from Noise: static and broken traces that clear under the cursor | WebGL fragment shader |
| How I work | Tickets flow through intake, reproduce, isolate, escalate | Canvas 2D, curl-noise particles |
| Skills | Ping any skill and watch the reply travel through related ones | Canvas 2D network, breadth-first search |
| Experience | Dotted globe flying the Kerala–Toronto route as you scroll | Canvas 2D orthographic projection |
| Projects | Case-file previews dissolve from static into a diagram of the build | WebGL signed-distance shapes |
| Contact | Spark burst when the ticket form is submitted | Canvas 2D |

Every effect follows the same rules:

- Its code loads only when its section is close.
- It animates only while on screen.
- It has a Pause control.
- It shows a still frame when the visitor prefers reduced motion.
- It redraws in the current theme's colors.

Canvases are decorative (`aria-hidden`); every name, number and skill is real HTML.

Press **D** anywhere (outside a form field) for debug mode: outlines, the column grid, and live measurements.

## Share image

`app/opengraph-image.png` is a 1200×630 capture of the live hero. Re-capture it if the hero changes.

## Credits

- **Switzer** by Indian Type Foundry, self-hosted under the Fontshare Free Font License (`public/fonts-license/Switzer-FFL.txt`).
- **Geist Mono** by Vercel, SIL Open Font License, via `next/font/google`.
- **Land outlines** from [Natural Earth](https://www.naturalearthdata.com/) 1:110m (public domain), via [world-atlas](https://github.com/topojson/world-atlas). They were sampled once into ~3,800 points in `lib/geo/land-dots.json`, stored as latitude/longitude × 10.
