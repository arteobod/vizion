/**
 * Small browser windows suspended in 3D behind the page.
 *
 * They live on the fixed decorative layer with the colour fields, so the big
 * frosted panes in front refract them: through the glass they read as soft
 * rectangular shapes, and they sharpen in the gaps between windows. Background
 * texture that means something ("we build websites") rather than abstract
 * decoration.
 *
 * Three things keep them from reading as skeleton loaders, which is what any
 * grid of grey bars turns into:
 *
 *  - Each pane runs a different miniature layout — a landing page, a
 *    dashboard, an order table, a form, an article. They are meant to look
 *    like screenshots of built things, not like content still loading.
 *  - Depth is graded. Far panes are smaller, softer, paler and slightly out of
 *    focus; near ones are crisp with a heavy shadow. Atmospheric perspective
 *    does more for the sense of space than the rotation does.
 *  - Every pane is lit from the same direction as the rest of the page, with a
 *    diagonal sheen across the glass and a white bevel inside the dark edge.
 *
 * Deliberately not WebGL. These are flat rectangles with crisp edges; CSS 3D
 * draws them exactly and costs nothing next to the backdrop blur already on
 * the page.
 *
 * Four nested elements per pane, because each owns a transform that would
 * otherwise overwrite the others: position drift → rotation sway → its own
 * perspective → the resting 3D angle. The perspective has to sit on the
 * immediate parent; inherited from further up it gets flattened by the
 * transforms in between, and a rotateY with no perspective just looks like a
 * horizontal squash.
 */

type Depth = 'near' | 'mid' | 'far'
type Layout = 'landing' | 'dashboard' | 'table' | 'form' | 'article'

type Pane = {
  place: string
  layout: Layout
  depth: Depth
  /** Resting 3D angle, before drift and sway. */
  angle: string
  drift: number
  sway: number
  delay: number
}

// Weighted to the right side and the low edges. The hero copy sits top-left
// inside the pane in front, and a rectangle drifting behind a headline reads
// as a rendering fault; the right half of the hero is empty, so the panes fill
// it instead.
//
// A phone has no empty right half — the copy spans the full width — so all but
// two are dropped there, and those two sit low enough to only ever show in the
// gap below a window.
const PANES: Pane[] = [
  {
    // Sits beside the banner headline, so it is held back a plane. At full
    // strength a coloured chart this size wins the first screen outright.
    place: 'hidden md:block md:right-[3%] md:top-[11%] md:w-[18rem]',
    layout: 'dashboard', depth: 'mid',
    angle: 'rotateX(9deg) rotateY(-18deg)', drift: 19, sway: 26, delay: -4,
  },
  {
    place: 'hidden md:block md:right-[23%] md:top-[35%] md:w-[13rem]',
    layout: 'form', depth: 'far',
    angle: 'rotateX(-7deg) rotateY(-11deg)', drift: 15, sway: 21, delay: 0,
  },
  {
    place: 'hidden md:block md:right-[1%] md:top-[59%] md:w-[21rem]',
    layout: 'table', depth: 'near',
    angle: 'rotateX(8deg) rotateY(-15deg)', drift: 22, sway: 29, delay: -9,
  },
  {
    place: 'hidden md:block md:right-[35%] md:top-[-7%] md:w-[12rem]',
    layout: 'article', depth: 'far',
    angle: 'rotateX(13deg) rotateY(10deg)', drift: 24, sway: 19, delay: -6,
  },
  {
    place: '-left-10 top-[86%] w-[11rem] md:left-[1%] md:top-[69%] md:w-[17rem]',
    layout: 'landing', depth: 'mid',
    angle: 'rotateX(-8deg) rotateY(16deg)', drift: 17, sway: 24, delay: -13,
  },
  {
    place: 'left-[42%] top-[95%] w-[9rem] md:left-[26%] md:top-[89%] md:w-[14rem]',
    layout: 'dashboard', depth: 'mid',
    angle: 'rotateX(-11deg) rotateY(7deg)', drift: 16, sway: 27, delay: -2,
  },
]

// Distance cues, applied together. Scale, focus, contrast and shadow weight all
// have to agree or the pane reads as a mistake rather than as further away.
const DEPTH: Record<Depth, { scale: number; blur: number; opacity: number; edge: string; shadow: string }> = {
  near: {
    scale: 1, blur: 0, opacity: 1,
    edge: 'border-vz-ink/75',
    shadow: '0 20px 44px -12px rgba(20,24,31,0.42), 0 5px 12px rgba(20,24,31,0.16)',
  },
  mid: {
    scale: 0.9, blur: 0.7, opacity: 0.82,
    edge: 'border-vz-ink/55',
    shadow: '0 14px 32px -12px rgba(20,24,31,0.3), 0 3px 8px rgba(20,24,31,0.1)',
  },
  far: {
    scale: 0.78, blur: 2, opacity: 0.55,
    edge: 'border-vz-ink/35',
    shadow: '0 10px 24px -10px rgba(20,24,31,0.2)',
  },
}

export default function FloatingWindows() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {PANES.map((pane) => {
        const d = DEPTH[pane.depth]
        return (
          <div
            key={pane.place}
            className={`absolute animate-drift ${pane.place}`}
            style={{ animationDuration: `${pane.drift}s`, animationDelay: `${pane.delay}s` }}
          >
            <div
              className="animate-sway"
              style={{ animationDuration: `${pane.sway}s`, animationDelay: `${pane.delay}s` }}
            >
              <div style={{ perspective: 900 }}>
                <div
                  style={{
                    transform: `${pane.angle} scale(${d.scale})`,
                    filter: d.blur ? `blur(${d.blur}px)` : undefined,
                    opacity: d.opacity,
                  }}
                >
                  <MiniWindow layout={pane.layout} edge={d.edge} shadow={d.shadow} />
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function MiniWindow({
  layout,
  edge,
  shadow,
}: {
  layout: Layout
  edge: string
  shadow: string
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[10px] border bg-white ${edge}`}
      style={{ boxShadow: shadow }}
    >
      {/* Chrome. No lock glyph at this size — an icon a few pixels across is
          mush, and a plain pill reads as an address bar on its own. */}
      <div className="flex h-[18px] items-center gap-[3px] border-b border-vz-ink/10 bg-gradient-to-b from-white to-vz-bg-soft px-2">
        <span className="h-[3px] w-[3px] rounded-full bg-vz-orange" />
        <span className="h-[3px] w-[3px] rounded-full bg-vz-blue" />
        <span className="h-[3px] w-[3px] rounded-full bg-vz-border-strong" />
        <span className="ml-1.5 h-[6px] flex-1 rounded-full bg-vz-bg-soft ring-1 ring-vz-border" />
      </div>

      {/* Fixed 16:10 viewport rather than letting the content set the height.
          Left to itself a short layout collapses the pane into a letterbox,
          and nothing about that shape says "browser window". */}
      <div className="relative flex aspect-[16/10] bg-white p-2">{LAYOUTS[layout]}</div>

      {/* Light, over everything: a diagonal sheen from the page's key light,
          and a white bevel just inside the dark edge so the outline reads as a
          lit frame instead of a cutout. Kept weak — at full strength it blows
          out the corner it lands on and the layout underneath disappears. */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.5)_0%,rgba(255,255,255,0.08)_26%,transparent_52%)]" />
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/60" />
    </div>
  )
}

/* ── Miniature layouts ──────────────────────────────────────────────
   Sized in raw pixels rather than the type scale: these are pictures of
   interfaces, not text, and they have to hold their proportions at a third of
   normal size.

   Each one fills the 16:10 viewport — one block per layout takes the leftover
   height. A layout that only dresses the top leaves a dead white slab beneath
   it, which is exactly what a half-finished page looks like. */

const LAYOUTS: Record<Layout, React.ReactNode> = {
  // Marketing page: headline, sub-line, orange CTA, hero band.
  landing: (
    <div className="flex h-full w-full flex-col gap-[5px]">
      <span className="block h-[7px] w-2/3 rounded-full bg-vz-text/80" />
      <span className="block h-[4px] w-1/2 rounded-full bg-vz-text/25" />
      <div className="flex items-center gap-[5px] pt-[2px]">
        <span className="h-[10px] w-[34px] rounded-[3px] bg-vz-orange" />
        <span className="h-[10px] w-[26px] rounded-[3px] bg-white ring-1 ring-vz-border-strong" />
      </div>
      <div className="mt-[2px] flex-1 rounded-[4px] bg-gradient-to-br from-vz-blue-soft via-white to-vz-orange-soft ring-1 ring-vz-border" />
    </div>
  ),

  // Internal tool: sidebar, KPI row, bar chart. The B2B half of the work.
  dashboard: (
    <div className="flex h-full w-full gap-[5px]">
      <div className="flex w-[16px] shrink-0 flex-col gap-[3px] rounded-[3px] bg-vz-bg-soft p-[3px] ring-1 ring-vz-border">
        <span className="block h-[3px] shrink-0 rounded-full bg-vz-blue/70" />
        <span className="block h-[3px] shrink-0 rounded-full bg-vz-border-strong" />
        <span className="block h-[3px] shrink-0 rounded-full bg-vz-border-strong" />
        <span className="block h-[3px] shrink-0 rounded-full bg-vz-border-strong" />
      </div>
      <div className="flex flex-1 flex-col gap-[5px]">
        <div className="flex shrink-0 gap-[4px]">
          <span className="h-[13px] flex-1 rounded-[3px] bg-vz-blue-soft ring-1 ring-vz-blue/20" />
          <span className="h-[13px] flex-1 rounded-[3px] bg-vz-orange-soft ring-1 ring-vz-orange/20" />
          <span className="h-[13px] flex-1 rounded-[3px] bg-vz-bg-soft ring-1 ring-vz-border" />
        </div>
        <div className="flex flex-1 items-end gap-[3px] rounded-[3px] bg-vz-bg-soft px-[4px] pb-[3px] ring-1 ring-vz-border">
          <span className="h-[30%] flex-1 rounded-t-[1px] bg-vz-blue/45" />
          <span className="h-[55%] flex-1 rounded-t-[1px] bg-vz-blue/60" />
          <span className="h-[40%] flex-1 rounded-t-[1px] bg-vz-blue/45" />
          <span className="h-[78%] flex-1 rounded-t-[1px] bg-vz-orange" />
          <span className="h-[62%] flex-1 rounded-t-[1px] bg-vz-blue/60" />
          <span className="h-[88%] flex-1 rounded-t-[1px] bg-vz-blue/70" />
        </div>
      </div>
    </div>
  ),

  // Order list: header row, striped rows, status pills.
  table: (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-[3px] ring-1 ring-vz-border">
      <div className="flex shrink-0 items-center gap-[5px] bg-vz-bg-soft px-[5px] py-[3px]">
        <span className="h-[3px] w-[26px] rounded-full bg-vz-text/40" />
        <span className="h-[3px] w-[18px] rounded-full bg-vz-border-strong" />
        <span className="ml-auto h-[3px] w-[14px] rounded-full bg-vz-border-strong" />
      </div>
      {[
        { w: 'w-[38px]', pill: 'bg-vz-blue/55' },
        { w: 'w-[30px]', pill: 'bg-vz-orange' },
        { w: 'w-[42px]', pill: 'bg-vz-blue/35' },
        { w: 'w-[34px]', pill: 'bg-vz-blue/55' },
        { w: 'w-[44px]', pill: 'bg-vz-blue/35' },
        { w: 'w-[28px]', pill: 'bg-vz-orange' },
      ].map((row, i) => (
        <div
          key={row.w}
          className={`flex flex-1 items-center gap-[5px] px-[5px] ${i % 2 ? 'bg-vz-bg-soft/60' : 'bg-white'}`}
        >
          <span className={`h-[3px] rounded-full bg-vz-text/25 ${row.w}`} />
          <span className={`ml-auto h-[6px] w-[15px] rounded-full ${row.pill}`} />
        </div>
      ))}
    </div>
  ),

  // Contact form: labelled fields and a submit button.
  form: (
    <div className="flex h-full w-full flex-col gap-[4px]">
      <span className="block h-[5px] w-1/2 shrink-0 rounded-full bg-vz-text/70" />
      <span className="block h-[9px] shrink-0 rounded-[3px] bg-vz-bg-soft ring-1 ring-vz-border" />
      <span className="block h-[9px] shrink-0 rounded-[3px] bg-vz-bg-soft ring-1 ring-vz-border" />
      <span className="block flex-1 rounded-[3px] bg-vz-bg-soft ring-1 ring-vz-border" />
      <span className="block h-[10px] w-[40px] shrink-0 rounded-[3px] bg-vz-orange" />
    </div>
  ),

  // Content page: text column beside an image block.
  article: (
    <div className="flex h-full w-full flex-col gap-[4px]">
      <span className="block h-[5px] w-3/4 shrink-0 rounded-full bg-vz-text/75" />
      <div className="flex flex-1 gap-[5px]">
        <div className="flex flex-1 flex-col justify-between py-[1px]">
          <span className="block h-[3px] rounded-full bg-vz-border-strong" />
          <span className="block h-[3px] rounded-full bg-vz-border-strong" />
          <span className="block h-[3px] w-4/5 rounded-full bg-vz-border-strong" />
          <span className="block h-[3px] rounded-full bg-vz-border-strong" />
          <span className="block h-[3px] w-2/3 rounded-full bg-vz-border-strong" />
        </div>
        <span className="w-[38px] shrink-0 rounded-[3px] bg-gradient-to-br from-vz-blue-soft to-vz-orange-soft ring-1 ring-vz-border" />
      </div>
    </div>
  ),
}
