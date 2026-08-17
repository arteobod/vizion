import {
  Globe, Sparkles, Workflow, Check, ArrowRight, ArrowLeft, Mail, Phone,
  MapPin, Clock, ShieldCheck, MessagesSquare, UserRoundCheck, LifeBuoy,
  Target, Gauge, HandHeart, Layers, Quote, Plus, Minus, Menu, X, Lock,
  RotateCcw, ArrowUpRight,
  type LucideIcon,
} from 'lucide-react'

const ICONS: Record<string, LucideIcon> = {
  Globe, Sparkles, Workflow, Check, ArrowRight, ArrowLeft, Mail, Phone,
  MapPin, Clock, ShieldCheck, MessagesSquare, UserRoundCheck, LifeBuoy,
  Target, Gauge, HandHeart, Layers, Quote, Plus, Minus, Menu, X, Lock,
  RotateCcw, ArrowUpRight,
}

/** Renders a lucide icon by name, so icons can be set from JSON data. */
export default function Icon({
  name,
  className = '',
  strokeWidth = 1.75,
}: {
  name: string
  className?: string
  strokeWidth?: number
}) {
  const Cmp = ICONS[name] ?? Layers
  return <Cmp className={className} strokeWidth={strokeWidth} aria-hidden="true" />
}
