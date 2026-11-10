import { useRef } from 'react'
import { useMagneticEffect } from '../../hooks/useMagneticEffect'

export function MagneticButton({
  children,
  className = '',
  intensity = 0.4,
  onClick,
  ...props
}) {
  const buttonRef = useRef(null)
  useMagneticEffect(buttonRef, intensity)

  return (
    <button
      ref={buttonRef}
      className={`relative transition-transform ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}

export default MagneticButton
