import Container from './Container'

type Tone = 'white' | 'soft' | 'tint'

/**
 * `white` is transparent so the fixed 3D model shows through the gaps between
 * cards. `soft` and `tint` stay solid, hiding the model — alternating them
 * gives the page a reveal/settle rhythm as the model travels down on scroll.
 */
const TONES: Record<Tone, string> = {
  white: 'bg-transparent',
  soft: 'bg-vz-soft',
  tint: 'bg-vz-tint',
}

/** Generous vertical rhythm — "air" between blocks is core to the design brief. */
export default function Section({
  children,
  tone = 'white',
  className = '',
  id,
}: {
  children: React.ReactNode
  tone?: Tone
  className?: string
  id?: string
}) {
  return (
    <section id={id} className={`py-16 sm:py-20 lg:py-28 ${TONES[tone]} ${className}`}>
      <Container>{children}</Container>
    </section>
  )
}

/** Eyebrow + heading + optional subtitle, used at the top of most sections. */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  className = '',
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  align?: 'center' | 'left'
  className?: string
}) {
  const alignment = align === 'center' ? 'text-center mx-auto items-center' : 'text-left items-start'
  return (
    <div className={`flex flex-col ${alignment} ${align === 'center' ? 'max-w-2xl' : ''} ${className}`}>
      {eyebrow && (
        <span className="mb-3 inline-flex rounded-full bg-vz-blue-soft px-3 py-1 text-sm font-medium text-vz-blue-deep">
          {eyebrow}
        </span>
      )}
      <h2 className="text-h2 font-display">{title}</h2>
      {subtitle && (
        <p className={`mt-4 text-lead text-vz-body ${align === 'center' ? 'max-w-prose' : 'max-w-prose'}`}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
