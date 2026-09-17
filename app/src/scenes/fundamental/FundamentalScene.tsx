import { useCallback, useEffect, useRef, useState, type CSSProperties, type DragEvent } from 'react'
import { ArrowRight, Check, ChevronLeft, MousePointer2, RotateCcw, X } from 'lucide-react'

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
  CLASSIFICATION_46_ART,
  CLASSIFICATION_46_CARDS,
  CLASSIFICATION_46_COPY,
  FUNDAMENTAL_COPY,
  HOMEOSTASIS_45_ART,
  HOMEOSTASIS_45_CHANGES,
  HOMEOSTASIS_45_COPY,
  HOMEOSTASIS_45_EXAMPLES,
  HOMEOSTASIS_45_RESPONSES,
  ORGANIZATION_44_COPY,
  ORGANIZATION_44_LEVELS,
  PHYSIOLOGY_EXAMPLES,
  PHYSIOLOGY_43_COPY,
  PHYSIOLOGY_43_CURSOR_ART,
  PHYSIOLOGY_43_PROCESSES,
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
export type FundamentalMicroscene = '4.1' | '4.2' | '4.3' | '4.4' | '4.5' | '4.6'

const FUNDAMENTAL_MICROSCENES: readonly FundamentalMicroscene[] = ['4.1', '4.2', '4.3', '4.4', '4.5', '4.6']

function animationStyle(index: number): CSSProperties {
  return { '--stagger': index } as CSSProperties
}

type FundamentalSceneProps = {
  onBackToHome?: () => void
  onBack?: () => void
  onComplete?: () => void
  /** Dev-only testing shortcut; see App.tsx VITE_DEV_MICROSCENE. Defaults to '4.1'. */
  initialMicroscene?: FundamentalMicroscene
}

/** Microscene 4.1 — the visual introduction to anatomy and physiology. */
export function FundamentalScene({ onBackToHome, onBack, onComplete, initialMicroscene }: FundamentalSceneProps) {
  const stageScale = useStageCoverScale(DESIGN_WIDTH, DESIGN_HEIGHT, SAFE_WIDTH, SAFE_HEIGHT)
  const prefersReducedMotion = usePrefersReducedMotion()
  const [audioOn, setAudioOn] = useState(true)
  const [phase, setPhase] = useState<FundamentalPhase>('entering')
  const [microscene, setMicroscene] = useState<FundamentalMicroscene>(() =>
    initialMicroscene && FUNDAMENTAL_MICROSCENES.includes(initialMicroscene) ? initialMicroscene : '4.1',
  )
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
        onComplete={() => changeMicroscene('4.3')}
      />
    )
  }

  if (microscene === '4.3') {
    return (
      <FundamentalPhysiologyScene
        audioOn={audioOn}
        phase={phase}
        stageStyle={stageStyle}
        onAudioToggle={() => setAudioOn((current) => !current)}
        onBackToHome={() => leaveScene(onBackToHome)}
        onBackToCase={() => leaveScene(onBack)}
        onPrevious={() => changeMicroscene('4.2')}
        onComplete={() => changeMicroscene('4.4')}
      />
    )
  }

  if (microscene === '4.4') {
    return (
      <FundamentalOrganizationScene
        audioOn={audioOn}
        phase={phase}
        stageStyle={stageStyle}
        onAudioToggle={() => setAudioOn((current) => !current)}
        onBackToHome={() => leaveScene(onBackToHome)}
        onBackToCase={() => leaveScene(onBack)}
        onPrevious={() => changeMicroscene('4.3')}
        onComplete={() => changeMicroscene('4.5')}
      />
    )
  }

  if (microscene === '4.5') {
    return (
      <FundamentalHomeostasisScene
        audioOn={audioOn}
        phase={phase}
        stageStyle={stageStyle}
        onAudioToggle={() => setAudioOn((current) => !current)}
        onBackToHome={() => leaveScene(onBackToHome)}
        onBackToCase={() => leaveScene(onBack)}
        onPrevious={() => changeMicroscene('4.4')}
        onComplete={() => changeMicroscene('4.6')}
      />
    )
  }

  if (microscene === '4.6') {
    return (
      <FundamentalClassificationScene
        audioOn={audioOn}
        phase={phase}
        stageStyle={stageStyle}
        onAudioToggle={() => setAudioOn((current) => !current)}
        onBackToHome={() => leaveScene(onBackToHome)}
        onBackToCase={() => leaveScene(onBack)}
        onPrevious={() => changeMicroscene('4.5')}
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

type FundamentalPhysiologySceneProps = FundamentalAnatomySceneProps

function FundamentalClassificationScene({
  audioOn,
  phase,
  stageStyle,
  onAudioToggle,
  onBackToHome,
  onBackToCase,
  onComplete,
}: FundamentalAnatomySceneProps) {
  type CardId = (typeof CLASSIFICATION_46_CARDS)[number]['id']
  type Category = (typeof CLASSIFICATION_46_CARDS)[number]['category']
  type CheckState = 'correct' | 'incorrect' | null

  const [assignments, setAssignments] = useState<Partial<Record<CardId, Category>>>({})
  const [selectedCardId, setSelectedCardId] = useState<CardId | null>(null)
  const [checkState, setCheckState] = useState<CheckState>(null)
  const assignedCount = Object.keys(assignments).length

  const assignCard = (cardId: CardId, category: Category) => {
    if (phase !== 'idle') return
    setAssignments((current) => ({ ...current, [cardId]: category }))
    setSelectedCardId(null)
    setCheckState(null)
  }

  const handleDrop = (event: DragEvent<HTMLDivElement>, category: Category) => {
    event.preventDefault()
    const cardId = event.dataTransfer.getData('application/x-anatoquest-classification') as CardId
    if (CLASSIFICATION_46_CARDS.some((card) => card.id === cardId)) assignCard(cardId, category)
  }

  const categoryState = (category: Category) => {
    if (!checkState) return undefined
    return CLASSIFICATION_46_CARDS.filter((card) => assignments[card.id] === category).every((card) => card.category === category) ? 'correct' : 'incorrect'
  }

  const checkAnswers = () => {
    if (assignedCount !== CLASSIFICATION_46_CARDS.length) return
    setCheckState(CLASSIFICATION_46_CARDS.every((card) => assignments[card.id] === card.category) ? 'correct' : 'incorrect')
  }

  const resetAnswers = () => {
    setAssignments({})
    setSelectedCardId(null)
    setCheckState(null)
  }

  const classificationNextReady = checkState === 'correct'

  return (
    <main className="fundamental fundamental--classification" data-phase={phase} data-testid="fundamental-scene" data-microscene="4.6" aria-labelledby="fundamental-heading">
      <div className="fundamental__stage" data-testid="fundamental-stage" style={stageStyle}>
        <img className="fundamental__background" src={backgroundArt} alt="" aria-hidden="true" />
        <button type="button" className="fundamental__icon-button fundamental__home-button fundamental__anim" style={animationStyle(1)} data-testid="fundamental-home-button" aria-label="Kembali ke Beranda" onClick={onBackToHome}><img src={homeArt} alt="" aria-hidden="true" /></button>
        <button type="button" className="fundamental__icon-button fundamental__back-icon-button fundamental__anim" style={animationStyle(2)} data-testid="fundamental-top-back-button" aria-label="Kembali ke studi kasus" onClick={onBackToCase}><img src={backArt} alt="" aria-hidden="true" /></button>
        <button type="button" className="fundamental__icon-button fundamental__audio-button fundamental__anim" style={animationStyle(3)} data-testid="fundamental-audio-button" aria-label={audioOn ? 'Matikan musik latar' : 'Aktifkan musik latar'} aria-pressed={audioOn} onClick={onAudioToggle}><img src={audioOn ? bgmOnArt : bgmOffArt} alt="" aria-hidden="true" /></button>
        <HelpButton className="fundamental__icon-button fundamental__help-button fundamental__anim" style={animationStyle(4)} data-testid="fundamental-help-button" label="Bantuan kelompok anatomi dan fisiologi" onClick={() => document.getElementById('fundamental-classification-tray')?.focus()} />

        <header className="fundamental__header fundamental__anim" data-testid="fundamental-header" style={animationStyle(0)}>
          <p className="fundamental__eyebrow">{CLASSIFICATION_46_COPY.eyebrow}</p>
          <h1 id="fundamental-heading">{CLASSIFICATION_46_COPY.heading}</h1>
          <p>{CLASSIFICATION_46_COPY.subtitle}</p>
        </header>

        <section className="fundamental__classification-groups fundamental__anim" data-testid="fundamental-classification-groups" style={animationStyle(5)} aria-label="Kelompok anatomi dan fisiologi">
          {(['anatomy', 'physiology'] as const).map((category) => {
            const copy = CLASSIFICATION_46_COPY[category]
            const icon = category === 'anatomy' ? CLASSIFICATION_46_ART.skeleton : CLASSIFICATION_46_ART.heart
            const assignedCards = CLASSIFICATION_46_CARDS.filter((card) => assignments[card.id] === category)
            return <section key={category} className={`fundamental__classification-group fundamental__classification-group--${category}`} data-status={categoryState(category)}>
              <header><span><img src={icon} alt="" aria-hidden="true" /></span><div><h2>{copy.title}</h2><p>{copy.subtitle}</p></div><img className="fundamental__classification-header-art" src={icon} alt="" aria-hidden="true" /></header>
              <div className="fundamental__classification-drop" data-testid={`classification-drop-${category}`} role="button" tabIndex={0} aria-label={`Kelompok ${copy.title}. ${assignedCards.length} kartu ditempatkan.`} onClick={() => selectedCardId && assignCard(selectedCardId, category)} onKeyDown={(event) => { if ((event.key === 'Enter' || event.key === ' ') && selectedCardId) { event.preventDefault(); assignCard(selectedCardId, category) } }} onDragOver={(event) => event.preventDefault()} onDrop={(event) => handleDrop(event, category)}>
                {assignedCards.length === 0 ? <div className="fundamental__classification-empty"><span aria-hidden="true">▧</span><strong>{copy.prompt}</strong><small>{copy.hint}</small></div> : <div className="fundamental__classification-assigned">{assignedCards.map((card) => <article key={card.id}><img src={card.art} alt="" aria-hidden="true" /><span>{card.title}<br />{card.label}</span>{checkState === 'correct' && <Check aria-hidden="true" />}</article>)}</div>}
              </div>
            </section>
          })}
        </section>

        <section className="fundamental__classification-tray fundamental__anim" id="fundamental-classification-tray" data-testid="fundamental-classification-tray" style={animationStyle(6)} tabIndex={-1} aria-label="Kartu untuk dikelompokkan">
          <p><img src={CLASSIFICATION_46_ART.swipe} alt="" aria-hidden="true" />Seret kartu ke kelompok yang sesuai.<i aria-hidden="true" /><img src={CLASSIFICATION_46_ART.click} alt="" aria-hidden="true" />Atau klik kartu, lalu pilih kelompok tujuannya.</p>
          <div>{CLASSIFICATION_46_CARDS.filter((card) => !assignments[card.id]).map((card) => <button key={card.id} type="button" draggable={phase === 'idle'} className="fundamental__classification-card" data-testid={`classification-card-${card.id}`} data-selected={selectedCardId === card.id} aria-pressed={selectedCardId === card.id} onClick={() => setSelectedCardId((current) => current === card.id ? null : card.id)} onDragStart={(event) => { event.dataTransfer.effectAllowed = 'move'; event.dataTransfer.setData('application/x-anatoquest-classification', card.id) }}><img src={card.art} alt="" aria-hidden="true" /><span>{card.title}<br />{card.label}</span></button>)}</div>
        </section>

        <p className="fundamental__classification-progress fundamental__anim" data-testid="classification-progress" style={animationStyle(7)}><span aria-hidden="true">▣</span><strong>{assignedCount} / 8</strong> dikelompokkan</p>
        {checkState && <div className={`fundamental__classification-feedback fundamental__classification-feedback--${checkState}`} data-testid="classification-feedback" aria-live="polite">{checkState === 'correct' ? 'Hebat! Kamu sudah membedakan struktur tubuh dan cara kerjanya dengan tepat.' : 'Masih ada kartu yang berada di kelompok kurang tepat. Coba ulangi dan periksa kembali.'}<button type="button" onClick={resetAnswers} aria-label="Ulangi pengelompokan"><RotateCcw aria-hidden="true" /></button></div>}

        <button type="button" className="fundamental__nav-button fundamental__nav-button--back fundamental__anim" data-testid="fundamental-back-button" style={animationStyle(8)} disabled aria-label="Sebelumnya, tidak tersedia pada aktivitas ini"><ChevronLeft aria-hidden="true" focusable="false" />Sebelumnya</button>
        <button type="button" className="fundamental__nav-button fundamental__nav-button--classification-check fundamental__anim" data-testid={classificationNextReady ? 'fundamental-next-button' : 'classification-check-button'} style={animationStyle(9)} disabled={phase !== 'idle' || assignedCount !== CLASSIFICATION_46_CARDS.length} onClick={classificationNextReady ? onComplete : checkAnswers}>{classificationNextReady ? 'Selanjutnya' : 'Periksa Jawaban'}<ArrowRight aria-hidden="true" focusable="false" /></button>
      </div>
    </main>
  )
}

function FundamentalHomeostasisScene({
  audioOn,
  phase,
  stageStyle,
  onAudioToggle,
  onBackToHome,
  onBackToCase,
  onComplete,
}: FundamentalAnatomySceneProps) {
  type ChangeId = (typeof HOMEOSTASIS_45_CHANGES)[number]['id']
  type ResponseId = (typeof HOMEOSTASIS_45_RESPONSES)[number]['id']
  type CheckState = 'correct' | 'incorrect' | 'incomplete' | null

  const shuffleResponses = () => [...HOMEOSTASIS_45_RESPONSES].sort(() => Math.random() - 0.5)

  const [assignments, setAssignments] = useState<Partial<Record<ChangeId, ResponseId>>>({})
  const [selectedResponseId, setSelectedResponseId] = useState<ResponseId | null>(null)
  const [checkState, setCheckState] = useState<CheckState>(null)
  const [responseOrder, setResponseOrder] = useState(shuffleResponses)

  const assignResponse = (changeId: ChangeId, responseId: ResponseId) => {
    if (phase !== 'idle') return
    setAssignments((current) => ({ ...current, [changeId]: responseId }))
    setSelectedResponseId(null)
    setCheckState(null)
  }

  const handleDrop = (event: DragEvent<HTMLButtonElement>, changeId: ChangeId) => {
    event.preventDefault()
    const responseId = event.dataTransfer.getData('application/x-anatoquest-response') as ResponseId
    if (HOMEOSTASIS_45_RESPONSES.some((response) => response.id === responseId)) assignResponse(changeId, responseId)
  }

  const checkAnswers = () => {
    const hasEveryAnswer = HOMEOSTASIS_45_CHANGES.every((change) => assignments[change.id])
    if (!hasEveryAnswer) {
      setCheckState('incomplete')
      return
    }
    setCheckState(HOMEOSTASIS_45_CHANGES.every((change) => assignments[change.id] === change.answerId) ? 'correct' : 'incorrect')
  }

  const resetAnswers = () => {
    setAssignments({})
    setSelectedResponseId(null)
    setCheckState(null)
    setResponseOrder(shuffleResponses())
  }

  const homeostasisNextReady = checkState === 'correct'

  return (
    <main className="fundamental fundamental--homeostasis" data-phase={phase} data-testid="fundamental-scene" data-microscene="4.5" aria-labelledby="fundamental-heading">
      <div className="fundamental__stage" data-testid="fundamental-stage" style={stageStyle}>
        <img className="fundamental__background" src={backgroundArt} alt="" aria-hidden="true" />
        <button type="button" className="fundamental__icon-button fundamental__home-button fundamental__anim" style={animationStyle(1)} data-testid="fundamental-home-button" aria-label="Kembali ke Beranda" onClick={onBackToHome}><img src={homeArt} alt="" aria-hidden="true" /></button>
        <button type="button" className="fundamental__icon-button fundamental__back-icon-button fundamental__anim" style={animationStyle(2)} data-testid="fundamental-top-back-button" aria-label="Kembali ke studi kasus" onClick={onBackToCase}><img src={backArt} alt="" aria-hidden="true" /></button>
        <button type="button" className="fundamental__icon-button fundamental__audio-button fundamental__anim" style={animationStyle(3)} data-testid="fundamental-audio-button" aria-label={audioOn ? 'Matikan musik latar' : 'Aktifkan musik latar'} aria-pressed={audioOn} onClick={onAudioToggle}><img src={audioOn ? bgmOnArt : bgmOffArt} alt="" aria-hidden="true" /></button>
        <HelpButton className="fundamental__icon-button fundamental__help-button fundamental__anim" style={animationStyle(4)} data-testid="fundamental-help-button" label="Bantuan keseimbangan tubuh" onClick={() => document.getElementById('fundamental-homeostasis-task')?.focus()} />

        <header className="fundamental__header fundamental__anim" data-testid="fundamental-header" style={animationStyle(0)}>
          <p className="fundamental__eyebrow">{HOMEOSTASIS_45_COPY.eyebrow}</p>
          <h1 id="fundamental-heading">{HOMEOSTASIS_45_COPY.heading}</h1>
          <p>{HOMEOSTASIS_45_COPY.subtitle}</p>
        </header>

        <aside className="fundamental__homeostasis-info fundamental__anim" data-testid="fundamental-homeostasis-info" style={animationStyle(5)}>
          <h2>Homeostasis</h2>
          <p>{HOMEOSTASIS_45_COPY.definition}</p>
          <section aria-label="Contoh kondisi tubuh yang dijaga">
            <h3>Contoh dalam tubuh:</h3>
            {HOMEOSTASIS_45_EXAMPLES.map((example) => <article key={example.id} data-tone={example.tone}><img src={example.art} alt="" aria-hidden="true" /><div><strong>{example.title}</strong><span>{example.description}</span></div></article>)}
          </section>
          <p className="fundamental__homeostasis-tip"><img src={HOMEOSTASIS_45_ART.lightbulb} alt="" aria-hidden="true" />Tubuh terus menyesuaikan diri untuk menjaga keseimbangan.</p>
        </aside>

        <section className="fundamental__homeostasis-task fundamental__anim" id="fundamental-homeostasis-task" data-testid="fundamental-homeostasis-task" style={animationStyle(6)} tabIndex={-1} aria-label="Aktivitas memasangkan perubahan dan respons tubuh">
          <p className="fundamental__homeostasis-instruction"><img src={HOMEOSTASIS_45_ART.cursor} alt="" aria-hidden="true" /><span>{HOMEOSTASIS_45_COPY.instruction}</span></p>
          <p className="fundamental__sr-only">Alternatif keyboard dan sentuh: pilih satu kartu respons tubuh, lalu pilih kotak perubahan tubuh yang sesuai.</p>
          <div className="fundamental__homeostasis-columns">
            <section className="fundamental__homeostasis-list" aria-labelledby="homeostasis-change-heading">
              <h2 id="homeostasis-change-heading">Perubahan pada tubuh</h2>
              {HOMEOSTASIS_45_CHANGES.map((change) => {
                const assignedResponse = HOMEOSTASIS_45_RESPONSES.find((response) => response.id === assignments[change.id])
                const status = checkState && assignments[change.id] ? (assignments[change.id] === change.answerId ? 'correct' : 'incorrect') : undefined
                return <article className="fundamental__change-card" key={change.id}><img src={change.art} alt="" aria-hidden="true" /><div><h3>{change.title}</h3><p>{change.detail}</p></div><button type="button" className="fundamental__drop-zone" data-testid={`homeostasis-drop-${change.id}`} data-status={status} aria-label={assignedResponse ? `${change.title}: ${assignedResponse.title}` : `Pilih respons untuk ${change.title}`} onClick={() => selectedResponseId && assignResponse(change.id, selectedResponseId)} onDragOver={(event) => event.preventDefault()} onDrop={(event) => handleDrop(event, change.id)}>{assignedResponse ? <><img src={assignedResponse.art} alt="" aria-hidden="true" />{status === 'correct' && <Check aria-hidden="true" />}</> : <span aria-hidden="true">?</span>}</button></article>
              })}
            </section>
            <section className="fundamental__homeostasis-list fundamental__homeostasis-list--responses" aria-labelledby="homeostasis-response-heading">
              <h2 id="homeostasis-response-heading">Respons tubuh</h2>
              {responseOrder.map((response) => <button key={response.id} type="button" draggable={phase === 'idle'} className="fundamental__response-card" data-selected={selectedResponseId === response.id} data-testid={`homeostasis-response-${response.id}`} aria-pressed={selectedResponseId === response.id} onClick={() => setSelectedResponseId((current) => current === response.id ? null : response.id)} onDragStart={(event) => { event.dataTransfer.effectAllowed = 'move'; event.dataTransfer.setData('application/x-anatoquest-response', response.id) }}><img src={response.art} alt="" aria-hidden="true" /><span><strong>{response.title}</strong><small>{response.detail}</small></span></button>)}
            </section>
          </div>
        </section>

        <aside className="fundamental__homeostasis-diagram fundamental__anim" data-testid="fundamental-homeostasis-diagram" style={animationStyle(7)} aria-label="Diagram respons tubuh saat suhu lingkungan meningkat">
          <img src={HOMEOSTASIS_45_ART.body} alt="Ilustrasi tubuh berkeringat yang menurunkan suhu tubuh hingga kembali seimbang" />
          <p>{HOMEOSTASIS_45_COPY.diagramCaption}</p>
        </aside>

        <ol className="fundamental__homeostasis-steps fundamental__anim" aria-label="Tahapan keseimbangan tubuh" style={animationStyle(8)}>
          <li data-complete="true"><span><Check aria-hidden="true" /></span><p>1. Terjadi<br />Perubahan</p></li>
          <li><span /><p>2. Tubuh<br />Merespons</p></li>
          <li><span /><p>3. Kembali<br />Seimbang</p></li>
        </ol>

        {checkState && <div className={`fundamental__homeostasis-feedback fundamental__anim fundamental__homeostasis-feedback--${checkState}`} data-testid="homeostasis-feedback" style={animationStyle(8)} aria-live="polite">{checkState === 'correct' ? 'Hebat! Semua respons sudah tepat. Tubuh bekerja menjaga kondisi internal tetap stabil.' : checkState === 'incomplete' ? 'Lengkapi ketiga pasangan terlebih dahulu.' : 'Masih ada pasangan yang belum tepat. Coba periksa kembali respons tubuhnya.'}<button type="button" onClick={resetAnswers} aria-label="Ulangi pasangan respons tubuh"><RotateCcw aria-hidden="true" /></button></div>}

        <button type="button" className="fundamental__nav-button fundamental__nav-button--back fundamental__anim" data-testid="fundamental-back-button" style={animationStyle(8)} disabled aria-label="Sebelumnya, tidak tersedia pada aktivitas ini"><ChevronLeft aria-hidden="true" focusable="false" />Sebelumnya</button>
        <button type="button" className="fundamental__nav-button fundamental__nav-button--check fundamental__anim" data-testid={homeostasisNextReady ? 'fundamental-next-button' : 'homeostasis-check-button'} style={animationStyle(9)} disabled={phase !== 'idle'} onClick={homeostasisNextReady ? onComplete : checkAnswers}>{homeostasisNextReady ? 'Selanjutnya' : 'Periksa Jawaban'}<ArrowRight aria-hidden="true" focusable="false" /></button>
      </div>
    </main>
  )
}

function FundamentalOrganizationScene({
  audioOn,
  phase,
  stageStyle,
  onAudioToggle,
  onBackToHome,
  onBackToCase,
  onPrevious,
  onComplete,
}: FundamentalAnatomySceneProps) {
  const [selectedLevelId, setSelectedLevelId] = useState<(typeof ORGANIZATION_44_LEVELS)[number]['id']>('cell')
  const selectedLevel = ORGANIZATION_44_LEVELS.find((level) => level.id === selectedLevelId) ?? ORGANIZATION_44_LEVELS[0]

  return (
    <main className="fundamental fundamental--organization" data-phase={phase} data-testid="fundamental-scene" data-microscene="4.4" aria-labelledby="fundamental-heading">
      <div className="fundamental__stage" data-testid="fundamental-stage" style={stageStyle}>
        <img className="fundamental__background" src={backgroundArt} alt="" aria-hidden="true" />
        <button type="button" className="fundamental__icon-button fundamental__home-button fundamental__anim" style={animationStyle(1)} data-testid="fundamental-home-button" aria-label="Kembali ke Beranda" onClick={onBackToHome}><img src={homeArt} alt="" aria-hidden="true" /></button>
        <button type="button" className="fundamental__icon-button fundamental__back-icon-button fundamental__anim" style={animationStyle(2)} data-testid="fundamental-top-back-button" aria-label="Kembali ke studi kasus" onClick={onBackToCase}><img src={backArt} alt="" aria-hidden="true" /></button>
        <button type="button" className="fundamental__icon-button fundamental__audio-button fundamental__anim" style={animationStyle(3)} data-testid="fundamental-audio-button" aria-label={audioOn ? 'Matikan musik latar' : 'Aktifkan musik latar'} aria-pressed={audioOn} onClick={onAudioToggle}><img src={audioOn ? bgmOnArt : bgmOffArt} alt="" aria-hidden="true" /></button>
        <HelpButton className="fundamental__icon-button fundamental__help-button fundamental__anim" style={animationStyle(4)} data-testid="fundamental-help-button" label="Bantuan organisasi tubuh" onClick={() => document.getElementById('fundamental-organization-detail')?.focus()} />

        <header className="fundamental__header fundamental__anim" data-testid="fundamental-header" style={animationStyle(0)}>
          <p className="fundamental__eyebrow">{ORGANIZATION_44_COPY.eyebrow}</p>
          <h1 id="fundamental-heading">{ORGANIZATION_44_COPY.heading}</h1>
          <p>{ORGANIZATION_44_COPY.subtitle}</p>
        </header>

        <section className="fundamental__organization-flow fundamental__anim" data-testid="fundamental-organization-flow" style={animationStyle(5)} aria-label="Alur organisasi tubuh manusia">
          <p className="fundamental__organization-instruction"><img src={PHYSIOLOGY_43_CURSOR_ART} alt="" aria-hidden="true" />{ORGANIZATION_44_COPY.instruction}</p>
          <div className="fundamental__organization-levels">
            {ORGANIZATION_44_LEVELS.map((level, index) => <div className="fundamental__organization-step" key={level.id}>
              <button type="button" className="fundamental__organization-choice" data-active={selectedLevel.id === level.id} aria-pressed={selectedLevel.id === level.id} disabled={phase !== 'idle'} onClick={() => setSelectedLevelId(level.id)}>
                <img src={level.art} alt="" aria-hidden="true" />
                <span>{level.label}</span>
              </button>
              {index < ORGANIZATION_44_LEVELS.length - 1 && <ArrowRight className="fundamental__organization-arrow" aria-hidden="true" />}
            </div>)}
          </div>
        </section>

        <section className="fundamental__organization-detail fundamental__anim" id="fundamental-organization-detail" data-testid="fundamental-organization-detail" style={animationStyle(6)} tabIndex={-1} aria-label={`Penjelasan ${selectedLevel.title}`}>
          <div className="fundamental__organization-summary"><img src={selectedLevel.art} alt="" aria-hidden="true" /><div><h2>{selectedLevel.title}</h2><strong>{selectedLevel.tag}</strong><p>{selectedLevel.summary}</p></div></div>
          <div className="fundamental__organization-info"><section><h3>Contoh</h3><img src={selectedLevel.exampleArt} alt="" aria-hidden="true" /><span>{selectedLevel.example}</span></section><section><h3>Fungsi</h3><p>{selectedLevel.function}</p></section><section><h3>{selectedLevel.formingTitle}</h3><div className="fundamental__organization-forming">{selectedLevel.forming.map((art, index) => <span key={`${selectedLevel.id}-${index}`}><img src={art} alt="" aria-hidden="true" />{index < selectedLevel.forming.length - 1 && <b aria-hidden="true">›</b>}</span>)}</div><p>{selectedLevel.formingText}</p></section></div>
        </section>

        <button type="button" className="fundamental__nav-button fundamental__nav-button--back fundamental__anim" data-testid="fundamental-back-button" style={animationStyle(8)} disabled={phase !== 'idle'} onClick={onPrevious}><ChevronLeft aria-hidden="true" focusable="false" />Sebelumnya</button>
        <button type="button" className="fundamental__nav-button fundamental__nav-button--next fundamental__anim" data-testid="fundamental-next-button" style={animationStyle(9)} disabled={phase !== 'idle'} onClick={onComplete}>Selanjutnya<ArrowRight aria-hidden="true" focusable="false" /></button>
      </div>
    </main>
  )
}

function FundamentalPhysiologyScene({
  audioOn,
  phase,
  stageStyle,
  onAudioToggle,
  onBackToHome,
  onBackToCase,
  onPrevious,
  onComplete,
}: FundamentalPhysiologySceneProps) {
  const [selectedProcessId, setSelectedProcessId] = useState<(typeof PHYSIOLOGY_43_PROCESSES)[number]['id']>('heartbeat')
  const selectedProcess = PHYSIOLOGY_43_PROCESSES.find((process) => process.id === selectedProcessId) ?? PHYSIOLOGY_43_PROCESSES[0]

  return (
    <main className="fundamental fundamental--physiology" data-phase={phase} data-testid="fundamental-scene" data-microscene="4.3" aria-labelledby="fundamental-heading">
      <div className="fundamental__stage" data-testid="fundamental-stage" style={stageStyle}>
        <img className="fundamental__background" src={backgroundArt} alt="" aria-hidden="true" />
        <button type="button" className="fundamental__icon-button fundamental__home-button fundamental__anim" style={animationStyle(1)} data-testid="fundamental-home-button" aria-label="Kembali ke Beranda" onClick={onBackToHome}><img src={homeArt} alt="" aria-hidden="true" /></button>
        <button type="button" className="fundamental__icon-button fundamental__back-icon-button fundamental__anim" style={animationStyle(2)} data-testid="fundamental-top-back-button" aria-label="Kembali ke studi kasus" onClick={onBackToCase}><img src={backArt} alt="" aria-hidden="true" /></button>
        <button type="button" className="fundamental__icon-button fundamental__audio-button fundamental__anim" style={animationStyle(3)} data-testid="fundamental-audio-button" aria-label={audioOn ? 'Matikan musik latar' : 'Aktifkan musik latar'} aria-pressed={audioOn} onClick={onAudioToggle}><img src={audioOn ? bgmOnArt : bgmOffArt} alt="" aria-hidden="true" /></button>
        <HelpButton className="fundamental__icon-button fundamental__help-button fundamental__anim" style={animationStyle(4)} data-testid="fundamental-help-button" label="Bantuan fisiologi" onClick={() => document.getElementById('fundamental-physiology-panel')?.focus()} />

        <header className="fundamental__header fundamental__anim" data-testid="fundamental-header" style={animationStyle(0)}>
          <p className="fundamental__eyebrow">{PHYSIOLOGY_43_COPY.eyebrow}</p>
          <h1 id="fundamental-heading">{PHYSIOLOGY_43_COPY.heading}</h1>
          <p>{PHYSIOLOGY_43_COPY.subtitle}</p>
        </header>

        <section className="fundamental__physiology-menu fundamental__anim" data-testid="fundamental-physiology-menu" style={animationStyle(5)}>
          <h2>Apa itu Fisiologi?</h2>
          <p>{PHYSIOLOGY_43_COPY.intro}</p>
          <div>{PHYSIOLOGY_43_PROCESSES.map((process) => <button key={process.id} type="button" data-active={selectedProcess.id === process.id} aria-pressed={selectedProcess.id === process.id} onClick={() => setSelectedProcessId(process.id)}><img src={process.art} alt="" aria-hidden="true" /><span><strong>{process.title}</strong><small>{process.body}</small></span>{selectedProcess.id === process.id && <span className="fundamental__process-check" aria-hidden="true">✓</span>}</button>)}</div>
        </section>

        <section className="fundamental__physiology-panel fundamental__anim" id="fundamental-physiology-panel" data-testid="fundamental-physiology-panel" style={animationStyle(6)} tabIndex={-1} aria-label={`Penjelasan ${selectedProcess.title}`}>
          <img className="fundamental__process-card" src={selectedProcess.cardArt} alt={`Penjelasan ${selectedProcess.title}: ${selectedProcess.caption}`} />
          <div className="fundamental__process-card-copy" aria-live="polite"><strong>{selectedProcess.detailTitle}</strong><span>{selectedProcess.detail}</span></div>
        </section>

        <button type="button" className="fundamental__nav-button fundamental__nav-button--back fundamental__anim" data-testid="fundamental-back-button" style={animationStyle(8)} disabled={phase !== 'idle'} onClick={onPrevious}><ChevronLeft aria-hidden="true" focusable="false" />Sebelumnya</button>
        <button type="button" className="fundamental__nav-button fundamental__nav-button--next fundamental__anim" data-testid="fundamental-next-button" style={animationStyle(9)} disabled={phase !== 'idle'} onClick={onComplete}>Selanjutnya<ArrowRight aria-hidden="true" focusable="false" /></button>
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
