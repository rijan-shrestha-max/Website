import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '@/utils/gsap-register'
import SplitText from '@/components/ui/SplitText'

const philosophy = [
  "Great design isn't just about aesthetics—it's about creating emotional connections through motion and visual language.",
  "Every frame tells a story. Every transition matters. Attention to detail transforms good work into exceptional work.",
  "Motion should feel natural, purposeful, and human. Technology serves the narrative, not the other way around."
]

export function Philosophy() {
  const containerRef = useRef(null)
  const quoteRef = useRef(null)
  const [currentQuote, setCurrentQuote] = useState(0)

  useEffect(() => {
    if (!quoteRef.current) return

    gsap.registerPlugin(ScrollTrigger)

    // Character reveal on scroll
    const quoteChars = quoteRef.current.querySelectorAll('.char')
    quoteChars.forEach((char, i) => {
      gsap.from(char, {
        scrollTrigger: {
          trigger: quoteRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
        opacity: 0,
        y: 20,
        duration: 0.4,
        delay: i * 0.02,
        ease: 'power2.out',
      })
    })
  }, [currentQuote])

  return (
    <section
      ref={containerRef}
      id="philosophy"
      className="relative min-h-screen w-full bg-bg-primary py-24 px-8 flex items-center justify-center"
    >
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-accent rounded-full mix-blend-screen opacity-5 blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent rounded-full mix-blend-screen opacity-3 blur-3xl"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center space-y-12">
          <div className="space-y-4">
            <div className="text-sm font-medium text-accent tracking-widest uppercase">My Philosophy</div>
            <h2 className="text-5xl md:text-6xl font-display font-bold text-text-primary leading-tight">
              Design with Purpose
            </h2>
          </div>

          {/* Quote display */}
          <blockquote className="space-y-8">
            <p
              ref={quoteRef}
              className="text-2xl md:text-3xl font-light text-text-secondary leading-relaxed italic"
            >
              <SplitText text={philosophy[currentQuote]} type="chars" />
            </p>
          </blockquote>

          {/* Philosophy points */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
            {['Quality', 'Story', 'Impact'].map((point, i) => (
              <div
                key={i}
                className="p-6 border border-bg-elevated rounded-lg hover:border-accent/30 transition-all duration-300 group cursor-pointer"
                onClick={() => setCurrentQuote(i)}
              >
                <div className="text-lg font-semibold text-accent group-hover:text-accent transition-colors">
                  {point}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Philosophy
