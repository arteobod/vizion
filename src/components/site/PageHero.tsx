import Container from './Container'

/**
 * Top-of-page header for inner pages.
 *
 * The home page opens on a lit stage — a broad key light, coloured fields
 * buried under heavy blur, browser panes suspended behind glass. Every other
 * page used to open on a flat tinted band with one soft circle in the corner,
 * so the site changed material the moment anyone clicked past the front door.
 *
 * This is the same light rig at a quieter setting: the key light above the
 * fold, one cool and one warm field placed off opposite edges so the band has a
 * direction of light rather than an even wash, and the page's own grain over
 * the top. Static gradients only — no extra elements to animate, nothing that
 * costs a frame on scroll, which matters because this block sits at the top of
 * every page on the site.
 */
export default function PageHero({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  children?: React.ReactNode
}) {
  return (
    <div className="relative overflow-hidden border-b border-vz-border bg-gradient-to-b from-white via-vz-tint to-vz-soft">
      {/* Light rig. Decorative, non-interactive, and deliberately saturated
          before the blur — pale fields blur into pale nothing. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {/* Key light: broad and high, so everything below falls away from it. */}
        <div className="absolute left-1/2 top-[-18rem] h-[26rem] w-[52rem] -translate-x-1/2 rounded-full bg-white blur-[90px]" />
        {/* Cool from the left, warm from the right — the same two-accent
            relationship the rest of the site runs on. */}
        <div className="absolute -left-24 top-[-4rem] h-[24rem] w-[24rem] rounded-full bg-vz-blue/25 blur-[100px]" />
        <div className="absolute -right-20 bottom-[-8rem] h-[26rem] w-[26rem] rounded-full bg-vz-orange/20 blur-[110px]" />
      </div>

      <Container>
        <div className="relative py-14 sm:py-16 lg:py-20">
          <div className="max-w-3xl">
            {eyebrow && (
              <span className="vz-page-in inline-flex rounded-full border border-white/70 bg-white/80 px-3 py-1 text-sm font-medium text-vz-blue-deep shadow-soft-sm backdrop-blur-sm">
                {eyebrow}
              </span>
            )}
            {/* A short CSS stagger, matching the home page's opening. It runs
                from the stylesheet rather than on an observer: this is the first
                thing on the page, so it must paint without waiting for the
                bundle. */}
            <h1 className="vz-page-in mt-4 text-h1 font-display" style={{ animationDelay: '80ms' }}>
              {title}
            </h1>
            {subtitle && (
              <p
                className="vz-page-in mt-4 max-w-prose text-lead text-vz-body"
                style={{ animationDelay: '160ms' }}
              >
                {subtitle}
              </p>
            )}
            {children && (
              <div className="vz-page-in mt-7" style={{ animationDelay: '240ms' }}>
                {children}
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  )
}
