import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/utils/gsap-register'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'Work', href: '#work' },
  { label: 'Philosophy', href: '#philosophy' },
  { label: 'Process', href: '#process' },
  { label: 'Contact', href: '#contact' }
]

export function Navbar() {
  const navRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolling, setIsScrolling] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const lastScrollRef = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY
      const scrollDelta = currentScroll - lastScrollRef.current

      // Show/hide based on scroll direction
      if (scrollDelta > 50 && isVisible) {
        setIsVisible(false)
      } else if (scrollDelta < -50 && !isVisible) {
        setIsVisible(true)
      }

      // Apply background blur when scrolled
      setIsScrolling(currentScroll > 10)
      lastScrollRef.current = currentScroll
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isVisible])

  // Animate navbar visibility
  useEffect(() => {
    if (!navRef.current) return

    gsap.to(navRef.current, {
      y: isVisible ? 0 : -100,
      duration: 0.3,
      ease: 'power2.out',
    })
  }, [isVisible])

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-40 px-8 py-6 transition-all duration-300 ${
        isScrolling ? 'bg-bg-primary/80 backdrop-blur-md border-b border-bg-elevated/30' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="text-2xl font-display font-bold text-text-primary hover:text-accent transition-colors">
          R.S
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link, i) => (
            <a
              key={i}
              href={link.href}
              className="text-text-secondary hover:text-accent transition-colors duration-200 text-sm font-medium"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-text-primary hover:text-accent transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-bg-primary/95 backdrop-blur-md border-b border-bg-elevated/30 px-8 py-6 space-y-4">
          {navLinks.map((link, i) => (
            <a
              key={i}
              href={link.href}
              className="block text-text-secondary hover:text-accent transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  )
}

export default Navbar
