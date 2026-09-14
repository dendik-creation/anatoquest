import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { ArrowRight, ChevronLeft } from 'lucide-react'

import backgroundArt from '../../assets/02_scene/04_fundamental/backgrounds/00_background.png'
import bodyArt from '../../assets/02_scene/04_fundamental/micro_scenes/4.1/01_body_full.png'
import backArt from '../../assets/01_reusable/buttons/btn_back.png'
import bgmOffArt from '../../assets/01_reusable/buttons/btn_bgm_off.png'
import bgmOnArt from '../../assets/01_reusable/buttons/btn_bgm_on.png'
import homeArt from '../../assets/01_reusable/buttons/btn_home.png'
import { HelpButton } from '../../components/HelpButton'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { useStageCoverScale } from '../../hooks/useStageCoverScale'
import {
  ANATOMY_LEVELS,
  FUNDAMENTAL_COPY,
  PHYSIOLOGY_EXAMPLES,
  PHYSIOLOGY_GEAR_ART,
} from './fundamentalContent'
import './FundamentalScene.css'

const DESIGN_WIDTH = 1920
const DESIGN_HEIGHT = 1080
const SAFE_WIDTH = 1860
const SAFE_HEIGHT = 1046
const STAGGER_STEP_MS = 55
const ENTER_DURATION_MS = 500
const EXIT_DURATION_MS = 420
const REDUCED_MOTION_MS = 140
const ANIMATED_ELEMENT_COUNT = 10

type FundamentalPhase = 'entering' | 'idle' | 'exiting'

function animationStyle(index: number): CSSProperties {
  return { '--stagger': index } as CSSProperties
}

type FundamentalSceneProps = {
  onBackToHome?: () => void
  onBack?: () => void
  onComplete?: () => void
}

/** Microscene 4.1 — the visual introduction to anatomy and physiology. */
export function FundamentalScene({ onBackToHome, onBack, onComplete }: FundamentalSceneProps) {
  const stageScale = useStageCoverScale(DESIGN_WIDTH, DESIGN_HEIGHT, SAFE_WIDTH, SAFE_HEIGHT)
  const prefersReducedMotion = usePrefersReducedMotion()
  const [audioOn, setAudioOn] = useState(true)
  const [phase, setPhase] = useState<FundamentalPhase>('entering')
  const exitActionRef = useRef<(() => void) | undefined>(undefined)

  useEffect(() => {
    if (phase !== 'entering') return
    const duration = prefersReducedMotion
      ? REDUCED_MOTION_MS
      : ENTER_DURATION_MS + (ANIMATED_ELEMENT_COUNT - 1) * STAGGER_STEP_MS
    const timer = window.setTimeout(() => setPhase('idle'), duration)
    return () => window.clearTimeout(timer)
  }, [phase, prefersReducedMotion])

  useEffect(() => {
    if (phase !== 'exiting') return
    const duration = prefersReducedMotion
      ? REDUCED_MOTION_MS
      : EXIT_DURATION_MS + (ANIMATED_ELEMENT_COUNT - 1) * STAGGER_STEP_MS
    const timer = window.setTimeout(() => exitActionRef.current?.(), duration)
    return () => window.clearTimeout(timer)
  }, [phase, prefersReducedMotion])

  const leaveScene = useCallback(
    (action?: () => void) => {
      if (phase === 'exiting') return
      exitActionRef.current = action
      setPhase('exiting')
    },
    [phase],
  )

  const stageStyle = {
    '--stage-scale': stageScale,
    '--stagger-count': ANIMATED_ELEMENT_COUNT - 1,
  } as CSSProperties

  return (
    <main
      className="fundamental"
      data-phase={phase}
      data-testid="fundamental-scene"
      aria-labelledby="fundamental-heading"
    >
      <div className="fundamental__stage" data-testid="fundamental-stage" style={stageStyle}>
        <img className="fundamental__background" src={backgroundArt} alt="" aria-hidden="true" />

        <button
          type="button"
          className="fundamental__icon-button fundamental__home-button fundamental__anim"
          data-testid="fundamental-home-button"
          style={animationStyle(1)}
          aria-label="Kembali ke Beranda"
          onClick={() => leaveScene(onBackToHome)}
        >
          <img src={homeArt} alt="" aria-hidden="true" />
        </button>
        <button
          type="button"
          className="fundamental__icon-button fundamental__back-icon-button fundamental__anim"
          data-testid="fundamental-top-back-button"
          style={animationStyle(2)}
          aria-label="Kembali ke studi kasus"
          onClick={() => leaveScene(onBack)}
        >
          <img src={backArt} alt="" aria-hidden="true" />
        </button>
        <button
          type="button"
          className="fundamental__icon-button fundamental__audio-button fundamental__anim"
          data-testid="fundamental-audio-button"
          style={animationStyle(3)}
          aria-label={audioOn ? 'Matikan musik latar' : 'Aktifkan musik latar'}
          aria-pressed={audioOn}
          onClick={() => setAudioOn((current) => !current)}
        >
          <img src={audioOn ? bgmOnArt : bgmOffArt} alt="" aria-hidden="true" />
        </button>
        <HelpButton
          className="fundamental__icon-button fundamental__help-button fundamental__anim"
          data-testid="fundamental-help-button"
          label="Bantuan pengantar materi"
          style={animationStyle(4)}
          onClick={() => document.getElementById('fundamental-anatomy')?.focus()}
        />

        <header className="fundamental__header fundamental__anim" data-testid="fundamental-header" style={animationStyle(0)}>
          <p className="fundamental__eyebrow">{FUNDAMENTAL_COPY.eyebrow}</p>
          <h1 id="fundamental-heading">{FUNDAMENTAL_COPY.heading}</h1>
          <p>{FUNDAMENTAL_COPY.subtitle}</p>
        </header>

        <section className="fundamental__card fundamental__card--anatomy fundamental__anim" data-testid="fundamental-anatomy-panel" style={animationStyle(5)}>
          <div className="fundamental__card-banner fundamental__card-banner--anatomy">
            <span className="fundamental__topic-disc fundamental__topic-disc--anatomy" aria-hidden="true">🦴</span>
            <div>
              <h2>{FUNDAMENTAL_COPY.anatomy.title}</h2>
              <p>{FUNDAMENTAL_COPY.anatomy.kicker}</p>
            </div>
          </div>
          <p className="fundamental__definition">{FUNDAMENTAL_COPY.anatomy.body}</p>
          <ul className="fundamental__examples" aria-label="Tingkat struktur tubuh">
            {ANATOMY_LEVELS.map((level) => (
              <li key={level.id}>
                <img src={level.art} alt="" aria-hidden="true" />
                <span>{level.label}</span>
              </li>
            ))}
          </ul>
          <p className="fundamental__card-footer">{FUNDAMENTAL_COPY.anatomy.footer}</p>
        </section>

        <section className="fundamental__body-region fundamental__anim" data-testid="fundamental-anatomy" aria-label="Ilustrasi tubuh manusia" style={animationStyle(6)}>
          <img id="fundamental-anatomy" className="fundamental__body" src={bodyArt} alt="Ilustrasi struktur tubuh manusia" tabIndex={-1} />
          <div className="fundamental__body-halo" aria-hidden="true" />
          <p className="fundamental__relation" data-testid="fundamental-relation">
            <strong>{FUNDAMENTAL_COPY.relation}</strong>
            <span>{FUNDAMENTAL_COPY.relationCaption}</span>
          </p>
        </section>

        <section className="fundamental__card fundamental__card--physiology fundamental__anim" data-testid="fundamental-physiology-panel" style={animationStyle(7)}>
          <div className="fundamental__card-banner fundamental__card-banner--physiology">
            <span className="fundamental__topic-disc fundamental__topic-disc--physiology" aria-hidden="true">
              <img src={PHYSIOLOGY_GEAR_ART} alt="" />
            </span>
            <div>
              <h2>{FUNDAMENTAL_COPY.physiology.title}</h2>
              <p>{FUNDAMENTAL_COPY.physiology.kicker}</p>
            </div>
          </div>
          <p className="fundamental__definition">{FUNDAMENTAL_COPY.physiology.body}</p>
          <ul className="fundamental__examples fundamental__examples--physiology" aria-label="Contoh fungsi tubuh">
            {PHYSIOLOGY_EXAMPLES.map((example) => (
              <li key={example.id}>
                <img src={example.art} alt="" aria-hidden="true" />
                <span>{example.label}</span>
              </li>
            ))}
          </ul>
          <p className="fundamental__card-footer fundamental__card-footer--physiology">
            {FUNDAMENTAL_COPY.physiology.footer}
          </p>
        </section>

        <button type="button" className="fundamental__nav-button fundamental__nav-button--back fundamental__anim" data-testid="fundamental-back-button" style={animationStyle(8)} onClick={() => leaveScene(onBack)}>
          <ChevronLeft aria-hidden="true" focusable="false" />
          Sebelumnya
        </button>
        <button type="button" className="fundamental__nav-button fundamental__nav-button--next fundamental__anim" data-testid="fundamental-next-button" style={animationStyle(9)} onClick={() => leaveScene(onComplete)}>
          Mulai Eksplorasi
          <ArrowRight aria-hidden="true" focusable="false" />
        </button>
      </div>
    </main>
  )
}
