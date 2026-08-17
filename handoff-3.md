# Handoff 3 — Vižon website (front_vision)

Written 2026-08-18, after a long session on the home page and the case studies.
Read `handoff-2.md` first for the project fundamentals — stack, routes, i18n,
admin panel, security. **Everything in handoff-2 §2 about the home page is now
out of date**; this file replaces it. The rest of handoff-2 still holds.

---

## 1. What changed since handoff-2

The home page went from three browser windows to **four**, gained a headline
banner above the hero, a scroll-driven tilt, and a background of drifting
miniature browser windows. The case system learned to tell client work from our
own, and to show video. All four placeholder case studies were deleted and
replaced with three real ones.

Nothing is committed. The whole thing still sits in the working tree.

---

## 2. The home page, window by window

Everything lives in `src/components/site/HomeWindows.tsx`.

| # | Chapter | URL shown | Content |
|---|---|---|---|
| 1 | 01 — Studio | viz-on.net | Hero copy, with the banner above the window |
| 2 | 02 — What we do | viz-on.net/services | Three service cards + four "why us" points |
| 3 | 03 — Work | viz-on.net/work | The case grid. **Disappears entirely when there is no case data** |
| 4 | 04 — Start | viz-on.net/contacts | Closing CTA, centred |

All four windows are the same size on purpose: `min-h-[82vh]`, `max-w-window`
(95rem), identical padding. The client asked for this explicitly after calling
an earlier, smaller window "toy-like". **Do not make one window a different
size** — it reads as a mistake rather than emphasis.

### The banner

A short lead-in and a huge payoff, sitting above window 1 and pulling away as
you scroll (`ScrollTiltWindow`, `header` prop). Copy is `home.banner.lead` /
`home.banner.title`:

> Everything we build / **has to work**

**It is deliberately service-neutral.** The first version said "We build
websites that bring in clients" and the client rejected it: B2B tools matter to
them as much as websites, possibly more, and naming one service sidelines the
other. Keep any replacement about the principle, not the product.

The banner carries the page's only `h1`. The headline inside window 1 was
stepped down to `h2` when the banner arrived.

### The hero tilt

`src/components/site/ScrollTiltWindow.tsx`. The window lies back 30° in 3D and
straightens as the reader scrolls, finishing at 70% of the range.

Two things there are easy to "fix" and break:

**Nothing is pinned, on purpose.** An earlier version used `position: sticky`
so the window stayed put while the tilt resolved. It works, and it feels dead —
the window goes nowhere. Now the section is simply taller than the viewport and
ordinary flow carries the window up the screen while it straightens, so it
drives out toward the reader. If you reintroduce `sticky`, you will lose that.

**The rise out of blur is a one-shot on load, not scroll-linked.** Tying blur
to scroll leaves the headline smeared for as long as the reader sits still, and
that is the state visitors land on. The brand rule from handoff-2 — static blur
never over readable text — is what forces this split.

### Background panes

`src/components/site/FloatingWindows.tsx`. Six miniature browser windows
drifting in 3D on the fixed decorative layer, refracted by the frosted glass in
front and sharp in the gaps between windows.

The first version was a grid of grey bars and read as a skeleton loader — the
"content is still loading" look, which is exactly the unfinished impression to
avoid. Now each pane runs a different miniature layout (landing, dashboard,
order table, form, article), depth is graded three ways (scale, blur, opacity,
border weight and shadow all move together), and each is lit from the same
direction as the page.

Not WebGL, deliberately. These are flat rectangles with crisp edges; CSS 3D
draws them exactly and costs nothing next to the four `backdrop-blur-2xl` panes
already on the page. `three` is still in `package.json` at ~25 MB with **zero
imports anywhere** — handoff-2 claimed it was uninstalled; only its usage was.
It can be dropped.

Four panes are hidden below `md`. A phone has no empty right half to fill.

### Light and the black outline

The client called the page "raw". Three things fixed it:

- **A near-black 2px outline** on every window (`--vz-ink`, `16 19 24` — not
  pure black, which reads as a rendering artefact on a light page), with a
  white hairline bevel just inside it so the edge is a lit frame and not a
  cutout.
- **A deep layered shadow** (`--vz-shadow-window`), five casts of decreasing
  opacity. An earlier attempt spread it over 233px and it read as fog; keep it
  tight near the edge.
- **A light rig** on the page: a vertical gradient, a broad white key light
  above the fold, saturated colour fields, and a corner vignette. The fields
  look too strong on the bare page on purpose — frosted glass over white eats
  most of what is behind it. One iteration overshot and the blue-to-orange wash
  became the loudest thing on screen, which is the stock-gradient look the
  client hates. Current values are the dialled-back ones.

---

## 3. Case studies

### Real content only, as of now

The four placeholder cases (TransitFlow, Baltic Dental, Nordic Systems, Verde
Trading) are **deleted**, along with `data/testimonials.json`, which quoted the
same invented companies. Three real cases remain:

| id | slug | kind | notes |
|---|---|---|---|
| PRJ-005 | `voxent-ai-restaurant-manager` | own | Own product. Has a 30s screen recording |
| PRJ-006 | `lady-travel-agency-website` | client | Live at lady-travel.com, link shown |
| PRJ-007 | `vimba-fishing-shop` | client | Pre-launch, deliberately no link |

**None of them has result metrics.** The projects either launched too recently
or are still pre-launch. The results block hides itself when `results` is
empty, so the pages render clean. When real numbers exist, they go in.

The home page's window 4 used to open with three headline metrics (−55%, +62%,
×7). They were invented and they named the deleted cases, so they went too. The
window is now a closing CTA. The copy on window 3 and on `/work` was rewritten
at the same time — it promised "results" and "numbers that moved in the right
direction", which nothing on the site could back any more.

### The honesty line the client set

Asked directly whether we could "embellish a bit" in a case, the agreed
position was: tone, ambition and persuasive writing are fine; invented result
percentages, fabricated client names and made-up testimonials are not. The
reasoning that landed was practical rather than moral — one prospect who checks
is a lost prospect, and misleading commercial claims are regulated in the EU.
Hold that line; it was accepted, not merely tolerated.

### New fields on `Project`

```ts
kind?: 'client' | 'own'   // absent means 'client'
video?: string            // /media/*.mp4, takes precedence over `image`
videoPoster?: string
link?: string             // now actually rendered
```

`kind: 'own'` swaps three labels on the case page that would otherwise assert
things that are not true of a self-initiated build:

| | client | own |
|---|---|---|
| meta row | Client → *name* | Project → Own project |
| section | The client's task | The problem |
| section | Results achieved | What was built |

`link` renders an "Open the site" button in the case hero, `target="_blank"`
with `rel="noopener noreferrer"`. `Button` adds those only for `http(s)` —
`mailto:` and `tel:` hand off to another app and must stay in the same tab.

### Video

`src/components/site/CaseVideo.tsx`. Plays when the reader reaches it, pauses
when it leaves the viewport, stops outright on unmount. Muted (autoplay is
blocked otherwise, and the recordings are silent anyway), looped, with
controls.

The visibility threshold is `0.25`, not higher: at the top of a case page only
about a third of the video block is above the fold, and a stricter threshold
means it never starts.

For Voxent the audio track was stripped from the file as well — it measured
−65.8 dB mean, pure recording noise. Remuxed with `-c copy -an`, so the video
is untouched.

**The native controls are gone, replaced by two custom buttons.** The client
asked about removing the progress bar; Chrome's black slab across the bottom of
a case page was the one piece of UI on the site nobody had designed. What
replaced it is deliberately minimal — pause and fullscreen, round, in the
site's own black-outline language, hidden while playing and revealed on hover.

Three decisions worth not undoing:

- **Pause is not optional.** WCAG 2.2.2 requires a way to stop anything that
  plays by itself for more than five seconds, and this clip loops for 30.
  Whatever it costs visually, one control has to stay.
- **Fullscreen stays** because the product UI inside the recording is small at
  card width and unreadable on a phone. It goes fullscreen on the *wrapper*, not
  the video, so the custom buttons come along; iOS Safari refuses a div and
  falls back to the video's own native path.
- **No scrubber.** It was what made the native bar look heavy, and a short
  looping clip has nothing worth seeking to.

A pause by the reader outranks the viewport observer — scrolling past and back
will not restart something they deliberately stopped. Verified: pause, scroll
away, scroll back, still paused.

Touch devices have no hover, so the controls simply stay visible there
(`(hover: hover)` media query). The state starts as `true` so server and first
client render agree.

---

## 4. Bugs found and fixed — worth knowing, they will recur

**Framer cannot animate a CSS variable.** `borderColor: 'rgb(var(--vz-border-strong))'`
silently does nothing and logs a warning. The service-card border fade
described in handoff-2 as working had never worked. Use a literal colour.

**IntersectionObserver deadlock by geometry.** Window 2's outer cards enter with
`x: ±280`. On a 390px phone that leaves ~18% of the card visible, under the 20%
`amount` threshold — so the card can never expose enough of itself to trigger
the entrance that would have brought it into view. It sat invisible forever,
leaving a screen-tall hole under the heading. Fixed with `amount: 'some'` plus
no horizontal offset on narrow screens. **Any element that enters from off the
edge needs `'some'`, never a fraction.**

**`initial` is read once and never again.** The `compact` flag comes from a
`matchMedia` effect that runs after the first render, so a card mounted with the
desktop variant kept its 280px offset even after the flag flipped. Fixed by
putting the breakpoint in the element's `key` so it remounts.

**The fixed decorative layer painted over the footer.** Its panes are
viewport-fixed, so at the bottom of the page they landed on the contact
details. The footer now carries `relative z-10`.

**A JSX comment cannot sit before the root element.** `return ( {/* … */} <div> )`
is two siblings and a parse error. Cost me two rounds; put the comment above
`return`.

---

## 5. Running things

**Always clear the ports first.** Twice this session a zombie from a previous
run held 3000, the new server fell through to 3001 without complaining, and I
spent a while looking at stale code and debugging a 500 that did not exist.

```bash
powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort 3000,3001,3002,3006,3100 -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique | ForEach-Object { Stop-Process -Id \$_ -Force }"
```

Then `npm run dev` and **confirm the log says 3000**.

`document.documentElement.scrollWidth > clientWidth` reports true on this page
and always will — the tilted hero's perspective flare and the decorative blobs
overflow, both clipped by `html { overflow-x: hidden }`. It is not a bug. Test
by actually panning: `window.scrollTo(200,0)` then read `window.scrollX`. If it
stays 0, there is no horizontal scroll.

### Related projects on this machine

Two other repos came up while building cases:

- **`C:\Users\arteo\Desktop\Voxent`** — the own-product landing. `npx next dev -p 3100`.
  Single page, no backend. Next 16 with its own `AGENTS.md` warning that the API
  differs from training data.
- **`C:\Users\arteo\Desktop\Klient`** — the Vimba.lv shop. **Must run on 3006**;
  `.env.local` pins `AUTH_URL` there and any other port returns 500 on every
  page. Its Neon database sleeps and may fail the first request. It has its own
  detailed `handoff-1.md` — read it before touching anything.

---

## 6. Translations

Audited this session against DeepL by round-tripping RU and LV back to English
and comparing with the source — about 500 comparisons across the locale files
and the localized data fields.

Result: the translations are good. Structure is exact (207 keys in all three
files, no gaps), terminology is consistent (`pārveidošana`, `pieteikums`,
`редизайн`, `заявка`), and most divergence is natural paraphrase rather than
error. One real bug was found and fixed: the Latvian for a Verde Trading metric
had dropped "pipeline" — that case has since been deleted anyway.

Short labels cannot be audited this way; word-overlap scoring on two words is
noise. Only strings of six words or more gave useful signal.

The owner supplied a DeepL API key in chat. It was never written to disk —
passed through an environment variable — but it is in the conversation history
and should be rotated.

---

## 7. Open items

- **Result metrics.** Nothing measurable exists yet. This is the single biggest
  gap in the portfolio.
- **Vimba.lv case:** year is a guess (2026), and there is no link because the
  shop cannot take payment yet. Revisit at launch.
- **Lady Travel case:** the "task" section is a reconstruction from what the
  site implies, not something the client said. Confirm before publishing.
- **Voxent case:** the owner said a working prototype exists in another repo.
  It was never located. The solution text describes the product in their words,
  without implementation detail.
- **`three` can be removed** from package.json.
- **Placeholder contact details** remain: `hello@viz-on.net`,
  `+371 20 000 000`. Also `data/pricing.json` and service prices, per
  `CONTENT_TODO.md`.
- **Security** was not touched this session. The pass described in handoff-2 §4
  was verified still in place (middleware, `requireAdmin` on eight routes, JWT
  failing closed, Next 15.5.22, env files untracked). New code does not touch
  auth or data handling. `JWT_SECRET` must be set in the Cloudflare env or prod
  admin returns 500.

---

## 8. Working with this client

They react to visuals, not descriptions. Change one thing, screenshot it, show
it. They will tell you plainly when something is wrong and they are usually
right — "the windows look toy-like", "this looks raw", "the 3D windows don't
look good" all pointed at real problems I had rationalised away.

They also correct scope quickly and expect you to keep up: a request to widen a
window came one message after a request to narrow it, because seeing it changed
their mind. That is normal here, not indecision.

From this session on they take their own screenshots to save tokens. Ask for
exactly what you need — which page, which width, roughly where — and keep doing
the cheap non-visual checks (DOM measurements, console, `tsc`, HTTP codes)
yourself. Those are what caught most of the real bugs above.
