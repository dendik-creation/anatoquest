import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { useGlobalAudio } from '../../audio/GlobalAudio'
import { ArrowLeft, ArrowRight, HeartPulse, Sprout } from 'lucide-react'

import bodyAnatomyArt from '../../assets/02_scene/03_case_study/body_anatomy_full.png'
import caseStudyBackground from '../../assets/02_scene/03_case_study/backgrounds/1.png'
import doctorArt from '../../assets/02_scene/03_case_study/doctor_character.png'
import bgmOff from '../../assets/01_reusable/buttons/btn_bgm_off.png'
import bgmOn from '../../assets/01_reusable/buttons/btn_bgm_on.png'
import homeArt from '../../assets/01_reusable/buttons/btn_home.png'
import { ProgressDots } from '../../components/ProgressDots'
import { SceneHeader } from '../../components/SceneHeader'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { useStageCoverScale } from '../../hooks/useStageCoverScale'
import {
  CASE_STUDY_BODY_HEADING,
  CASE_STUDY_BRIEF_BODY,
  CASE_STUDY_BRIEF_LABEL,
  CASE_STUDY_BRIEF_TASK,
  CASE_STUDY_BRIEF_TASK_LEAD,
  CASE_STUDY_CHECK_BUTTON,
  CASE_STUDY_CONTINUE_BUTTON,
  CASE_STUDY_FEEDBACK_INCORRECT,
  CASE_STUDY_ORGANS,
  CASE_STUDY_PROGRESS_LABEL,
  CASE_STUDY_RESULT_BODY,
  CASE_STUDY_RESULT_TITLE,
  CASE_STUDY_START_MATERI_BUTTON,
  CASE_STUDY_SUBTITLE,
  CASE_STUDY_SYMPTOM_HEADING,
  CASE_STUDY_SYMPTOMS,
  CASE_STUDY_TITLE,
  type CaseStudySymptom,
  type OrganHotspotId,
} from './caseStudyContent'
import './CaseStudyScene.css'

const DESIGN_WIDTH = 1920
const DESIGN_HEIGHT = 1080
const SAFE_WIDTH = 1860
const SAFE_HEIGHT = 1046

/**
 * Design-space centre + hit radius for each organ drop target. Sized to the
 * shrunk body-anatomy overlay (see CaseStudyScene.css `.case-study__hotspot`)
 * so the lung and heart targets — anatomically close together — don't fully
 * swallow each other's centre point for a plain (non-drag) click.
 */
const HOTSPOT_HIT_RADIUS = 45
/** How far the pointer must travel before a card press counts as a drag. */
const DRAG_THRESHOLD_PX = 6

const PLACED_WIDTH = 64
const PLACED_HEIGHT = 50
const PLACED_BADGE_SPACING = 70

/** Non-interactive visible anchors on the supplied full-body anatomy artwork. */
const REFERENCE_ANATOMY_MARKERS = [
  { id: 'stomach', x: 801, y: 718 },
  { id: 'intestine', x: 767, y: 835 },
] as const

const FEEDBACK_DISPLAY_MS = 4200

/** Session-scoped only (Phase 04 note): not user profile/account persistence. */

/**
 * Enter/exit bubble+fade, matching SC-02 Home: every element but the
 * background pops in staggered on mount and reverses out before the scene
 * actually navigates away.
 */
type CaseStudyPhase = 'entering' | 'idle' | 'exiting'

const STAGGER_STEP_MS = 50
const ENTER_DURATION_MS = 480
const EXIT_DURATION_MS = 420
const REDUCED_MOTION_MS = 140

const STAGGER_KEYS = [
  'header',
  'brief',
  'home',
  'audio',
  'heading-body',
  'heading-symptom',
  'hotspot-lung',
  'hotspot-heart',
  'card-sesak_napas',
  'card-jantung_berdebar',
  'card-lelah',
  'card-pucat',
  'panel',
] as const

const STAGGER_INDEX: Record<string, number> = Object.fromEntries(
  STAGGER_KEYS.map((key, index) => [key, index]),
)
const STAGGER_COUNT = STAGGER_KEYS.length

/** `key` is loosely typed since card keys are built from content-driven ids. */
function staggerStyle(key: string): CSSProperties {
  return { '--stagger': STAGGER_INDEX[key] ?? 0 } as CSSProperties
}

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

/**
 * `placing`: dragging/placing symptoms, bottom-next reads "Periksa Analisis".
 * `checked`: all four placed correctly, bottom-next reads "Lanjut ke Pembahasan".
 * `result`: pembahasan card shown, bottom-next reads "Mulai Materi 1".
 */
type ReviewStage = 'placing' | 'checked' | 'result'

type CaseStudySceneProps = {
  onBackToHome?: () => void
  onBack?: () => void
  onComplete?: () => void
}

export function CaseStudyScene({ onBackToHome, onBack, onComplete }: CaseStudySceneProps) {
  const stageScale = useStageCoverScale(DESIGN_WIDTH, DESIGN_HEIGHT, SAFE_WIDTH, SAFE_HEIGHT)
  const prefersReducedMotion = usePrefersReducedMotion()
  const stageRef = useRef<HTMLDivElement>(null)

  const [phase, setPhase] = useState<CaseStudyPhase>('entering')
  const exitActionRef = useRef<(() => void) | null>(null)

  const { audioOn, toggleAudio } = useGlobalAudio()
  const [placedIds, setPlacedIds] = useState<ReadonlySet<string>>(() => new Set())
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [dragPos, setDragPos] = useState<DragPos | null>(null)
  const [hoverHotspot, setHoverHotspot] = useState<OrganHotspotId | null>(null)
  const [shakeId, setShakeId] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [reviewStage, setReviewStage] = useState<ReviewStage>('placing')

  const dragInfoRef = useRef<DragInfo | null>(null)
  const suppressClickRef = useRef(false)
  const feedbackNonceRef = useRef(0)
  const feedbackTimerRef = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(feedbackTimerRef.current), [])

  useEffect(() => {
    if (phase !== 'entering') return
    const duration = prefersReducedMotion
      ? REDUCED_MOTION_MS
      : STAGGER_COUNT * STAGGER_STEP_MS + ENTER_DURATION_MS
    const timer = window.setTimeout(() => setPhase('idle'), duration)
    return () => window.clearTimeout(timer)
  }, [phase, prefersReducedMotion])

  useEffect(() => {
    if (phase !== 'exiting') return
    const duration = prefersReducedMotion
      ? REDUCED_MOTION_MS
      : STAGGER_COUNT * STAGGER_STEP_MS + EXIT_DURATION_MS
    const timer = window.setTimeout(() => exitActionRef.current?.(), duration)
    return () => window.clearTimeout(timer)
  }, [phase, prefersReducedMotion])

  const requestExit = useCallback(
    (action?: () => void) => {
      if (phase === 'exiting') return
      exitActionRef.current = action ?? null
      setPhase('exiting')
    },
    [phase],
  )

  const completed = placedIds.size === CASE_STUDY_SYMPTOMS.length

  const announceFeedback = useCallback((kind: Feedback['kind'], message: string) => {
    feedbackNonceRef.current += 1
    setFeedback({ kind, message, nonce: feedbackNonceRef.current })
    window.clearTimeout(feedbackTimerRef.current)
    feedbackTimerRef.current = window.setTimeout(() => setFeedback(null), FEEDBACK_DISPLAY_MS)
  }, [])

  const attemptPlacement = useCallback(
    (symptomId: string, hotspotId: OrganHotspotId) => {
      const symptom = CASE_STUDY_SYMPTOMS.find((item) => item.id === symptomId)
      if (!symptom || placedIds.has(symptomId)) return

      if (symptom.correctHotspot === hotspotId) {
        setPlacedIds((prev) => new Set(prev).add(symptomId))
        setSelectedId(null)
        announceFeedback('correct', symptom.explanation)
      } else {
        setShakeId(symptomId)
        announceFeedback('incorrect', CASE_STUDY_FEEDBACK_INCORRECT)
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

  const handleCardPointerDown = useCallback(
    (symptom: CaseStudySymptom, event: ReactPointerEvent<HTMLButtonElement>) => {
      if (placedIds.has(symptom.id)) return
      event.currentTarget.setPointerCapture(event.pointerId)
      const stagePoint = toStagePoint(event.clientX, event.clientY)
      dragInfoRef.current = {
        id: symptom.id,
        pointerId: event.pointerId,
        offsetX: stagePoint.x - symptom.home.x,
        offsetY: stagePoint.y - symptom.home.y,
        startClientX: event.clientX,
        startClientY: event.clientY,
        moved: false,
      }
      setDragPos({ id: symptom.id, x: symptom.home.x, y: symptom.home.y })
    },
    [placedIds, toStagePoint],
  )

  const handleCardPointerMove = useCallback(
    (symptom: CaseStudySymptom, event: ReactPointerEvent<HTMLButtonElement>) => {
      const info = dragInfoRef.current
      if (!info || info.id !== symptom.id) return

      const dx = event.clientX - info.startClientX
      const dy = event.clientY - info.startClientY
      if (!info.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD_PX) return
      info.moved = true

      const stagePoint = toStagePoint(event.clientX, event.clientY)
      setDragPos({ id: symptom.id, x: stagePoint.x - info.offsetX, y: stagePoint.y - info.offsetY })

      // The deliberately generous drop areas overlap around the chest. Resolve
      // the overlap by the nearest organ so a card dropped at a marker centre
      // is never claimed by the first item in the content array.
      const hovered = CASE_STUDY_ORGANS.reduce<
        { id: OrganHotspotId; distance: number } | undefined
      >((nearest, organ) => {
        const distance = Math.hypot(stagePoint.x - organ.x, stagePoint.y - organ.y)
        if (distance > HOTSPOT_HIT_RADIUS || (nearest && nearest.distance <= distance)) {
          return nearest
        }
        return { id: organ.id, distance }
      }, undefined)
      setHoverHotspot(hovered?.id ?? null)
    },
    [toStagePoint],
  )

  const handleCardPointerUp = useCallback(
    (symptom: CaseStudySymptom, event: ReactPointerEvent<HTMLButtonElement>) => {
      const info = dragInfoRef.current
      if (!info || info.id !== symptom.id) return
      event.currentTarget.releasePointerCapture(event.pointerId)
      dragInfoRef.current = null

      if (info.moved) {
        suppressClickRef.current = true
        if (hoverHotspot) attemptPlacement(symptom.id, hoverHotspot)
      }

      setDragPos(null)
      setHoverHotspot(null)
    },
    [hoverHotspot, attemptPlacement],
  )

  const handleCardClick = useCallback((symptom: CaseStudySymptom) => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false
      return
    }
    setSelectedId((prev) => (prev === symptom.id ? null : symptom.id))
  }, [])

  const handleHotspotClick = useCallback(
    (hotspotId: OrganHotspotId) => {
      if (!selectedId) return
      attemptPlacement(selectedId, hotspotId)
    },
    [selectedId, attemptPlacement],
  )

  const placedOrder = useMemo(
    () => CASE_STUDY_SYMPTOMS.filter((symptom) => placedIds.has(symptom.id)),
    [placedIds],
  )

  const getPlacedBadgeRect = useCallback(
    (symptom: CaseStudySymptom) => {
      const siblings = CASE_STUDY_SYMPTOMS.filter(
        (item) => item.correctHotspot === symptom.correctHotspot && placedIds.has(item.id),
      )
      const index = siblings.findIndex((item) => item.id === symptom.id)
      const hotspot = CASE_STUDY_ORGANS.find((organ) => organ.id === symptom.correctHotspot)
      if (!hotspot || index === -1) return { x: symptom.home.x, y: symptom.home.y }

      const startX = hotspot.x - ((siblings.length - 1) * PLACED_BADGE_SPACING) / 2
      return {
        x: startX + index * PLACED_BADGE_SPACING - PLACED_WIDTH / 2,
        y: hotspot.y + hotspot.badgeOffsetY - PLACED_HEIGHT / 2,
      }
    },
    [placedIds],
  )

  // Sighted UI shows only the progress count (see the panel below); the
  // correctness + explanation this feedback carries is announced here for
  // screen-reader users, satisfying the project's immediate-feedback rule
  // without cluttering the simplified visual panel.
  const srAnnouncement = feedback
    ? feedback.kind === 'correct'
      ? `Benar! ${feedback.message}`
      : feedback.message
    : ''

  return (
    <div className="case-study" data-phase={phase} data-testid="case-study-scene">
      <div
        ref={stageRef}
        className="case-study__stage"
        data-testid="case-study-stage"
        style={{ '--stage-scale': stageScale } as CSSProperties}
      >
        <img
          className="case-study__background"
          src={caseStudyBackground}
          alt=""
          aria-hidden="true"
        />
        <img className="case-study__body-art" src={bodyAnatomyArt} alt="" aria-hidden="true" />
        <img className="case-study__doctor-art" src={doctorArt} alt="" aria-hidden="true" />
        <aside className="case-study__wall-message case-study__wall-message--left" aria-hidden="true">
          <p>JELAJAHI<br />PAHAMI<br />JAGA<br />KESEHATAN</p>
          <HeartPulse />
        </aside>
        <aside className="case-study__wall-message case-study__wall-message--right" aria-hidden="true">
          <p>TUBUH SEHAT<br />MASA DEPAN<br />LEBIH BAIK</p>
          <Sprout />
        </aside>

        <button
          type="button"
          className="case-study__icon-button case-study__home-button case-study__anim"
          data-testid="case-study-home-button"
          style={staggerStyle('home')}
          aria-label="Kembali ke Beranda"
          onClick={() => requestExit(onBackToHome)}
        >
          <img src={homeArt} alt="" aria-hidden="true" />
        </button>

        <button
          type="button"
          className="case-study__icon-button case-study__audio-button case-study__anim"
          data-testid="case-study-audio-button"
          style={staggerStyle('audio')}
          aria-pressed={audioOn}
          aria-label={audioOn ? 'Matikan musik latar' : 'Aktifkan musik latar'}
          onClick={() => toggleAudio()}
        >
          <img src={audioOn ? bgmOn : bgmOff} alt="" aria-hidden="true" />
        </button>

        <SceneHeader
          className="case-study__anim"
          style={staggerStyle('header')}
          data-testid="case-study-header"
          title={CASE_STUDY_TITLE}
          subtitle={CASE_STUDY_SUBTITLE}
        />

        <div
          className="case-study__brief case-study__anim"
          data-testid="case-study-brief"
          style={staggerStyle('brief')}
        >
          <p className="case-study__brief-label">{CASE_STUDY_BRIEF_LABEL}</p>
          <p className="case-study__brief-body">{CASE_STUDY_BRIEF_BODY}</p>
          <p className="case-study__brief-task">
            <span className="case-study__brief-task-lead">{CASE_STUDY_BRIEF_TASK_LEAD}</span>{' '}
            {CASE_STUDY_BRIEF_TASK}
          </p>
        </div>

        <h2
          className="case-study__column-heading case-study__column-heading--body case-study__anim"
          style={staggerStyle('heading-body')}
        >
          {CASE_STUDY_BODY_HEADING}
        </h2>
        <h2
          className="case-study__column-heading case-study__column-heading--symptom case-study__anim"
          style={staggerStyle('heading-symptom')}
        >
          {CASE_STUDY_SYMPTOM_HEADING}
        </h2>

        {/*
          The lung/heart illustration lives on the body-anatomy overlay
          (`bodyAnatomyArt`) — this is an invisible anchor over that existing
          artwork for the interaction layer, not a second anatomy image.
        */}
        <div
          className="case-study__anatomy-region"
          data-testid="case-study-anatomy"
          aria-hidden="true"
        />

        {CASE_STUDY_ORGANS.map((organ) => (
          <button
            key={organ.id}
            type="button"
            className={`case-study__hotspot case-study__anim${
              hoverHotspot === organ.id ? ' case-study__hotspot--hover' : ''
            }${selectedId ? ' case-study__hotspot--inviting' : ''}`}
            data-testid={`case-study-hotspot-${organ.id}`}
            style={{ left: organ.x, top: organ.y, ...staggerStyle(`hotspot-${organ.id}`) }}
            aria-label={organ.label}
            onClick={() => handleHotspotClick(organ.id)}
          />
        ))}
        {REFERENCE_ANATOMY_MARKERS.map((marker) => (
          <span
            key={marker.id}
            className="case-study__anatomy-marker"
            style={{ left: marker.x, top: marker.y }}
            aria-hidden="true"
          />
        ))}

        <div
          className="case-study__symptom-grid"
          data-testid="case-study-symptom-grid"
          aria-hidden="true"
        />

        {CASE_STUDY_SYMPTOMS.map((symptom) => {
          const isPlaced = placedIds.has(symptom.id)
          const isDragging = dragPos?.id === symptom.id
          const rect = isDragging
            ? dragPos
            : isPlaced
              ? getPlacedBadgeRect(symptom)
              : symptom.home
          const size = isPlaced
            ? { width: PLACED_WIDTH, height: PLACED_HEIGHT }
            : { width: symptom.home.width, height: symptom.home.height }

          const cardStagger = staggerStyle(`card-${symptom.id}`)

          if (isPlaced) {
            return (
              <div
                key={symptom.id}
                className="case-study__card case-study__card--placed case-study__anim"
                data-testid={`case-study-card-${symptom.id}`}
                style={{ left: rect.x, top: rect.y, width: size.width, height: size.height, ...cardStagger }}
              >
                <img src={symptom.art} alt={`${symptom.label} (terpasang)`} />
              </div>
            )
          }

          return (
            <button
              key={symptom.id}
              type="button"
              className={`case-study__card case-study__anim${
                isDragging ? ' case-study__card--dragging' : ''
              }${selectedId === symptom.id ? ' case-study__card--selected' : ''}${
                shakeId === symptom.id ? ' case-study__card--shake' : ''
              }`}
              data-testid={`case-study-card-${symptom.id}`}
              style={{ left: rect.x, top: rect.y, width: size.width, height: size.height, ...cardStagger }}
              aria-pressed={selectedId === symptom.id}
              aria-label={`${symptom.label}${selectedId === symptom.id ? ', dipilih. Pilih organ tujuan.' : ''}`}
              onPointerDown={(event) => handleCardPointerDown(symptom, event)}
              onPointerMove={(event) => handleCardPointerMove(symptom, event)}
              onPointerUp={(event) => handleCardPointerUp(symptom, event)}
              onPointerCancel={(event) => handleCardPointerUp(symptom, event)}
              onClick={() => handleCardClick(symptom)}
              onAnimationEnd={() => setShakeId((current) => (current === symptom.id ? null : current))}
            >
              <img src={symptom.art} alt="" aria-hidden="true" />
              <span className="case-study__card-label">{symptom.label}</span>
            </button>
          )
        })}

        {/* Correctness + explanation for each placement is announced here
            (screen readers only); the visible panel below stays a plain
            progress readout, per the reviewed SC-04 case-brief layout. */}
        <p className="case-study__sr-only" role="status" aria-live="polite">
          {srAnnouncement}
        </p>

        <div
          className="case-study__panel case-study__anim"
          data-testid="case-study-progress"
          style={staggerStyle('panel')}
        >
          {reviewStage === 'result' ? (
            <>
              <p className="case-study__panel-title">{CASE_STUDY_RESULT_TITLE}</p>
              <p className="case-study__panel-body">{CASE_STUDY_RESULT_BODY}</p>
            </>
          ) : (
            <div className="case-study__progress-readout">
              <p className="case-study__progress-label" data-testid="case-study-prompt">
                {CASE_STUDY_PROGRESS_LABEL} — {placedOrder.length} / {CASE_STUDY_SYMPTOMS.length}
              </p>
              <ProgressDots
                data-testid="case-study-progress-dots"
                total={CASE_STUDY_SYMPTOMS.length}
                completed={placedOrder.length}
                unitLabel="gejala"
              />
            </div>
          )}
        </div>

        <button
          type="button"
          className="case-study__bottom-back case-study__anim"
          data-testid="case-study-back-button"
          style={staggerStyle('panel')}
          onClick={() => requestExit(onBack ?? onBackToHome)}
        >
          <ArrowLeft aria-hidden="true" />
          Sebelumnya
        </button>
        <button
          type="button"
          className="case-study__bottom-next case-study__anim"
          data-testid="case-study-bottom-next-button"
          style={staggerStyle('panel')}
          disabled={reviewStage === 'placing' && !completed}
          onClick={() => {
            if (reviewStage === 'placing') {
              if (completed) setReviewStage('checked')
            } else if (reviewStage === 'checked') {
              setReviewStage('result')
            } else {
              requestExit(onComplete)
            }
          }}
        >
          {reviewStage === 'placing'
            ? CASE_STUDY_CHECK_BUTTON
            : reviewStage === 'checked'
              ? CASE_STUDY_CONTINUE_BUTTON
              : CASE_STUDY_START_MATERI_BUTTON}
          <ArrowRight aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
