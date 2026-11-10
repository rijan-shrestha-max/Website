import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/utils/gsap-register'

export function ProjectCard({ number, project, index }) {
  const cardRef = useRef(null)
  const imageRef = useRef(null)
  const numberRef = useRef(null)

  useEffect(() => {
    if (!cardRef.current) return

    // Card reveal on scroll: fade in + slide up
    gsap.registerPlugin(ScrollTrigger)
    
    gsap.from(cardRef.current, {
      scrollTrigger: {
        trigger: cardRef.current,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
      opacity: 0,
      y: 40,
      duration: 0.8,
      ease: 'power3.out',
    })

    // Image parallax on scroll
    if (imageRef.current) {
      gsap.to(imageRef.current, {
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top center',
          end: 'bottom center',
          scrub: 0.5,
        },
        y: -40,
        duration: 1,
        ease: 'none',
      })
    }

    // Number counter animation
    if (numberRef.current) {
      gsap.from(numberRef.current, {
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
        textContent: 0,
        duration: 0.6,
        snap: { textContent: 1 },
        ease: 'power2.out',
      })
    }

    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === cardRef.current || t.trigger === imageRef.current || t.trigger === numberRef.current) {
          t.kill()
        }
      })
    }
  }, [])

  return (
    <div
      ref={cardRef}
      className="group relative overflow-hidden bg-bg-elevated rounded-xl border border-bg-elevated hover:border-accent/30 transition-colors duration-300"
    >
      {/* Project Number */}
      <div className="absolute top-6 right-6 z-20 text-5xl font-bold text-accent/20 group-hover:text-accent/40 transition-colors duration-300">
        <span ref={numberRef}>0{number}</span>
      </div>

      {/* Image Container with Parallax */}
      <div className="relative w-full h-96 overflow-hidden bg-bg-surface">
        <img
          ref={imageRef}
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-bg-elevated via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Content */}
      <div className="p-8 space-y-4">
        <div className="space-y-2">
          <h3 className="text-2xl font-display font-bold text-text-primary">{project.title}</h3>
          <p className="text-text-secondary leading-relaxed">{project.description}</p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 pt-4">
          {project.tags.map((tag, i) => (
            <span
              key={i}
              className="text-xs px-3 py-1 rounded-full bg-accent/10 text-accent hover:bg-accent/20 transition-colors duration-200"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Year */}
        <div className="pt-4 border-t border-bg-elevated">
          <span className="text-sm text-text-muted">{project.year}</span>
        </div>
      </div>
    </div>
  )
}

export default ProjectCard
