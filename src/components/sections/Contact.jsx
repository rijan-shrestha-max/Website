import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/utils/gsap-register'
import MagneticButton from '@/components/ui/MagneticButton'
import { Mail, Linkedin, Twitter, Github } from 'lucide-react'

const socialLinks = [
  { icon: Mail, href: 'mailto:rijan@example.com', label: 'Email' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Github, href: '#', label: 'GitHub' }
]

export function Contact() {
  const containerRef = useRef(null)
  const contentRef = useRef(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (!contentRef.current) return

    // Heading and CTA animation on mount
    const tl = gsap.timeline()
    tl.from('.contact-heading', {
      opacity: 0,
      y: 40,
      duration: 0.8,
      ease: 'power3.out',
    })
    .from('.contact-cta', {
      opacity: 0,
      y: 40,
      duration: 0.8,
      ease: 'power3.out',
    }, 0.2)
    .from('.contact-social', {
      opacity: 0,
      y: 40,
      duration: 0.8,
      ease: 'power3.out',
    }, 0.4)
  }, [])

  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY })
  }

  return (
    <section
      ref={containerRef}
      id="contact"
      className="relative min-h-screen w-full bg-gradient-to-b from-bg-primary via-bg-surface to-bg-primary py-24 px-8 flex items-center justify-center overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Animated background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-accent rounded-full mix-blend-screen opacity-8 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-accent rounded-full mix-blend-screen opacity-5 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div ref={contentRef} className="max-w-3xl mx-auto text-center space-y-12 relative z-10">
        {/* CTA Text */}
        <div className="contact-heading space-y-4">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-text-primary leading-tight">
            Let's Create Something
            <span className="block text-accent">Extraordinary</span>
          </h2>
          <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
            I'm always interested in hearing about new projects and collaborations. Get in touch and let's explore what we can build together.
          </p>
        </div>

        {/* Email CTA */}
        <div className="contact-cta space-y-6 pt-8">
          <a
            href="mailto:rijan@example.com"
            className="group inline-block"
          >
            <div className="text-4xl md:text-5xl font-bold text-text-primary hover:text-accent transition-colors duration-300">
              rijan@example.com
            </div>
          </a>
        </div>

        {/* Social Links */}
        <div className="contact-social flex flex-wrap gap-6 justify-center pt-12">
          {socialLinks.map((social, i) => {
            const Icon = social.icon
            return (
              <a
                key={i}
                href={social.href}
                className="group relative w-12 h-12 rounded-full bg-bg-elevated hover:bg-accent/20 flex items-center justify-center transition-all duration-300 border border-bg-elevated hover:border-accent/50"
                title={social.label}
              >
                <Icon className="w-5 h-5 text-text-secondary group-hover:text-accent transition-colors" />
              </a>
            )
          })}
        </div>

        {/* Footer note */}
        <div className="pt-16 border-t border-bg-elevated text-text-muted text-sm">
          <p>Based in Kathmandu, Nepal • Available for freelance projects worldwide</p>
        </div>
      </div>
    </section>
  )
}

export default Contact
