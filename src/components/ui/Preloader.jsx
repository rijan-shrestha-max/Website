import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export function Preloader({ onComplete }) {
  const preloaderRef = useRef(null)
  const logoRef = useRef(null)
  const progressBarRef = useRef(null)
  const counterRef = useRef(null)
  const screenTopRef = useRef(null)
  const screenBottomRef = useRef(null)

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        onComplete?.()
      },
    })

    // 1. Logo fade in (600ms)
    tl.from(
      logoRef.current,
      {
        opacity: 0,
        scale: 0.8,
        duration: 0.6,
        ease: 'back.out(1.7)',
      },
      0
    )

    // 2. Progress bar fills over 1.8s
    tl.to(
      progressBarRef.current,
      {
        scaleX: 1,
        duration: 1.8,
        ease: 'power1.inOut',
      },
      0.3
    )

    // 3. Counter animation - use to() with object tween
    let counterObj = { count: 0 }
    tl.to(
      counterObj,
      {
        count: 100,
        duration: 1.8,
        ease: 'power1.inOut',
        snap: { count: 1 },
        onUpdate: function () {
          if (counterRef.current) {
            counterRef.current.textContent = Math.floor(counterObj.count)
          }
        },
      },
      0.3
    )

    // 4. Hold at 100 for 200ms
    tl.to({}, { duration: 0.2 })

    // 5. Screen split animation
    tl.to(
      screenTopRef.current,
      {
        clipPath: 'inset(-100% 0 0 0)',
        y: -window.innerHeight,
        duration: 0.8,
        ease: 'power3.inOut',
      },
      '-=0.2'
    )

    tl.to(
      screenBottomRef.current,
      {
        clipPath: 'inset(0 0 -100% 0)',
        y: window.innerHeight,
        duration: 0.8,
        ease: 'power3.inOut',
      },
      '-=0.8'
    )

    // 6. Fade out logo
    tl.to(
      logoRef.current,
      {
        opacity: 0,
        duration: 0.4,
      },
      '-=0.8'
    )

    // 7. Fade out preloader
    tl.to(
      preloaderRef.current,
      {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
      },
      '-=0.2'
    )

    return () => {
      tl.kill()
    }
  }, [onComplete])

  return (
    <div
      ref={preloaderRef}
      className="fixed inset-0 z-50 pointer-events-none bg-[#0B0B0F]"
    >
      <div
        ref={screenTopRef}
        className="absolute top-0 left-0 w-full h-1/2 bg-bg-primary"
        style={{ clipPath: 'inset(0 0 0 0)' }}
      />

      <div
        ref={screenBottomRef}
        className="absolute top-1/2 left-0 w-full h-1/2 bg-bg-primary"
        style={{ clipPath: 'inset(0 0 0 0)' }}
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div ref={logoRef} className="mb-12 text-center">
          <h1 className="text-6xl font-display font-bold text-white">Rijan</h1>
        </div>

        <div className="w-48">
          <div className="w-full h-1 bg-bg-surface rounded-full overflow-hidden">
            <div
              ref={progressBarRef}
              className="h-full bg-gradient-to-r from-accent to-accent/60 rounded-full"
              style={{
                scaleX: 0,
                transformOrigin: 'left',
              }}
            />
          </div>

          <div className="mt-4 text-center">
            <span
              ref={counterRef}
              className="text-2xl font-display font-bold text-[#3B82F6]"
            >
              0
            </span>
            <span className="text-2xl font-display font-bold text-text-muted ml-2">%</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Preloader
