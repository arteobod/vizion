import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Marquee from '@/components/Marquee'
import Services from '@/components/Services'
import Stats from '@/components/Stats'
import Projects from '@/components/Projects'
import Process from '@/components/Process'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import ScrollProgress from '@/components/ScrollProgress'
import { getServices, getStats, getProjects, getProcessSteps } from '@/lib/data'

// Server Component - reads from JSON data files (editable via admin panel)
export const dynamic = 'force-dynamic'

export default function Home() {
  const services = getServices()
  const stats = getStats()
  const projects = getProjects()
  const processSteps = getProcessSteps()

  return (
    <main>
      <ScrollProgress />
      <Navbar />
      <Hero />
      <Marquee text="WEB DEVELOPMENT" />
      <Services services={services} />
      <Stats stats={stats} />
      <Marquee text="SELECTED PROJECTS" reverse speed={50} />
      <Projects projects={projects} />
      <Marquee text="OUR PROCESS" speed={35} />
      <Process steps={processSteps} />
      <Contact />
      <Footer />
    </main>
  )
}
