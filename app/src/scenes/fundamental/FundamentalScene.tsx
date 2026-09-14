import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { ArrowRight, ChevronLeft, MousePointer2, X } from 'lucide-react'

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
  ANATOMY_42_BODY_ART,
  ANATOMY_42_CONCEPTS,
  ANATOMY_42_COPY,
  ANATOMY_42_ORGANS,
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
type FundamentalMicroscene = '4.1' | '4.2'

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
  const [microscene, setMicroscene] = useState<FundamentalMicroscene>('4.1')
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

  const changeMicroscene = useCallback(
    (next: FundamentalMicroscene) => {
      if (phase !== 'idle') return
      setMicroscene(next)
      setPhase('entering')
    },
    [phase],
  )

  if (microscene === '4.2') {
    return (
      <FundamentalAnatomyScene
        audioOn={audioOn}
        phase={phase}
        stageStyle={stageStyle}
        onAudioToggle={() => setAudioOn((current) => !current)}
        onBackToHome={() => leaveScene(onBackToHome)}
        onBackToCase={() => leaveScene(onBack)}
        onPrevious={() => changeMicroscene('4.1')}
        onComplete={() => leaveScene(onComplete)}
      />
    )
  }

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

        <button type="button" className="fundamental__nav-button fundamental__nav-button--back fundamental__anim" data-testid="fundamental-back-button" style={animationStyle(8)} disabled aria-label="Sebelumnya, belum tersedia pada langkah pertama">
          <ChevronLeft aria-hidden="true" focusable="false" />
          Sebelumnya
        </button>
        <button type="button" className="fundamental__nav-button fundamental__nav-button--next fundamental__anim" data-testid="fundamental-next-button" style={animationStyle(9)} onClick={() => changeMicroscene('4.2')}>
          Mulai Eksplorasi
          <ArrowRight aria-hidden="true" focusable="false" />
        </button>
      </div>
    </main>
  )
}

type FundamentalAnatomySceneProps = {
  audioOn: boolean
  phase: FundamentalPhase
  stageStyle: CSSProperties
  onAudioToggle: () => void
  onBackToHome: () => void
  onBackToCase: () => void
  onPrevious: () => void
  onComplete: () => void
}

function FundamentalAnatomyScene({
  audioOn,
  phase,
  stageStyle,
  onAudioToggle,
  onBackToHome,
  onBackToCase,
  onPrevious,
  onComplete,
}: FundamentalAnatomySceneProps) {
  const [selectedOrganId, setSelectedOrganId] = useState<(typeof ANATOMY_42_ORGANS)[number]['id']>('heart')
  const selectedOrgan = ANATOMY_42_ORGANS.find((organ) => organ.id === selectedOrganId) ?? ANATOMY_42_ORGANS[0]

  return (
    <main className="fundamental fundamental--anatomy" data-phase={phase} data-testid="fundamental-scene" data-microscene="4.2" aria-labelledby="fundamental-heading">
      <div className="fundamental__stage" data-testid="fundamental-stage" style={stageStyle}>
        <img className="fundamental__background" src={backgroundArt} alt="" aria-hidden="true" />
        <button type="button" className="fundamental__icon-button fundamental__home-button fundamental__anim" style={animationStyle(1)} data-testid="fundamental-home-button" aria-label="Kembali ke Beranda" onClick={onBackToHome}><img src={homeArt} alt="" aria-hidden="true" /></button>
        <button type="button" className="fundamental__icon-button fundamental__back-icon-button fundamental__anim" style={animationStyle(2)} data-testid="fundamental-top-back-button" aria-label="Kembali ke studi kasus" onClick={onBackToCase}><img src={backArt} alt="" aria-hidden="true" /></button>
        <button type="button" className="fundamental__icon-button fundamental__audio-button fundamental__anim" style={animationStyle(3)} data-testid="fundamental-audio-button" aria-label={audioOn ? 'Matikan musik latar' : 'Aktifkan musik latar'} aria-pressed={audioOn} onClick={onAudioToggle}><img src={audioOn ? bgmOnArt : bgmOffArt} alt="" aria-hidden="true" /></button>
        <HelpButton className="fundamental__icon-button fundamental__help-button fundamental__anim" style={animationStyle(4)} data-testid="fundamental-help-button" label="Bantuan dasar anatomi" onClick={() => document.getElementById('fundamental-anatomy-model')?.focus()} />

        <header className="fundamental__header fundamental__anim" data-testid="fundamental-header" style={animationStyle(0)}>
          <p className="fundamental__eyebrow">{ANATOMY_42_COPY.eyebrow}</p>
          <h1 id="fundamental-heading">{ANATOMY_42_COPY.heading}</h1>
          <p>{ANATOMY_42_COPY.subtitle}</p>
        </header>

        <section className="fundamental__anatomy-intro fundamental__anim" data-testid="fundamental-anatomy-intro" style={animationStyle(5)}>
          <h2>Apa itu Anatomi?</h2>
          <p>{ANATOMY_42_COPY.intro}</p>
          <ul>
            {ANATOMY_42_CONCEPTS.map((concept) => <li key={concept.id} data-tone={concept.tone}><img src={concept.art} alt="" aria-hidden="true" /><div><strong>{concept.title}</strong><span>{concept.body}</span></div></li>)}
          </ul>
        </section>

        <section className="fundamental__anatomy-model fundamental__anim" data-testid="fundamental-anatomy-model" style={animationStyle(6)} aria-label="Model anatomi tubuh" tabIndex={-1}>
          <img src={ANATOMY_42_BODY_ART} alt="Ilustrasi anatomi tubuh manusia" />
          {ANATOMY_42_ORGANS.map((organ) => <button key={organ.id} type="button" className={`fundamental__organ-hotspot${selectedOrganId === organ.id ? ' fundamental__organ-hotspot--selected' : ''}`} style={{ left: `${organ.position.x}%`, top: `${organ.position.y}%` }} aria-label={organ.label} aria-pressed={selectedOrganId === organ.id} onClick={() => setSelectedOrganId(organ.id)}><span /></button>)}
        </section>

        <aside className="fundamental__organ-card fundamental__anim" data-testid="fundamental-organ-card" style={animationStyle(7)} aria-label={`Informasi ${selectedOrgan.label}`}>
          <header><span><img src={selectedOrgan.art} alt="" aria-hidden="true" /></span><h2>{selectedOrgan.label}</h2><button type="button" aria-label="Tutup informasi organ" onClick={() => setSelectedOrganId('heart')}><X aria-hidden="true" /></button></header>
          <div className="fundamental__organ-details"><img src={selectedOrgan.art} alt="" aria-hidden="true" /><dl><div><dt><img src={ANATOMY_42_CONCEPTS[1].art} alt="" aria-hidden="true" />Lokasi</dt><dd>{selectedOrgan.location}</dd></div><div><dt><img src={ANATOMY_42_CONCEPTS[2].art} alt="" aria-hidden="true" />Struktur</dt><dd>{selectedOrgan.structure}</dd></div><div><dt><MousePointer2 aria-hidden="true" />Fungsi (singkat)</dt><dd>{selectedOrgan.function}</dd></div></dl></div>
        </aside>

        <p className="fundamental__anatomy-instruction fundamental__anim" data-testid="fundamental-anatomy-instruction" style={animationStyle(8)}><MousePointer2 aria-hidden="true" /><span>{ANATOMY_42_COPY.instruction}</span></p>
        <button type="button" className="fundamental__nav-button fundamental__nav-button--back fundamental__anim" data-testid="fundamental-back-button" style={animationStyle(8)} onClick={onPrevious}><ChevronLeft aria-hidden="true" focusable="false" />Sebelumnya</button>
        <button type="button" className="fundamental__nav-button fundamental__nav-button--next fundamental__anim" data-testid="fundamental-next-button" style={animationStyle(9)} onClick={onComplete}>Selanjutnya<ArrowRight aria-hidden="true" focusable="false" /></button>
      </div>
    </main>
  )
}
