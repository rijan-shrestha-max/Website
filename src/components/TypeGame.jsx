import { useCallback, useEffect, useRef, useState } from 'react'

let typeGameInstanceSeq = 0

const STORAGE_KEY = 'rijan_cyber_type_best'
const WORDS_PER_LEVEL = 15
const MAX_LIVES = 3
const HUD_SYNC_INTERVAL_MS = 160
const MISS_Y_RATIO = 0.91

const WORD_POOLS = {
  short: [
    'let',
    'map',
    'div',
    'git',
    'npm',
    'api',
    'css',
    'dom',
    'jsx',
    'sql',
    'url',
    'var',
    'key',
    'src',
    'svg',
    'ref',
    'req',
    'res',
    'env',
    'cli',
  ],
  medium: [
    'array',
    'state',
    'props',
    'async',
    'fetch',
    'regex',
    'hooks',
    'route',
    'query',
    'cache',
    'build',
    'class',
    'token',
    'modal',
    'stack',
    'bytes',
    'merge',
    'clone',
    'event',
    'frame',
  ],
  long: [
    'middleware',
    'typescript',
    'localStorage',
    'polymorphism',
    'refactoring',
    'deployment',
    'architecture',
    'authentication',
    'microservices',
    'optimization',
    'serialization',
    'abstraction',
    'asynchronous',
    'virtualization',
    'dependency',
    'observability',
  ],
}

const COLUMN_PCTS = [10, 30, 50, 70, 90]

function readStoredBest() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return { bestScore: 0, bestLevel: 1 }
    const parsed = JSON.parse(raw)
    return {
      bestScore: Number.isFinite(parsed?.bestScore) && parsed.bestScore > 0 ? parsed.bestScore : 0,
      bestLevel: Number.isFinite(parsed?.bestLevel) && parsed.bestLevel > 1 ? parsed.bestLevel : 1,
    }
  } catch {
    return { bestScore: 0, bestLevel: 1 }
  }
}

function writeStoredBest(bestScore, bestLevel) {
  try {
    const current = readStoredBest()
    const next = {
      bestScore: Math.max(current.bestScore, bestScore),
      bestLevel: Math.max(current.bestLevel, bestLevel),
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    return next
  } catch {
    return { bestScore, bestLevel }
  }
}

function computeComboMultiplier(combo) {
  return Math.min(4, 1 + Math.floor(combo / 3) * 0.25)
}

function computeWpm(correctChars, activePlayMs) {
  if (correctChars <= 0 || activePlayMs <= 0) return 0
  // Clamp minimum window so initial keystrokes do not inflate WPM artificially
  const effectiveMinutes = Math.max(activePlayMs, 2500) / 60000
  return Math.round(correctChars / 5 / effectiveMinutes)
}

function computeAccuracy(correctChars, wrongChars) {
  const total = correctChars + wrongChars
  if (total <= 0) return 100
  return Math.round((correctChars / total) * 100)
}

function pickWordText(level, activeWords) {
  let pool
  if (level <= 2) {
    pool = WORD_POOLS.short
  } else if (level <= 5) {
    pool = Math.random() < 0.76 ? WORD_POOLS.medium : WORD_POOLS.short
  } else {
    pool = Math.random() < 0.7 ? WORD_POOLS.long : WORD_POOLS.medium
  }

  const activeTexts = new Set(activeWords.map((w) => w.text))
  const candidates = pool.filter((word) => !activeTexts.has(word))
  const source = candidates.length > 0 ? candidates : pool
  return source[Math.floor(Math.random() * source.length)]
}

function getLevelConfig(level) {
  return {
    fallSpeedPerSec: Math.min(0.28, 0.085 + (level - 1) * 0.018),
    spawnIntervalMs: Math.max(820, 2050 - (level - 1) * 145),
    maxConcurrent: Math.min(7, 3 + Math.floor(level / 2)),
  }
}

/**
 * Cyberpunk terminal falling-word typing defense game.
 * Keeps per-frame falling coordinates inside refs paired with direct DOM transforms
 * while throttling HUD telemetry pushes cleanly for 60-144Hz responsiveness.
 */
export function TypeGame({ className = '' }) {
  const baseIdRef = useRef(null)
  if (!baseIdRef.current) {
    typeGameInstanceSeq += 1
    baseIdRef.current = `type-game-${typeGameInstanceSeq}`
  }
  const headingId = `${baseIdRef.current}-heading`
  const inputId = `${baseIdRef.current}-input`
  const statusId = `${baseIdRef.current}-status`

  const arenaRef = useRef(null)
  const inputRef = useRef(null)
  const primaryOverlayBtnRef = useRef(null)
  const wordNodeRefs = useRef(new Map())
  const rafRef = useRef(0)
  const lastHudSyncRef = useRef(0)
  const isComposingRef = useRef(false)
  const arenaHeightRef = useRef(380)
  const prefersReducedRef = useRef(false)

  // Mutable simulation state kept out of React render loop
  const simRef = useRef({
    phase: 'title', // 'title' | 'playing' | 'paused' | 'levelComplete' | 'gameOver'
    level: 1,
    score: 0,
    lives: MAX_LIVES,
    combo: 0,
    maxCombo: 0,
    levelCleared: 0,
    totalCleared: 0,
    runCorrectChars: 0,
    runWrongChars: 0,
    runPlayMs: 0,
    levelCorrectChars: 0,
    levelWrongChars: 0,
    levelPlayMs: 0,
    words: [],
    activeWordId: null,
    nextWordSeq: 1,
    nextBurstSeq: 1,
    spawnElapsedMs: 0,
    lastFrameMs: 0,
    statusLog: 'TX_00 // SYSTEM STANDBY',
    pauseReason: 'SIGNAL INTERRUPTED // PAUSED',
  })

  const [phase, setPhase] = useState('title')
  const [wordsView, setWordsView] = useState([])
  const [activeWordIdView, setActiveWordIdView] = useState(null)
  const [bursts, setBursts] = useState([])
  const [feedback, setFeedback] = useState({ errorFlash: false, hitShake: false })
  const [announcement, setAnnouncement] = useState('')
  const [bestRecord, setBestRecord] = useState(() =>
    typeof window !== 'undefined' ? readStoredBest() : { bestScore: 0, bestLevel: 1 }
  )

  const [hud, setHud] = useState({
    level: 1,
    score: 0,
    lives: MAX_LIVES,
    combo: 0,
    multiplier: 1,
    wpm: 0,
    accuracy: 100,
    levelCleared: 0,
    statusLog: 'TX_00 // SYSTEM STANDBY',
    pauseReason: 'SIGNAL INTERRUPTED // PAUSED',
  })

  const [summary, setSummary] = useState({
    level: 1,
    score: 0,
    wpm: 0,
    accuracy: 100,
    nextLevel: 2,
    isNewBestScore: false,
  })

  const feedbackTimersRef = useRef({ error: null, hit: null })

  const triggerErrorFlash = useCallback(() => {
    if (feedbackTimersRef.current.error) clearTimeout(feedbackTimersRef.current.error)
    setFeedback((prev) => ({ ...prev, errorFlash: true }))
    feedbackTimersRef.current.error = setTimeout(() => {
      setFeedback((prev) => ({ ...prev, errorFlash: false }))
    }, 240)
  }, [])

  const triggerHitEffect = useCallback(() => {
    if (feedbackTimersRef.current.hit) clearTimeout(feedbackTimersRef.current.hit)
    setFeedback((prev) => ({ ...prev, hitShake: true }))
    feedbackTimersRef.current.hit = setTimeout(() => {
      setFeedback((prev) => ({ ...prev, hitShake: false }))
    }, 360)
  }, [])

  const pushHudSnapshot = useCallback((force = false, now = performance.now()) => {
    if (!force && now - lastHudSyncRef.current < HUD_SYNC_INTERVAL_MS) return
    lastHudSyncRef.current = now
    const s = simRef.current
    setHud({
      level: s.level,
      score: s.score,
      lives: s.lives,
      combo: s.combo,
      multiplier: computeComboMultiplier(s.combo),
      wpm: computeWpm(s.runCorrectChars, s.runPlayMs),
      accuracy: computeAccuracy(s.runCorrectChars, s.runWrongChars),
      levelCleared: s.levelCleared,
      statusLog: s.statusLog,
      pauseReason: s.pauseReason,
    })
  }, [])

  const syncWordsView = useCallback(() => {
    const s = simRef.current
    setActiveWordIdView(s.activeWordId)
    setWordsView(
      s.words.map((w) => ({
        id: w.id,
        text: w.text,
        xPct: w.xPct,
        typedCount: w.typedCount,
        danger: w.yRatio >= 0.72,
      }))
    )
  }, [])

  const emitBurst = useCallback((xPct, yRatio, wordText) => {
    if (prefersReducedRef.current) return
    const s = simRef.current
    const burstId = s.nextBurstSeq++
    setBursts((prev) => [
      ...prev.slice(-4),
      { id: burstId, xPct, yPct: Math.max(8, Math.min(88, yRatio * 100)), wordText },
    ])
    setTimeout(() => {
      setBursts((prev) => prev.filter((b) => b.id !== burstId))
    }, 480)
  }, [])

  /** Spawn a programming keyword into a clear horizontal lane at the top of the arena. */
  const spawnWord = useCallback(() => {
    const s = simRef.current
    const cfg = getLevelConfig(s.level)
    if (s.words.length >= cfg.maxConcurrent) return false

    const usedRecently = new Set(
      s.words.filter((w) => w.yRatio < 0.24).map((w) => w.columnIndex)
    )
    const freeCols = COLUMN_PCTS.map((_, idx) => idx).filter((idx) => !usedRecently.has(idx))
    const colIdx =
      freeCols.length > 0
        ? freeCols[Math.floor(Math.random() * freeCols.length)]
        : Math.floor(Math.random() * COLUMN_PCTS.length)

    // Small horizontal jitter keeps columns organic while translation clamping prevents overflow
    const jitter = (Math.random() - 0.5) * 6
    const xPct = Math.max(4, Math.min(96, COLUMN_PCTS[colIdx] + jitter))
    const text = pickWordText(s.level, s.words)

    const word = {
      id: `pkt_${s.nextWordSeq++}`,
      text,
      columnIndex: colIdx,
      xPct,
      yRatio: -0.04,
      speed: cfg.fallSpeedPerSec * (0.93 + Math.random() * 0.14),
      typedCount: 0,
    }

    s.words.push(word)
    syncWordsView()
    return true
  }, [syncWordsView])

  /** Transition run cleanly into Level Complete or Game Over and persist personal bests. */
  const endGame = useCallback(
    (outcome) => {
      const s = simRef.current
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = 0
      }

      const nextPhase = outcome === 'levelComplete' ? 'levelComplete' : 'gameOver'
      s.phase = nextPhase
      s.activeWordId = null

      const prevBest = readStoredBest()

      if (nextPhase === 'levelComplete') {
        s.statusLog = `TX_${String(s.level).padStart(2, '0')} // SECTOR CLEARED`
        const levelWpm = computeWpm(s.levelCorrectChars, s.levelPlayMs)
        const levelAcc = computeAccuracy(s.levelCorrectChars, s.levelWrongChars)
        const saved = writeStoredBest(s.score, s.level + 1)
        setBestRecord(saved)
        setSummary({
          level: s.level,
          score: s.score,
          wpm: levelWpm,
          accuracy: levelAcc,
          nextLevel: s.level + 1,
          isNewBestScore: s.score > prevBest.bestScore,
        })
        setAnnouncement(
          `Level ${s.level} cleared. Accuracy ${levelAcc} percent, ${levelWpm} words per minute.`
        )
      } else {
        s.statusLog = 'ERR_00 // SIGNAL LOST'
        const runWpm = computeWpm(s.runCorrectChars, s.runPlayMs)
        const runAcc = computeAccuracy(s.runCorrectChars, s.runWrongChars)
        const saved = writeStoredBest(s.score, s.level)
        setBestRecord(saved)
        setSummary({
          level: s.level,
          score: s.score,
          wpm: runWpm,
          accuracy: runAcc,
          nextLevel: s.level,
          isNewBestScore: s.score > prevBest.bestScore && s.score > 0,
        })
        setAnnouncement(
          `Game over at level ${s.level}. Final score ${s.score}, ${runWpm} WPM, ${runAcc} percent accuracy.`
        )
      }

      setPhase(nextPhase)
      syncWordsView()
      pushHudSnapshot(true)

      setTimeout(() => {
        primaryOverlayBtnRef.current?.focus({ preventScroll: true })
      }, 20)
    },
    [pushHudSnapshot, syncWordsView]
  )

  /** Advance falling words using frame delta time, applying compositor transforms directly. */
  const update = useCallback(
    (now) => {
      const s = simRef.current
      if (s.phase !== 'playing') {
        rafRef.current = 0
        return
      }

      const dtMs = s.lastFrameMs ? Math.min(80, now - s.lastFrameMs) : 16.67
      s.lastFrameMs = now
      const dtSec = dtMs / 1000

      s.runPlayMs += dtMs
      s.levelPlayMs += dtMs
      s.spawnElapsedMs += dtMs

      const cfg = getLevelConfig(s.level)
      if (s.spawnElapsedMs >= cfg.spawnIntervalMs || s.words.length === 0) {
        if (spawnWord()) {
          s.spawnElapsedMs = 0
        }
      }

      const arenaH = Math.max(240, arenaHeightRef.current)
      let missedThisFrame = false
      const surviving = []

      for (let i = 0; i < s.words.length; i++) {
        const w = s.words[i]
        w.yRatio += w.speed * dtSec

        if (w.yRatio >= MISS_Y_RATIO) {
          missedThisFrame = true
          s.lives = Math.max(0, s.lives - 1)
          s.combo = 0
          if (s.activeWordId === w.id) {
            s.activeWordId = null
          }
          s.statusLog = `FIREWALL BREACHED // -1 LIFE (${w.text})`
          continue
        }

        surviving.push(w)
        const node = wordNodeRefs.current.get(w.id)
        if (node) {
          const yPx = Math.round(w.yRatio * arenaH)
          node.style.transform = `translate3d(-${w.xPct}%, ${yPx}px, 0)`
          node.dataset.danger = w.yRatio >= 0.72 ? 'true' : 'false'
        }
      }

      if (missedThisFrame) {
        s.words = surviving
        triggerHitEffect()
        syncWordsView()
        if (s.lives <= 0) {
          endGame('gameOver')
          return
        }
        setAnnouncement(`Firewall breached. ${s.lives} ${s.lives === 1 ? 'life' : 'lives'} left.`)
        pushHudSnapshot(true, now)
      } else {
        pushHudSnapshot(false, now)
      }

      rafRef.current = requestAnimationFrame(update)
    },
    [endGame, pushHudSnapshot, spawnWord, syncWordsView, triggerHitEffect]
  )

  const startLoop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    simRef.current.lastFrameMs = 0
    rafRef.current = requestAnimationFrame(update)
  }, [update])

  /** Reset level counters and start (or restart full run from Level 1). */
  const startLevel = useCallback(
    (targetLevel, { resetRun = false } = {}) => {
      const s = simRef.current
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = 0
      }

      if (resetRun) {
        s.score = 0
        s.lives = MAX_LIVES
        s.combo = 0
        s.maxCombo = 0
        s.totalCleared = 0
        s.runCorrectChars = 0
        s.runWrongChars = 0
        s.runPlayMs = 0
      }

      s.level = Math.max(1, targetLevel)
      s.levelCleared = 0
      s.levelCorrectChars = 0
      s.levelWrongChars = 0
      s.levelPlayMs = 0
      s.words = []
      s.activeWordId = null
      s.spawnElapsedMs = 0
      s.phase = 'playing'
      s.statusLog = `SYSTEM ONLINE // SECTOR ${String(s.level).padStart(2, '0')}`

      setPhase('playing')
      setBursts([])
      syncWordsView()
      spawnWord()
      pushHudSnapshot(true)
      setAnnouncement(`Level ${s.level} started. Type falling keywords to intercept packets.`)
      startLoop()

      setTimeout(() => {
        inputRef.current?.focus({ preventScroll: true })
      }, 20)
    },
    [pushHudSnapshot, spawnWord, startLoop, syncWordsView]
  )

  const pauseGame = useCallback(
    (reason = 'LINK PAUSED // ESC TO RESUME') => {
      const s = simRef.current
      if (s.phase !== 'playing') return
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = 0
      }
      s.phase = 'paused'
      s.pauseReason = reason
      s.statusLog = 'TX_HALT // ' + reason
      setPhase('paused')
      pushHudSnapshot(true)
      setAnnouncement('Game paused.')
      setTimeout(() => {
        primaryOverlayBtnRef.current?.focus({ preventScroll: true })
      }, 20)
    },
    [pushHudSnapshot]
  )

  const resumeGame = useCallback(() => {
    const s = simRef.current
    if (s.phase !== 'paused') return
    s.phase = 'playing'
    s.statusLog = `SYSTEM ONLINE // SECTOR ${String(s.level).padStart(2, '0')}`
    setPhase('playing')
    pushHudSnapshot(true)
    startLoop()
    setAnnouncement('Game resumed.')
    setTimeout(() => {
      inputRef.current?.focus({ preventScroll: true })
    }, 20)
  }, [pushHudSnapshot, startLoop])

  /** Match single printable key against locked target or closest-to-bottom word sharing prefix. */
  const handleKey = useCallback(
    (rawChar) => {
      const s = simRef.current
      if (s.phase !== 'playing' || !rawChar || rawChar.length !== 1) return
      if (/\s/.test(rawChar)) return
      if (s.words.length === 0) return

      const typedLower = rawChar.toLowerCase()
      let target = s.activeWordId
        ? s.words.find((w) => w.id === s.activeWordId) || null
        : null

      if (!target) {
        const matches = s.words.filter((w) => w.text[0]?.toLowerCase() === typedLower)
        if (matches.length === 0) {
          s.runWrongChars += 1
          s.levelWrongChars += 1
          s.combo = 0
          s.statusLog = `CHECKSUM ERR // '${rawChar}' REJECTED`
          triggerErrorFlash()
          pushHudSnapshot(true)
          return
        }
        // Highlight the matching word closest to the bottom first
        matches.sort((a, b) => b.yRatio - a.yRatio)
        target = matches[0]
        s.activeWordId = target.id
      }

      const expectedChar = target.text[target.typedCount]
      if (!expectedChar || expectedChar.toLowerCase() !== typedLower) {
        s.runWrongChars += 1
        s.levelWrongChars += 1
        s.combo = 0
        s.statusLog = `CHECKSUM ERR // EXPECTED '${expectedChar || ''}'`
        triggerErrorFlash()
        pushHudSnapshot(true)
        return
      }

      // Valid character progress
      target.typedCount += 1
      s.runCorrectChars += 1
      s.levelCorrectChars += 1

      if (target.typedCount >= target.text.length) {
        s.words = s.words.filter((w) => w.id !== target.id)
        s.activeWordId = null
        s.combo += 1
        s.maxCombo = Math.max(s.maxCombo, s.combo)
        s.levelCleared += 1
        s.totalCleared += 1

        const mult = computeComboMultiplier(s.combo)
        const points = Math.round((target.text.length * 15 + s.level * 10) * mult)
        s.score += points
        s.statusLog = `PACKET INTERCEPTED // +${points} (${target.text})`

        emitBurst(target.xPct, target.yRatio, target.text)
        syncWordsView()
        pushHudSnapshot(true)

        if (s.levelCleared >= WORDS_PER_LEVEL) {
          endGame('levelComplete')
        } else if (s.words.length === 0) {
          spawnWord()
          s.spawnElapsedMs = 0
        }
        return
      }

      syncWordsView()
    },
    [emitBurst, endGame, pushHudSnapshot, spawnWord, syncWordsView, triggerErrorFlash]
  )

  // Track reduced motion preference and arena pixel height for compositor translate3d
  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    prefersReducedRef.current = motionQuery.matches
    const onMotionChange = (e) => {
      prefersReducedRef.current = e.matches
    }
    motionQuery.addEventListener?.('change', onMotionChange)

    const arenaEl = arenaRef.current
    let resizeObserver = null
    const syncHeight = () => {
      if (arenaEl) {
        arenaHeightRef.current = arenaEl.clientHeight || 380
      }
    }
    syncHeight()
    if (arenaEl && 'ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(syncHeight)
      resizeObserver.observe(arenaEl)
    } else {
      window.addEventListener('resize', syncHeight)
    }

    return () => {
      motionQuery.removeEventListener?.('change', onMotionChange)
      resizeObserver?.disconnect()
      window.removeEventListener('resize', syncHeight)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      if (feedbackTimersRef.current.error) clearTimeout(feedbackTimersRef.current.error)
      if (feedbackTimersRef.current.hit) clearTimeout(feedbackTimersRef.current.hit)
    }
  }, [])

  // Auto-pause on tab hide or window blur
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden && simRef.current.phase === 'playing') {
        pauseGame('SIGNAL INTERRUPTED // TAB HIDDEN')
      }
    }
    const onBlur = () => {
      if (simRef.current.phase === 'playing') {
        pauseGame('SIGNAL INTERRUPTED // FOCUS LOST')
      }
    }

    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('blur', onBlur)
    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('blur', onBlur)
    }
  }, [pauseGame])

  // Global keyboard handler: Esc toggles pause; captures desktop keystrokes even if focus sits on arena
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return

      if (e.key === 'Escape') {
        if (simRef.current.phase === 'playing') {
          e.preventDefault()
          pauseGame('LINK PAUSED // ESC TO RESUME')
        } else if (simRef.current.phase === 'paused') {
          e.preventDefault()
          resumeGame()
        }
        return
      }

      if (simRef.current.phase !== 'playing') return
      if (isComposingRef.current) return

      // Skip unrelated inputs outside this game component
      const activeEl = document.activeElement
      if (activeEl === inputRef.current) return
      const tag = activeEl?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || activeEl?.isContentEditable) {
        return
      }

      if (e.key.length === 1 && !/\s/.test(e.key)) {
        e.preventDefault()
        handleKey(e.key)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [handleKey, pauseGame, resumeGame])

  const handleMobileInputChange = (e) => {
    if (isComposingRef.current) return
    const val = e.target.value
    if (!val) return
    for (let i = 0; i < val.length; i++) {
      handleKey(val[i])
    }
    e.target.value = ''
  }

  const focusTerminalInput = () => {
    if (simRef.current.phase === 'playing') {
      inputRef.current?.focus({ preventScroll: true })
    }
  }

  return (
    <div
      className={`type-game-shell project-card ${feedback.hitShake ? 'is-shaking' : ''} ${
        feedback.errorFlash ? 'is-error-flash' : ''
      } ${className}`.trim()}
      aria-labelledby={headingId}
    >
      <style>{`
        .type-game-shell {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 18px;
          background: var(--bg-card, var(--bg-surface, #121622));
          color: var(--text, var(--text-primary, #F4F2E9));
          border: 1px solid var(--border, rgba(0, 240, 255, 0.18));
          clip-path: polygon(
            var(--chamfer-md, 18px) 0,
            100% 0,
            100% calc(100% - var(--chamfer-md, 18px)),
            calc(100% - var(--chamfer-md, 18px)) 100%,
            0 100%,
            0 var(--chamfer-md, 18px)
          );
          font-family: var(--font-body, 'DM Sans', sans-serif);
          cursor: default;
          overflow: visible;
        }

        .type-game-shell:hover {
          transform: none;
        }

        .type-game-shell .card-reticle {
          position: absolute;
          width: 14px;
          height: 14px;
          border: 2px solid var(--cyber-cyan, #00F0FF);
          z-index: 4;
          pointer-events: none;
          opacity: 0.45;
        }

        .type-game-shell .card-reticle.tl {
          top: 12px;
          left: 12px;
          border-right: none;
          border-bottom: none;
        }

        .type-game-shell .card-reticle.br {
          bottom: 12px;
          right: 12px;
          border-left: none;
          border-top: none;
        }

        .type-game-shell.is-error-flash {
          border-color: var(--cyber-magenta, #FF2A6D);
        }

        @media (prefers-reduced-motion: no-preference) {
          .type-game-shell {
            transition: border-color var(--duration-fast, 0.22s) ease;
          }

          .type-game-shell.is-shaking {
            animation: typeGameShake 0.32s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
          }
        }

        @keyframes typeGameShake {
          10%, 90% { transform: translate3d(-2px, 0, 0); }
          20%, 80% { transform: translate3d(3px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }

        .type-game-header {
          display: flex;
          flex-wrap: wrap;
          align-items: flex-start;
          justify-content: space-between;
          gap: 10px;
          position: relative;
          z-index: 2;
        }

        .type-game-kicker {
          font-family: var(--font-mono, monospace);
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--cyber-cyan, var(--accent, #00F0FF));
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }

        .type-game-kicker::before {
          content: "";
          display: inline-block;
          width: 12px;
          height: 2px;
          background: var(--accent, #D5FF3F);
        }

        .type-game-title {
          font-family: var(--font-cyber, var(--font-display, 'Orbitron', sans-serif));
          font-size: clamp(1.05rem, 2.2vw, 1.45rem);
          font-weight: 800;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--text, var(--text-primary, #F4F2E9));
          margin: 0;
          line-height: 1.08;
        }

        .type-game-controls-top {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .type-game-btn-sm {
          min-height: 36px;
          padding: 6px 12px;
          font-family: var(--font-mono, monospace);
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          background: var(--bg-surface, #0D1018);
          color: var(--text, #F4F2E9);
          border: 1px solid var(--border, rgba(0, 240, 255, 0.18));
          cursor: pointer;
        }

        .type-game-btn-sm:hover {
          border-color: var(--cyber-cyan, #00F0FF);
          color: var(--cyber-cyan, #00F0FF);
        }

        .type-game-hud {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 6px;
          position: relative;
          z-index: 2;
        }

        @media (max-width: 560px) {
          .type-game-hud {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        .type-game-hud-cell {
          background: var(--bg-surface, #0D1018);
          border: 1px solid var(--border, rgba(0, 240, 255, 0.18));
          padding: 6px 8px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }

        .type-game-hud-label {
          font-family: var(--font-mono, monospace);
          font-size: 0.6rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--text-muted, #8F96A3);
          white-space: nowrap;
        }

        .type-game-hud-val {
          font-family: var(--font-cyber, var(--font-display, 'Orbitron', sans-serif));
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text, #F4F2E9);
          font-variant-numeric: tabular-nums;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .type-game-lives-row {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          height: 18px;
        }

        .type-game-life-pip {
          width: 11px;
          height: 8px;
          background: var(--cyber-magenta, #FF2A6D);
          box-shadow: 0 0 8px var(--cyber-magenta-glow, rgba(255, 42, 109, 0.3));
        }

        .type-game-life-pip.is-lost {
          background: transparent;
          border: 1px solid var(--border-muted, rgba(119, 125, 135, 0.35));
          box-shadow: none;
        }

        .type-game-status-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          padding: 6px 10px;
          background: var(--bg, var(--bg-primary, #07080D));
          border: 1px solid var(--border-muted, rgba(119, 125, 135, 0.25));
          font-family: var(--font-mono, monospace);
          font-size: 0.68rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--cyber-cyan, #00F0FF);
          position: relative;
          z-index: 2;
        }

        .type-game-arena {
          position: relative;
          width: 100%;
          height: clamp(310px, 50vw, 410px);
          background-color: var(--bg, var(--bg-primary, #07080D));
          background-image:
            linear-gradient(to right, var(--cyber-cyan-subtle, rgba(0, 240, 255, 0.06)) 1px, transparent 1px),
            linear-gradient(to bottom, var(--cyber-cyan-subtle, rgba(0, 240, 255, 0.06)) 1px, transparent 1px);
          background-size: 28px 28px;
          border: 1px solid var(--border, rgba(0, 240, 255, 0.22));
          overflow: hidden;
          z-index: 2;
        }

        .type-game-arena.is-error-border {
          border-color: var(--cyber-magenta, #FF2A6D);
        }

        .type-game-arena.is-hit-border {
          box-shadow: inset 0 0 28px var(--cyber-magenta-glow, rgba(255, 42, 109, 0.35));
        }

        .type-game-firewall-line {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 8%;
          height: 1px;
          background: repeating-linear-gradient(
            90deg,
            var(--cyber-magenta, #FF2A6D) 0 8px,
            transparent 8px 16px
          );
          opacity: 0.65;
          pointer-events: none;
        }

        .type-game-word-chip {
          position: absolute;
          top: 0;
          padding: 4px 9px;
          background: var(--bg-surface, #0D1018);
          border: 1px solid var(--border, rgba(0, 240, 255, 0.28));
          font-family: var(--font-mono, monospace);
          font-size: clamp(0.76rem, 2.2vw, 0.9rem);
          font-weight: 700;
          letter-spacing: 0.04em;
          white-space: nowrap;
          user-select: none;
          pointer-events: none;
          will-change: transform;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.35);
        }

        .type-game-word-chip.is-targeted {
          border-color: var(--accent, #D5FF3F);
          box-shadow: 0 0 12px var(--accent-glow, rgba(213, 255, 63, 0.28));
          z-index: 3;
        }

        .type-game-word-chip[data-danger="true"] {
          border-color: var(--cyber-magenta, #FF2A6D);
        }

        .type-game-char-typed {
          color: var(--accent, #D5FF3F);
        }

        .type-game-char-rest {
          color: var(--text, #F4F2E9);
        }

        .type-game-burst {
          position: absolute;
          transform: translate(-50%, -50%);
          font-family: var(--font-mono, monospace);
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--accent, #D5FF3F);
          pointer-events: none;
          z-index: 4;
          white-space: nowrap;
        }

        @media (prefers-reduced-motion: no-preference) {
          .type-game-burst {
            animation: typeGameBurstUp 0.45s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          }
        }

        @keyframes typeGameBurstUp {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(0.92);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -135%) scale(1.12);
          }
        }

        .type-game-overlay {
          position: absolute;
          inset: 0;
          z-index: 6;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          background: rgba(7, 8, 13, 0.86);
          backdrop-filter: blur(6px);
        }

        html.light-mode .type-game-overlay {
          background: rgba(235, 234, 226, 0.9);
        }

        .type-game-modal {
          width: 100%;
          max-width: 340px;
          background: var(--bg-surface, #0D1018);
          border: 1px solid var(--cyber-cyan, #00F0FF);
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          text-align: center;
        }

        .type-game-modal-title {
          font-family: var(--font-cyber, var(--font-display, 'Orbitron', sans-serif));
          font-size: 1.05rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--text, #F4F2E9);
          margin: 0;
        }

        .type-game-modal-copy {
          font-size: 0.8rem;
          line-height: 1.5;
          color: var(--text-secondary, #C5CBD8);
          margin: 0;
        }

        .type-game-stats-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 8px;
          padding: 10px 0;
          border-top: 1px solid var(--border, rgba(0, 240, 255, 0.18));
          border-bottom: 1px solid var(--border, rgba(0, 240, 255, 0.18));
        }

        .type-game-stat-k {
          display: block;
          font-family: var(--font-mono, monospace);
          font-size: 0.6rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--text-muted, #8F96A3);
        }

        .type-game-stat-v {
          display: block;
          margin-top: 2px;
          font-family: var(--font-cyber, var(--font-display, 'Orbitron', sans-serif));
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--accent, #D5FF3F);
          font-variant-numeric: tabular-nums;
        }

        .type-game-modal-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: center;
          margin-top: 4px;
        }

        .type-game-btn-primary {
          min-height: 40px;
          padding: 9px 18px;
          font-family: var(--font-cyber, var(--font-display, 'Orbitron', sans-serif));
          font-size: 0.76rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          background: var(--accent, #D5FF3F);
          color: #07080D;
          border: 1px solid var(--accent, #D5FF3F);
          cursor: pointer;
        }

        html.light-mode .type-game-btn-primary {
          color: #FFFFFF;
        }

        .type-game-btn-primary:hover {
          filter: drop-shadow(0 0 10px var(--accent-glow, rgba(213, 255, 63, 0.3)));
        }

        .type-game-btn-ghost {
          min-height: 40px;
          padding: 9px 14px;
          font-family: var(--font-mono, monospace);
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          background: transparent;
          color: var(--text-secondary, #C5CBD8);
          border: 1px solid var(--border, rgba(0, 240, 255, 0.22));
          cursor: pointer;
        }

        .type-game-btn-ghost:hover {
          border-color: var(--cyber-cyan, #00F0FF);
          color: var(--text, #F4F2E9);
        }

        .type-game-input-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: var(--bg-surface, #0D1018);
          border: 1px solid var(--border, rgba(0, 240, 255, 0.22));
          position: relative;
          z-index: 2;
        }

        .type-game-input-bar:focus-within {
          border-color: var(--accent, #D5FF3F);
        }

        .type-game-prompt {
          font-family: var(--font-mono, monospace);
          font-size: 0.76rem;
          font-weight: 700;
          color: var(--accent, #D5FF3F);
          flex-shrink: 0;
        }

        .type-game-input {
          width: 100%;
          min-width: 0;
          background: transparent;
          border: none;
          color: var(--text, #F4F2E9);
          font-family: var(--font-mono, monospace);
          font-size: 0.85rem;
          caret-color: var(--accent, #D5FF3F);
          outline: none;
        }

        .type-game-input::placeholder {
          color: var(--text-muted, #8F96A3);
          opacity: 0.85;
        }

        .type-game-btn-sm:focus-visible,
        .type-game-btn-primary:focus-visible,
        .type-game-btn-ghost:focus-visible,
        .type-game-input-bar:has(.type-game-input:focus-visible) {
          outline: 2px solid var(--accent, #D5FF3F);
          outline-offset: 2px;
        }

        .type-game-footer {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          font-family: var(--font-mono, monospace);
          font-size: 0.65rem;
          letter-spacing: 0.08em;
          color: var(--text-muted, #8F96A3);
          position: relative;
          z-index: 2;
        }

        .type-game-sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        @media (max-width: 480px) {
          .type-game-shell {
            padding: 12px;
            gap: 10px;
          }
        }
      `}</style>

      {/* Corner HUD target reticles matching portfolio cards */}
      <span className="card-reticle tl" aria-hidden="true" />
      <span className="card-reticle br" aria-hidden="true" />

      {/* Terminal Header */}
      <header className="type-game-header">
        <div>
          <div className="type-game-kicker section-tag">SYS // TYPE_DEFENSE</div>
          <h2 id={headingId} className="type-game-title section-heading-huge">
            PACKET INTERCEPTOR
          </h2>
        </div>

        <div className="type-game-controls-top">
          {phase === 'playing' && (
            <button
              type="button"
              onClick={() => pauseGame('LINK PAUSED // ESC TO RESUME')}
              className="type-game-btn-sm"
            >
              Pause [Esc]
            </button>
          )}
          {phase !== 'title' && (
            <button
              type="button"
              onClick={() => startLevel(1, { resetRun: true })}
              className="type-game-btn-sm"
            >
              Reset
            </button>
          )}
        </div>
      </header>

      {/* 5-Cell Telemetry HUD */}
      <div className="type-game-hud" aria-label="Session telemetry">
        <div className="type-game-hud-cell">
          <span className="type-game-hud-label">Level</span>
          <span className="type-game-hud-val">
            {String(hud.level).padStart(2, '0')} · {hud.levelCleared}/{WORDS_PER_LEVEL}
          </span>
        </div>
        <div className="type-game-hud-cell">
          <span className="type-game-hud-label">Score</span>
          <span className="type-game-hud-val">{hud.score}</span>
        </div>
        <div className="type-game-hud-cell">
          <span className="type-game-hud-label">Integrity</span>
          <div
            className="type-game-lives-row"
            aria-label={`${hud.lives} of ${MAX_LIVES} lives remaining`}
          >
            {Array.from({ length: MAX_LIVES }, (_, idx) => (
              <span
                key={idx}
                className={`type-game-life-pip ${idx >= hud.lives ? 'is-lost' : ''}`}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>
        <div className="type-game-hud-cell">
          <span className="type-game-hud-label">Combo</span>
          <span className="type-game-hud-val">
            {hud.combo} ({hud.multiplier}x)
          </span>
        </div>
        <div className="type-game-hud-cell">
          <span className="type-game-hud-label">WPM</span>
          <span className="type-game-hud-val">{hud.wpm}</span>
        </div>
      </div>

      {/* System Log Ticker */}
      <div className="type-game-status-bar">
        <span>{hud.statusLog}</span>
        <span>BEST: {bestRecord.bestScore}</span>
      </div>

      {/* Playfield Arena */}
      <div
        ref={arenaRef}
        role="group"
        aria-label="Falling code keywords playfield. Tap or type keywords directly to intercept them."
        onClick={focusTerminalInput}
        className={`type-game-arena ${feedback.errorFlash ? 'is-error-border' : ''} ${
          feedback.hitShake ? 'is-hit-border' : ''
        }`}
      >
        <div className="type-game-firewall-line" aria-hidden="true" />

        {/* Falling Word Nodes */}
        {wordsView.map((word) => {
          const isTargeted = word.id === activeWordIdView
          const typedPart = word.text.slice(0, word.typedCount)
          const restPart = word.text.slice(word.typedCount)

          return (
            <div
              key={word.id}
              ref={(el) => {
                if (el) {
                  wordNodeRefs.current.set(word.id, el)
                  const simWord = simRef.current.words.find((w) => w.id === word.id)
                  const yPx = simWord ? Math.round(simWord.yRatio * arenaHeightRef.current) : 0
                  el.style.transform = `translate3d(-${word.xPct}%, ${yPx}px, 0)`
                } else {
                  wordNodeRefs.current.delete(word.id)
                }
              }}
              data-danger={word.danger ? 'true' : 'false'}
              style={{ left: `${word.xPct}%` }}
              className={`type-game-word-chip ${isTargeted ? 'is-targeted' : ''}`}
            >
              {word.typedCount > 0 && (
                <span className="type-game-char-typed">{typedPart}</span>
              )}
              <span className="type-game-char-rest">{restPart}</span>
            </div>
          )
        })}

        {/* Cleared Word Particle / Float Feedback */}
        {bursts.map((b) => (
          <div
            key={b.id}
            aria-hidden="true"
            style={{ left: `${b.xPct}%`, top: `${b.yPct}%` }}
            className="type-game-burst"
          >
            [OK // {b.wordText}]
          </div>
        ))}

        {/* Title Overlay */}
        {phase === 'title' && (
          <div className="type-game-overlay">
            <div className="type-game-modal">
              <div className="tx-header">[TX_01 // SYSTEM ONLINE]</div>
              <h3 className="type-game-modal-title">Packet Interceptor</h3>
              <p className="type-game-modal-copy">
                Type falling code keywords before they breach the firewall line. Clear 15 per sector.
              </p>

              <div className="type-game-stats-grid">
                <div>
                  <span className="type-game-stat-k">Best Score</span>
                  <span className="type-game-stat-v">{bestRecord.bestScore}</span>
                </div>
                <div>
                  <span className="type-game-stat-k">Best Sector</span>
                  <span className="type-game-stat-v">
                    LVL {String(bestRecord.bestLevel).padStart(2, '0')}
                  </span>
                </div>
              </div>

              <div className="type-game-modal-actions">
                <button
                  ref={primaryOverlayBtnRef}
                  type="button"
                  onClick={() => startLevel(1, { resetRun: true })}
                  className="type-game-btn-primary"
                >
                  Start
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pause Overlay */}
        {phase === 'paused' && (
          <div className="type-game-overlay">
            <div className="type-game-modal">
              <div className="tx-header">[TX_HALT // LINK SUSPENDED]</div>
              <h3 className="type-game-modal-title">System Paused</h3>
              <p className="type-game-modal-copy">{hud.pauseReason}</p>
              <div className="type-game-modal-actions">
                <button
                  ref={primaryOverlayBtnRef}
                  type="button"
                  onClick={resumeGame}
                  className="type-game-btn-primary"
                >
                  Resume
                </button>
                <button
                  type="button"
                  onClick={() => startLevel(1, { resetRun: true })}
                  className="type-game-btn-ghost"
                >
                  Restart Run
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Level Complete Overlay */}
        {phase === 'levelComplete' && (
          <div className="type-game-overlay">
            <div className="type-game-modal">
              <div className="tx-header">[TX_CLR // SECTOR {String(summary.level).padStart(2, '0')} SECURED]</div>
              <h3 className="type-game-modal-title">Packet Quota Met</h3>

              <div className="type-game-stats-grid">
                <div>
                  <span className="type-game-stat-k">WPM</span>
                  <span className="type-game-stat-v">{summary.wpm}</span>
                </div>
                <div>
                  <span className="type-game-stat-k">Accuracy</span>
                  <span className="type-game-stat-v">{summary.accuracy}%</span>
                </div>
              </div>

              <div className="type-game-modal-actions">
                <button
                  ref={primaryOverlayBtnRef}
                  type="button"
                  onClick={() => startLevel(summary.nextLevel)}
                  className="type-game-btn-primary"
                >
                  Next Level
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Game Over Overlay */}
        {phase === 'gameOver' && (
          <div className="type-game-overlay">
            <div className="type-game-modal">
              <div className="tx-header">[ERR_00 // SIGNAL LOST]</div>
              <h3 className="type-game-modal-title">Firewall Breached</h3>

              <div className="type-game-stats-grid">
                <div>
                  <span className="type-game-stat-k">Level Reached</span>
                  <span className="type-game-stat-v">
                    LVL {String(summary.level).padStart(2, '0')}
                  </span>
                </div>
                <div>
                  <span className="type-game-stat-k">Final Score</span>
                  <span className="type-game-stat-v">{summary.score}</span>
                </div>
                <div>
                  <span className="type-game-stat-k">WPM</span>
                  <span className="type-game-stat-v">{summary.wpm}</span>
                </div>
                <div>
                  <span className="type-game-stat-k">Accuracy</span>
                  <span className="type-game-stat-v">{summary.accuracy}%</span>
                </div>
              </div>

              <div className="type-game-modal-actions">
                <button
                  ref={primaryOverlayBtnRef}
                  type="button"
                  onClick={() => startLevel(1, { resetRun: true })}
                  className="type-game-btn-primary"
                >
                  Play Again
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Unified Desktop + Touch Command Prompt Input */}
      <label htmlFor={inputId} className="type-game-input-bar">
        <span className="type-game-prompt" aria-hidden="true">
          &gt;_
        </span>
        <input
          id={inputId}
          ref={inputRef}
          type="text"
          defaultValue=""
          onChange={handleMobileInputChange}
          onCompositionStart={() => {
            isComposingRef.current = true
          }}
          onCompositionEnd={(e) => {
            isComposingRef.current = false
            handleMobileInputChange(e)
          }}
          disabled={phase !== 'playing'}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck={false}
          enterKeyHint="go"
          inputMode="text"
          placeholder={
            phase === 'playing'
              ? 'TYPE FALLING KEYWORDS // TAP HERE ON MOBILE'
              : 'PRESS START TO ENGAGE TERMINAL INPUT'
          }
          aria-label="Type falling programming keywords"
          className="type-game-input"
        />
      </label>

      {/* Footer Hint */}
      <div className="type-game-footer">
        <span>NO ENTER KEY REQUIRED · ESC PAUSE</span>
        <span>BEST: {bestRecord.bestScore} PTS · LVL {String(bestRecord.bestLevel).padStart(2, '0')}</span>
      </div>

      {/* Screen Reader Status Announcer */}
      <div id={statusId} className="type-game-sr-only" aria-live="polite">
        {announcement}
      </div>
    </div>
  )
}

export default TypeGame
