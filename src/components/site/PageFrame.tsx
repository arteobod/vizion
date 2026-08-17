/**
 * A fixed frame around the whole viewport — a thin inset border with small
 * corner ticks. Non-interactive, sits above everything, giving the site a
 * clean "framed" edge that pairs with the browser-window concept.
 */
export default function PageFrame() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[2000]">
      {/* Trim line */}
      <div className="absolute inset-2.5 rounded-[16px] border border-vz-border-strong/80 sm:inset-3.5 sm:rounded-[20px]" />

      {/* Corner ticks — a small brand accent at each corner */}
      {[
        'left-2.5 top-2.5 border-l-2 border-t-2 rounded-tl-[16px] sm:left-3.5 sm:top-3.5 sm:rounded-tl-[20px]',
        'right-2.5 top-2.5 border-r-2 border-t-2 rounded-tr-[16px] sm:right-3.5 sm:top-3.5 sm:rounded-tr-[20px]',
        'left-2.5 bottom-2.5 border-l-2 border-b-2 rounded-bl-[16px] sm:left-3.5 sm:bottom-3.5 sm:rounded-bl-[20px]',
        'right-2.5 bottom-2.5 border-r-2 border-b-2 rounded-br-[16px] sm:right-3.5 sm:bottom-3.5 sm:rounded-br-[20px]',
      ].map((pos) => (
        <span key={pos} className={`absolute h-6 w-6 border-vz-orange ${pos}`} />
      ))}
    </div>
  )
}
