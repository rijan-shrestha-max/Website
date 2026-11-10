import './utils/gsap-register'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import { ArrowUpRight, ChevronDown, Code2, Film, Figma, Github, Globe2, Instagram, Layers3, Linkedin, Mail, MapPin, Menu, MonitorSmartphone, MoveUpRight, Palette, PenTool, Rocket, Send, Sparkles, Star, Video, X, Brush, LayoutGrid } from 'lucide-react'
import { gsap } from './utils/gsap-register'
import { useLenis } from './hooks/useLenis'
import Cursor from './components/ui/Cursor'
import Preloader from './components/ui/Preloader'
import MagneticButton from './components/ui/MagneticButton'
import SplitText from './components/ui/SplitText'

const navigation = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Services', href: '#services' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
]

const heroStats = [
  { label: 'Projects shipped', value: '100+' },
  { label: 'Clients served', value: '20+' },
  { label: 'Years experience', value: '5+' },
]

const aboutTimeline = [
  { year: '2018', title: 'Graphic Design', copy: 'Started building visual identities, campaign assets, and editorial layouts.' },
  { year: '2020', title: 'Branding', copy: 'Expanded into identity systems, packaging, and premium brand worlds.' },
  { year: '2021', title: 'Motion Graphics', copy: 'Brought stories to life through kinetic type, title sequences, and explainers.' },
  { year: '2023', title: 'Web Development', copy: 'Crafted refined frontend experiences with React, GSAP, and motion systems.' },
  { year: '2025', title: 'UI/UX', copy: 'Focused on conversion-aware interfaces, responsive systems, and usability.' },
]

const projectData = [
  {
    title: 'Equator Money Changer',
    category: 'Brand Identity + Digital',
    year: '2025',
    technologies: ['Brand System', 'Art Direction', 'Motion'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&h=1800&fit=crop',
    ratio: 'aspect-[4/5]',
  },
  {
    title: 'Good Luck Adventure',
    category: 'Campaign Design',
    year: '2024',
    technologies: ['Illustration', 'Social Media', 'Video'],
    image: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=1400&h=1200&fit=crop',
    ratio: 'aspect-[5/4]',
  },
  {
    title: 'Cafe Anytime',
    category: 'Hospitality Branding',
    year: '2024',
    technologies: ['Packaging', 'Menu Design', 'Motion'],
    image: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=1400&h=1600&fit=crop',
    ratio: 'aspect-[4/5]',
  },
  {
    title: 'My Old House Cafe',
    category: 'Brand Experience',
    year: '2024',
    technologies: ['Identity', 'Photography', 'Web'],
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1400&h=1200&fit=crop',
    ratio: 'aspect-[5/4]',
  },
  {
    title: 'Dhauniya Pharmacy',
    category: 'Health & Retail',
    year: '2023',
    technologies: ['UI Design', 'Packaging', 'Brand'],
    image: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=1400&h=1800&fit=crop',
    ratio: 'aspect-[4/5]',
  },
  {
    title: 'Dear Doughnut',
    category: 'Product Storytelling',
    year: '2023',
    technologies: ['Motion', 'Illustration', 'Social'],
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=1400&h=1400&fit=crop',
    ratio: 'aspect-[1/1]',
  },
  {
    title: 'Solinor Branding',
    category: 'Luxury Rebrand',
    year: '2025',
    technologies: ['Strategy', 'Logo System', 'Frontend'],
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1400&h=1600&fit=crop',
    ratio: 'aspect-[4/5]',
  },
]

const services = [
  { title: 'Brand Identity', copy: 'Premium visual systems, logotypes, style guides, and launch-ready brand assets.', price: 'From $1,500' },
  { title: 'Social Media Design', copy: 'High-clarity content systems, campaign templates, and platform-first art direction.', price: 'From $650' },
  { title: 'Motion Graphics', copy: 'Kinetic typography, product explainers, reels, and cinematic promotional pieces.', price: 'From $900' },
  { title: 'UI/UX Design', copy: 'Elegant product interfaces, flows, prototypes, and conversion-focused UI systems.', price: 'From $1,200' },
  { title: 'Frontend Development', copy: 'Fast, responsive, motion-rich experiences built with React, Tailwind, and GSAP.', price: 'From $1,800' },
  { title: 'Website Design', copy: 'High-end websites with a polished art direction and thoughtful content hierarchy.', price: 'Custom Quote' },
]

const designSkills = [
  { label: 'Photoshop', icon: Palette },
  { label: 'Illustrator', icon: Brush },
  { label: 'After Effects', icon: Video },
  { label: 'Premiere Pro', icon: Film },
  { label: 'Figma', icon: Figma },
]

const devSkills = [
  { label: 'React', icon: Code2 },
  { label: 'Next.js', icon: Rocket },
  { label: 'TypeScript', icon: Layers3 },
  { label: 'Tailwind CSS', icon: LayoutGrid },
  { label: 'Node.js', icon: MonitorSmartphone },
  { label: 'GSAP', icon: Sparkles },
  { label: 'Framer Motion', icon: MoveUpRight },
]

const experienceItems = [
  { year: '2019', title: 'Freelance Designer', copy: 'Shipped visuals for local businesses, startups, and campaigns with a focus on clarity and polish.' },
  { year: '2021', title: 'Motion Graphics', copy: 'Expanded into social reels, brand films, and animated content systems for digital-first clients.' },
  { year: '2022', title: 'Branding Projects', copy: 'Built complete identity systems, packaging directions, and launch materials for growing brands.' },
  { year: '2023', title: 'Frontend Development', copy: 'Developed interactive websites with motion, accessibility, and performance as first-class concerns.' },
  { year: '2025', title: 'Current Freelance Studio', copy: 'Operating as an independent creative partner for premium agencies and high-end clients.' },
]

const testimonials = [
  { name: 'Sarah K.', role: 'Founder, Equator Finance', company: 'Equator Money Changer', quote: 'The final direction felt expensive, calm, and sharply considered. Exactly what we needed to stand apart.' },
  { name: 'Milan R.', role: 'Creative Lead', company: 'Good Luck Adventure', quote: 'Rijan handled design, motion, and frontend with a rare level of consistency. The execution was exceptional.' },
  { name: 'Asha T.', role: 'Marketing Manager', company: 'Cafe Anytime', quote: 'Our brand felt instantly more premium. The visuals were elegant, modern, and very easy to use across channels.' },
  { name: 'Nabin S.', role: 'Operations Director', company: 'Solinor', quote: 'Fast communication, strong taste, and refined delivery. This is the kind of partner agencies love working with.' },
]

const processSteps = [
  { number: '01', title: 'Discover', copy: 'Research the brand, audience, and goals to define the right visual and strategic direction.' },
  { number: '02', title: 'Design', copy: 'Build the identity, layout, motion style, and interface language with premium detail.' },
  { number: '03', title: 'Develop', copy: 'Translate the visuals into responsive, performant, motion-rich frontend experiences.' },
  { number: '04', title: 'Deliver', copy: 'Refine, test, and hand over the polished system with production-ready assets and support.' },
]

const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/', icon: Github },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/', icon: Linkedin },
  { label: 'Instagram', href: 'https://www.instagram.com/', icon: Instagram },
  { label: 'Behance', href: 'https://www.behance.net/', icon: Globe2 },
  { label: 'Email', href: 'mailto:rijan@example.com', icon: Mail },
]

const resumeDownload =
  'data:text/plain;charset=utf-8,' +
  encodeURIComponent(
    'Rijan Shrestha\nFreelance Graphic Designer, Motion Graphics Artist, and Frontend Developer\nKathmandu, Nepal\n\nSelected strengths:\n- Brand identity systems\n- Motion design and animation\n- React, Tailwind, GSAP\n- Premium web experiences\n\nContact:\nrijan@example.com'
  )

function AnimatedCounter({ value, suffix = '' }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.6 })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return

    let frame = 0
    const duration = 1200
    const start = performance.now()

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(value * eased))

      if (progress < 1) {
        frame = window.requestAnimationFrame(tick)
      }
    }

    frame = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(frame)
  }, [isInView, value])

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  )
}

function SectionHeading({ eyebrow, title, description, align = 'left' }) {
  return (
    <motion.div
      className={`max-w-3xl ${align === 'center' ? 'mx-auto text-center' : ''} mb-10 lg:mb-16`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <p className="mb-4 text-xs uppercase tracking-[0.3em] text-white/50 sm:text-sm">{eyebrow}</p>
      <h2 className="split-heading text-4xl font-display font-semibold leading-[0.92] text-white sm:text-5xl lg:text-6xl xl:text-7xl">
        <SplitText text={title} type="chars" />
      </h2>
      {description ? <p className="mt-5 max-w-2xl text-sm leading-7 text-white/70 sm:text-base lg:text-lg">{description}</p> : null}
    </motion.div>
  )
}

function HeroSection() {
  const heroRef = useRef(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const smoothX = useSpring(mouseX, { stiffness: 80, damping: 18, mass: 0.2 })
  const smoothY = useSpring(mouseY, { stiffness: 80, damping: 18, mass: 0.2 })
  const cardRotateX = useTransform(smoothY, [-0.5, 0.5], [10, -10])
  const cardRotateY = useTransform(smoothX, [-0.5, 0.5], [-12, 12])
  const cardX = useTransform(smoothX, [-0.5, 0.5], [-24, 24])
  const cardY = useTransform(smoothY, [-0.5, 0.5], [-20, 20])

  const handleMouseMove = (event) => {
    if (!heroRef.current) return
    const rect = heroRef.current.getBoundingClientRect()
    const normalizedX = (event.clientX - rect.left) / rect.width - 0.5
    const normalizedY = (event.clientY - rect.top) / rect.height - 0.5
    mouseX.set(normalizedX)
    mouseY.set(normalizedY)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <section
      ref={heroRef}
      id="home"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen overflow-hidden pt-24 lg:pt-28"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.08),transparent_18%),linear-gradient(180deg,#0B0B0F_0%,#0B0B0F_100%)]" />
      <div className="absolute inset-0 opacity-40 mix-blend-screen">
        <motion.div className="absolute left-[-10%] top-[15%] h-72 w-72 rounded-full bg-[#3B82F6]/20 blur-3xl" animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.15, 1] }} transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="absolute right-[2%] top-[10%] h-96 w-96 rounded-full bg-white/10 blur-3xl" animate={{ x: [0, -30, 0], y: [0, 30, 0], scale: [1, 1.12, 1] }} transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }} />
        {Array.from({ length: 22 }).map((_, index) => (
          <motion.span
            key={index}
            className="absolute rounded-full bg-white/40"
            style={{ width: 2 + (index % 3), height: 2 + (index % 3), left: `${(index * 7) % 100}%`, top: `${(index * 11) % 90}%` }}
            animate={{ y: [0, -14, 0], opacity: [0.15, 0.55, 0.15], scale: [1, 1.8, 1] }}
            transition={{ duration: 6 + (index % 5), repeat: Infinity, delay: index * 0.15, ease: 'easeInOut' }}
          />
        ))}
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 py-10 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-24 lg:px-12 lg:py-20 xl:min-h-[calc(100vh-6rem)]">
        <div className="relative z-10 space-y-10">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.28em] text-white/70 backdrop-blur-xl">
            <Sparkles className="h-4 w-4 text-[#3B82F6]" />
            Rijan Shrestha Portfolio 2026
          </motion.div>

          <div className="space-y-6">
            <h1 className="max-w-4xl text-5xl font-display font-semibold leading-[0.9] text-white sm:text-6xl md:text-7xl xl:text-[6.5rem]">
              <span className="block overflow-hidden">
                <motion.span initial={{ y: 90 }} animate={{ y: 0 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} className="inline-block">
                  Hi, I&apos;m Rijan Shrestha
                </motion.span>
              </span>
              <span className="mt-5 block overflow-hidden text-white/88">
                <motion.span initial={{ y: 90 }} animate={{ y: 0 }} transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }} className="inline-block">
                  I Design Experiences That Move.
                </motion.span>
              </span>
            </h1>
            <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.25 }} className="max-w-2xl text-base leading-8 text-white/70 sm:text-lg lg:text-xl">
              Graphic Designer • Motion Graphics Artist • Frontend Developer
            </motion.p>
          </div>

          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.35 }} className="flex flex-wrap items-center gap-4">
            <MagneticButton className="rounded-full border border-white/10 bg-white px-6 py-4 text-sm font-medium text-[#0B0B0F] shadow-[0_0_40px_rgba(255,255,255,0.08)] transition-transform hover:bg-white/95" onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}>
              View Projects
            </MagneticButton>
            <MagneticButton
              className="rounded-full border border-white/10 bg-white/5 px-6 py-4 text-sm font-medium text-white backdrop-blur-xl transition-colors hover:border-[#3B82F6]/40 hover:bg-[#3B82F6]/10"
              onClick={() => {
                const anchor = document.createElement('a')
                anchor.href = resumeDownload
                anchor.download = 'Rijan-Shrestha-Resume.txt'
                anchor.click()
              }}
            >
              Download Resume
            </MagneticButton>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.45 }} className="grid gap-4 sm:grid-cols-3">
            {heroStats.map((stat) => (
              <div key={stat.label} className="rounded-[24px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                <div className="text-3xl font-display font-semibold text-white">{stat.value}</div>
                <div className="mt-2 text-sm text-white/55">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div style={{ x: cardX, y: cardY, rotateX: cardRotateX, rotateY: cardRotateY, transformPerspective: 1200 }} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }} className="relative z-10">
          <div className="absolute inset-0 -z-10 rounded-[32px] bg-[linear-gradient(135deg,rgba(59,130,246,0.2),rgba(255,255,255,0.08),rgba(59,130,246,0.05))] blur-2xl" />
          <div className="glass-card overflow-hidden rounded-[32px] border border-white/10 bg-white/6 p-4 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
            <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#101018]">
              <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1200&h=1400&fit=crop" alt="Portrait of Rijan Shrestha" className="h-[580px] w-full object-cover object-center opacity-92" loading="eager" decoding="async" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,11,15,0.06),rgba(11,11,15,0.45)_70%,rgba(11,11,15,0.95))]" />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <div className="rounded-[24px] border border-white/10 bg-white/6 p-5 backdrop-blur-xl">
                  <div className="flex items-center gap-3 text-white/85">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#3B82F6]/20 text-[#3B82F6]">
                      <Star className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm uppercase tracking-[0.24em] text-white/45">Current Focus</p>
                      <p className="text-base font-medium text-white">Luxury identity systems, cinematic motion, and premium frontend craft.</p>
                    </div>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {['Brand Strategy', 'Motion', 'Web', 'UI/UX'].map((item) => (
                      <span key={item} className="rounded-full border border-white/10 bg-white/6 px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-white/65">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3 text-xs uppercase tracking-[0.3em] text-white/45">
        <ChevronDown className="h-4 w-4 text-[#3B82F6]" />
        Scroll to explore
      </div>
    </section>
  )
}

function AboutSection() {
  return (
    <section id="about" className="reveal-section relative px-6 py-24 sm:px-8 lg:px-12 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} className="reveal-item relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
          <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#101018]">
            <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&h=1600&fit=crop" alt="Rijan working creatively" className="h-[640px] w-full object-cover object-center opacity-95" loading="lazy" decoding="async" />
          </div>
          <div className="absolute bottom-8 left-8 right-8 rounded-[24px] border border-white/10 bg-[#0B0B0F]/70 p-5 backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.28em] text-white/45">Based in Kathmandu, Nepal</p>
            <p className="mt-2 text-lg text-white/80">Available for freelance collaborations with agencies, founders, and ambitious brands.</p>
          </div>
        </motion.div>

        <div className="space-y-10">
          <SectionHeading eyebrow="About" title="A designer who thinks like a brand partner and builds like a product team." description="I help companies shape premium digital identities through visual systems, motion, and frontend experiences that feel intentional from first glance to final interaction." />

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: 'Projects', value: 100, suffix: '+' },
              { label: 'Clients', value: 20, suffix: '+' },
              { label: 'Experience', value: 5, suffix: '+ years' },
              { label: 'Industries', value: 7, suffix: '+' },
            ].map((stat) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.6 }} className="reveal-item rounded-[24px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                <div className="text-3xl font-display font-semibold text-white">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="mt-2 text-sm uppercase tracking-[0.24em] text-white/50">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          <div className="space-y-4 rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            {aboutTimeline.map((item) => (
              <div key={item.year} className="grid gap-3 border-b border-white/8 py-4 last:border-b-0 sm:grid-cols-[90px_180px_1fr] sm:items-start">
                <div className="text-sm uppercase tracking-[0.3em] text-white/45">{item.year}</div>
                <div className="text-lg font-medium text-white">{item.title}</div>
                <div className="text-sm leading-7 text-white/65">{item.copy}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function ProjectsSection() {
  return (
    <section id="projects" className="reveal-section relative px-6 py-24 sm:px-8 lg:px-12 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Featured Projects" title="Selected work where visual identity, motion, and product thinking meet." description="A masonry gallery of brands and digital experiences crafted to feel rich, clear, and memorable." />

        <div className="columns-1 gap-6 md:columns-2 xl:columns-3">
          {projectData.map((project) => (
            <motion.article key={project.title} initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="reveal-item group mb-6 break-inside-avoid overflow-hidden rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1 hover:border-white/20">
              <div className={`relative overflow-hidden ${project.ratio}`}>
                <img src={project.image} alt={project.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" decoding="async" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,11,15,0.08),rgba(11,11,15,0.75))] opacity-70 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_55%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="absolute left-5 top-5 rounded-full border border-white/10 bg-[#0B0B0F]/55 px-3 py-1 text-xs uppercase tracking-[0.22em] text-white/75 backdrop-blur-xl">{project.category}</div>
                <div className="absolute right-5 top-5 rounded-full border border-white/10 bg-[#0B0B0F]/55 px-3 py-1 text-xs uppercase tracking-[0.22em] text-white/75 backdrop-blur-xl">{project.year}</div>
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 opacity-0 transition-all duration-500 group-hover:opacity-100">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-white/50">Project preview</p>
                    <h3 className="mt-2 text-2xl font-display font-semibold text-white">{project.title}</h3>
                  </div>
                  <a href="#contact" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-[#0B0B0F]">
                    View Project <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
              <div className="space-y-4 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-display font-semibold text-white">{project.title}</h3>
                    <p className="mt-2 text-sm uppercase tracking-[0.24em] text-white/45">{project.category}</p>
                  </div>
                  <div className="text-right text-sm text-white/55">{project.year}</div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-white/65">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="pt-2">
                  <a href="#contact" className="inline-flex items-center gap-2 text-sm font-medium text-[#3B82F6] transition-colors hover:text-white">
                    View Project <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

function ServicesSection() {
  return (
    <section id="services" className="reveal-section relative px-6 py-24 sm:px-8 lg:px-12 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Services" title="A focused studio stack for brands that need design, motion, and execution in one place." description="Each card reveals a high-touch service lane with a clear starting point and enough flexibility for bespoke work." />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <motion.div key={service.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }} className="reveal-item group rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1 hover:border-white/20">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-display font-semibold text-white">{service.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-white/65">{service.copy}</p>
                </div>
                <Sparkles className="h-5 w-5 text-[#3B82F6] transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
              </div>
              <div className="mt-8 flex items-center justify-between gap-4 border-t border-white/8 pt-5">
                <div className="text-sm uppercase tracking-[0.24em] text-white/45">{service.price}</div>
                <button className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-white transition-colors hover:border-[#3B82F6]/40 hover:bg-[#3B82F6]/10">
                  Request Quote
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function SkillsSection() {
  return (
    <section id="skills" className="reveal-section relative px-6 py-24 sm:px-8 lg:px-12 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Skills" title="Animated toolsets for visual design and modern frontend development." description="The badges float lightly, but the systems behind them are disciplined, fast, and production-friendly." />

        <div className="grid gap-6 lg:grid-cols-2">
          {[
            { title: 'Design', items: designSkills },
            { title: 'Development', items: devSkills },
          ].map((group) => (
            <motion.div key={group.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }} className="reveal-item rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <div className="mb-6 flex items-center justify-between gap-4">
                <h3 className="text-2xl font-display font-semibold text-white">{group.title}</h3>
                <div className="h-px flex-1 bg-white/10" />
              </div>
              <div className="flex flex-wrap gap-3">
                {group.items.map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.label} className="group flex items-center gap-3 rounded-full border border-white/10 bg-[#101018] px-4 py-3 text-sm text-white/75 transition-all duration-300 hover:-translate-y-1 hover:border-[#3B82F6]/35 hover:bg-[#3B82F6]/10">
                      <Icon className="h-4 w-4 text-[#3B82F6] transition-transform duration-300 group-hover:scale-110" />
                      {item.label}
                    </div>
                  )
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ExperienceSection() {
  const sectionRef = useRef(null)
  const lineRef = useRef(null)

  useEffect(() => {
    if (!sectionRef.current || !lineRef.current) return

    const ctx = gsap.context(() => {
      gsap.to(lineRef.current, {
        scaleY: 1,
        transformOrigin: 'top',
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          end: 'bottom 30%',
          scrub: true,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="experience" className="reveal-section relative px-6 py-24 sm:px-8 lg:px-12 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Experience" title="A vertical record of creative growth, project maturity, and product thinking." description="The path moves from standalone design work to a more holistic practice spanning identity, motion, and frontend delivery." />

        <div className="relative mx-auto max-w-4xl pl-8">
          <div className="absolute left-3 top-0 h-full w-px bg-white/10" />
          <div ref={lineRef} className="absolute left-3 top-0 h-full w-px origin-top scale-y-0 bg-[linear-gradient(180deg,rgba(59,130,246,1),rgba(255,255,255,0.22))]" />

          <div className="space-y-8">
            {experienceItems.map((item) => (
              <motion.div key={item.year} initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ duration: 0.6 }} className="reveal-item relative rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                <div className="absolute -left-[2px] top-8 h-4 w-4 rounded-full border border-white/20 bg-[#0B0B0F] shadow-[0_0_0_8px_rgba(59,130,246,0.08)]" />
                <div className="flex flex-wrap items-start justify-between gap-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-white/45">{item.year}</p>
                    <h3 className="mt-3 text-2xl font-display font-semibold text-white">{item.title}</h3>
                  </div>
                  <div className="max-w-2xl text-sm leading-7 text-white/65">{item.copy}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function TestimonialsSection() {
  const testimonialsLoop = useMemo(() => [...testimonials, ...testimonials], [])

  return (
    <section id="testimonials" className="reveal-section relative px-6 py-24 sm:px-8 lg:px-12 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Testimonials" title="Client feedback that values taste, speed, and execution." description="The marquee keeps moving, but each card remains readable, calm, and premium." align="center" />

        <div className="marquee-mask overflow-hidden rounded-[32px] border border-white/10 bg-white/5 py-6 backdrop-blur-xl">
          <div className="marquee-track flex w-max gap-5 px-5">
            {testimonialsLoop.map((item, index) => (
              <article key={`${item.name}-${index}`} className="w-[340px] rounded-[28px] border border-white/10 bg-[#101018] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.25)]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-sm font-medium text-white">{item.name}</div>
                    <div className="text-xs uppercase tracking-[0.24em] text-white/40">{item.role}</div>
                  </div>
                  <div className="flex items-center gap-1 text-[#3B82F6]">
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <Star key={starIndex} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="mt-5 text-sm leading-7 text-white/68">“{item.quote}”</p>
                <div className="mt-5 text-xs uppercase tracking-[0.24em] text-white/45">{item.company}</div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function ProcessSection() {
  return (
    <section id="process" className="reveal-section relative px-6 py-24 sm:px-8 lg:px-12 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Process" title="A clear four-step workflow connected by a visual thread." description="Each step is designed to feel like part of a larger story, not a disconnected deliverable." />

        <div className="relative">
          <svg className="pointer-events-none absolute left-0 top-16 hidden h-px w-full lg:block" viewBox="0 0 1200 40" preserveAspectRatio="none">
            <path d="M 0 20 C 220 20, 180 20, 300 20 S 520 20, 600 20 S 820 20, 900 20 S 1080 20, 1200 20" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" fill="none" />
            <path d="M 0 20 C 220 20, 180 20, 300 20 S 520 20, 600 20 S 820 20, 900 20 S 1080 20, 1200 20" stroke="#3B82F6" strokeWidth="1.5" fill="none" strokeDasharray="1200" strokeDashoffset="0" opacity="0.9" />
          </svg>

          <div className="grid gap-4 lg:grid-cols-4">
            {processSteps.map((step) => (
              <motion.div key={step.number} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }} className="reveal-item rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.28em] text-white/45">{step.number}</span>
                  <div className="h-3 w-3 rounded-full bg-[#3B82F6] shadow-[0_0_0_8px_rgba(59,130,246,0.12)]" />
                </div>
                <h3 className="mt-6 text-2xl font-display font-semibold text-white">{step.title}</h3>
                <p className="mt-4 text-sm leading-7 text-white/65">{step.copy}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function ContactSection() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <section id="contact" className="reveal-section relative px-6 py-24 sm:px-8 lg:px-12 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} className="reveal-item rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:p-8">
          <SectionHeading eyebrow="Contact" title="Let’s build something refined, cinematic, and useful." description="Use the form for briefs, collaborations, or creative direction. I respond best to clear goals and ambitious ideas." />

          <form
            className="grid gap-4"
            onSubmit={(event) => {
              event.preventDefault()
              setSubmitted(true)
            }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <input required placeholder="Name" className="rounded-[18px] border border-white/10 bg-[#101018] px-4 py-4 text-white placeholder:text-white/35 outline-none transition focus:border-[#3B82F6]/60" />
              <input required type="email" placeholder="Email" className="rounded-[18px] border border-white/10 bg-[#101018] px-4 py-4 text-white placeholder:text-white/35 outline-none transition focus:border-[#3B82F6]/60" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <input placeholder="Project" className="rounded-[18px] border border-white/10 bg-[#101018] px-4 py-4 text-white placeholder:text-white/35 outline-none transition focus:border-[#3B82F6]/60" />
              <input placeholder="Budget" className="rounded-[18px] border border-white/10 bg-[#101018] px-4 py-4 text-white placeholder:text-white/35 outline-none transition focus:border-[#3B82F6]/60" />
            </div>
            <textarea rows="6" placeholder="Tell me about your goals, timeline, and what success looks like." className="rounded-[22px] border border-white/10 bg-[#101018] px-4 py-4 text-white placeholder:text-white/35 outline-none transition focus:border-[#3B82F6]/60" />

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <MagneticButton className="rounded-full bg-white px-6 py-4 text-sm font-medium text-[#0B0B0F] transition-transform hover:bg-white/95" onClick={() => setSubmitted(true)}>
                Send Inquiry
              </MagneticButton>
              <p className="text-sm text-white/50">{submitted ? 'Message ready. I will reply shortly.' : 'Typical response time: within 1 business day.'}</p>
            </div>
          </form>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} className="reveal-item space-y-6">
          <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:p-8">
            <p className="text-xs uppercase tracking-[0.28em] text-white/45">Social</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {socialLinks.map((link) => {
                const Icon = link.icon
                return (
                  <a key={link.label} href={link.href} target={link.href.startsWith('http') ? '_blank' : undefined} rel={link.href.startsWith('http') ? 'noreferrer' : undefined} className="flex items-center justify-between rounded-[18px] border border-white/10 bg-[#101018] px-4 py-4 text-sm text-white/70 transition hover:border-[#3B82F6]/40 hover:bg-[#3B82F6]/10 hover:text-white">
                    <span className="flex items-center gap-3">
                      <Icon className="h-4 w-4 text-[#3B82F6]" />
                      {link.label}
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-white/35" />
                  </a>
                )
              })}
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:p-8">
            <p className="text-xs uppercase tracking-[0.28em] text-white/45">Location</p>
            <div className="mt-4 flex items-center gap-3 text-lg text-white/80">
              <MapPin className="h-5 w-5 text-[#3B82F6]" />
              Kathmandu, Nepal - working globally
            </div>
            <div className="mt-8 rounded-[24px] border border-white/10 bg-[#101018] p-5 text-sm leading-7 text-white/65">
              Brand identity, motion, and frontend should feel like a single system. That is the standard I design for.
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function SiteFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-white/10 px-6 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-2xl font-display font-semibold text-white">Rijan Shrestha</p>
          <p className="mt-2 text-sm text-white/45">Graphic Designer • Motion Graphics Artist • Frontend Developer</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm text-white/60">
          {socialLinks.map((link) => (
            <a key={link.label} href={link.href} target={link.href.startsWith('http') ? '_blank' : undefined} rel={link.href.startsWith('http') ? 'noreferrer' : undefined} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 transition hover:border-[#3B82F6]/40 hover:bg-[#3B82F6]/10 hover:text-white">
              {link.label}
            </a>
          ))}
          <a href="#home" className="rounded-full border border-white/10 bg-white px-4 py-2 text-[#0B0B0F] transition hover:bg-white/95">
            Back to top
          </a>
        </div>
      </div>
      <div className="mx-auto mt-8 flex max-w-7xl flex-col gap-3 border-t border-white/10 pt-6 text-xs uppercase tracking-[0.24em] text-white/35 sm:flex-row sm:items-center sm:justify-between">
        <span>© {currentYear} Rijan Shrestha</span>
        <span>Minimal. Premium. Cinematic.</span>
      </div>
    </footer>
  )
}

function SiteNav({ onMenuToggle, isOpen }) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 px-4 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/10 bg-[#0B0B0F]/70 px-4 py-3 backdrop-blur-2xl shadow-[0_18px_60px_rgba(0,0,0,0.3)]">
        <a href="#home" className="flex items-center gap-3 text-white">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sm font-semibold tracking-[0.28em] text-[#3B82F6]">RS</div>
          <div>
            <div className="text-sm font-medium">Rijan Shrestha</div>
            <div className="text-[10px] uppercase tracking-[0.28em] text-white/40">Creative Studio</div>
          </div>
        </a>

        <nav className="hidden items-center gap-2 lg:flex">
          {navigation.map((item) => (
            <a key={item.href} href={item.href} className="rounded-full px-4 py-2 text-sm text-white/65 transition hover:bg-white/5 hover:text-white">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a href="#contact" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 transition hover:border-[#3B82F6]/40 hover:bg-[#3B82F6]/10 hover:text-white">
            Let’s Talk
          </a>
        </div>

        <button onClick={onMenuToggle} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 lg:hidden">
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
    </header>
  )
}

function MobileMenu({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2 }} className="fixed inset-x-4 top-24 z-40 rounded-[28px] border border-white/10 bg-[#0B0B0F]/95 p-4 backdrop-blur-2xl lg:hidden">
          <div className="grid gap-2">
            {navigation.map((item) => (
              <a key={item.href} href={item.href} onClick={onClose} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white/80">
                {item.label}
              </a>
            ))}
            <a href="#contact" onClick={onClose} className="rounded-2xl bg-white px-4 py-4 font-medium text-[#0B0B0F]">
              Let’s Talk
            </a>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { scrollYProgress } = useScroll()

  useLenis()

  useEffect(() => {
    if (!isLoaded) return

    const ctx = gsap.context(() => {
      gsap.utils.toArray('.split-heading .char').forEach((char) => {
        gsap.from(char, {
          opacity: 0,
          y: 18,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: char,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        })
      })

      gsap.utils.toArray('.reveal-item').forEach((item) => {
        gsap.from(item, {
          opacity: 0,
          y: 24,
          filter: 'blur(8px)',
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 82%',
            toggleActions: 'play none none reverse',
          },
        })
      })

      gsap.to('.marquee-track', {
        xPercent: -50,
        ease: 'none',
        duration: 28,
        repeat: -1,
      })
    })

    return () => ctx.revert()
  }, [isLoaded])

  return (
    <>
      {!isLoaded && <Preloader onComplete={() => setIsLoaded(true)} />}
      {isLoaded ? (
        <div className="relative min-h-screen overflow-hidden bg-[#0B0B0F] text-white">
          <Cursor />
          <motion.div className="fixed inset-x-0 top-0 z-50 h-1 origin-left bg-[#3B82F6]" style={{ scaleX: scrollYProgress }} />
          <SiteNav onMenuToggle={() => setIsMenuOpen((current) => !current)} isOpen={isMenuOpen} />
          <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

          <main>
            <HeroSection />
            <AboutSection />
            <ProjectsSection />
            <ServicesSection />
            <SkillsSection />
            <ExperienceSection />
            <TestimonialsSection />
            <ProcessSection />
            <ContactSection />
          </main>

          <SiteFooter />
        </div>
      ) : null}
    </>
  )
}
