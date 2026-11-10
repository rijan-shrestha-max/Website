import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

export function Cursor() {
  const cursorDotRef = useRef(null)
  const cursorRingRef = useRef(null)
  const [isHovering, setIsHovering] = useState(false)
  const [ringText, setRingText] = useState('')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if device has fine pointer (desktop)
    const isDesktop = window.matchMedia('(pointer: fine)').matches
    setIsMobile(!isDesktop)

    if (!isDesktop) {
      return
    }

    const dot = cursorDotRef.current
    const ring = cursorRingRef.current

    if (!dot || !ring) return

    // Mouse move listener
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e

      // Dot follows immediately
      gsap.to(dot, {
        x: clientX - 4,
        y: clientY - 4,
        duration: 0,
      })

      // Ring follows with lag
      gsap.to(ring, {
        x: clientX - 20,
        y: clientY - 20,
        duration: 0.15,
        ease: 'power2.out',
      })
    }

    // Mouse down - click animation
    const handleMouseDown = () => {
      gsap.to(dot, {
        scale: 1.5,
        duration: 0.1,
      })
      gsap.to(ring, {
        scale: 0.7,
        opacity: 0.5,
        duration: 0.1,
      })
    }

    // Mouse up - click animation release
    const handleMouseUp = () => {
      gsap.to(dot, {
        scale: 1,
        duration: 0.1,
      })
      gsap.to(ring, {
        scale: 1,
        opacity: 1,
        duration: 0.1,
      })
    }

    // Hover detection
    const handleHoverStart = (e) => {
      const target = e.target
      const hasHoverClass =
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('cursor-hover') ||
        target.classList.contains('magnetic-button')

      if (hasHoverClass) {
        setIsHovering(true)
        setRingText('')
        gsap.to(ring, {
          scale: 1.8,
          duration: 0.3,
          ease: 'power2.out',
        })
        gsap.to(ring, {
          background: 'rgba(59, 130, 246, 0.18)',
          duration: 0.3,
        })
      }

      // Project card hover
      if (target.closest('.project-card') || target.classList.contains('project-card')) {
        setRingText('VIEW')
        gsap.to(ring, {
          scale: 2.5,
          duration: 0.3,
          ease: 'power2.out',
        })
      }
    }

    const handleHoverEnd = () => {
      setIsHovering(false)
      setRingText('')
      gsap.to(ring, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
      })
      gsap.to(ring, {
        background: 'rgba(59, 130, 246, 0)',
        duration: 0.3,
      })
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('mouseover', handleHoverStart)
    document.addEventListener('mouseout', handleHoverEnd)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mouseover', handleHoverStart)
      document.removeEventListener('mouseout', handleHoverEnd)
    }
  }, [])

  if (isMobile) {
    return null
  }

  return (
    <>
      <div
        ref={cursorDotRef}
        className="cursor-dot fixed top-0 left-0 h-2 w-2 rounded-full bg-[#3B82F6] pointer-events-none z-50"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
      <div
        ref={cursorRingRef}
        className="cursor-ring fixed top-0 left-0 flex h-10 w-10 items-center justify-center rounded-full border border-[#3B82F6] pointer-events-none z-50 text-[8px] font-display font-bold text-[#3B82F6]"
        style={{
          transform: 'translate(-50%, -50%)',
          mixBlendMode: 'difference',
        }}
      >
        {ringText}
      </div>
    </>
  )
}

export default Cursor
