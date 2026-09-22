import { useEffect, useState, type CSSProperties } from 'react'
import { ArrowLeft, ArrowRight, ChevronRight, CircleDot, HeartPulse, Lightbulb, ShieldCheck, Wind, X } from 'lucide-react'

import backgroundArt from '../../assets/02_scene/05_sistem_organ_1/backgrounds/00_background.png'
import anatomyArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.1/full-anatomy-with-callouts.png'
import heartArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.1/heart.png'
import lungsArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.1/lungs.png'
import lymphArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.1/lymphatic-system.png'
import backArt from '../../assets/01_reusable/buttons/btn_back.png'
import bgmOffArt from '../../assets/01_reusable/buttons/btn_bgm_off.png'
import bgmOnArt from '../../assets/01_reusable/buttons/btn_bgm_on.png'
import homeArt from '../../assets/01_reusable/buttons/btn_home.png'
import { HelpButton } from '../../components/HelpButton'
import { useStageCoverScale } from '../../hooks/useStageCoverScale'
import { BreathingMechanicsScene } from './BreathingMechanicsScene'
import { CirculatorySystemScene } from './CirculatorySystemScene'
import { BloodCirculationScene } from './BloodCirculationScene'
import { LymphaticSystemScene } from './LymphaticSystemScene'
import { LymphFlowScene } from './LymphFlowScene'
import { RespiratorySystemScene } from './RespiratorySystemScene'
import { AirwayOrderingScene } from './AirwayOrderingScene'
import './SistemOrganScene.css'

const DESIGN_WIDTH = 1920
const DESIGN_HEIGHT = 1080
const SAFE_WIDTH = 1860
const SAFE_HEIGHT = 1046

type SystemId = 'pernapasan' | 'sirkulasi' | 'limfatik'

const SYSTEMS = [
  {
    id: 'pernapasan', title: 'Sistem Pernapasan', body: 'Mengambil oksigen (O₂) dari udara dan\nmengeluarkan karbon dioksida (CO₂) dari tubuh.', art: lungsArt, tone: 'green', tag: 'Pernapasan', short: 'Sistem Pernapasan',
    details: [['Peran utama', 'Pertukaran gas'], ['Organ utama', 'Saluran pernapasan & paru-paru'], ['Singkatnya', 'Oksigen masuk, karbon dioksida keluar.']],
  },
  {
    id: 'sirkulasi', title: 'Jantung & Pembuluh Darah', body: 'Mengedarkan darah, oksigen, dan nutrisi ke seluruh\ntubuh serta membawa zat sisa.', art: heartArt, tone: 'red', tag: 'Sirkulasi', short: 'Jantung & Pembuluh Darah',
    details: [['Peran utama', 'Transportasi dalam tubuh'], ['Organ utama', 'Jantung & pembuluh darah'], ['Singkatnya', 'Darah mengantarkan oksigen dan nutrisi ke seluruh tubuh.']],
  },
  {
    id: 'limfatik', title: 'Sistem Limfatik', body: 'Menjaga keseimbangan cairan tubuh dan membantu\npertahanan tubuh terhadap infeksi.', art: lymphArt, tone: 'blue', tag: 'Limfatik', short: 'Sistem Limfatik',
    details: [['Peran utama', 'Keseimbangan cairan & pertahanan tubuh'], ['Komponen utama', 'Pembuluh limfa, kelenjar limfa & organ limfatik'], ['Singkatnya', 'Membantu mengatur cairan dan melindungi tubuh.']],
  },
] as const

type SistemOrganSceneProps = {
  onBackToHome?: () => void
  onBack?: () => void
  onComplete?: () => void
  simulationMode?: boolean
  transitionState?: 'entering' | 'entered' | 'exiting'
}

function SistemOrganOverviewScene({ onBackToHome, onBack, onComplete, transitionState = 'entered' }: SistemOrganSceneProps) {
  const scale = useStageCoverScale(DESIGN_WIDTH, DESIGN_HEIGHT, SAFE_WIDTH, SAFE_HEIGHT)
  const [audioOn, setAudioOn] = useState(true)
  const [selected, setSelected] = useState<SystemId | null>(null)
  const [showHint, setShowHint] = useState(false)
  const active = SYSTEMS.find((system) => system.id === selected) ?? SYSTEMS[0]
  const DetailIcon = active.id === 'pernapasan' ? Wind : active.id === 'sirkulasi' ? HeartPulse : ShieldCheck
  const style = { '--stage-scale': scale } as CSSProperties

  return (
    <main className="sistem-organ" data-testid="sistem-organ-scene" data-microscene="5.1" data-transition={transitionState} style={style} aria-labelledby="sistem-organ-heading">
      <div className="sistem-organ__stage" data-testid="sistem-organ-stage">
        <img className="sistem-organ__background" src={backgroundArt} alt="" aria-hidden="true" />

        <button className="sistem-organ__icon sistem-organ__home" type="button" aria-label="Kembali ke Beranda" data-testid="sistem-organ-home-button" onClick={onBackToHome}><img src={homeArt} alt="" /></button>
        <button className="sistem-organ__icon sistem-organ__top-back" type="button" aria-label="Kembali ke materi sebelumnya" data-testid="sistem-organ-top-back-button" onClick={onBack}><img src={backArt} alt="" /></button>
        <button className="sistem-organ__icon sistem-organ__audio" type="button" aria-label={audioOn ? 'Matikan musik latar' : 'Aktifkan musik latar'} aria-pressed={audioOn} data-testid="sistem-organ-audio-button" onClick={() => setAudioOn((value) => !value)}><img src={audioOn ? bgmOnArt : bgmOffArt} alt="" /></button>
        <HelpButton className="sistem-organ__icon sistem-organ__help" label="Bantuan materi sistem organ" data-testid="sistem-organ-help-button" onClick={() => setShowHint((value) => !value)} />

        <header className="sistem-organ__header">
          <p>Materi 2 - Sistem Organ Tubuh (1/8)</p>
          <h1 id="sistem-organ-heading">Kenali Tiga Sistem Organ Tubuh</h1>
          <span>Temukan peran sistem pernapasan, peredaran darah, dan limfatik sebelum mempelajarinya lebih dalam.</span>
        </header>

        <section className="sistem-organ__content">
          <div className="sistem-organ__list" aria-label="Pilihan sistem organ">
            <div className="sistem-organ__instruction"><Lightbulb aria-hidden="true" /><span>Klik setiap sistem untuk melihat penjelasan singkat.</span></div>
            {SYSTEMS.map((system) => (
              <button key={system.id} type="button" className={`sistem-organ__card sistem-organ__card--${system.tone}`} data-selected={selected === system.id} data-testid={`sistem-organ-selector-${system.id}`} aria-pressed={selected === system.id} onClick={() => setSelected(system.id)}>
                <span className="sistem-organ__art"><img src={system.art} alt="" /></span>
                <span className="sistem-organ__card-copy"><strong>{system.title}</strong><span>{system.body.split('\n').map((line) => <span key={line}>{line}<br /></span>)}</span></span>
                <span className="sistem-organ__card-next"><ChevronRight aria-hidden="true" /></span>
              </button>
            ))}
          </div>

          <section className="sistem-organ__anatomy" aria-label={`Ilustrasi ${active.short}`} data-testid="sistem-organ-explorer">
            <div className="sistem-organ__halo" />
            <img src={anatomyArt} alt="Ilustrasi tiga sistem organ tubuh manusia" />
            <span className="sr-only" data-testid="sistem-organ-active-system">{active.tag}</span>
          </section>

          <aside className="sistem-organ__together" data-testid="sistem-organ-info">
            <h2>Bekerja Bersama</h2>
            <p>Ketiga sistem ini saling berkaitan dan bekerja sama untuk menjaga tubuh tetap hidup, sehat, dan berfungsi dengan baik.</p>
            <hr />
            <div><Lightbulb aria-hidden="true" /><span>Kamu akan mempelajari setiap sistem secara lebih dalam pada halaman berikutnya.</span></div>
          </aside>

          <aside className={`sistem-organ__drawer sistem-organ__drawer--${active.tone}`} data-open={selected !== null} aria-hidden={selected === null} aria-label={`Ringkasan ${active.title}`} data-testid="sistem-organ-drawer">
            <div className="sistem-organ__drawer-heading">
              <span className="sistem-organ__drawer-icon"><DetailIcon aria-hidden="true" /></span>
              <div><p>Ringkasan Sistem</p><h2>{active.title}</h2></div>
              <button type="button" aria-label="Tutup ringkasan" data-testid="sistem-organ-drawer-close" tabIndex={selected === null ? -1 : 0} onClick={() => setSelected(null)}><X aria-hidden="true" /></button>
            </div>
            <p className="sistem-organ__drawer-intro">{active.body.replace('\n', ' ')}</p>
            <dl className="sistem-organ__drawer-details">
              {active.details.map(([label, value], index) => (
                <div key={label}>
                  <CircleDot aria-hidden="true" />
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                  <span className="sr-only">Informasi {index + 1}</span>
                </div>
              ))}
            </dl>
          </aside>
        </section>

        {showHint && <div className="sistem-organ__hint" role="status">Pilih salah satu kartu untuk menyorot sistem organ pada ilustrasi.</div>}
        <button className="sistem-organ__bottom-back" type="button" data-testid="sistem-organ-back-button" onClick={onBack}><ArrowLeft aria-hidden="true" />Sebelumnya</button>
        <div className="sistem-organ__next-label"><span><img src={lungsArt} alt="" /></span><p>Selanjutnya:<strong>Sistem Pernapasan</strong></p></div>
        <button className="sistem-organ__next" type="button" data-testid="sistem-organ-next-button" onClick={onComplete}>Mulai Eksplorasi<ArrowRight aria-hidden="true" /></button>
      </div>
    </main>
  )
}

export type SistemOrganMicroscene = '5.1' | '5.2' | '5.3' | '5.4' | '5.5' | '5.6' | '5.7' | '5.8'

const SISTEM_ORGAN_MICROSCENES: readonly SistemOrganMicroscene[] = ['5.1', '5.2', '5.3', '5.4', '5.5', '5.6', '5.7', '5.8']

type SistemOrganSceneWithDevJumpProps = SistemOrganSceneProps & {
  /** Dev-only testing shortcut; see App.tsx VITE_DEV_MICROSCENE. Defaults to '5.1'. */
  initialMicroscene?: SistemOrganMicroscene
}

export function SistemOrganScene({ initialMicroscene, ...props }: SistemOrganSceneWithDevJumpProps) {
  const [microscene, setMicroscene] = useState<SistemOrganMicroscene>(() =>
    initialMicroscene && SISTEM_ORGAN_MICROSCENES.includes(initialMicroscene) ? initialMicroscene : '5.1',
  )
  const [transitionState, setTransitionState] = useState<'entering' | 'entered' | 'exiting'>('entering')

  useEffect(() => {
    if (transitionState !== 'entering') return
    const timer = window.setTimeout(() => setTransitionState('entered'), 620)
    return () => window.clearTimeout(timer)
  }, [microscene, transitionState])

  const exitScene = (next: () => void) => {
    setTransitionState('exiting')
    window.setTimeout(next, 460)
  }

  const changeMicroscene = (next: SistemOrganMicroscene) => exitScene(() => {
    setMicroscene(next)
    setTransitionState('entering')
  })

  if (microscene === '5.3') {
    return <BreathingMechanicsScene {...props} simulationMode={props.simulationMode} transitionState={transitionState} onBack={() => props.simulationMode ? exitScene(() => props.onBack?.()) : changeMicroscene('5.2')} onBackToHome={() => exitScene(() => props.onBackToHome?.())} onComplete={() => props.simulationMode ? exitScene(() => props.onComplete?.()) : changeMicroscene('5.4')} />
  }

  if (microscene === '5.4') {
    return <AirwayOrderingScene {...props} transitionState={transitionState} onBack={() => changeMicroscene('5.3')} onBackToHome={() => exitScene(() => props.onBackToHome?.())} onComplete={() => changeMicroscene('5.5')} />
  }

  if (microscene === '5.5') {
    return <CirculatorySystemScene {...props} transitionState={transitionState} onBack={() => changeMicroscene('5.4')} onBackToHome={() => exitScene(() => props.onBackToHome?.())} onComplete={() => changeMicroscene('5.6')} />
  }

  if (microscene === '5.6') {
    return <BloodCirculationScene {...props} simulationMode={props.simulationMode} transitionState={transitionState} onBack={() => props.simulationMode ? exitScene(() => props.onBack?.()) : changeMicroscene('5.5')} onBackToHome={() => exitScene(() => props.onBackToHome?.())} onComplete={() => props.simulationMode ? exitScene(() => props.onComplete?.()) : changeMicroscene('5.7')} />
  }

  if (microscene === '5.7') {
    return <LymphaticSystemScene {...props} transitionState={transitionState} onBack={() => changeMicroscene('5.6')} onBackToHome={() => exitScene(() => props.onBackToHome?.())} onComplete={() => changeMicroscene('5.8')} />
  }

  if (microscene === '5.8') {
    return <LymphFlowScene {...props} transitionState={transitionState} onBack={() => changeMicroscene('5.7')} onBackToHome={() => exitScene(() => props.onBackToHome?.())} onComplete={() => exitScene(() => props.onComplete?.())} />
  }

  if (microscene === '5.2') {
    return <RespiratorySystemScene {...props} transitionState={transitionState} onBack={() => changeMicroscene('5.1')} onBackToHome={() => exitScene(() => props.onBackToHome?.())} onComplete={() => changeMicroscene('5.3')} />
  }

  return <SistemOrganOverviewScene {...props} transitionState={transitionState} onBack={() => exitScene(() => props.onBack?.())} onBackToHome={() => exitScene(() => props.onBackToHome?.())} onComplete={() => changeMicroscene('5.2')} />
}
