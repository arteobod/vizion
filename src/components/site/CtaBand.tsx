import Container from './Container'
import Button from './Button'

/**
 * Repeated conversion block. Orange field, white button — the strongest
 * call to action on any page, per the design system.
 */
export default function CtaBand({
  title,
  text,
  buttonLabel,
  href = '/contacts',
}: {
  title: string
  text: string
  buttonLabel: string
  href?: string
}) {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="relative overflow-hidden rounded-xl2 bg-gradient-to-br from-vz-orange to-[#FF8A1F] px-6 py-12 text-center shadow-cta sm:px-12 sm:py-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-white/15 blur-2xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-20 -right-10 h-64 w-64 rounded-full bg-white/10 blur-2xl"
          />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-h2 font-display text-white">{title}</h2>
            <p className="mt-4 text-lead text-white/90">{text}</p>
            <Button href={href} variant="white" size="lg" className="mt-8">
              {buttonLabel}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}
