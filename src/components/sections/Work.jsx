import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/utils/gsap-register'
import ProjectCard from '@/components/ui/ProjectCard'
import SplitText from '@/components/ui/SplitText'
import { projects } from '@/data/projects'

export function Work() {
  const containerRef = useRef(null)
  const headingRef = useRef(null)

  useEffect(() => {
    if (!headingRef.current) return

    // Heading reveal on scroll
    gsap.registerPlugin(ScrollTrigger)
    
    const headingChars = headingRef.current.querySelectorAll('.char')
    headingChars.forEach((char, i) => {
      gsap.from(char, {
        scrollTrigger: {
          trigger: headingRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
        opacity: 0,
        y: 20,
        duration: 0.6,
        delay: i * 0.05,
        ease: 'power3.out',
      })
    })
  }, [])

  return (
    <section
      ref={containerRef}
      id="work"
      className="relative min-h-screen w-full bg-gradient-to-b from-bg-surface via-bg-primary to-bg-primary py-24 px-8"
    >
      {/* Section Container */}
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-20 space-y-6">
          <div className="text-sm font-medium text-accent tracking-widest uppercase">
            Featured Work
          </div>
          <h2
            ref={headingRef}
            className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-text-primary leading-tight"
          >
            <SplitText text="Selected Projects" type="chars" />
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl">
            A curated collection of recent motion design and visual storytelling projects that showcase creative direction, technical execution, and artistic vision.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {projects.map((project, index) => (
            <div key={project.id} className={index === projects.length - 1 && projects.length % 2 === 1 ? 'md:col-span-2 max-w-xl' : ''}>
              <ProjectCard
                number={index + 1}
                project={project}
                index={index}
              />
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center space-y-6 py-12 border-t border-bg-elevated">
          <p className="text-xl text-text-secondary">
            Want to see more of my work?
          </p>
          <a
            href="#contact"
            className="inline-flex items-center justify-center px-8 py-4 bg-accent text-bg-primary font-semibold rounded-lg hover:bg-accent/90 transition-colors duration-300"
          >
            Get In Touch
          </a>
        </div>
      </div>
    </section>
  )
}

export default Work
