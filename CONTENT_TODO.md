# Placeholder content — replace before launch

The site is structurally complete, but some content is **invented placeholder data**
written to make the layouts reviewable. Replace it with real material before going live.

## Must replace

| What | Where | Notes |
|---|---|---|
| Result metrics | `data/projects.json` → `results` | All three real cases ship with an empty `results` array, because nothing measurable exists yet. The block hides itself, so the pages render clean. Fill it in when there are real numbers. |
| Price ranges | `data/pricing.json` | `priceFrom` / `priceTo` are plausible market guesses, not your rates. Also check `includes` matches what you actually deliver. |
| Service prices | `data/services.json` | The `priceFrom` field on each service. |

The four fabricated case studies and the testimonials that quoted them are gone;
the portfolio now holds three real projects. Keep it that way. Publishing invented
client names, quotes, or result metrics as if they were real is misleading to
prospects, and one prospect who checks is a lost prospect.

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
