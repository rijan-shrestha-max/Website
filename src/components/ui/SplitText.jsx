export function SplitText({ text = '', type = 'chars', className = '', children }) {
  /**
   * Splits text into individual elements for animation
   * @param {string} text - Text to split
   * @param {string} type - 'chars', 'words', or 'lines'
   * @param {string} className - CSS class to apply
   */

  if (!text && !children) return null

  const content = text || (typeof children === 'string' ? children : '')
  
  let elements = []

  switch (type) {
    case 'chars':
      elements = content.split('').map((char, i) => (
        <span key={i} className={`char ${className}`}>
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))
      break

    case 'words':
      elements = content.split(/\s+/).map((word, i, arr) => (
        <span key={i} className={`word ${className}`}>
          {word}
          {i < arr.length - 1 && '\u00A0'}
        </span>
      ))
      break

    case 'lines':
      elements = content.split('\n').map((line, i) => (
        <div key={i} className={`line ${className}`}>
          {line}
        </div>
      ))
      break

    default:
      elements = [content]
  }

  return <>{elements}</>
}

export default SplitText
