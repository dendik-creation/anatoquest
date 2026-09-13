import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  CircleCheck,
  CircleX,
  Droplets,
  HeartPulse,
  Link2,
  ListOrdered,
  Play,
  Wind,
  X,
  type LucideIcon,
} from 'lucide-react'

import sceneBackground from '../../assets/02_scene/05_sistem_pernapasan_kardiovaskular_lumfatik/backgrounds/1.png'
import homeArt from '../../assets/01_reusable/buttons/home.png'
import bgmOn from '../../assets/01_reusable/buttons/bgm_on.png'
import bgmOff from '../../assets/01_reusable/buttons/bgm_off.png'
import { HelpButton } from '../../components/HelpButton'
import { SceneHeader } from '../../components/SceneHeader'
import { useGuidedTour, type TourStep } from '../../hooks/useGuidedTour'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { useStageCoverScale } from '../../hooks/useStageCoverScale'
import {
  DEFAULT_SYSTEM_ID,
  LEARNING_PATH_STEPS,
  MATCH_FEEDBACK_INCORRECT,
  MATCH_POOL_ORDER,
  MATCH_SLOT_ORDER,
  ORGAN_SYSTEMS,
  RESPIRATORY_FEEDBACK_INCORRECT,
  RESPIRATORY_FUNCTION_TAGS,
  RESPIRATORY_FUNCTIONS,
  RESPIRATORY_IDLE_HINT,
  RESPIRATORY_POOL_ORDER,
  RESPIRATORY_SEQUENCE,
  type OrganSystemId,
  type RespiratoryStepId,
} from './sistemOrganContent'
import './SistemOrganScene.css'

const DESIGN_WIDTH = 1920
const DESIGN_HEIGHT = 1080
const SAFE_WIDTH = 1860
// Taller than the other scenes' 1046: the "Kembali"/"Lanjutkan" pills here
// sit lower (1030-1076) to clear the activity card above them (see the
// geometry note by SLOT_START_X below), so the safe box must reach that far.
const SAFE_HEIGHT = 1078

const DRAG_THRESHOLD_PX = 6
const FEEDBACK_DISPLAY_MS = 4200

const TOUR_SEEN_KEY = 'anatoquest:sistem-organ-tour-seen'

type ScenePhase = 'entering' | 'idle' | 'exiting'

const STAGGER_STEP_MS = 50
const ENTER_DURATION_MS = 480
const EXIT_DURATION_MS = 420
const REDUCED_MOTION_MS = 140

const FIXED_STAGGER_KEYS = [
  'header',
  'home',
  'help',
  'audio',
  'path',
  'explorer',
  'info',
  'activity',
  'back',
  'next',
] as const

// Sequence slots and the token pool tray reproject the Figma "Main" bottom
// panel (node 68:89 and children, file h11RPHZrZurTNsU3U0DWFZ) as absolute
// stage siblings, the same architecture FundamentalScene uses for its
// activity zones/chips — see ACTIVITY_ZONES/ACTIVITY_STATEMENTS there.
//
// The literal Figma x-coordinates (slots from 235, tray to 1679) run right
// under the "Kembali"/"Lanjutkan" pills (40-260 and 1660-1880) and collided
// with them. Both are inset further from the card's side edges here so
// nothing sits under the nav pills, and the card itself is shorter (165 vs
// Figma's 195) so the pills clear it vertically too — see
// `.sistem-organ__panel--activity` / `.sistem-organ__nav-button` in the
// stylesheet for the matching geometry.
const SLOT_Y = 944
const SLOT_W = 77
const SLOT_H = 77
const SLOT_PITCH = 108
const SLOT_START_X = 270
const SLOT_RECTS = RESPIRATORY_SEQUENCE.map((_, index) => ({
  x: SLOT_START_X + index * SLOT_PITCH,
  y: SLOT_Y,
  width: SLOT_W,
  height: SLOT_H,
}))

// Pool tray backdrop (see `.sistem-organ__pool-tray`); tokens below centre inside it.
const POOL_Y = 925
const POOL_W = 82
const POOL_H = 80
const POOL_PITCH = 100
const POOL_START_X = 999

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
    target: '[data-testid="sistem-organ-path"]',
    title: 'Alur Belajar',
    body: 'Ikuti tiga langkah ini, lalu pilih sistem organ yang ingin dijelajahi.',
    side: 'right',
    align: 'start',
  },
  {
    target: '[data-testid="sistem-organ-explorer"]',
    title: 'Sistem Organ',
    body: 'Pilih Pernapasan, Kardiovaskular, atau Limfatik untuk mengganti tampilan organ.',
    side: 'right',
    align: 'center',
  },
  {
    target: '[data-testid="sistem-organ-info"]',
    title: 'Organ Terpilih',
    body: 'Nama, lokasi, fungsi, dan proses fisiologi dari sistem yang aktif muncul di sini.',
    side: 'left',
    align: 'start',
  },
  {
    target: '[data-testid="sistem-organ-activity"]',
    title: 'Dua Aktivitas',
    body: 'Urutkan jalur napas, lalu pasangkan tiap organ dengan fungsinya — pindah aktivitas lewat dua tombol di kanan atas kartu ini.',
    side: 'top',
    align: 'center',
  },
  {
    target: '[data-testid="sistem-organ-help-button"]',
    title: 'Bantuan',
    body: 'Tekan tombol ini kapan saja untuk melihat panduan ini lagi.',
    side: 'bottom',
    align: 'end',
  },
]

type ActivityTab = 'sequence' | 'match'

type BoardOrgan = { id: RespiratoryStepId; label: string; image: string; correctIndex: number }

// Both activities reuse the same six respiratory organs/art and the same
// slot geometry; only which slot index counts as "correct" for a given organ
// differs. The sequencing board's correctIndex is the real hidung→alveolus
// airway order; the matching board's is this session's shuffled function-card
// order (`MATCH_SLOT_ORDER`), so the two activities don't share answers.
const SEQUENCE_BOARD: BoardOrgan[] = RESPIRATORY_SEQUENCE.map((organ) => ({
  id: organ.id,
  label: organ.label,
  image: organ.image,
  correctIndex: organ.correctIndex,
}))
const MATCH_BOARD: BoardOrgan[] = RESPIRATORY_SEQUENCE.map((organ) => ({
  id: organ.id,
  label: organ.label,
  image: organ.image,
  correctIndex: MATCH_SLOT_ORDER.indexOf(organ.id),
}))

type DragPos = { id: RespiratoryStepId; x: number; y: number }

type DragInfo = {
  id: RespiratoryStepId
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

const SYSTEM_ICONS: Record<OrganSystemId, LucideIcon> = {
  pernapasan: Wind,
  kardiovaskular: HeartPulse,
  limfatik: Droplets,
}

type SistemOrganSceneProps = {
  /** Top-left home icon: leaves the guided route entirely. */
  onBackToHome?: () => void
  /** Bottom-left "Kembali" pill: steps back to SC-05. */
  onBack?: () => void
  onComplete?: () => void
}

/**
 * SC-06: 1:1 with the Figma "Main" frame (node 58:3, file
 * h11RPHZrZurTNsU3U0DWFZ). The frame itself has no mascot node — it lives on
 * the canvas outside "Main" — and the Figma-authored default state only
 * shows Kardiovaskular/Limfatik as selector pills because Pernapasan is
 * already the active system; both are handled explicitly below (mascot
 * dropped to keep the render matching the frame, Pernapasan added back as a
 * real selectable/active pill per the task's "all three tabs must be
 * genuinely selectable" requirement). The physiology drawer is a
 * `PROPOSED` addition: the Figma comp has no "proses fisiologi" control at
 * all, but the content contract requires a process field, and the task
 * brief specifies it must open as a closable drawer inside this card rather
 * than growing the card.
 */
export function SistemOrganScene({ onBackToHome, onBack, onComplete }: SistemOrganSceneProps) {
  const stageScale = useStageCoverScale(DESIGN_WIDTH, DESIGN_HEIGHT, SAFE_WIDTH, SAFE_HEIGHT)
  const prefersReducedMotion = usePrefersReducedMotion()
  const stageRef = useRef<HTMLDivElement>(null)

  const [phase, setPhase] = useState<ScenePhase>('entering')
  const exitActionRef = useRef<(() => void) | null>(null)

  const [activeSystemId, setActiveSystemId] = useState<OrganSystemId>(DEFAULT_SYSTEM_ID)
  const [audioOn, setAudioOn] = useState(true)
  const [showProcess, setShowProcess] = useState(false)

  const [activityTab, setActivityTab] = useState<ActivityTab>('sequence')
  const [sequencePlaced, setSequencePlaced] = useState<ReadonlySet<RespiratoryStepId>>(() => new Set())
  const [matchedIds, setMatchedIds] = useState<ReadonlySet<RespiratoryStepId>>(() => new Set())
  const [selectedChipId, setSelectedChipId] = useState<RespiratoryStepId | null>(null)
  const [dragPos, setDragPos] = useState<DragPos | null>(null)
  const [hoverSlot, setHoverSlot] = useState<number | null>(null)
  const [shakeId, setShakeId] = useState<RespiratoryStepId | null>(null)
  const [feedback, setFeedback] = useState<Feedback | null>(null)

  const dragInfoRef = useRef<DragInfo | null>(null)
  const suppressClickRef = useRef(false)
  const feedbackNonceRef = useRef(0)
  const feedbackTimerRef = useRef<number | undefined>(undefined)

  const { start: startTour } = useGuidedTour(TOUR_STEPS)

  const activeSystem = useMemo(
    () => ORGAN_SYSTEMS.find((system) => system.id === activeSystemId) ?? ORGAN_SYSTEMS[0],
    [activeSystemId],
  )

  const activeBoard = activityTab === 'sequence' ? SEQUENCE_BOARD : MATCH_BOARD
  const activePlaced = activityTab === 'sequence' ? sequencePlaced : matchedIds
  const setActivePlaced = activityTab === 'sequence' ? setSequencePlaced : setMatchedIds
  const activePoolOrder = activityTab === 'sequence' ? RESPIRATORY_POOL_ORDER : MATCH_POOL_ORDER

  const staggerKeys = useMemo(
    () => [
      ...FIXED_STAGGER_KEYS,
      ...ORGAN_SYSTEMS.map((s) => `selector-${s.id}`),
      ...RESPIRATORY_SEQUENCE.map((o) => `slot-${o.correctIndex}`),
      ...RESPIRATORY_SEQUENCE.map((o) => `token-${o.id}`),
    ],
    [],
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

  const sequenceComplete = sequencePlaced.size === RESPIRATORY_SEQUENCE.length
  const matchComplete = matchedIds.size === RESPIRATORY_SEQUENCE.length
  const completedActivity = sequenceComplete && matchComplete

  const announceFeedback = useCallback((kind: Feedback['kind'], message: string) => {
    feedbackNonceRef.current += 1
    setFeedback({ kind, message, nonce: feedbackNonceRef.current })
    window.clearTimeout(feedbackTimerRef.current)
    feedbackTimerRef.current = window.setTimeout(() => setFeedback(null), FEEDBACK_DISPLAY_MS)
  }, [])

  const attemptPlacement = useCallback(
    (organId: RespiratoryStepId, slotIndex: number) => {
      const organ = activeBoard.find((item) => item.id === organId)
      if (!organ || activePlaced.has(organId)) return

      if (organ.correctIndex === slotIndex) {
        setActivePlaced((prev) => new Set(prev).add(organId))
        setSelectedChipId(null)
        const message =
          activityTab === 'sequence'
            ? RESPIRATORY_SEQUENCE.find((item) => item.id === organId)!.explanation
            : RESPIRATORY_FUNCTIONS[organId]
        announceFeedback('correct', message)
      } else {
        setShakeId(organId)
        announceFeedback('incorrect', activityTab === 'sequence' ? RESPIRATORY_FEEDBACK_INCORRECT : MATCH_FEEDBACK_INCORRECT)
      }
    },
    [activeBoard, activePlaced, setActivePlaced, activityTab, announceFeedback],
  )

  const switchActivityTab = useCallback((tab: ActivityTab) => {
    setActivityTab(tab)
    setSelectedChipId(null)
    setDragPos(null)
    setHoverSlot(null)
    setShakeId(null)
    setFeedback(null)
  }, [])

  const toStagePoint = useCallback(
    (clientX: number, clientY: number) => {
      const rect = stageRef.current?.getBoundingClientRect()
      if (!rect || stageScale === 0) return { x: 0, y: 0 }
      return { x: (clientX - rect.left) / stageScale, y: (clientY - rect.top) / stageScale }
    },
    [stageScale],
  )

  const slotAt = useCallback((x: number, y: number) => {
    const index = SLOT_RECTS.findIndex(
      (slot) => x >= slot.x && x <= slot.x + slot.width && y >= slot.y && y <= slot.y + slot.height,
    )
    return index >= 0 ? index : null
  }, [])

  // Unplaced tokens reflow to fill the gap left by a token already placed,
  // matching FundamentalScene's HOME_COLS reflow pattern (single row here).
  const unplacedOrder = useMemo(
    () => activePoolOrder.filter((id) => !activePlaced.has(id)),
    [activePoolOrder, activePlaced],
  )

  const getPoolRect = useCallback(
    (id: RespiratoryStepId) => {
      const index = unplacedOrder.indexOf(id)
      const safeIndex = index < 0 ? 0 : index
      return { x: POOL_START_X + safeIndex * POOL_PITCH, y: POOL_Y, width: POOL_W, height: POOL_H }
    },
    [unplacedOrder],
  )

  const handleTokenPointerDown = useCallback(
    (organ: BoardOrgan, event: ReactPointerEvent<HTMLButtonElement>) => {
      if (activePlaced.has(organ.id)) return
      event.currentTarget.setPointerCapture(event.pointerId)
      const stagePoint = toStagePoint(event.clientX, event.clientY)
      const currentRect = event.currentTarget.getBoundingClientRect()
      const origin = toStagePoint(currentRect.left, currentRect.top)
      dragInfoRef.current = {
        id: organ.id,
        pointerId: event.pointerId,
        offsetX: stagePoint.x - origin.x,
        offsetY: stagePoint.y - origin.y,
        startClientX: event.clientX,
        startClientY: event.clientY,
        moved: false,
      }
      setDragPos({ id: organ.id, x: origin.x, y: origin.y })
    },
    [activePlaced, toStagePoint],
  )

  const handleTokenPointerMove = useCallback(
    (organ: BoardOrgan, event: ReactPointerEvent<HTMLButtonElement>) => {
      const info = dragInfoRef.current
      if (!info || info.id !== organ.id) return

      const dx = event.clientX - info.startClientX
      const dy = event.clientY - info.startClientY
      if (!info.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD_PX) return
      info.moved = true

      const stagePoint = toStagePoint(event.clientX, event.clientY)
      const x = stagePoint.x - info.offsetX
      const y = stagePoint.y - info.offsetY
      setDragPos({ id: organ.id, x, y })

      const centerX = x + POOL_W / 2
      const centerY = y + POOL_H / 2
      setHoverSlot(slotAt(centerX, centerY))
    },
    [toStagePoint, slotAt],
  )

  const handleTokenPointerUp = useCallback(
    (organ: BoardOrgan, event: ReactPointerEvent<HTMLButtonElement>) => {
      const info = dragInfoRef.current
      if (!info || info.id !== organ.id) return
      event.currentTarget.releasePointerCapture(event.pointerId)
      dragInfoRef.current = null

      if (info.moved) {
        suppressClickRef.current = true
        if (hoverSlot !== null) attemptPlacement(organ.id, hoverSlot)
      }

      setDragPos(null)
      setHoverSlot(null)
    },
    [hoverSlot, attemptPlacement],
  )

  const handleTokenClick = useCallback((organ: BoardOrgan) => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false
      return
    }
    setSelectedChipId((prev) => (prev === organ.id ? null : organ.id))
  }, [])

  const handleSlotClick = useCallback(
    (slotIndex: number) => {
      if (!selectedChipId) return
      attemptPlacement(selectedChipId, slotIndex)
    },
    [selectedChipId, attemptPlacement],
  )

  const selectSystem = useCallback((id: OrganSystemId) => {
    setActiveSystemId(id)
    setShowProcess(false)
  }, [])

  const rootStyle = { '--stage-scale': stageScale, '--stagger-count': staggerCount } as CSSProperties

  return (
    <div className="sistem-organ" data-phase={phase} data-testid="sistem-organ-scene" style={rootStyle}>
      <div ref={stageRef} className="sistem-organ__stage" data-testid="sistem-organ-stage">
        <img className="sistem-organ__background" src={sceneBackground} alt="" aria-hidden="true" />

        <button
          type="button"
          className="sistem-organ__icon-button sistem-organ__home-button sistem-organ__anim"
          data-testid="sistem-organ-home-button"
          style={staggerStyle('home')}
          aria-label="Kembali ke Beranda"
          onClick={() => requestExit(onBackToHome)}
        >
          <img src={homeArt} alt="" aria-hidden="true" />
        </button>

        <HelpButton
          className="sistem-organ__icon-button sistem-organ__help-button sistem-organ__anim"
          style={staggerStyle('help')}
          data-testid="sistem-organ-help-button"
          label="Bantuan materi sistem pernapasan, kardiovaskular, dan limfatik"
          onClick={startTour}
        />

        <button
          type="button"
          className="sistem-organ__icon-button sistem-organ__audio-button sistem-organ__anim"
          data-testid="sistem-organ-audio-button"
          style={staggerStyle('audio')}
          aria-pressed={audioOn}
          aria-label={audioOn ? 'Matikan musik latar' : 'Aktifkan musik latar'}
          onClick={() => setAudioOn((current) => !current)}
        >
          <img src={audioOn ? bgmOn : bgmOff} alt="" aria-hidden="true" />
        </button>

        <SceneHeader
          className="sistem-organ__anim"
          style={staggerStyle('header')}
          data-testid="sistem-organ-header"
          title="Sistem Pernapasan, Kardiovaskular, dan Limfatik"
          subtitle="Jelajahi hubungan oksigen, aliran darah, dan pertahanan tubuh"
        />

        {/* --- Left: Alur Belajar + system selector ------------------------ */}
        <section
          className="sistem-organ__panel sistem-organ__panel--path sistem-organ__anim"
          data-testid="sistem-organ-path"
          style={staggerStyle('path')}
          aria-label="Alur belajar dan pilihan sistem organ"
        >
          <h2 className="sistem-organ__panel-title">Alur Belajar</h2>
          <p className="sistem-organ__path-intro">Ikuti langkah-langkah dibawah ini:</p>
          <ol className="sistem-organ__path-steps">
            {LEARNING_PATH_STEPS.map((step, index) => (
              <li key={step.id} className="sistem-organ__path-step">
                <span className="sistem-organ__path-number" aria-hidden="true">{index + 1}</span>
                <span className="sistem-organ__path-text">
                  <span className="sistem-organ__path-step-title">{step.title}</span>
                  <span className="sistem-organ__path-step-body">{step.body}</span>
                </span>
              </li>
            ))}
          </ol>

          <hr className="sistem-organ__divider" />
          <p className="sistem-organ__selector-label" id="sistem-organ-selector-label">
            Pilih sistem untuk dijelajahi
          </p>
          <div className="sistem-organ__selector-list" role="group" aria-labelledby="sistem-organ-selector-label">
            {ORGAN_SYSTEMS.map((system) => {
              const isActive = system.id === activeSystemId
              const SystemIcon = SYSTEM_ICONS[system.id]
              return (
                <button
                  key={system.id}
                  type="button"
                  className="sistem-organ__selector-button sistem-organ__anim"
                  data-testid={`sistem-organ-selector-${system.id}`}
                  data-active={isActive}
                  aria-pressed={isActive}
                  style={{
                    '--select-color': system.color,
                    '--select-soft': system.colorSoft,
                    ...staggerStyle(`selector-${system.id}`),
                  } as CSSProperties}
                  onClick={() => selectSystem(system.id)}
                >
                  <span className="sistem-organ__selector-icon"><SystemIcon /></span>
                  <span className="sistem-organ__selector-label-text">{system.label}</span>
                  {isActive ? (
                    <span className="sistem-organ__selector-active-tag">
                      <Check size={14} aria-hidden="true" /> Aktif
                    </span>
                  ) : (
                    <ChevronRight className="sistem-organ__selector-chevron" aria-hidden="true" />
                  )}
                </button>
              )
            })}
          </div>
        </section>

        {/* --- Center: Anatomy explorer ------------------------------------ */}
        <section
          className="sistem-organ__panel sistem-organ__panel--explorer sistem-organ__anim"
          data-testid="sistem-organ-explorer"
          style={staggerStyle('explorer')}
          aria-label="Jelajahi sistem organ"
        >
          <h2 className="sistem-organ__panel-title">Sistem Organ</h2>
          <div
            className="sistem-organ__body-area"
            data-testid="sistem-organ-body-area"
            data-system={activeSystemId}
          >
            <div className="sistem-organ__physio-glow" style={{ '--physio-color': activeSystem.color } as CSSProperties} aria-hidden="true" />
            <button
              type="button"
              className="sistem-organ__body-hotspot"
              data-testid="sistem-organ-body-hotspot"
              style={{ '--organ-glow': activeSystem.color } as CSSProperties}
              aria-label={`Info singkat: ${activeSystem.organ.name}`}
              aria-describedby="sistem-organ-body-tooltip"
            >
              <img
                key={activeSystemId}
                className="sistem-organ__body-image"
                src={activeSystem.explorerImage}
                alt={`Ilustrasi sistem ${activeSystem.label.toLowerCase()} pada tubuh manusia`}
              />
            </button>
            <p className="sistem-organ__body-tooltip" id="sistem-organ-body-tooltip" role="note">
              <strong>{activeSystem.organ.name}</strong> — {activeSystem.organ.function}
            </p>
          </div>
        </section>

        {/* --- Right: Organ terpilih ---------------------------------------- */}
        <section
          className="sistem-organ__panel sistem-organ__panel--info sistem-organ__anim"
          data-testid="sistem-organ-info"
          style={staggerStyle('info')}
          aria-label="Organ terpilih"
        >
          <h2 className="sistem-organ__panel-title">Organ Terpilih</h2>

          <div className="sistem-organ__info-heading">
            <img className="sistem-organ__info-badge-icon" src={activeSystem.badgeIcon} alt="" aria-hidden="true" />
            <div>
              <p className="sistem-organ__info-name" data-testid="sistem-organ-name">{activeSystem.organ.name}</p>
              <span className="sistem-organ__info-badge" style={{ background: activeSystem.color }}>
                {activeSystem.organ.badge}
              </span>
            </div>
          </div>

          <p className="sistem-organ__info-description">{activeSystem.organ.description}</p>

          <div className="sistem-organ__info-fact">
            <p className="sistem-organ__info-fact-label">Lokasi:</p>
            <p className="sistem-organ__info-fact-body">{activeSystem.organ.location}</p>
          </div>
          <div className="sistem-organ__info-fact">
            <p className="sistem-organ__info-fact-label">Fungsi:</p>
            <p className="sistem-organ__info-fact-body">{activeSystem.organ.function}</p>
          </div>

          <button
            type="button"
            className="sistem-organ__process-button"
            data-testid="sistem-organ-process-button"
            aria-expanded={showProcess}
            onClick={() => setShowProcess(true)}
          >
            <Play size={18} aria-hidden="true" /> Lihat proses fisiologi
          </button>

          <div
            className={`sistem-organ__process-drawer${showProcess ? ' sistem-organ__process-drawer--open' : ''}`}
            data-testid="sistem-organ-process-drawer"
            role="region"
            aria-label={`Proses fisiologi ${activeSystem.organ.name}`}
            aria-hidden={!showProcess}
          >
            <div className="sistem-organ__process-drawer-header">
              <p className="sistem-organ__process-drawer-title">Proses Fisiologi</p>
              <button
                type="button"
                className="sistem-organ__process-drawer-close"
                aria-label="Tutup proses fisiologi"
                tabIndex={showProcess ? 0 : -1}
                onClick={() => setShowProcess(false)}
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            <p className="sistem-organ__process-drawer-body" data-testid="sistem-organ-process-text">
              {activeSystem.organ.process}
            </p>
          </div>
        </section>

        {/* --- Bottom: two-tab activity — Urutkan Alur / Pasangkan Fungsi ---- */}
        <section
          className="sistem-organ__panel sistem-organ__panel--activity sistem-organ__anim"
          data-testid="sistem-organ-activity"
          style={staggerStyle('activity')}
          aria-label="Aktivitas urutkan alur dan pasangkan fungsi organ pernapasan"
        >
          <div className="sistem-organ__activity-header">
            <h2 className="sistem-organ__panel-title">
              {activityTab === 'sequence' ? 'Urutkan Alur Pernapasan' : 'Pasangkan Fungsi Organ'}
            </h2>
            <div className="sistem-organ__activity-tabs" role="group" aria-label="Pilih aktivitas">
              <button
                type="button"
                className="sistem-organ__activity-tab"
                data-testid="sistem-organ-tab-sequence"
                data-active={activityTab === 'sequence'}
                aria-pressed={activityTab === 'sequence'}
                onClick={() => switchActivityTab('sequence')}
              >
                <ListOrdered size={16} aria-hidden="true" />
                Urutkan{sequenceComplete ? <Check size={14} aria-hidden="true" /> : null}
              </button>
              <button
                type="button"
                className="sistem-organ__activity-tab"
                data-testid="sistem-organ-tab-match"
                data-active={activityTab === 'match'}
                aria-pressed={activityTab === 'match'}
                onClick={() => switchActivityTab('match')}
              >
                <Link2 size={16} aria-hidden="true" />
                Pasangkan{matchComplete ? <Check size={14} aria-hidden="true" /> : null}
              </button>
            </div>
          </div>
          {feedback ? (
            <p
              key={feedback.nonce}
              className={`sistem-organ__activity-hint sistem-organ__activity-hint--${feedback.kind}`}
              aria-live="polite"
              data-testid="sistem-organ-feedback"
            >
              {feedback.kind === 'correct' ? <CircleCheck aria-hidden="true" /> : <CircleX aria-hidden="true" />}
              {feedback.kind === 'correct' ? `Benar! ${feedback.message}` : feedback.message}
            </p>
          ) : (
            <p className="sistem-organ__activity-hint" data-testid="sistem-organ-feedback-idle">
              {activityTab === 'sequence'
                ? RESPIRATORY_IDLE_HINT
                : 'Baca fungsi tiap kartu, lalu seret atau pilih organ yang sesuai ke kartu itu.'}
            </p>
          )}
        </section>

        <div className="sistem-organ__pool-tray sistem-organ__anim" style={staggerStyle('activity')} aria-hidden="true" />

        {SLOT_RECTS.map((slot, index) => {
          const matchOrganId = MATCH_SLOT_ORDER[index]
          const label =
            activityTab === 'sequence'
              ? `Letakkan di urutan ke-${index + 1}`
              : `Kartu fungsi: ${RESPIRATORY_FUNCTIONS[matchOrganId]}`
          return (
            <div
              key={index}
              className={`sistem-organ__slot sistem-organ__anim${hoverSlot === index ? ' sistem-organ__slot--hover' : ''}`}
              data-testid={`sistem-organ-slot-${index}`}
              style={{ left: slot.x, top: slot.y, width: slot.width, height: slot.height, ...staggerStyle(`slot-${index}`) }}
            >
              <button
                type="button"
                className="sistem-organ__slot-hit"
                aria-label={label}
                title={activityTab === 'match' ? RESPIRATORY_FUNCTIONS[matchOrganId] : undefined}
                onClick={() => handleSlotClick(index)}
              >
                {hoverSlot !== index &&
                  (activityTab === 'sequence' ? (
                    <span className="sistem-organ__slot-number">{index + 1}</span>
                  ) : (
                    <span className="sistem-organ__slot-tag">{RESPIRATORY_FUNCTION_TAGS[matchOrganId]}</span>
                  ))}
              </button>
              {activityTab === 'sequence' && index < SLOT_RECTS.length - 1 && (
                <ChevronRight className="sistem-organ__slot-chevron" aria-hidden="true" />
              )}
            </div>
          )
        })}

        {activeBoard.map((organ) => {
          const isPlaced = activePlaced.has(organ.id)
          const isDragging = dragPos?.id === organ.id
          const placedRect = isPlaced ? SLOT_RECTS[organ.correctIndex] : null
          const rect = isDragging ? dragPos! : placedRect ?? getPoolRect(organ.id)
          const tokenStagger = staggerStyle(`token-${organ.id}`)

          if (isPlaced) {
            return (
              <div
                key={organ.id}
                className="sistem-organ__token sistem-organ__token--placed sistem-organ__anim"
                data-testid={`sistem-organ-token-${organ.id}`}
                style={{ left: rect.x, top: rect.y, width: SLOT_W, height: SLOT_H, ...tokenStagger }}
              >
                <img src={organ.image} alt="" aria-hidden="true" />
              </div>
            )
          }

          return (
            <button
              key={organ.id}
              type="button"
              className={`sistem-organ__token sistem-organ__anim${isDragging ? ' sistem-organ__token--dragging' : ''}${
                selectedChipId === organ.id ? ' sistem-organ__token--selected' : ''
              }${shakeId === organ.id ? ' sistem-organ__token--shake' : ''}`}
              data-testid={`sistem-organ-token-${organ.id}`}
              style={{ left: rect.x, top: rect.y, width: POOL_W, height: POOL_H, ...tokenStagger }}
              aria-pressed={selectedChipId === organ.id}
              aria-label={`${organ.label}${selectedChipId === organ.id ? ', dipilih. Pilih kartu tujuan.' : ''}`}
              onPointerDown={(event) => handleTokenPointerDown(organ, event)}
              onPointerMove={(event) => handleTokenPointerMove(organ, event)}
              onPointerUp={(event) => handleTokenPointerUp(organ, event)}
              onPointerCancel={(event) => handleTokenPointerUp(organ, event)}
              onClick={() => handleTokenClick(organ)}
              onAnimationEnd={() => setShakeId((current) => (current === organ.id ? null : current))}
            >
              <img src={organ.image} alt="" aria-hidden="true" />
              <span className="sistem-organ__token-label">{organ.label}</span>
            </button>
          )
        })}

        <button
          type="button"
          className="sistem-organ__nav-button sistem-organ__nav-button--back sistem-organ__anim"
          data-testid="sistem-organ-back-button"
          style={staggerStyle('back')}
          onClick={() => requestExit(onBack)}
        >
          <ArrowLeft size={18} aria-hidden="true" /> Kembali
        </button>

        <button
          type="button"
          className="sistem-organ__nav-button sistem-organ__nav-button--next sistem-organ__anim"
          data-testid="sistem-organ-next-button"
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
