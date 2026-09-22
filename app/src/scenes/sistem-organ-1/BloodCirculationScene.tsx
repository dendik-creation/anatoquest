import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useGlobalAudio } from '../../audio/GlobalAudio'
import { ArrowLeft, ArrowRight, Check, Play } from 'lucide-react'

import backgroundArt from '../../assets/02_scene/05_sistem_organ_1/backgrounds/00_background.png'
import bodyArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.6/body_full_circulatory.png'
import heartArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.6/heart.png'
import lungsArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.6/lungs.png'
import capillaryArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.6/capillary_circle.png'
import arrowBlueArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.6/arrow_blue.png'
import arrowRedArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.6/arrow_red.png'
import arrowWhiteArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.6/arrow_white.png'
import redCellArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.6/red_blood_cell.png'
import blueCellArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.6/blue_blood_cell.png'
import lungsIconArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.6/small_lungs_icon.png'
import personIconArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.6/person_icon.png'
import lightbulbArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.6/lightbulb_icon.png'
import bgmOffArt from '../../assets/01_reusable/buttons/btn_bgm_off.png'
import bgmOnArt from '../../assets/01_reusable/buttons/btn_bgm_on.png'
import homeArt from '../../assets/01_reusable/buttons/btn_home.png'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { useStageCoverScale } from '../../hooks/useStageCoverScale'
import './BloodCirculationScene.css'

const DESIGN_WIDTH = 1920
const DESIGN_HEIGHT = 1080
const SAFE_WIDTH = 1860
const SAFE_HEIGHT = 1046

type FlowMode = 'lungs' | 'body'
type BloodCirculationSceneProps = { onBackToHome?: () => void; onBack?: () => void; onComplete?: () => void; simulationMode?: boolean; transitionState?: 'entering' | 'entered' | 'exiting' }

const COPY = {
  lungs: {
    tab: 'Ke Paru-paru', panelTitle: 'Menuju Paru-paru',
    intro: 'Darah dari jantung menuju paru-paru untuk melakukan pertukaran gas (mengambil oksigen dan melepaskan karbon dioksida), kemudian kembali ke jantung.',
    steps: [
      ['Jantung memompa darah ke pembuluh.', ''],
      ['Darah mengalir melalui pembuluh darah.', ''],
      ['Darah mencapai jaringan tubuh/paru-paru.', ''],
      ['Darah kembali ke jantung melalui vena.', ''],
    ],
    outgoing: 'Darah menuju\nparu-paru', returning: 'Darah kembali\nke jantung',
  },
  body: {
    tab: 'Ke Seluruh Tubuh', panelTitle: 'Ke Seluruh Tubuh',
    intro: 'Jantung memompa darah melalui arteri menuju seluruh tubuh. Di kapiler, oksigen dan zat makanan dilepaskan ke jaringan tubuh. Darah yang lebih banyak mengandung karbon dioksida kemudian kembali ke jantung melalui vena.',
    steps: [
      ['Jantung memompa darah', 'Darah kaya oksigen dipompa keluar dari jantung melalui arteri.'],
      ['Darah mengalir melalui arteri', 'Darah menuju ke seluruh tubuh melalui pembuluh arteri.'],
      ['Darah mencapai kapiler', 'Di kapiler, terjadi pertukaran oksigen dan zat makanan dengan jaringan tubuh.'],
      ['Darah kembali ke jantung', 'Darah yang lebih banyak mengandung karbon dioksida kembali ke jantung melalui vena.'],
    ],
    outgoing: 'Darah keluar\ndari jantung\nmelalui arteri', returning: 'Darah kembali\nke jantung\nmelalui vena',
  },
} as const

const PARTICLES = [0, 1, 2, 3, 4, 5, 6, 7] as const

export function BloodCirculationScene({ onBackToHome, onBack, onComplete, simulationMode = false, transitionState = 'entered' }: BloodCirculationSceneProps) {
  const scale = useStageCoverScale(DESIGN_WIDTH, DESIGN_HEIGHT, SAFE_WIDTH, SAFE_HEIGHT)
  const reducedMotion = usePrefersReducedMotion()
  const { audioOn, toggleAudio } = useGlobalAudio()
  const [mode, setMode] = useState<FlowMode>('lungs')
  const [step, setStep] = useState<number | null>(null)
  const [completed, setCompleted] = useState(false)
  const [running, setRunning] = useState(false)
  const timers = useRef<number[]>([])
  const style = { '--stage-scale': scale } as CSSProperties
  const copy = COPY[mode]

  const clearTimeline = () => {
    timers.current.forEach((timer) => window.clearTimeout(timer))
    timers.current = []
  }

  useEffect(() => clearTimeline, [])

  const resetTimeline = () => {
    clearTimeline()
    setRunning(false)
    setStep(null)
    setCompleted(false)
  }

  const selectMode = (next: FlowMode) => {
    if (next === mode) return
    resetTimeline()
    setMode(next)
  }

  const runAnimation = () => {
    resetTimeline()
    setRunning(true)
    setStep(0)
    const phaseAt = mode === 'lungs' ? [0, 1200, 3000, 4300] : [0, 1200, 3200, 4800]
    const finishAt = mode === 'lungs' ? 7000 : 7600
    if (reducedMotion) {
      timers.current = [
        window.setTimeout(() => setStep(1), 120),
        window.setTimeout(() => setStep(2), 240),
        window.setTimeout(() => setStep(3), 360),
        window.setTimeout(() => { setCompleted(true); setStep(null); setRunning(false); timers.current = [] }, 520),
      ]
      return
    }
    timers.current = [
      ...phaseAt.slice(1).map((time, index) => window.setTimeout(() => setStep(index + 1), time)),
      window.setTimeout(() => { setCompleted(true); setStep(null); setRunning(false); timers.current = [] }, finishAt),
    ]
  }

  const stepState = (index: number) => completed || (step !== null && index < step) ? 'completed' : step === index ? 'active' : 'idle'

  return <main className="blood-circulation" data-testid="blood-circulation-scene" data-microscene="5.6" data-transition={transitionState} data-mode={mode} data-running={running} data-step={step ?? 'none'} data-completed={completed} style={style} aria-labelledby="blood-circulation-heading">
    <div className="blood-circulation__stage">
      <img className="blood-circulation__background" src={backgroundArt} alt="" aria-hidden="true" />
      <button className="blood-circulation__icon blood-circulation__home" type="button" aria-label="Kembali ke Beranda" onClick={onBackToHome}><img src={homeArt} alt="" /></button>

      <button className="blood-circulation__icon blood-circulation__audio" type="button" aria-label={audioOn ? 'Matikan musik latar' : 'Aktifkan musik latar'} aria-pressed={audioOn} onClick={() => toggleAudio()}><img src={audioOn ? bgmOnArt : bgmOffArt} alt="" /></button>
      <header className="blood-circulation__header"><p>Materi 2 - Sistem Organ Tubuh (6 / 8)</p><h1 id="blood-circulation-heading">Bagaimana Darah Beredar?</h1><span>Amati bagaimana jantung memompa darah melalui pembuluh darah ke seluruh tubuh.</span></header>

      <aside className="blood-circulation__journey" aria-label="Perjalanan Darah">
        <h2>Perjalanan Darah</h2>
        <ol>{copy.steps.map(([title, description], index) => <li key={title} data-state={stepState(index)}><span>{stepState(index) === 'completed' ? <Check aria-hidden="true" /> : index + 1}</span><div><strong>{title}</strong>{description && <small>{description}</small>}</div></li>)}</ol>
        <button type="button" data-testid="blood-circulation-play-button" disabled={running} onClick={runAnimation}><Play aria-hidden="true" /><span>{running ? 'Sedang Berjalan...' : 'Putar Animasi'}</span></button>
      </aside>

      <section className="blood-circulation__anatomy" aria-label={`Ilustrasi aliran darah ${copy.tab.toLowerCase()}`}>
        <div className="blood-circulation__halo" />
        <img className="blood-circulation__body" src={bodyArt} alt="Ilustrasi tubuh dengan sistem peredaran darah" />
        <img className="blood-circulation__heart" src={heartArt} alt="" aria-hidden="true" />
        <span className="blood-circulation__heartbeat" aria-hidden="true" />
        <div className="blood-circulation__particles blood-circulation__particles--red" aria-hidden="true">{PARTICLES.map((id) => <img key={id} data-particle={id} src={redCellArt} alt="" />)}</div>
        <div className="blood-circulation__particles blood-circulation__particles--blue" aria-hidden="true">{PARTICLES.map((id) => <img key={id} data-particle={id} src={blueCellArt} alt="" />)}</div>
        {running && <div className="blood-circulation__flow-arrows" aria-hidden="true"><img className="blood-circulation__flow-arrow blood-circulation__flow-arrow--blue" src={arrowBlueArt} alt="" /><img className="blood-circulation__flow-arrow blood-circulation__flow-arrow--red" src={arrowRedArt} alt="" /><img className="blood-circulation__flow-arrow blood-circulation__flow-arrow--white" src={arrowWhiteArt} alt="" /></div>}
        <p className="blood-circulation__callout blood-circulation__callout--outgoing">{copy.outgoing.split('\n').map((line) => <span key={line}>{line}</span>)}</p>
        <p className="blood-circulation__callout blood-circulation__callout--returning">{copy.returning.split('\n').map((line) => <span key={line}>{line}</span>)}</p>
        {mode === 'body' && <div className="blood-circulation__capillary"><p>Pertukaran zat<br />di kapiler</p><img src={capillaryArt} alt="Ilustrasi jaringan kapiler" /></div>}
      </section>

      <section className="blood-circulation__tabs" role="tablist" aria-label="Pilih perjalanan darah">
        <button type="button" role="tab" aria-selected={mode === 'lungs'} data-testid="blood-circulation-tab-lungs" onClick={() => selectMode('lungs')}><img src={lungsIconArt} alt="" />Ke Paru-paru</button>
        <button type="button" role="tab" aria-selected={mode === 'body'} data-testid="blood-circulation-tab-body" onClick={() => selectMode('body')}><img src={personIconArt} alt="" />Ke Seluruh Tubuh</button>
      </section>

      <aside className="blood-circulation__info" aria-live="polite"><h2>{copy.panelTitle}</h2><p>{copy.intro}</p>{mode === 'lungs' && <div className="blood-circulation__mini-flow"><img src={lungsArt} alt="" /><img className="blood-circulation__mini-arrow" src={arrowBlueArt} alt="" /><img src={heartArt} alt="" /></div>}<h3>Keterangan Warna Darah</h3><div className="blood-circulation__legend blood-circulation__legend--red"><img src={redCellArt} alt="" /><p>Darah kaya oksigen<small>(lebih banyak O<sub>2</sub>)</small></p></div><div className="blood-circulation__legend blood-circulation__legend--blue"><img src={blueCellArt} alt="" /><p>Darah rendah oksigen<small>(lebih banyak CO<sub>2</sub>)</small></p></div>{mode === 'body' && <div className="blood-circulation__fact"><img src={lightbulbArt} alt="" /><p><strong>Tahukah Kamu?</strong>Dalam satu menit, jantung dapat memompa sekitar 5 liter darah ke seluruh tubuh saat istirahat.</p></div>}</aside>

      {!simulationMode && <button className="blood-circulation__bottom-back" type="button" onClick={onBack}><ArrowLeft aria-hidden="true" />Sebelumnya</button>}
      <button className="blood-circulation__next" type="button" data-testid="blood-circulation-next-button" onClick={onComplete}>{simulationMode ? 'Selesaikan Simulasi' : 'Selanjutnya'}<ArrowRight aria-hidden="true" /></button>
    </div>
  </main>
}
