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

export default function Home() {
  return (
    <main>
      <ScrollProgress />
      <Navbar />
      <Hero />
      <Marquee text="WEB DEVELOPMENT" />
      <Services />
      <Stats />
      <Marquee text="SELECTED PROJECTS" reverse speed={50} />
      <Projects />
      <Marquee text="OUR PROCESS" speed={35} />
      <Process />
      <Contact />
      <Footer />
    </main>
  )
}
