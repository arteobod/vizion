import Container from './Container'

/** Top-of-page header for inner pages — soft tinted band, plenty of air. */
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
    <div className="relative overflow-hidden border-b border-vz-border bg-vz-tint">
      {/* Soft blue wash, decorative only */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-vz-blue/10 blur-3xl"
      />
      <Container>
        <div className="relative py-14 sm:py-16 lg:py-20">
          <div className="max-w-3xl">
            {eyebrow && (
              <span className="inline-flex rounded-full bg-white px-3 py-1 text-sm font-medium text-vz-blue-deep shadow-soft-sm">
                {eyebrow}
              </span>
            )}
            <h1 className="mt-4 text-h1 font-display">{title}</h1>
            {subtitle && (
              <p className="mt-4 max-w-prose text-lead text-vz-body">{subtitle}</p>
            )}
            {children && <div className="mt-7">{children}</div>}
          </div>
        </div>
      </Container>
    </div>
  )
}
