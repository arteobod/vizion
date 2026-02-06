'use client'

import { useState } from 'react'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import TextScramble from './TextScramble'
import { Project } from '@/types'

function ProjectRow({ project, index, isActive, onHover }: {
  project: Project
  index: number
  isActive: boolean
  onHover: () => void
}) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.1 })

  return (
    <div
      ref={ref}
      className="border-b border-fv-border group cursor-pointer"
      onMouseEnter={onHover}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateX(0)' : 'translateX(-40px)',
        transition: `opacity 0.8s ease-out ${index * 200}ms, transform 0.8s ease-out ${index * 200}ms`,
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 py-10 lg:py-16 items-center">
        {/* Left: ID + Title */}
        <div className="lg:col-span-5">
          <div className="flex items-center gap-4 mb-3">
            <span className="font-mono text-micro text-fv-text-muted">{project.id}</span>
            <span className="font-mono text-micro text-fv-text-muted">{project.year}</span>
            <span className="font-mono text-micro px-2 py-0.5 border border-fv-border text-fv-text-muted">
              {project.type}
            </span>
          </div>
          <h4 className="font-mono text-2xl lg:text-4xl font-bold text-white group-hover:text-fv-orange transition-colors duration-500">
            <TextScramble text={project.title} delay={index * 200 + 200} scrambleDuration={700} />
          </h4>
          <span className="font-sans text-sm text-fv-text-muted mt-2 block">
            {project.client}
          </span>
        </div>

        {/* Middle: Description */}
        <div className="lg:col-span-4">
          <p
            className="font-sans text-sm text-fv-text-dim leading-relaxed"
            style={{
              opacity: isVisible ? 1 : 0,
              transition: `opacity 0.8s ease-out ${index * 200 + 400}ms`,
            }}
          >
            {project.description}
          </p>
        </div>

        {/* Right: Stack + Arrow */}
        <div className="lg:col-span-3 flex flex-col items-start lg:items-end gap-4">
          <div className="flex flex-wrap gap-2 lg:justify-end">
            {project.tags.map((tech, techIndex) => (
              <span
                key={tech}
                className="font-mono text-micro px-2 py-1 border border-fv-border text-fv-text-muted group-hover:border-fv-orange/30 transition-colors duration-300"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(8px)',
                  transition: `opacity 0.5s ease-out ${index * 200 + 500 + techIndex * 60}ms, transform 0.5s ease-out ${index * 200 + 500 + techIndex * 60}ms`,
                }}
              >
                {tech}
              </span>
            ))}
          </div>
          <span className="font-mono text-label text-fv-text-muted group-hover:text-fv-orange transition-colors flex items-center gap-2">
            VIEW CASE
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="group-hover:translate-x-1 transition-transform">
              <path d="M4 12L12 4M12 4H6M12 4V10" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </span>
        </div>
      </div>

      {/* Active indicator line */}
      <div className="h-px bg-fv-border relative overflow-hidden">
        <div className={`absolute left-0 top-0 h-full bg-fv-orange transition-all duration-700 ${isActive ? 'w-full' : 'w-0'}`} />
      </div>
    </div>
  )
}

export default function Projects({ projects }: { projects: Project[] }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.3 })

  return (
    <section id="projects" className="section-border">
      {/* Section header */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
        <div
          ref={headerRef}
          className="border-b border-fv-border py-8 flex items-center justify-between"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? 'translateX(0)' : 'translateX(-30px)',
            transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
          }}
        >
          <div className="flex items-center gap-6">
            <span className="font-mono text-micro text-fv-text-muted">SECTION_02</span>
            <span
              className="h-px bg-fv-border transition-all ease-out"
              style={{ width: headerVisible ? 64 : 0, transitionDuration: '1s', transitionDelay: '300ms' }}
            />
            <TextScramble text="SELECTED WORK" className="font-mono text-label text-fv-text-dim" delay={200} />
          </div>
          <span className="font-mono text-micro text-fv-text-muted hidden sm:block">
            {projects.length} PROJECTS
          </span>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
        {projects.map((project, index) => (
          <ProjectRow
            key={project.id}
            project={project}
            index={index}
            isActive={activeIndex === index}
            onHover={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </section>
  )
}
