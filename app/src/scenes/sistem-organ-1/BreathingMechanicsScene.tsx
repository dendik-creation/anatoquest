import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useGlobalAudio } from '../../audio/GlobalAudio'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Lightbulb, Play } from 'lucide-react'

import backgroundArt from '../../assets/02_scene/05_sistem_organ_1/backgrounds/00_background.png'
import bodyArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.3/10_body_skeleton_chest.png'
import headArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.3/11_head_neck_cross_section.png'
import bronchiArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.3/12_bronchi_tree_center.png'
import leftLungArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.3/15_lung_left.png'
import rightLungArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.3/16_lung_right.png'
import diaphragmArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.3/08_diaphragm.png'
import alveoliArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.3/09_alveoli_cluster.png'
import capillaryArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.3/23_capillary_mesh_purple.png'
import bgmOffArt from '../../assets/01_reusable/buttons/btn_bgm_off.png'
import bgmOnArt from '../../assets/01_reusable/buttons/btn_bgm_on.png'
import homeArt from '../../assets/01_reusable/buttons/btn_home.png'
import { useStageCoverScale } from '../../hooks/useStageCoverScale'
import './BreathingMechanicsScene.css'

const DESIGN_WIDTH = 1920
const DESIGN_HEIGHT = 1080
const SAFE_WIDTH = 1860
const SAFE_HEIGHT = 1046

type BreathingPhase = 'inspirasi' | 'ekspirasi'

const PHASE_COPY = {
  inspirasi: {
    title: 'Inspirasi',
    lead: 'Udara masuk ke dalam paru-paru.',
    steps: ['Udara masuk melalui hidung dan saluran pernapasan.', 'Rongga dada membesar.', 'Paru-paru mengembang.', 'Diafragma turun.'],
    air: 'Udara masuk',
    lungs: 'Paru-paru mengembang',
    diaphragm: 'Diafragma turun',
  },
  ekspirasi: {
    title: 'Ekspirasi',
    lead: 'Udara keluar dari paru-paru.',
    steps: ['Udara keluar melalui saluran pernapasan dan hidung.', 'Rongga dada mengecil.', 'Paru-paru mengempis.', 'Diafragma naik.'],
    air: 'Udara keluar',
    lungs: 'Paru-paru mengempis',
    diaphragm: 'Diafragma naik',
  },
} as const

type BreathingMechanicsSceneProps = {
  onBackToHome?: () => void
  onBack?: () => void
  onComplete?: () => void
  simulationMode?: boolean
  transitionState?: 'entering' | 'entered' | 'exiting'
}

export function BreathingMechanicsScene({ onBackToHome, onBack, onComplete, simulationMode = false, transitionState = 'entered' }: BreathingMechanicsSceneProps) {
  const scale = useStageCoverScale(DESIGN_WIDTH, DESIGN_HEIGHT, SAFE_WIDTH, SAFE_HEIGHT)
  const { audioOn, toggleAudio } = useGlobalAudio()
  const [phase, setPhase] = useState<BreathingPhase>('inspirasi')
  const [isPlaying, setIsPlaying] = useState(false)
  const timers = useRef<number[]>([])
  const style = { '--stage-scale': scale } as CSSProperties
  const copy = PHASE_COPY[phase]

  const clearCycle = () => {
    timers.current.forEach((timer) => window.clearTimeout(timer))
    timers.current = []
  }

  useEffect(() => clearCycle, [])

  const selectPhase = (next: BreathingPhase) => {
    clearCycle()
    setIsPlaying(false)
    setPhase(next)
  }

  const playCycle = () => {
    clearCycle()
    const returnPhase = phase
    setIsPlaying(true)
    setPhase('inspirasi')
    timers.current = [
      window.setTimeout(() => setPhase('ekspirasi'), 3200),
      window.setTimeout(() => {
        setPhase(returnPhase)
        setIsPlaying(false)
        timers.current = []
      }, 6500),
    ]
  }

  return (
    <main className="breathing-mechanics" data-testid="breathing-mechanics-scene" data-microscene="5.3" data-transition={transitionState} data-phase={phase} data-playing={isPlaying} style={style} aria-labelledby="breathing-mechanics-heading">
      <div className="breathing-mechanics__stage">
        <img className="breathing-mechanics__background" src={backgroundArt} alt="" aria-hidden="true" />
        <button className="breathing-mechanics__icon breathing-mechanics__home" type="button" aria-label="Kembali ke Beranda" data-testid="breathing-mechanics-home-button" onClick={onBackToHome}><img src={homeArt} alt="" /></button>

        <button className="breathing-mechanics__icon breathing-mechanics__audio" type="button" aria-label={audioOn ? 'Matikan musik latar' : 'Aktifkan musik latar'} aria-pressed={audioOn} data-testid="breathing-mechanics-audio-button" onClick={() => toggleAudio()}><img src={audioOn ? bgmOnArt : bgmOffArt} alt="" /></button>

        <header className="breathing-mechanics__header">
          <p>Materi 2 - Sistem Organ Tubuh (3 / 8)</p>
          <h1 id="breathing-mechanics-heading">Bagaimana Kita Bernapas?</h1>
          <span>Amati perubahan paru-paru dan diafragma saat udara masuk dan keluar.</span>
        </header>

        <section className="breathing-mechanics__workspace">
          <section className="breathing-mechanics__lesson" aria-label="Tahapan pernapasan">
            <div className="breathing-mechanics__tabs" role="tablist" aria-label="Pilih proses pernapasan">
              {(['inspirasi', 'ekspirasi'] as const).map((item) => <button key={item} type="button" role="tab" aria-selected={phase === item} data-testid={`breathing-tab-${item}`} onClick={() => selectPhase(item)}>{PHASE_COPY[item].title}</button>)}
            </div>
            <h2>{copy.title}</h2>
            <p className="breathing-mechanics__lead">{copy.lead}</p>
            <ol>{copy.steps.map((step, index) => <li key={step}><span>{index + 1}</span><p>{step}</p></li>)}</ol>
            <button className={`breathing-mechanics__play breathing-mechanics__play--${phase}`} type="button" data-testid="breathing-play-button" aria-pressed={isPlaying} onClick={playCycle}><span><Play color='green' aria-hidden="true" /></span><p><strong>{isPlaying ? 'Animasi diputar' : 'Putar Animasi'}</strong><small>Lihat proses inspirasi dan ekspirasi.</small></p></button>
          </section>

          <section className="breathing-mechanics__visual" aria-label={`Ilustrasi ${copy.title.toLowerCase()}`}>
            <img className="breathing-mechanics__torso" src={bodyArt} alt="Ilustrasi torso manusia" />
            <img className="breathing-mechanics__head" src={headArt} alt="" aria-hidden="true" />
            <div className="breathing-mechanics__air breathing-mechanics__air--upper"><span>{copy.air}</span>{phase === 'inspirasi' ? <ArrowDown aria-hidden="true" /> : <ArrowUp aria-hidden="true" />}</div>
            <img className="breathing-mechanics__bronchi" src={bronchiArt} alt="" aria-hidden="true" />
            <img className="breathing-mechanics__lung breathing-mechanics__lung--left" src={leftLungArt} alt="" aria-hidden="true" />
            <img className="breathing-mechanics__lung breathing-mechanics__lung--right" src={rightLungArt} alt="" aria-hidden="true" />
            <div className="breathing-mechanics__lungs-label"><span>{copy.lungs}</span></div>
            <img className="breathing-mechanics__diaphragm" src={diaphragmArt} alt="" aria-hidden="true" />
            <div className="breathing-mechanics__diaphragm-label"><span>{copy.diaphragm}</span>{phase === 'inspirasi' ? <ArrowDown aria-hidden="true" /> : <ArrowUp aria-hidden="true" />}</div>
          </section>

          <aside className="breathing-mechanics__gas" aria-labelledby="gas-exchange-heading">
            <h2 id="gas-exchange-heading">Pertukaran Gas di Alveolus</h2>
            <p>Di dalam paru-paru, oksigen dari udara masuk ke dalam darah, sementara karbon dioksida dari darah masuk ke alveolus untuk dikeluarkan.</p>
            <div className="breathing-mechanics__alveolus-art" aria-label="Ilustrasi alveolus, oksigen, karbon dioksida, dan kapiler darah">
              <img src={alveoliArt} alt="" aria-hidden="true" />
              <img src={capillaryArt} alt="" aria-hidden="true" />
              <span className="breathing-mechanics__alveolus-label">Alveolus</span>
              <span className="breathing-mechanics__gas-particle breathing-mechanics__gas-particle--oxygen">O<sub>2</sub><small>masuk ke darah</small></span>
              <span className="breathing-mechanics__gas-particle breathing-mechanics__gas-particle--carbon">CO<sub>2</sub><small>menuju alveolus</small></span>
              <span className="breathing-mechanics__capillary-label">Kapiler darah</span>
            </div>
            <div className="breathing-mechanics__gas-note"><Lightbulb aria-hidden="true" /><p>Pertukaran gas terjadi di alveolus yang dikelilingi oleh pembuluh darah kapiler.</p></div>
          </aside>
        </section>

        {!simulationMode && <button className="breathing-mechanics__bottom-back" type="button" data-testid="breathing-mechanics-back-button" onClick={onBack}><ArrowLeft aria-hidden="true" />Sebelumnya</button>}
        <button className="breathing-mechanics__next" type="button" data-testid="breathing-mechanics-next-button" onClick={onComplete}>{simulationMode ? 'Selesaikan Simulasi' : 'Lanjut: Latihan Jalur Udara'}<ArrowRight aria-hidden="true" /></button>
      </div>
    </main>
  )
}
