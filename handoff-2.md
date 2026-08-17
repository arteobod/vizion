# Handoff — Vižon website (front_vision)

Handoff for the next agent picking up this project. Written 2026-08-01.
Read this fully before touching anything, then read `CONTENT_TODO.md`.

---

## 1. What this project is

Marketing site for **Vižon**, a small web studio in Riga (websites, redesign,
B2B tools). Multi-page, trilingual (EN / RU / LV), with a light/soft brand and
an editable admin panel + tiny CRM.

- **Framework:** Next.js 15.5.22 (App Router, `src/app`), React 19, TypeScript.
- **Styling:** Tailwind 3.4 (custom `vz-*` palette; see `tailwind.config.js` + `src/app/globals.css`).
- **Animation:** framer-motion 12.43.0 (home windows) + a couple of CSS/rAF bits.
- **three.js: removed.** There is no WebGL anymore — earlier 3D concepts were
  scrapped. `three` is uninstalled. Do not reintroduce it without a reason.
- **Deploy target:** Cloudflare Workers via `@opennextjs/cloudflare` + Wrangler.
  Data persists in a KV namespace (`VIZON_KV`) in prod, JSON files in `data/` in dev.
- Git branch `main`. Nothing is committed yet — the whole rebuild sits in the
  working tree (staged/modified). Commit when the user asks, not before.

---

## 2. THE most important context: the client iterates hard on the hero

The home page has been redesigned ~10 times. The client (writes in
transliterated Russian) is picky about the hero visual and animation. Current
accepted direction — **do not throw it away without being asked:**

**The whole home page is presented as three separate browser-window cards**
(`BrowserWindow.tsx`), each holding a "chapter" of the site, stacked with large
gaps, on a light page with soft blue/orange colour blobs behind them.

- **Windows are frosted glass** (glassmorphism): `bg-white/55 backdrop-blur-2xl`
  + white hairline border. The colour blobs behind (`src/app/(site)/page.tsx`,
  fixed `-z-0` layer) are what makes the glass read — without something behind,
  frosted glass on a flat page looks like nothing.
- **Window chrome** = traffic-light dots, a URL pill (`viz-on.net`,
  `viz-on.net/services`, `viz-on.net/work`), a chapter tag, and an orange
  loading bar that sweeps once when the window scrolls into view.
- **Animations (framer-motion, in `HomeWindows.tsx`):**
  - Window 1 (Hero): emerges from below out of blur, un-tilting from `rotateX`
    16°→0° into flat; inner content staggers in.
  - Window 2 (Services): slides up; the 3 service cards **fly in from the far
    edges** (left / bottom / right) out of blur, settle into the grid, and their
    borders animate to transparent. `ServiceCard` has a `flat` prop that drops
    its own border so the animated wrapper border is the one that fades.
  - Window 3 (Social proof): slides up; 3 minimalist metric cards
    **−55% / +62% / ×7** + a CTA row.

**Hard rule the client set on blur (respect it):** static blur must NEVER sit
over readable text. Blur is only for entry transitions (things resolving from
blur) or the extreme edge padding. The bottom `GradualBlur` strip is
deliberately short (3rem) so it only softens the very bottom seam.

Things the client explicitly **rejected** along the way (don't resurrect):
- Abstract 3D blob / "flying shape" — called it meaningless.
- Pretentious editorial labels like `( Web studio in Riga )` and `Est. 2026`.
- Dark/black glassmorphic windows — offered, client chose to keep **light** windows.

---

## 3. Routes & where the code lives

Public site is under the `(site)` route group: `src/app/(site)/`.

| Route | Folder | Content component(s) |
|---|---|---|
| `/` | `page.tsx` | `HomeWindows.tsx` (the 3 glass windows) |
| `/about` | `about/` | `AboutSections.tsx` |
| `/services` | `services/` + `[slug]/` | `ServicesSections.tsx` (4-step timeline `ProcessSteps.tsx` + FAQ `Faq.tsx`) |
| `/work` | `work/` + `[slug]/` | `PortfolioSections.tsx` (filter buttons + case grid) |
| `/pricing` | `pricing/` | `PricingSections.tsx` (4 tiers, one "popular" + "what affects the price") |
| `/contacts` | `contacts/` | `ContactsSections.tsx` (2-col: form + Riga contact card) |
| `/privatuma-politika` | privacy page | — |

**Note on the `/work` route:** it was renamed from `/portfolio` → `/work` to
match the nav and the window URL. The component files and i18n keys still use
the word "portfolio" internally (e.g. `t.portfolio.*`, `PortfolioSections.tsx`,
`t.nav.portfolio`). That's fine — only the URL changed. Don't rename the i18n
keys unless you enjoy pain.

Admin panel (dark theme, separate palette `--fv-*`): `/ctrl-8b2f` (content CMS)
and `/mgr-5k9w` (CRM). Obfuscated paths on purpose. These are self-contained and
were NOT part of the redesign — leave their look alone.

Shared layout: `src/app/(site)/layout.tsx` renders Header, main, Footer, plus
two fixed overlays: `GradualBlur` (bottom edge) and `PageFrame` (thin inset
border + orange corner ticks around the whole viewport).

Global i18n: `src/context/LanguageContext.tsx` + `src/locales/{en,ru,lv}.json`.
Every string lives in all three files; `en` is the type source. Localized data
fields use the flat-suffix convention (`title`, `title_ru`, `title_lv`) resolved
by `src/lib/i18n.ts` (`loc`, `locArray`).

Data: `src/lib/data.ts` reads/writes KV (prod) or `data/*.json` (dev).

---

## 4. Security — already hardened, don't regress it

A full pass was done (see the code, not just this list):
- **Admin API auth:** `src/middleware.ts` guards all `/api/ctrl-8b2f/*` and
  `/api/mgr-5k9w/*` (except login + the public contact POST), AND each sensitive
  route re-checks via `src/lib/api-auth.ts` (`requireAdmin`). Defense in depth —
  keep both. `src/lib/auth-edge.ts` is the edge-safe JWT verify (no bcrypt).
- **JWT fails closed:** `JWT_SECRET` unset in production throws instead of using
  a default. It's in `.env.local` for dev; make sure it's also set in the
  Cloudflare env or prod admin returns 500.
- Login has KV-backed rate limiting (`src/lib/rate-limit.ts`), contact API
  escapes HTML and never leaks internal errors, upload derives extension from
  the validated MIME type. `.env*.local` is gitignored and not tracked.
- Next was bumped to 15.5.22 to patch CVE-2025-29927 (middleware auth bypass) —
  do not downgrade below 15.2.3.

---

## 5. Content is PLACEHOLDER — must be replaced before launch

Read `CONTENT_TODO.md`. Short version: the case studies, testimonials, all the
result numbers (−55%, +62%, ×7, etc.), and the price ranges are **invented** and
clearly marked. Publishing fake client names / metrics as real is misleading.
Replace with real material or delete the entries (empty portfolio renders fine).
Email `hello@viz-on.net` and phone `+371 20 000 000` are placeholders too.

---

## 6. How to run it (Windows, and the gotchas)

Dev server:
```
npm run dev        # http://localhost:3000
```
Typecheck / build:
```
npx tsc --noEmit
npm run build
```

**Two Windows gotchas that WILL bite you — I hit them repeatedly:**

1. **Never run `npm run build` while `npm run dev` is running.** The build
   overwrites `.next`, and the live dev server then throws
   `Cannot find module './XXXX.js'` (webpack chunk). Fix: stop dev, `rm -rf .next`,
   restart dev. Cleanest habit: build → stop dev → clean → restart dev.

2. **`pkill` / `kill` do NOT stop the Node dev server on Windows here.** Killing
   the process by port is the only reliable way. When routes suddenly 404 or the
   server "won't restart," it's almost always a zombie holding port 3000 and the
   new server silently falling through to 3001/3002. Clear ports first:
   ```
   powershell -Command "Get-NetTCPConnection -LocalPort 3000,3001,3002 -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique | ForEach-Object { Stop-Process -Id $_ -Force }"
   ```
   Then start dev. Always confirm the `Local: http://localhost:3000` line — if it
   says 3001, you're testing the wrong (zombie) server.

**Current state: the dev server is NOT running** (last restart was interrupted).
Start it before testing. Last known-good `npm run build` passed: 23 routes,
shared JS ~103 kB.

Screenshots for QA: the gstack `browse` tool is set up
(`~/.claude/skills/gstack/browse/dist/browse`). `$B screenshot --viewport <path>`
then Read the PNG. Note: `/tmp` maps to `%TEMP%` (`C:\Users\arteo\AppData\Local\Temp`) —
read screenshots from the Windows path, not `/tmp`.

---

## 7. Open items / where a next agent could go

- **Real content** (the big one) — see §5.
- **Perf on real phones:** the glass windows use `backdrop-blur-2xl` (3 large
  panes). Fine in the viewport, but I could not measure FPS on a real mid-range
  Android. If it janks on scroll, drop to `backdrop-blur-xl` or reduce blob size.
- **Reduced-motion:** framer-motion entrances still play; consider gating them
  with `useReducedMotion()` if you want strict compliance.
- **Inner pages** (`/about /services /work /pricing /contacts`) are flat,
  editorial, and already match the last spec — they were not part of the
  window/glass redesign. They still use `Reveal` (simple fade/3d) for entrances.
- Contact form posts to `/api/ctrl-8b2f/contacts` (public POST) and emails via
  Resend; submissions are visible in the admin panel.

---

## 8. One-paragraph "what I'd tell you in person"

The site is functionally complete and secure; the only thing between it and
launch is real content. The client's taste lives entirely in the home hero —
they want it to feel premium and *mean something* (browser windows = "we build
websites"), and they hate anything that reads as generic AI slop or blur over
text. When you change the hero, change one thing, screenshot it, and show them —
they react to visuals, not descriptions. Everything else (routing, i18n, admin,
inner pages, security) is stable; don't rebuild it, just maintain it.
