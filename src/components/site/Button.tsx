import Link from 'next/link'

type Variant = 'primary' | 'secondary' | 'ghost' | 'white'
type Size = 'md' | 'lg'

// `vz-btn` carries the shared motion: an explicit transition list rather than
// `transition-all`. All-properties transitions are a standing invitation to
// animate `width` or `border-width` by accident, which drags layout onto the
// compositor's critical path for what should be a colour change.
//
// Every variant now answers a press, not just a hover. A control that lifts
// toward the cursor but does nothing at all when clicked feels unfinished on a
// phone, where hover does not exist and the press is the only feedback there is.
const BASE =
  'vz-btn inline-flex items-center justify-center gap-2 font-medium rounded-soft ' +
  'select-none disabled:opacity-60 disabled:cursor-not-allowed'

// Orange carries the primary action; blue and outlines support it.
const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-vz-orange text-white shadow-soft-sm hover:bg-vz-orange-deep hover:shadow-cta',
  secondary:
    'bg-white text-vz-text border border-vz-border-strong hover:border-vz-blue hover:text-vz-blue-deep hover:shadow-soft-sm',
  ghost:
    'text-vz-blue-deep hover:text-vz-orange-deep hover:bg-vz-orange-soft',
  white:
    'bg-white text-vz-orange-deep shadow-soft hover:shadow-soft-lg',
}

const SIZES: Record<Size, string> = {
  md: 'px-5 py-2.5 text-[0.9375rem]',
  lg: 'px-7 py-3.5 text-base',
}

interface Props {
  children: React.ReactNode
  href?: string
  variant?: Variant
  size?: Size
  className?: string
  type?: 'button' | 'submit'
  disabled?: boolean
  onClick?: () => void
}

export default function Button({
  children,
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  disabled,
  onClick,
}: Props) {
  const classes = `${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`

  if (href) {
    const isExternal = href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')
    if (isExternal) {
      // Only a real outbound page gets its own tab — a portfolio link to a
      // client site should not cost the reader the case they were reading.
      // `mailto:`/`tel:` hand off to another app and must stay in place.
      const offsite = href.startsWith('http')
      return (
        <a
          href={href}
          className={classes}
          {...(offsite ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {children}
        </a>
      )
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button type={type} className={classes} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  )
}
