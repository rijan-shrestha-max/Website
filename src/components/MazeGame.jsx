import { useCallback, useEffect, useRef, useState } from 'react'

const STORAGE_KEY = 'portfolio_maze_highest_level'
const BASE_SIZE = 7
const MAX_SIZE = 31
const FOG_START_LEVEL = 5

/** Compute maze side length for a 1-based level (7x7 on L1, +2/level, max 31x31). */
function getGridSize(level) {
  return Math.min(MAX_SIZE, BASE_SIZE + (level - 1) * 2)
}

/** Convert a CSS hex or rgb(...) string into an rgba(...) string for Canvas drawing. */
function colorWithAlpha(color, alpha) {
  const value = (color || '').trim()
  if (value.startsWith('#')) {
    let hex = value.slice(1)
    if (hex.length === 3) {
      hex = hex.split('').map((ch) => ch + ch).join('')
    }
    const num = parseInt(hex, 16)
    if (!Number.isNaN(num) && hex.length === 6) {
      const r = (num >> 16) & 255
      const g = (num >> 8) & 255
      const b = num & 255
      return `rgba(${r}, ${g}, ${b}, ${alpha})`
    }
  }
  const rgbMatch = value.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/i)
  if (rgbMatch) {
    return `rgba(${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]}, ${alpha})`
  }
  return value || `rgba(255, 255, 255, ${alpha})`
}

/** Read design tokens from :root CSS custom properties so theme changes apply automatically. */
function readSitePalette() {
  if (typeof window === 'undefined') {
    return {
      bgPrimary: '#0b0b0f',
      bgSurface: '#11111a',
      bgElevated: '#1a1a24',
      textPrimary: '#ffffff',
      textSecondary: '#b8bcc9',
      textMuted: '#6a7184',
      accent: '#3b82f6',
      accentGlow: 'rgba(59, 130, 246, 0.28)',
      accentSubtle: 'rgba(59, 130, 246, 0.08)',
    }
  }
  const styles = window.getComputedStyle(document.documentElement)
  const get = (name, fallback) => styles.getPropertyValue(name).trim() || fallback
  return {
    bgPrimary: get('--bg-primary', '#0b0b0f'),
    bgSurface: get('--bg-surface', '#11111a'),
    bgElevated: get('--bg-elevated', '#1a1a24'),
    textPrimary: get('--text-primary', '#ffffff'),
    textSecondary: get('--text-secondary', '#b8bcc9'),
    textMuted: get('--text-muted', '#6a7184'),
    accent: get('--accent', '#3b82f6'),
    accentGlow: get('--accent-glow', 'rgba(59, 130, 246, 0.28)'),
    accentSubtle: get('--accent-subtle', 'rgba(59, 130, 246, 0.08)'),
  }
}

function readStoredHighestLevel() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const parsed = parseInt(raw, 10)
    return Number.isFinite(parsed) && parsed >= 1 ? parsed : 1
  } catch {
    return 1
  }
}

function writeStoredHighestLevel(level) {
  try {
    const current = readStoredHighestLevel()
    if (level > current) {
      window.localStorage.setItem(STORAGE_KEY, String(level))
    }
  } catch {
    // Ignore storage quota or restricted context errors cleanly
  }
}

function formatTime(ms) {
  const totalSeconds = Math.max(0, ms / 1000)
  const mins = Math.floor(totalSeconds / 60)
  const secs = (totalSeconds % 60).toFixed(1).padStart(4, '0')
  return mins > 0 ? `${mins}:${secs}` : `${secs}s`
}

/**
 * Iterative recursive backtracker maze generator.
 * Early levels (1-4) open a few extra interior walls for loops; level 5+ stays single-solution.
 */
function generateMaze(level) {
  const size = getGridSize(level)
  const grid = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => ({
      top: true,
      right: true,
      bottom: true,
      left: true,
      visited: false,
    }))
  )

  const directions = [
    { dx: 0, dy: -1, wall: 'top', opposite: 'bottom' },
    { dx: 1, dy: 0, wall: 'right', opposite: 'left' },
    { dx: 0, dy: 1, wall: 'bottom', opposite: 'top' },
    { dx: -1, dy: 0, wall: 'left', opposite: 'right' },
  ]

  const stack = [{ x: 0, y: 0 }]
  grid[0][0].visited = true

  while (stack.length > 0) {
    const current = stack[stack.length - 1]
    const neighbors = []

    for (let i = 0; i < directions.length; i += 1) {
      const dir = directions[i]
      const nx = current.x + dir.dx
      const ny = current.y + dir.dy
      if (nx >= 0 && nx < size && ny >= 0 && ny < size && !grid[ny][nx].visited) {
        neighbors.push({ nx, ny, wall: dir.wall, opposite: dir.opposite })
      }
    }

    if (neighbors.length > 0) {
      const pick = neighbors[Math.floor(Math.random() * neighbors.length)]
      grid[current.y][current.x][pick.wall] = false
      grid[pick.ny][pick.nx][pick.opposite] = false
      grid[pick.ny][pick.nx].visited = true
      stack.push({ x: pick.nx, y: pick.ny })
    } else {
      stack.pop()
    }
  }

  // Open extra interior loops on early levels (1-4) to ease navigation before single-solution L5+
  if (level < FOG_START_LEVEL) {
    const loopBudget = Math.max(2, Math.round(size * size * (0.12 - (level - 1) * 0.025)))
    let opened = 0
    let guard = loopBudget * 6

    while (opened < loopBudget && guard > 0) {
      guard -= 1
      const rx = Math.floor(Math.random() * size)
      const ry = Math.floor(Math.random() * size)
      const horizontal = Math.random() < 0.5

      if (horizontal && rx < size - 1 && grid[ry][rx].right) {
        grid[ry][rx].right = false
        grid[ry][rx + 1].left = false
        opened += 1
      } else if (!horizontal && ry < size - 1 && grid[ry][rx].bottom) {
        grid[ry][rx].bottom = false
        grid[ry + 1][rx].top = false
        opened += 1
      }
    }
  }

  return { size, grid }
}

export function MazeGame() {
  const canvasRef = useRef(null)
  const frameWrapperRef = useRef(null)
  const swipeOriginRef = useRef(null)

  const [screen, setScreen] = useState('title') // 'title' | 'playing' | 'won'
  const [level, setLevel] = useState(1)
  const [highestLevel, setHighestLevel] = useState(() => readStoredHighestLevel())
  const [hudMoves, setHudMoves] = useState(0)
  const [hudTimeMs, setHudTimeMs] = useState(0)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [announcement, setAnnouncement] = useState('')

  // Mutable live game state kept inside refs so the 60fps Canvas loop triggers zero per-frame renders
  const gameRef = useRef(null)
  if (!gameRef.current) {
    gameRef.current = {
      phase: 'title',
      level: 1,
      size: BASE_SIZE,
      grid: generateMaze(1).grid,
      px: 0,
      py: 0,
      renderX: 0,
      renderY: 0,
      trail: [],
      moves: 0,
      timerActive: false,
      startedAt: 0,
      elapsedMs: 0,
      palette: readSitePalette(),
      cssSize: 480,
      dpr: 1,
      lastFrameTime: 0,
      reducedMotion: false,
    }
  }

  // Detect reduced motion preference and coarse touch pointers cleanly
  useEffect(() => {
    const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const touchMq = window.matchMedia('(pointer: coarse)')

    const syncPreferences = () => {
      const rm = motionMq.matches
      setReducedMotion(rm)
      gameRef.current.reducedMotion = rm
      setIsTouchDevice(touchMq.matches)
    }

    syncPreferences()
    motionMq.addEventListener('change', syncPreferences)
    touchMq.addEventListener('change', syncPreferences)
    return () => {
      motionMq.removeEventListener('change', syncPreferences)
      touchMq.removeEventListener('change', syncPreferences)
    }
  }, [])

  // Refresh computed CSS color tokens if root classes or styles change
  useEffect(() => {
    gameRef.current.palette = readSitePalette()
    const observer = new MutationObserver(() => {
      gameRef.current.palette = readSitePalette()
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style'] })
    return () => observer.disconnect()
  }, [])

  /** Draw one frame of the maze, trail, origin/exit markers, fog of war, and player puck. */
  const draw = useCallback((ctx, width, height, dt) => {
    const g = gameRef.current
    const p = g.palette
    const pad = Math.max(12, Math.floor(width * 0.036))
    const boardSpan = width - pad * 2
    const cellSize = boardSpan / g.size

    // Exponential movement smoothing (snaps directly under reduced motion)
    if (g.reducedMotion) {
      g.renderX = g.px
      g.renderY = g.py
    } else {
      const lerp = 1 - Math.exp(-22 * dt)
      g.renderX += (g.px - g.renderX) * lerp
      g.renderY += (g.py - g.renderY) * lerp
    }

    // Decay trail alpha cleanly
    const decayRate = g.reducedMotion ? 0 : 0.85
    for (let i = g.trail.length - 1; i >= 0; i -= 1) {
      g.trail[i].life -= dt * decayRate
      if (g.trail[i].life <= 0) {
        g.trail.splice(i, 1)
      }
    }

    // Background matching site surface token
    ctx.fillStyle = p.bgSurface
    ctx.fillRect(0, 0, width, height)

    const cellCenter = (cx, cy) => ({
      x: pad + (cx + 0.5) * cellSize,
      y: pad + (cy + 0.5) * cellSize,
    })

    // Origin marker at top-left (0, 0)
    const originPos = cellCenter(0, 0)
    ctx.strokeStyle = colorWithAlpha(p.textMuted, 0.45)
    ctx.lineWidth = Math.max(1.25, cellSize * 0.06)
    ctx.beginPath()
    ctx.arc(originPos.x, originPos.y, cellSize * 0.2, 0, Math.PI * 2)
    ctx.stroke()

    // Destination marker at bottom-right (size - 1, size - 1)
    const exitPos = cellCenter(g.size - 1, g.size - 1)
    const exitRadius = cellSize * 0.28
    ctx.fillStyle = p.accentSubtle
    ctx.beginPath()
    ctx.arc(exitPos.x, exitPos.y, cellSize * 0.38, 0, Math.PI * 2)
    ctx.fill()

    ctx.strokeStyle = p.accent
    ctx.lineWidth = Math.max(1.5, cellSize * 0.08)
    ctx.beginPath()
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(
        exitPos.x - exitRadius,
        exitPos.y - exitRadius,
        exitRadius * 2,
        exitRadius * 2,
        Math.max(3, cellSize * 0.12)
      )
    } else {
      ctx.rect(exitPos.x - exitRadius, exitPos.y - exitRadius, exitRadius * 2, exitRadius * 2)
    }
    ctx.stroke()

    // Player trail ribbon
    if (g.trail.length > 0) {
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      for (let i = 0; i < g.trail.length; i += 1) {
        const pt = g.trail[i]
        const next = i < g.trail.length - 1 ? g.trail[i + 1] : { x: g.renderX, y: g.renderY }
        const from = cellCenter(pt.x, pt.y)
        const to = cellCenter(next.x, next.y)
        const alpha = g.reducedMotion ? 0.22 : Math.max(0.04, pt.life * 0.42)
        ctx.strokeStyle = colorWithAlpha(p.accent, alpha)
        ctx.lineWidth = Math.max(2, cellSize * 0.18)
        ctx.beginPath()
        ctx.moveTo(from.x, from.y)
        ctx.lineTo(to.x, to.y)
        ctx.stroke()
      }
    }

    // Draw maze walls cleanly (each shared interior edge rendered once)
    ctx.strokeStyle = colorWithAlpha(p.textPrimary, 0.24)
    ctx.lineWidth = Math.max(1.5, Math.min(3.5, cellSize * 0.12))
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()

    for (let y = 0; y < g.size; y += 1) {
      for (let x = 0; x < g.size; x += 1) {
        const cell = g.grid[y][x]
        const x0 = pad + x * cellSize
        const y0 = pad + y * cellSize
        const x1 = x0 + cellSize
        const y1 = y0 + cellSize

        if (y === 0 && cell.top) {
          ctx.moveTo(x0, y0)
          ctx.lineTo(x1, y0)
        }
        if (x === 0 && cell.left) {
          ctx.moveTo(x0, y0)
          ctx.lineTo(x0, y1)
        }
        if (cell.right) {
          ctx.moveTo(x1, y0)
          ctx.lineTo(x1, y1)
        }
        if (cell.bottom) {
          ctx.moveTo(x0, y1)
          ctx.lineTo(x1, y1)
        }
      }
    }
    ctx.stroke()

    const playerPos = cellCenter(g.renderX, g.renderY)

    // Fog of war overlay starting from Level 5
    if (g.level >= FOG_START_LEVEL) {
      const innerR = cellSize * 1.4
      const outerR = cellSize * 3.4
      const fog = ctx.createRadialGradient(
        playerPos.x,
        playerPos.y,
        innerR,
        playerPos.x,
        playerPos.y,
        outerR
      )
      fog.addColorStop(0, colorWithAlpha(p.bgPrimary, 0))
      fog.addColorStop(0.55, colorWithAlpha(p.bgPrimary, 0.72))
      fog.addColorStop(1, colorWithAlpha(p.bgPrimary, 0.98))
      ctx.fillStyle = fog
      ctx.fillRect(0, 0, width, height)
    }

    // Player token drawn crisp above fog floor
    const playerRadius = Math.max(4, cellSize * 0.27)
    ctx.fillStyle = p.textPrimary
    ctx.beginPath()
    ctx.arc(playerPos.x, playerPos.y, playerRadius, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = p.accent
    ctx.beginPath()
    ctx.arc(playerPos.x, playerPos.y, playerRadius * 0.42, 0, Math.PI * 2)
    ctx.fill()
  }, [])

  /** Transition to level-complete state and unlock the next level in localStorage. */
  const win = useCallback(() => {
    const g = gameRef.current
    if (g.phase !== 'playing') return

    const finalMs = g.timerActive ? performance.now() - g.startedAt : 0
    g.elapsedMs = finalMs
    g.phase = 'won'

    const unlocked = g.level + 1
    writeStoredHighestLevel(unlocked)
    setHighestLevel((prev) => Math.max(prev, unlocked))
    setHudTimeMs(finalMs)
    setScreen('won')
    setAnnouncement(`Level ${g.level} complete in ${formatTime(finalMs)} and ${g.moves} moves.`)
  }, [])

  /** Start or restart any level cleanly and reset timer/moves/trail. */
  const start = useCallback((targetLevel = 1) => {
    const safeLevel = Math.max(1, targetLevel)
    const { size, grid } = generateMaze(safeLevel)
    const g = gameRef.current

    g.phase = 'playing'
    g.level = safeLevel
    g.size = size
    g.grid = grid
    g.px = 0
    g.py = 0
    g.renderX = 0
    g.renderY = 0
    g.trail = [{ x: 0, y: 0, life: 1 }]
    g.moves = 0
    g.timerActive = false
    g.startedAt = 0
    g.elapsedMs = 0
    g.palette = readSitePalette()

    writeStoredHighestLevel(safeLevel)
    setHighestLevel((prev) => Math.max(prev, safeLevel))
    setLevel(safeLevel)
    setHudMoves(0)
    setHudTimeMs(0)
    setScreen('playing')
    setAnnouncement(`Started level ${safeLevel}, ${size} by ${size} grid.`)
    requestAnimationFrame(() => canvasRef.current?.focus({ preventScroll: true }))
  }, [])

  /** Attempt a single cell step along (dx, dy), updating timer, trail, and win state. */
  const move = useCallback((dx, dy) => {
    const g = gameRef.current
    if (g.phase !== 'playing') return

    const cell = g.grid[g.py]?.[g.px]
    if (!cell) return

    if (dx === 1 && cell.right) return
    if (dx === -1 && cell.left) return
    if (dy === 1 && cell.bottom) return
    if (dy === -1 && cell.top) return

    if (!g.timerActive) {
      g.timerActive = true
      g.startedAt = performance.now()
    }

    g.trail.push({ x: g.px, y: g.py, life: 1 })
    const maxTrail = g.reducedMotion ? 10 : 28
    while (g.trail.length > maxTrail) {
      g.trail.shift()
    }

    g.px += dx
    g.py += dy
    g.moves += 1
    setHudMoves(g.moves)

    if (g.px === g.size - 1 && g.py === g.size - 1) {
      win()
    }
  }, [win])

  // ResizeObserver keeps the canvas square crisp across breakpoints including 320px viewports
  useEffect(() => {
    const wrapper = frameWrapperRef.current
    const canvas = canvasRef.current
    if (!wrapper || !canvas) return

    const updateCanvasSize = () => {
      const rect = wrapper.getBoundingClientRect()
      const cssSize = Math.max(240, Math.floor(rect.width))
      const dpr = Math.min(window.devicePixelRatio || 1, 2)

      gameRef.current.cssSize = cssSize
      gameRef.current.dpr = dpr

      canvas.width = Math.floor(cssSize * dpr)
      canvas.height = Math.floor(cssSize * dpr)

      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        draw(ctx, cssSize, cssSize, 0.016)
      }
    }

    updateCanvasSize()
    const ro = new ResizeObserver(updateCanvasSize)
    ro.observe(wrapper)
    return () => ro.disconnect()
  }, [draw])

  // Continuous render loop driven strictly by refs + lightweight 100ms HUD timer update
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let rafId = 0
    let lastHudSync = 0
    gameRef.current.lastFrameTime = performance.now()

    const loop = (now) => {
      const g = gameRef.current
      const dt = Math.min(0.05, Math.max(0.001, (now - g.lastFrameTime) / 1000))
      g.lastFrameTime = now

      ctx.setTransform(g.dpr, 0, 0, g.dpr, 0, 0)
      draw(ctx, g.cssSize, g.cssSize, dt)

      if (g.phase === 'playing' && g.timerActive && now - lastHudSync > 90) {
        lastHudSync = now
        setHudTimeMs(now - g.startedAt)
      }

      rafId = window.requestAnimationFrame(loop)
    }

    rafId = window.requestAnimationFrame(loop)
    return () => window.cancelAnimationFrame(rafId)
  }, [draw])

  // Keyboard controls (Arrows, WASD, R to restart) — skipped safely when typing in form fields
  useEffect(() => {
    const handleKeyDown = (e) => {
      const target = e.target
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return
      }

      if (gameRef.current.phase !== 'playing') return

      const key = e.key
      if (key === 'ArrowUp' || key === 'w' || key === 'W') {
        e.preventDefault()
        move(0, -1)
      } else if (key === 'ArrowRight' || key === 'd' || key === 'D') {
        e.preventDefault()
        move(1, 0)
      } else if (key === 'ArrowDown' || key === 's' || key === 'S') {
        e.preventDefault()
        move(0, 1)
      } else if (key === 'ArrowLeft' || key === 'a' || key === 'A') {
        e.preventDefault()
        move(-1, 0)
      } else if (key === 'r' || key === 'R') {
        e.preventDefault()
        start(gameRef.current.level)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [move, start])

  // Pointer/touch swipe handlers on the canvas with page-scroll locked via touch-action: none
  const handlePointerDown = (e) => {
    if (gameRef.current.phase !== 'playing') return
    try {
      e.currentTarget.setPointerCapture?.(e.pointerId)
    } catch {
      // Ignore synthetic pointer events without active pointerId
    }
    swipeOriginRef.current = { x: e.clientX, y: e.clientY }
  }

  const handlePointerMove = (e) => {
    const origin = swipeOriginRef.current
    if (!origin || gameRef.current.phase !== 'playing') return

    const dx = e.clientX - origin.x
    const dy = e.clientY - origin.y
    const threshold = 24

    if (Math.abs(dx) < threshold && Math.abs(dy) < threshold) return

    if (Math.abs(dx) > Math.abs(dy)) {
      move(dx > 0 ? 1 : -1, 0)
    } else {
      move(0, dy > 0 ? 1 : -1)
    }
    // Reset origin so continuous drags step smoothly cell by cell
    swipeOriginRef.current = { x: e.clientX, y: e.clientY }
  }

  const handlePointerUp = () => {
    swipeOriginRef.current = null
  }

  const currentGridSize = getGridSize(level)
  const nextLevelSize = getGridSize(level + 1)
  const fogActive = level >= FOG_START_LEVEL

  return (
    <section
      aria-label="Interactive Maze Exercise"
      className="mx-auto w-full max-w-[580px] font-body text-text-primary"
    >
      <div className="glass-card overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-5 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-7">
        {/* Header & HUD */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-white/45">
              Interactive Study
            </p>
            <h2 className="mt-1 font-display text-2xl font-semibold text-white">
              Spatial Labyrinth
            </h2>
          </div>

          {screen === 'playing' && (
            <button
              type="button"
              onClick={() => start(level)}
              aria-label="Restart current level"
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-white/80 backdrop-blur-xl transition-colors hover:border-[#3B82F6]/40 hover:bg-[#3B82F6]/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              Restart (R)
            </button>
          )}
        </div>

        {/* Metrics Strip matching heroStat / experience cards */}
        <div className="mb-5 grid grid-cols-3 gap-3">
          <div className="rounded-[20px] border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl">
            <div className="text-[11px] uppercase tracking-[0.22em] text-white/45">
              Level
            </div>
            <div className="mt-1 flex items-baseline gap-2 font-display text-xl font-semibold tabular-nums text-white sm:text-2xl">
              <span>{String(level).padStart(2, '0')}</span>
              <span className="font-body text-xs font-normal text-white/50">
                {currentGridSize}&times;{currentGridSize}
              </span>
            </div>
          </div>

          <div className="rounded-[20px] border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl">
            <div className="text-[11px] uppercase tracking-[0.22em] text-white/45">
              Time
            </div>
            <div className="mt-1 font-display text-xl font-semibold tabular-nums text-white sm:text-2xl">
              {formatTime(hudTimeMs)}
            </div>
          </div>

          <div className="rounded-[20px] border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl">
            <div className="text-[11px] uppercase tracking-[0.22em] text-white/45">
              Moves
            </div>
            <div className="mt-1 font-display text-xl font-semibold tabular-nums text-white sm:text-2xl">
              {hudMoves}
            </div>
          </div>
        </div>

        {/* Game Board Frame */}
        <div
          ref={frameWrapperRef}
          className="relative aspect-square w-full overflow-hidden rounded-[24px] border border-white/10 bg-bg-surface"
        >
          <canvas
            ref={canvasRef}
            tabIndex={0}
            aria-label={`Level ${level} interactive ${currentGridSize} by ${currentGridSize} maze board. Use arrow keys or WASD to reach the bottom-right exit.`}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="block h-full w-full touch-none select-none outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent"
            style={{ touchAction: 'none' }}
          />

          {/* Subtle Level 5+ Fog indicator pill */}
          {screen === 'playing' && fogActive && (
            <div className="pointer-events-none absolute left-4 top-4 rounded-full border border-white/10 bg-[#0B0B0F]/70 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/75 backdrop-blur-xl">
              Limited Vision
            </div>
          )}

          {/* Title Screen Overlay */}
          {screen === 'title' && (
            <div
              role="region"
              aria-label="Maze introduction"
              className={`absolute inset-0 flex items-center justify-center bg-[#0B0B0F]/80 p-5 backdrop-blur-md ${
                reducedMotion ? '' : 'transition-opacity duration-300'
              }`}
            >
              <div className="w-full max-w-sm rounded-[24px] border border-white/10 bg-white/5 p-6 text-center backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.28em] text-accent">
                  {highestLevel > 1 ? `Best Reached · Level ${highestLevel}` : 'Level 01 · 7×7 Grid'}
                </p>
                <h3 className="mt-2 font-display text-2xl font-semibold text-white">
                  Find the Exit
                </h3>
                <p className="mt-3 text-sm leading-6 text-white/70">
                  Guide the marker from top-left to bottom-right. Grids expand each stage, with limited vision from Level 5.
                </p>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  {highestLevel > 1 ? (
                    <>
                      <button
                        type="button"
                        onClick={() => start(highestLevel)}
                        className="rounded-full border border-white/10 bg-white px-6 py-3 text-sm font-medium text-[#0B0B0F] shadow-[0_0_40px_rgba(255,255,255,0.08)] transition-transform hover:bg-white/95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                      >
                        Resume Level {highestLevel}
                      </button>
                      <button
                        type="button"
                        onClick={() => start(1)}
                        className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white backdrop-blur-xl transition-colors hover:border-[#3B82F6]/40 hover:bg-[#3B82F6]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                      >
                        New Run
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => start(1)}
                      className="rounded-full border border-white/10 bg-white px-7 py-3 text-sm font-medium text-[#0B0B0F] shadow-[0_0_40px_rgba(255,255,255,0.08)] transition-transform hover:bg-white/95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      Start Level 1
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Level Complete Overlay */}
          {screen === 'won' && (
            <div
              role="region"
              aria-label="Level complete summary"
              className={`absolute inset-0 flex items-center justify-center bg-[#0B0B0F]/82 p-5 backdrop-blur-md ${
                reducedMotion ? '' : 'transition-opacity duration-300'
              }`}
            >
              <div className="w-full max-w-sm rounded-[24px] border border-white/10 bg-white/5 p-6 text-center backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.28em] text-accent">
                  Stage Cleared
                </p>
                <h3 className="mt-2 font-display text-2xl font-semibold text-white">
                  Level {level} Complete
                </h3>

                <div className="mt-5 grid grid-cols-3 gap-2 rounded-[18px] border border-white/10 bg-[#0B0B0F]/60 p-3">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-white/45">
                      Time
                    </div>
                    <div className="mt-1 font-display text-base font-semibold tabular-nums text-white">
                      {formatTime(hudTimeMs)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-white/45">
                      Moves
                    </div>
                    <div className="mt-1 font-display text-base font-semibold tabular-nums text-white">
                      {hudMoves}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-white/45">
                      Next Grid
                    </div>
                    <div className="mt-1 font-display text-base font-semibold tabular-nums text-white">
                      {nextLevelSize}&times;{nextLevelSize}
                    </div>
                  </div>
                </div>

                {level + 1 === FOG_START_LEVEL && (
                  <p className="mt-3 text-xs text-white/65">
                    Heads up: vision radius narrows starting on Level {FOG_START_LEVEL}.
                  </p>
                )}

                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => start(level + 1)}
                    className="rounded-full border border-white/10 bg-white px-6 py-3 text-sm font-medium text-[#0B0B0F] shadow-[0_0_40px_rgba(255,255,255,0.08)] transition-transform hover:bg-white/95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    Next Level
                  </button>
                  <button
                    type="button"
                    onClick={() => start(level)}
                    className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white backdrop-blur-xl transition-colors hover:border-[#3B82F6]/40 hover:bg-[#3B82F6]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    Replay
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Touch-Device-Only D-Pad */}
        {isTouchDevice && (
          <div className="mt-5 flex flex-col items-center gap-2" role="group" aria-label="Directional movement pad">
            <button
              type="button"
              onClick={() => move(0, -1)}
              aria-label="Move up"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white backdrop-blur-xl active:bg-[#3B82F6]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <polyline points="18 15 12 9 6 15" />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => move(-1, 0)}
                aria-label="Move left"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white backdrop-blur-xl active:bg-[#3B82F6]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => move(0, 1)}
                aria-label="Move down"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white backdrop-blur-xl active:bg-[#3B82F6]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => move(1, 0)}
                aria-label="Move right"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white backdrop-blur-xl active:bg-[#3B82F6]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Controls Footer Hint */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-white/45">
          <span>
            {isTouchDevice ? 'Swipe board or tap D-pad to move' : 'Move with Arrow keys or WASD · R to restart'}
          </span>
          <span className="uppercase tracking-[0.2em]">
            {fogActive ? 'Fog Active' : 'Open Sight'}
          </span>
        </div>

        {/* Screen Reader Live Announcements */}
        <p className="sr-only" aria-live="polite">
          {announcement}
        </p>
      </div>
    </section>
  )
}

export default MazeGame
