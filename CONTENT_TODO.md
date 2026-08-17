# Placeholder content — replace before launch

The site is structurally complete, but some content is **invented placeholder data**
written to make the layouts reviewable. Replace it with real material before going live.

## Must replace

| What | Where | Notes |
|---|---|---|
| Case studies (4) | `data/projects.json` | Clients, tasks, solutions and **all result figures** (`+62%`, `×7`, `−55%` …) are fabricated. Also the client quotes inside `testimonial`. |
| Testimonials (3) | `data/testimonials.json` | Fabricated quotes and attributed names. |
| Price ranges | `data/pricing.json` | `priceFrom` / `priceTo` are plausible market guesses, not your rates. Also check `includes` matches what you actually deliver. |
| Service prices | `data/services.json` | The `priceFrom` field on each service. |
| Phone number | `data/site-content.json` | Currently `+371 20 000 000`. |
| Email | `data/site-content.json` | Currently `hello@viz-on.net` — confirm this mailbox exists. |

Publishing invented client names, quotes, or result metrics as if they were real
is misleading to prospects. Either replace them with real projects or remove the
entries entirely — an empty portfolio renders cleanly (the grid shows an empty state).

## Optional

| What | Where | Notes |
|---|---|---|
| Team members | `data/team.json` | Ships as `[]`, which hides the team block on `/about`. Add entries to show it. |
| Case images | `data/projects.json` → `image` | Empty strings render a gradient placeholder with the client's initials. Upload real screenshots via the admin panel. |
| Studio stats | `data/stats.json` | Currently process facts (reply time, languages) rather than claims — safe as-is. |

## Where content is edited

- **Admin panel** (`/ctrl-8b2f`) — services (title, tagline, description, slug, price),
  projects, process steps, stats, and contact details.
- **JSON files** in `data/` — pricing tiers, testimonials, team, and the rich service
  fields (`whatItIs`, `forWhom`, `problems`, `benefits`, `stages`). These have no admin
  UI yet.
- **`src/locales/{en,ru,lv}.json`** — all static page copy: navigation, headings,
  the "why us" and values blocks, FAQ, and form labels. Every key exists in all three
  languages; a missing translation falls back to English.
