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
import { getServices, getStats, getProjects, getProcessSteps, getSiteContent } from '@/lib/data'

// Server Component - reads from JSON data files (editable via admin panel)
export const dynamic = 'force-dynamic'

export default async function Home() {
  const services = await getServices()
  const stats = await getStats()
  const projects = await getProjects()
  const processSteps = await getProcessSteps()
  const siteContent = await getSiteContent()

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
      <Contact siteContent={siteContent} />
      <Footer />
    </main>
  )
}
