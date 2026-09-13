import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react'
import { ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react'

import fundamentalBackground from '../../assets/02_scene/04_fundamental/backgrounds/1.png'
import anatomyFront from '../../assets/02_scene/04_fundamental/anatomy_front.png'
import anatomyBack from '../../assets/02_scene/04_fundamental/anatomy_back.png'
import mascotArt from '../../assets/02_scene/04_fundamental/mascot.png'
import homeArt from '../../assets/01_reusable/buttons/home.png'
import conceptSelIcon from '../../assets/02_scene/04_fundamental/icons/01_sel.png'
import conceptJaringanIcon from '../../assets/02_scene/04_fundamental/icons/02_jaringan.png'
import conceptOrganIcon from '../../assets/02_scene/04_fundamental/icons/03_organ_jantung.png'
import conceptSistemOrganIcon from '../../assets/02_scene/04_fundamental/icons/04_sistem_organ.png'
import conceptAnatomiIcon from '../../assets/02_scene/04_fundamental/icons/05_anatomi_rangka_dada.png'
import conceptFisiologiIcon from '../../assets/02_scene/04_fundamental/icons/06_fisiologi_gear.png'
import { HelpButton } from '../../components/HelpButton'
import { ProgressDots } from '../../components/ProgressDots'
import { SceneHeader } from '../../components/SceneHeader'
import { useGuidedTour, type TourStep } from '../../hooks/useGuidedTour'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { useStageCoverScale } from '../../hooks/useStageCoverScale'
import {
  ACTIVITY_STATEMENTS,
  ACTIVITY_ZONES,
  CONCEPT_NOTES,
  CONCEPT_STEPS,
  DEFAULT_ORGAN_ID,
  FEEDBACK_INCORRECT,
  organsForMode,
  type ActivityGroup,
  type ActivityStatement,
  type AnatomyMode,
} from './fundamentalContent'
import './FundamentalScene.css'

const DESIGN_WIDTH = 1920
const DESIGN_HEIGHT = 1080
const SAFE_WIDTH = 1860
const SAFE_HEIGHT = 1046

const DRAG_THRESHOLD_PX = 6
const PLACED_START_OFFSET = 48
const PLACED_HEIGHT = 32
const PLACED_GAP = 8
const FEEDBACK_DISPLAY_MS = 4200

// Unplaced statement chips reflow into this fixed 2-column grid (in original
// statement order) so removing one to a drop zone closes the gap instead of
// leaving a hole in the pool.
const HOME_COLS = [265, 625] as const
const HOME_BASE_Y = 885
const HOME_ROW_GAP = 75

const TOUR_SEEN_KEY = 'anatoquest:fundamental-tour-seen'

type FundamentalPhase = 'entering' | 'idle' | 'exiting'

const STAGGER_STEP_MS = 50
const ENTER_DURATION_MS = 480
const EXIT_DURATION_MS = 420
const REDUCED_MOTION_MS = 140

const FIXED_STAGGER_KEYS = [
  'header',
  'home',
  'help',
  'concept',
  'anatomy',
  'mascot',
  'info',
  'back',
  'next',
  'activity-header',
] as const

function hasSeenTour(): boolean {
  try {
    return window.sessionStorage.getItem(TOUR_SEEN_KEY) === '1'
  } catch {
    return true
  }
}

function markTourSeen(): void {
  try {
    window.sessionStorage.setItem(TOUR_SEEN_KEY, '1')
  } catch {
    // Storage unavailable (private mode, disabled cookies, ...) — non-fatal.
  }
}

const TOUR_STEPS: TourStep[] = [
  {
    target: '[data-testid="fundamental-concept-panel"]',
    title: 'Peta Konsep',
    body: 'Ikuti urutan sel, jaringan, organ, hingga sistem organ untuk memahami tingkat organisasi tubuh.',
    side: 'right',
    align: 'start',
  },
  {
    target: '[data-testid="fundamental-anatomy"]',
    title: 'Model Tubuh',
    body: 'Tekan sebuah organ untuk melihat penjelasannya, lalu tekan tombol Putar untuk melihat tampilan belakang.',
    side: 'right',
    align: 'center',
  },
  {
    target: '[data-testid="fundamental-info-panel"]',
    title: 'Info Organ',
    body: 'Nama, lokasi, dan fungsi organ yang dipilih muncul di sini.',
    side: 'left',
    align: 'start',
  },
  {
    target: '[data-testid="fundamental-activity"]',
    title: 'Struktur atau Fungsi?',
    body: 'Seret atau pilih setiap pernyataan, lalu letakkan ke kotak Struktur atau Fungsi yang sesuai.',
    side: 'top',
    align: 'center',
  },
  {
    target: '[data-testid="fundamental-help-button"]',
    title: 'Bantuan',
    body: 'Tekan tombol ini kapan saja untuk melihat panduan ini lagi.',
    side: 'bottom',
    align: 'end',
  },
]

type DragPos = { id: string; x: number; y: number }

type DragInfo = {
  id: string
  pointerId: number
  offsetX: number
  offsetY: number
  startClientX: number
  startClientY: number
  moved: boolean
}

type Feedback = { kind: 'correct' | 'incorrect'; message: string; nonce: number }

function staggerStyleFor(index: number): CSSProperties {
  return { '--stagger': index } as CSSProperties
}

function IconBadge({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={`fundamental__icon-badge${className ? ` ${className}` : ''}`}>{children}</span>
}

function IconBook() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 5.5C4 4.67 4.67 4 5.5 4H12v16H5.5A1.5 1.5 0 0 1 4 18.5v-13Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M20 5.5c0-.83-.67-1.5-1.5-1.5H12v16h6.5a1.5 1.5 0 0 0 1.5-1.5v-13Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  )
}

function IconHeartPulse() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 20s-7.5-4.6-9.9-9.2C.6 7.6 2.3 4 5.8 4c2 0 3.4 1.1 4.2 2.4C10.8 5.1 12.2 4 14.2 4c3.5 0 5.2 3.6 3.7 6.8-.5.9-1 1.7-1.6 2.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M2 13h4l1.6-3 2.4 5 1.6-3H16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconPuzzle() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 4h3.2a1.4 1.4 0 0 1 1.36 1.76 1.4 1.4 0 0 0 1.36 1.76H17a2 2 0 0 1 2 2v2.08a1.4 1.4 0 0 0-1.76 1.36 1.4 1.4 0 0 0 1.76 1.36V16a2 2 0 0 1-2 2h-2.08a1.4 1.4 0 0 0-1.36-1.76A1.4 1.4 0 0 0 12.08 18H9a2 2 0 0 1-2-2v-2.08a1.4 1.4 0 0 0 1.76-1.36A1.4 1.4 0 0 0 7 11.08V9a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const CONCEPT_STEP_ICONS = [conceptSelIcon, conceptJaringanIcon, conceptOrganIcon, conceptSistemOrganIcon]
const CONCEPT_NOTE_ICONS: Record<string, string> = {
  anatomi: conceptAnatomiIcon,
  fisiologi: conceptFisiologiIcon,
}

function ConceptIcon({ src, className }: { src: string; className?: string }) {
  return (
    <span className={`fundamental__concept-icon${className ? ` ${className}` : ''}`}>
      <img src={src} alt="" aria-hidden="true" />
    </span>
  )
}

function IconTag() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M11.5 4H5.5A1.5 1.5 0 0 0 4 5.5v6L13.5 21l6-6L10 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="8" cy="8" r="1.2" fill="currentColor" />
    </svg>
  )
}

function IconPin() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 21s-6.5-5.6-6.5-10.8C5.5 6.2 8.4 3.5 12 3.5s6.5 2.7 6.5 6.7C18.5 15.4 12 21 12 21Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10.4" r="2.2" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
}

function IconGear() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="2.6" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 4v1.6M12 18.4V20M20 12h-1.6M5.6 12H4M17.3 6.7l-1.1 1.1M7.8 16.2l-1.1 1.1M17.3 17.3l-1.1-1.1M7.8 7.8 6.7 6.7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function IconRefresh() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 12a8 8 0 0 1 13.66-5.66M20 12a8 8 0 0 1-13.66 5.66M17 4v4h-4M7 20v-4h4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

type FundamentalSceneProps = {
  /** Top-left home icon: leaves the guided route entirely. */
  onBackToHome?: () => void
  /** Bottom-left "Kembali" pill: steps back to SC-04. */
  onBack?: () => void
  onComplete?: () => void
}

export function FundamentalScene({ onBackToHome, onBack, onComplete }: FundamentalSceneProps) {
  const stageScale = useStageCoverScale(DESIGN_WIDTH, DESIGN_HEIGHT, SAFE_WIDTH, SAFE_HEIGHT)
  const prefersReducedMotion = usePrefersReducedMotion()
  const stageRef = useRef<HTMLDivElement>(null)

  const [phase, setPhase] = useState<FundamentalPhase>('entering')
  const exitActionRef = useRef<(() => void) | null>(null)

  const [mode, setMode] = useState<AnatomyMode>('front')
  const [selectedOrganId, setSelectedOrganId] = useState<string>(DEFAULT_ORGAN_ID)

  const [placedIds, setPlacedIds] = useState<ReadonlySet<string>>(() => new Set())
  const [selectedChipId, setSelectedChipId] = useState<string | null>(null)
  const [dragPos, setDragPos] = useState<DragPos | null>(null)
  const [hoverZone, setHoverZone] = useState<ActivityGroup | null>(null)
  const [shakeId, setShakeId] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<Feedback | null>(null)

  const dragInfoRef = useRef<DragInfo | null>(null)
  const suppressClickRef = useRef(false)
  const feedbackNonceRef = useRef(0)
  const feedbackTimerRef = useRef<number | undefined>(undefined)

  const { start: startTour } = useGuidedTour(TOUR_STEPS)

  const frontOrgans = useMemo(() => organsForMode('front'), [])
  const backOrgans = useMemo(() => organsForMode('back'), [])
  const currentOrgans = mode === 'front' ? frontOrgans : backOrgans
  const selectedOrgan =
    currentOrgans.find((organ) => organ.id === selectedOrganId) ?? currentOrgans[0]

  const staggerKeys = useMemo(
    () => [
      ...FIXED_STAGGER_KEYS,
      ...frontOrgans.map((o) => `hotspot-front-${o.id}`),
      ...backOrgans.map((o) => `hotspot-back-${o.id}`),
      ...ACTIVITY_ZONES.map((z) => `zone-${z.id}`),
      ...ACTIVITY_STATEMENTS.map((s) => `chip-${s.id}`),
    ],
    [frontOrgans, backOrgans],
  )
  const staggerIndex = useMemo(
    () => Object.fromEntries(staggerKeys.map((key, index) => [key, index])),
    [staggerKeys],
  )
  const staggerCount = staggerKeys.length

  const staggerStyle = useCallback((key: string) => staggerStyleFor(staggerIndex[key] ?? 0), [staggerIndex])

  useEffect(() => {
    if (phase !== 'idle' || hasSeenTour()) return
    const timer = window.setTimeout(() => {
      startTour()
      markTourSeen()
    }, 200)
    return () => window.clearTimeout(timer)
  }, [phase, startTour])

  useEffect(() => () => window.clearTimeout(feedbackTimerRef.current), [])

  useEffect(() => {
    if (phase !== 'entering') return
    const duration = prefersReducedMotion
      ? REDUCED_MOTION_MS
      : staggerCount * STAGGER_STEP_MS + ENTER_DURATION_MS
    const timer = window.setTimeout(() => setPhase('idle'), duration)
    return () => window.clearTimeout(timer)
  }, [phase, prefersReducedMotion, staggerCount])

  useEffect(() => {
    if (phase !== 'exiting') return
    const duration = prefersReducedMotion
      ? REDUCED_MOTION_MS
      : staggerCount * STAGGER_STEP_MS + EXIT_DURATION_MS
    const timer = window.setTimeout(() => exitActionRef.current?.(), duration)
    return () => window.clearTimeout(timer)
  }, [phase, prefersReducedMotion, staggerCount])

  const requestExit = useCallback(
    (action?: () => void) => {
      if (phase === 'exiting') return
      exitActionRef.current = action ?? null
      setPhase('exiting')
    },
    [phase],
  )

  const completedActivity = placedIds.size === ACTIVITY_STATEMENTS.length

  const announceFeedback = useCallback((kind: Feedback['kind'], message: string) => {
    feedbackNonceRef.current += 1
    setFeedback({ kind, message, nonce: feedbackNonceRef.current })
    window.clearTimeout(feedbackTimerRef.current)
    feedbackTimerRef.current = window.setTimeout(() => setFeedback(null), FEEDBACK_DISPLAY_MS)
  }, [])

  const attemptPlacement = useCallback(
    (statementId: string, zoneId: ActivityGroup) => {
      const statement = ACTIVITY_STATEMENTS.find((item) => item.id === statementId)
      if (!statement || placedIds.has(statementId)) return

      if (statement.group === zoneId) {
        setPlacedIds((prev) => new Set(prev).add(statementId))
        setSelectedChipId(null)
        announceFeedback('correct', statement.explanation)
      } else {
        setShakeId(statementId)
        announceFeedback('incorrect', FEEDBACK_INCORRECT)
      }
    },
    [placedIds, announceFeedback],
  )

  const toStagePoint = useCallback(
    (clientX: number, clientY: number) => {
      const rect = stageRef.current?.getBoundingClientRect()
      if (!rect || stageScale === 0) return { x: 0, y: 0 }
      return { x: (clientX - rect.left) / stageScale, y: (clientY - rect.top) / stageScale }
    },
    [stageScale],
  )

  const zoneAt = useCallback((x: number, y: number) => {
    return ACTIVITY_ZONES.find(
      (zone) => x >= zone.x && x <= zone.x + zone.width && y >= zone.y && y <= zone.y + zone.height,
    )
  }, [])

  // Unplaced chips reflow to fill gaps left by statements already placed,
  // instead of leaving dead slots in the pool (see HOME_COLS/HOME_BASE_Y).
  const unplacedOrder = useMemo(
    () => ACTIVITY_STATEMENTS.filter((s) => !placedIds.has(s.id)).map((s) => s.id),
    [placedIds],
  )

  const getHomeRect = useCallback(
    (statement: ActivityStatement) => {
      const index = unplacedOrder.indexOf(statement.id)
      if (index < 0) return statement.home
      const col = index % HOME_COLS.length
      const row = Math.floor(index / HOME_COLS.length)
      return {
        x: HOME_COLS[col],
        y: HOME_BASE_Y + row * HOME_ROW_GAP,
        width: statement.home.width,
        height: statement.home.height,
      }
    },
    [unplacedOrder],
  )

  const handleChipPointerDown = useCallback(
    (statement: ActivityStatement, event: ReactPointerEvent<HTMLButtonElement>) => {
      if (placedIds.has(statement.id)) return
      event.currentTarget.setPointerCapture(event.pointerId)
      const stagePoint = toStagePoint(event.clientX, event.clientY)
      // Measure the chip's actual rendered position rather than its reflow
      // target: the home-pool grid reflows other chips when one is placed, so
      // a chip picked up mid-transition may not yet be at its target rect.
      const currentRect = event.currentTarget.getBoundingClientRect()
      const origin = toStagePoint(currentRect.left, currentRect.top)
      dragInfoRef.current = {
        id: statement.id,
        pointerId: event.pointerId,
        offsetX: stagePoint.x - origin.x,
        offsetY: stagePoint.y - origin.y,
        startClientX: event.clientX,
        startClientY: event.clientY,
        moved: false,
      }
      setDragPos({ id: statement.id, x: origin.x, y: origin.y })
    },
    [placedIds, toStagePoint],
  )

  const handleChipPointerMove = useCallback(
    (statement: ActivityStatement, event: ReactPointerEvent<HTMLButtonElement>) => {
      const info = dragInfoRef.current
      if (!info || info.id !== statement.id) return

      const dx = event.clientX - info.startClientX
      const dy = event.clientY - info.startClientY
      if (!info.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD_PX) return
      info.moved = true

      const stagePoint = toStagePoint(event.clientX, event.clientY)
      const x = stagePoint.x - info.offsetX
      const y = stagePoint.y - info.offsetY
      setDragPos({ id: statement.id, x, y })

      const centerX = x + statement.home.width / 2
      const centerY = y + statement.home.height / 2
      const hovered = zoneAt(centerX, centerY)
      setHoverZone(hovered ? hovered.id : null)
    },
    [toStagePoint, zoneAt],
  )

  const handleChipPointerUp = useCallback(
    (statement: ActivityStatement, event: ReactPointerEvent<HTMLButtonElement>) => {
      const info = dragInfoRef.current
      if (!info || info.id !== statement.id) return
      event.currentTarget.releasePointerCapture(event.pointerId)
      dragInfoRef.current = null

      if (info.moved) {
        suppressClickRef.current = true
        if (hoverZone) attemptPlacement(statement.id, hoverZone)
      }

      setDragPos(null)
      setHoverZone(null)
    },
    [hoverZone, attemptPlacement],
  )

  const handleChipClick = useCallback((statement: ActivityStatement) => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false
      return
    }
    setSelectedChipId((prev) => (prev === statement.id ? null : statement.id))
  }, [])

  const handleZoneClick = useCallback(
    (zoneId: ActivityGroup) => {
      if (!selectedChipId) return
      attemptPlacement(selectedChipId, zoneId)
    },
    [selectedChipId, attemptPlacement],
  )

  const placedCountByZone = useCallback(
    (zoneId: ActivityGroup) => ACTIVITY_STATEMENTS.filter((s) => s.group === zoneId && placedIds.has(s.id)).length,
    [placedIds],
  )

  const zoneTotal = useCallback(
    (zoneId: ActivityGroup) => ACTIVITY_STATEMENTS.filter((s) => s.group === zoneId).length,
    [],
  )

  const getPlacedRect = useCallback(
    (statement: ActivityStatement) => {
      const zone = ACTIVITY_ZONES.find((z) => z.id === statement.group)!
      const siblings = ACTIVITY_STATEMENTS.filter((s) => s.group === statement.group && placedIds.has(s.id))
      const index = siblings.findIndex((s) => s.id === statement.id)
      return {
        x: zone.x + 16,
        y: zone.y + PLACED_START_OFFSET + index * (PLACED_HEIGHT + PLACED_GAP),
        width: zone.width - 32,
        height: PLACED_HEIGHT,
      }
    },
    [placedIds],
  )

  const handlePickAnotherOrgan = useCallback(() => {
    const list = currentOrgans
    if (list.length < 2) return
    const idx = list.findIndex((organ) => organ.id === selectedOrganId)
    const next = list[(idx + 1) % list.length]
    setSelectedOrganId(next.id)
  }, [currentOrgans, selectedOrganId])

  const toggleMode = useCallback(() => {
    const nextMode: AnatomyMode = mode === 'front' ? 'back' : 'front'
    const nextOrgans = nextMode === 'front' ? frontOrgans : backOrgans
    setMode(nextMode)
    if (!nextOrgans.some((organ) => organ.id === selectedOrganId)) {
      setSelectedOrganId(nextOrgans[0]?.id ?? DEFAULT_ORGAN_ID)
    }
  }, [mode, frontOrgans, backOrgans, selectedOrganId])

  const rootStyle = { '--stage-scale': stageScale, '--stagger-count': staggerCount } as CSSProperties

  return (
    <div className="fundamental" data-phase={phase} data-testid="fundamental-scene" style={rootStyle}>
      <div ref={stageRef} className="fundamental__stage" data-testid="fundamental-stage">
        <img className="fundamental__background" src={fundamentalBackground} alt="" aria-hidden="true" />

        <button
          type="button"
          className="fundamental__icon-button fundamental__home-button fundamental__anim"
          data-testid="fundamental-home-button"
          style={staggerStyle('home')}
          aria-label="Kembali ke Beranda"
          onClick={() => requestExit(onBackToHome)}
        >
          <img src={homeArt} alt="" aria-hidden="true" />
        </button>

        <HelpButton
          className="fundamental__icon-button fundamental__help-button fundamental__anim"
          style={staggerStyle('help')}
          data-testid="fundamental-help-button"
          label="Bantuan materi fundamentals"
          onClick={startTour}
        />

        <SceneHeader
          className="fundamental__anim"
          style={staggerStyle('header')}
          data-testid="fundamental-header"
          title="SC-05 · Materi 1: Fundamentals"
          subtitle="Pengertian Anatomi dan Fisiologi Tubuh Manusia"
        />

        <img
          className="fundamental__mascot fundamental__anim"
          style={staggerStyle('mascot')}
          src={mascotArt}
          alt=""
          aria-hidden="true"
        />

        <section
          className="fundamental__panel fundamental__panel--concept fundamental__anim"
          data-testid="fundamental-concept-panel"
          style={staggerStyle('concept')}
          aria-label="Peta konsep"
        >
          <h2 className="fundamental__panel-title">
            <IconBadge><IconBook /></IconBadge>
            Peta Konsep
          </h2>
          <ol className="fundamental__concept-steps">
            {CONCEPT_STEPS.map((step, index) => (
              <li key={step.id} className="fundamental__concept-step">
                <span className="fundamental__concept-step-row">
                  <ConceptIcon src={CONCEPT_STEP_ICONS[index]} />
                  <span className="fundamental__concept-step-label">{step.label}</span>
                </span>
                {index < CONCEPT_STEPS.length - 1 && <ArrowDown className="fundamental__concept-arrow-icon" aria-hidden="true" />}
              </li>
            ))}
          </ol>
          <div className="fundamental__concept-notes">
            {CONCEPT_NOTES.map((note) => (
              <div key={note.id} className="fundamental__concept-note">
                <ConceptIcon src={CONCEPT_NOTE_ICONS[note.id]} className="fundamental__concept-icon--note" />
                <div>
                  <p className="fundamental__concept-note-title">{note.title.toUpperCase()}</p>
                  <p className="fundamental__concept-note-body">{note.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section
          className="fundamental__panel fundamental__panel--anatomy fundamental__anim"
          data-testid="fundamental-anatomy"
          style={staggerStyle('anatomy')}
          aria-label="Model anatomi tubuh manusia"
        >
          <div className="fundamental__flip-viewport">
            <div className="fundamental__flip" data-mode={mode} data-testid="fundamental-flip">
              <div
                className="fundamental__flip-face fundamental__flip-face--front"
                data-active={mode === 'front'}
                aria-hidden={mode !== 'front'}
              >
                <img src={anatomyFront} alt="Tampilan depan tubuh manusia" />
                {frontOrgans.map((organ) => (
                  <button
                    key={organ.id}
                    type="button"
                    tabIndex={mode === 'front' ? 0 : -1}
                    className={`fundamental__hotspot fundamental__anim${
                      selectedOrganId === organ.id && mode === 'front' ? ' fundamental__hotspot--selected' : ''
                    }`}
                    data-testid={`fundamental-hotspot-${organ.id}`}
                    style={{
                      left: `${organ.positions.front!.x * 100}%`,
                      top: `${organ.positions.front!.y * 100}%`,
                      ...staggerStyle(`hotspot-front-${organ.id}`),
                    }}
                    aria-label={organ.label}
                    aria-pressed={selectedOrganId === organ.id}
                    onClick={() => setSelectedOrganId(organ.id)}
                  />
                ))}
              </div>
              <div
                className="fundamental__flip-face fundamental__flip-face--back"
                data-active={mode === 'back'}
                aria-hidden={mode !== 'back'}
              >
                <img src={anatomyBack} alt="Tampilan belakang tubuh manusia" />
                {backOrgans.map((organ) => (
                  <button
                    key={organ.id}
                    type="button"
                    tabIndex={mode === 'back' ? 0 : -1}
                    className={`fundamental__hotspot fundamental__anim${
                      selectedOrganId === organ.id && mode === 'back' ? ' fundamental__hotspot--selected' : ''
                    }`}
                    data-testid={`fundamental-hotspot-${organ.id}`}
                    style={{
                      left: `${organ.positions.back!.x * 100}%`,
                      top: `${organ.positions.back!.y * 100}%`,
                      ...staggerStyle(`hotspot-back-${organ.id}`),
                    }}
                    aria-label={organ.label}
                    aria-pressed={selectedOrganId === organ.id}
                    onClick={() => setSelectedOrganId(organ.id)}
                  />
                ))}
              </div>
            </div>
          </div>
          <button
            type="button"
            className="fundamental__rotate"
            data-testid="fundamental-rotate-button"
            aria-label={mode === 'front' ? 'Putar ke tampilan belakang' : 'Putar ke tampilan depan'}
            onClick={toggleMode}
          >
            <ArrowLeft className="fundamental__rotate-arrow" size={18} aria-hidden="true" />
            Putar
            <ArrowRight className="fundamental__rotate-arrow" size={18} aria-hidden="true" />
          </button>
        </section>

        <section
          className="fundamental__panel fundamental__panel--info fundamental__anim"
          data-testid="fundamental-info-panel"
          style={staggerStyle('info')}
          aria-label="Info organ"
        >
          <h2 className="fundamental__panel-title">
            <IconBadge><IconHeartPulse /></IconBadge>
            Info Organ
          </h2>
          {selectedOrgan && (
            <>
              <div className="fundamental__organ-preview">
                <img src={selectedOrgan.image} alt="" aria-hidden="true" />
                <p className="fundamental__organ-name" data-testid="fundamental-organ-name">
                  {selectedOrgan.label}
                </p>
              </div>
              <dl className="fundamental__organ-facts">
                <div className="fundamental__organ-fact">
                  <dt><IconBadge className="fundamental__fact-icon"><IconTag /></IconBadge>Nama</dt>
                  <dd>{selectedOrgan.label}</dd>
                </div>
                <div className="fundamental__organ-fact">
                  <dt><IconBadge className="fundamental__fact-icon"><IconPin /></IconBadge>Lokasi</dt>
                  <dd>{selectedOrgan.location}</dd>
                </div>
                <div className="fundamental__organ-fact">
                  <dt><IconBadge className="fundamental__fact-icon"><IconGear /></IconBadge>Fungsi</dt>
                  <dd>{selectedOrgan.function}</dd>
                </div>
              </dl>
              <button
                type="button"
                className="fundamental__pick-another"
                data-testid="fundamental-pick-another"
                onClick={handlePickAnotherOrgan}
                disabled={currentOrgans.length < 2}
              >
                <IconRefresh /> Pilih organ lain
              </button>
            </>
          )}
        </section>

        <section
          className="fundamental__panel fundamental__panel--activity fundamental__anim"
          data-testid="fundamental-activity"
          style={staggerStyle('activity-header')}
          aria-label="Aktivitas struktur atau fungsi"
        >
          <div className="fundamental__activity-header">
            <h2 className="fundamental__panel-title">
              <IconBadge><IconPuzzle /></IconBadge>
              Aktivitas · Struktur atau Fungsi?
            </h2>
            <ProgressDots
              data-testid="fundamental-progress-dots"
              total={ACTIVITY_STATEMENTS.length}
              completed={placedIds.size}
              unitLabel="pernyataan"
            />
          </div>
          <p className="fundamental__activity-subtitle">Seret pernyataan ke kotak yang sesuai, atau pilih lalu ketuk kotak tujuan!</p>
          {feedback && (
            <p
              key={feedback.nonce}
              className={`fundamental__activity-feedback fundamental__activity-feedback--${feedback.kind}`}
              aria-live="polite"
              data-testid="fundamental-feedback"
            >
              {feedback.kind === 'correct' ? `Benar! ${feedback.message}` : feedback.message}
            </p>
          )}
        </section>

        {ACTIVITY_ZONES.map((zone) => (
            <div
              key={zone.id}
              className={`fundamental__zone fundamental__anim${hoverZone === zone.id ? ' fundamental__zone--hover' : ''}`}
              data-testid={`fundamental-zone-${zone.id}`}
              style={{
                left: zone.x,
                top: zone.y,
                width: zone.width,
                height: zone.height,
                ...staggerStyle(`zone-${zone.id}`),
              }}
            >
              <div className="fundamental__zone-header">
                <span className="fundamental__zone-label">{zone.label}</span>
                <span className="fundamental__zone-count">
                  {placedCountByZone(zone.id)}/{zoneTotal(zone.id)}
                </span>
              </div>
              <button
                type="button"
                className="fundamental__zone-hit"
                aria-label={`Letakkan di kotak ${zone.label}`}
                onClick={() => handleZoneClick(zone.id)}
              >
                {placedCountByZone(zone.id) === 0 && (
                  <span className="fundamental__zone-placeholder">
                    <span className="fundamental__zone-arrow" aria-hidden="true">↓</span>
                    Seret pernyataan di sini
                  </span>
                )}
              </button>
            </div>
          ))}

          {ACTIVITY_STATEMENTS.map((statement) => {
            const isPlaced = placedIds.has(statement.id)
            const isDragging = dragPos?.id === statement.id
            const placedRect = isPlaced ? getPlacedRect(statement) : null
            const rect = isDragging ? dragPos! : placedRect ?? getHomeRect(statement)
            const size = placedRect
              ? { width: placedRect.width, height: placedRect.height }
              : { width: statement.home.width, height: statement.home.height }
            const chipStagger = staggerStyle(`chip-${statement.id}`)

            if (isPlaced) {
              return (
                <div
                  key={statement.id}
                  className="fundamental__chip fundamental__chip--placed fundamental__anim"
                  data-testid={`fundamental-chip-${statement.id}`}
                  style={{ left: rect.x, top: rect.y, width: size.width, height: size.height, ...chipStagger }}
                >
                  {statement.text}
                </div>
              )
            }

            return (
              <button
                key={statement.id}
                type="button"
                className={`fundamental__chip fundamental__anim${isDragging ? ' fundamental__chip--dragging' : ''}${
                  selectedChipId === statement.id ? ' fundamental__chip--selected' : ''
                }${shakeId === statement.id ? ' fundamental__chip--shake' : ''}`}
                data-testid={`fundamental-chip-${statement.id}`}
                style={{ left: rect.x, top: rect.y, width: size.width, height: size.height, ...chipStagger }}
                aria-pressed={selectedChipId === statement.id}
                aria-label={`${statement.text}${selectedChipId === statement.id ? ', dipilih. Pilih kotak tujuan.' : ''}`}
                onPointerDown={(event) => handleChipPointerDown(statement, event)}
                onPointerMove={(event) => handleChipPointerMove(statement, event)}
                onPointerUp={(event) => handleChipPointerUp(statement, event)}
                onPointerCancel={(event) => handleChipPointerUp(statement, event)}
                onClick={() => handleChipClick(statement)}
                onAnimationEnd={() => setShakeId((current) => (current === statement.id ? null : current))}
              >
                {statement.text}
              </button>
            )
          })}

        <button
          type="button"
          className="fundamental__nav-button fundamental__nav-button--back fundamental__anim"
          data-testid="fundamental-back-button"
          style={staggerStyle('back')}
          onClick={() => requestExit(onBack)}
        >
          <ArrowLeft size={18} aria-hidden="true" /> Kembali
        </button>

        <button
          type="button"
          className="fundamental__nav-button fundamental__nav-button--next fundamental__anim"
          data-testid="fundamental-next-button"
          style={staggerStyle('next')}
          disabled={!completedActivity}
          onClick={() => requestExit(onComplete)}
        >
          Lanjutkan <ArrowRight size={18} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
