import HomeWindows from '@/components/site/HomeWindows'
import FloatingWindows from '@/components/site/FloatingWindows'
import { getServices, getProjects } from '@/lib/data'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [services, projects] = await Promise.all([getServices(), getProjects()])

  // The page gradient runs light at the top to deeper at the bottom, so the
  // whole surface has one direction of light instead of sitting flat.
  return (
    <div className="relative bg-gradient-to-b from-white via-vz-soft to-[#e6eaef]">
      {/* Light rig behind the glass. Frosted glass shows nothing unless there
          is something to refract, and pale fields refract into pale nothing —
          these are deliberately saturated, then buried under heavy blur.
          Fixed and decorative only. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-0 overflow-hidden"
      >
        {/* Key light: a broad bright source above the fold that everything
            else falls away from. */}
        <div className="absolute left-1/2 top-[-24rem] h-[44rem] w-[80rem] -translate-x-1/2 rounded-full bg-white blur-[110px]" />

        {/* Sized up deliberately: the hero window covers most of the viewport,
            and frosted glass over white eats most of what is behind it. What
            looks strong on the bare page arrives as a hint through the pane. */}
        <div className="absolute -left-28 top-[4%] h-[38rem] w-[38rem] rounded-full bg-vz-blue/40 blur-[130px]" />
        <div className="absolute right-[-8rem] top-[30%] h-[44rem] w-[44rem] rounded-full bg-vz-orange/32 blur-[140px]" />
        <div className="absolute left-[14%] bottom-[0%] h-[36rem] w-[36rem] rounded-full bg-vz-blue/32 blur-[130px]" />

        {/* Small browser panes drifting behind the glass. Sits above the colour
            fields so they light it, below the vignette so it still darkens the
            corners. */}
        <FloatingWindows />

        {/* Vignette: pulls the corners down a touch so the centre of the page
            reads as the lit area rather than everything being equally bright. */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(16,19,24,0.1)_100%)]" />
      </div>

      <div className="relative">
        <HomeWindows services={services} projects={projects} />
      </div>
    </div>
  )
}
