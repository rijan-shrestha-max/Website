import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export function useMagneticEffect(ref, intensity = 0.4) {
  const position = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (!ref.current) return

    const element = ref.current
    let animationFrameId

    const handleMouseMove = (e) => {
      const rect = element.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const distX = (e.clientX - centerX) * intensity
      const distY = (e.clientY - centerY) * intensity

      gsap.to(element, {
        x: distX,
        y: distY,
        duration: 0.3,
        overwrite: 'auto',
      })
    }

    const handleMouseLeave = () => {
      gsap.to(element, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)',
        overwrite: 'auto',
      })
    }

    element.addEventListener('mousemove', handleMouseMove)
    element.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      element.removeEventListener('mousemove', handleMouseMove)
      element.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [intensity])
}

export default useMagneticEffect
