import { useState, type CSSProperties } from 'react'
import { Check, ChevronRight, MapPin, MousePointerClick, Settings } from 'lucide-react'

import backgroundArt from '../../assets/02_scene/05_sistem_organ_1/backgrounds/00_background.png'
import noseArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.2/01_nose-clean.png'
import pharynxArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.2/02_pharynx-clean.png'
import larynxArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.2/03_larynx-clean.png'
import tracheaArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.2/04_trachea_rings-clean.png'
import bronchiArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.2/05_bronchi_tree-clean.png'
import lungsArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.2/06_lungs-clean.png'
import bodyArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.2/08_body_respiratory_full-clean.png'
import backArt from '../../assets/01_reusable/buttons/btn_back.png'
import bgmOffArt from '../../assets/01_reusable/buttons/btn_bgm_off.png'
import bgmOnArt from '../../assets/01_reusable/buttons/btn_bgm_on.png'
import homeArt from '../../assets/01_reusable/buttons/btn_home.png'
import { HelpButton } from '../../components/HelpButton'
import { useStageCoverScale } from '../../hooks/useStageCoverScale'
import './RespiratorySystemScene.css'

const DESIGN_WIDTH = 1920
const DESIGN_HEIGHT = 1080
const SAFE_WIDTH = 1860
const SAFE_HEIGHT = 1046

// Centre points are measured from the top-left of the anatomy panel. They map
// to the coloured organ markers in the source illustration, not its callout pills.
const PARTS = [
  { id: 'hidung', title: 'Rongga Hidung', location: 'Di bagian paling depan saluran pernapasan.', function: 'Menyaring, menghangatkan, dan melembapkan udara.', art: noseArt, hotspot: { x: 378, y: 84 } },
  { id: 'faring', title: 'Faring', location: 'Di belakang rongga hidung dan mulut.', function: 'Menyalurkan udara menuju laring.', art: pharynxArt, hotspot: { x: 376, y: 140 } },
  { id: 'laring', title: 'Laring', location: 'Di antara faring dan trakea.', function: 'Mengatur aliran udara dan menghasilkan suara.', art: larynxArt, hotspot: { x: 333, y: 186 } },
  { id: 'trakea', title: 'Trakea', location: 'Di antara laring dan bronkus.', function: 'Menyalurkan udara menuju bronkus.', art: tracheaArt, hotspot: { x: 328, y: 253 } },
  { id: 'bronkus', title: 'Bronkus', location: 'Cabang trakea yang masuk ke paru-paru.', function: 'Menyalurkan udara ke tiap paru-paru.', art: bronchiArt, hotspot: { x: 270, y: 354 } },
  { id: 'paru', title: 'Paru-paru', location: 'Di rongga dada.', function: 'Tempat pertukaran oksigen dan karbon dioksida.', art: lungsArt, hotspot: { x: 415, y: 439 } },
] as const

type PartId = (typeof PARTS)[number]['id']

type RespiratorySystemSceneProps = {
  onBackToHome?: () => void
  onBack?: () => void
  onComplete?: () => void
  transitionState?: 'entering' | 'entered' | 'exiting'
}

export function RespiratorySystemScene({ onBackToHome, onBack, onComplete, transitionState = 'entered' }: RespiratorySystemSceneProps) {
  const scale = useStageCoverScale(DESIGN_WIDTH, DESIGN_HEIGHT, SAFE_WIDTH, SAFE_HEIGHT)
  const [audioOn, setAudioOn] = useState(true)
  const [selected, setSelected] = useState<PartId>('trakea')
  const [explored, setExplored] = useState<Set<PartId>>(() => new Set())
  const [showHint, setShowHint] = useState(false)
  const active = PARTS.find((part) => part.id === selected) ?? PARTS[3]
  const isComplete = explored.size === PARTS.length
  const style = { '--stage-scale': scale } as CSSProperties

  const selectPart = (part: PartId) => {
    setSelected(part)
    setExplored((current) => new Set(current).add(part))
  }

  return (
    <main className="respiratory-system" data-testid="respiratory-system-scene" data-microscene="5.2" data-transition={transitionState} style={style} aria-labelledby="respiratory-system-heading">
      <div className="respiratory-system__stage">
        <img className="respiratory-system__background" src={backgroundArt} alt="" aria-hidden="true" />

        <button className="respiratory-system__icon respiratory-system__home" type="button" aria-label="Kembali ke Beranda" data-testid="respiratory-system-home-button" onClick={onBackToHome}><img src={homeArt} alt="" /></button>
        <button className="respiratory-system__icon respiratory-system__top-back" type="button" aria-label="Kembali ke materi sebelumnya" data-testid="respiratory-system-top-back-button" onClick={onBack}><img src={backArt} alt="" /></button>
        <button className="respiratory-system__icon respiratory-system__audio" type="button" aria-label={audioOn ? 'Matikan musik latar' : 'Aktifkan musik latar'} aria-pressed={audioOn} data-testid="respiratory-system-audio-button" onClick={() => setAudioOn((value) => !value)}><img src={audioOn ? bgmOnArt : bgmOffArt} alt="" /></button>
        <HelpButton className="respiratory-system__icon respiratory-system__help" label="Bantuan sistem pernapasan" data-testid="respiratory-system-help-button" onClick={() => setShowHint((value) => !value)} />

        <header className="respiratory-system__header">
          <p>Materi 2 - Sistem Organ Tubuh (2 / 8)</p>
          <h1 id="respiratory-system-heading">Kenali Jalur Udara dalam Tubuh</h1>
          <span>Pilih bagian sistem pernapasan untuk mengenal nama, lokasi, dan fungsi dasarnya.</span>
        </header>

        <section className="respiratory-system__workspace">
          <aside className="respiratory-system__panel" aria-label="Bagian sistem pernapasan">
            <h2>Bagian Sistem Pernapasan</h2>
            <div className="respiratory-system__parts">
              {PARTS.map((part, index) => {
                const visited = explored.has(part.id)
                return <button key={part.id} type="button" className="respiratory-system__part" data-selected={part.id === selected} data-visited={visited} data-testid={`respiratory-part-${part.id}`} aria-pressed={part.id === selected} onClick={() => selectPart(part.id)}>
                  <span className="respiratory-system__number">{visited ? <Check aria-label={`Bagian ${index + 1} telah dipelajari`} /> : index + 1}</span>
                  <img className={`respiratory-system__sprite respiratory-system__sprite--${part.id}`} src={part.art} alt="" aria-hidden="true" />
                  <span>{part.title}</span><ChevronRight aria-hidden="true" />
                </button>
              })}
            </div>

            <section className="respiratory-system__part-information" aria-live="polite" data-testid="respiratory-part-information">
              <h3>Informasi Bagian</h3>
              <div className="respiratory-system__info-card">
                <img className={`respiratory-system__info-sprite respiratory-system__info-sprite--${active.id}`} src={active.art} alt="" aria-hidden="true" />
                <div>
                  <h4>{active.title}</h4>
                  <p><MapPin aria-hidden="true" /><span><strong>Lokasi</strong>{active.location}</span></p>
                  <p><Settings aria-hidden="true" /><span><strong>Fungsi</strong>{active.function}</span></p>
                </div>
              </div>
            </section>
          </aside>

          <section className="respiratory-system__anatomy" aria-label="Ilustrasi sistem pernapasan">
            <div className="respiratory-system__body" aria-hidden="true" style={{ '--organ-x': `${active.hotspot.x}px`, '--organ-y': `${active.hotspot.y}px` } as CSSProperties}><img src={bodyArt} alt="" /></div>
            {PARTS.map((part) => <button key={part.id} type="button" className="respiratory-system__hotspot" data-testid={`respiratory-hotspot-${part.id}`} aria-label={`Pilih ${part.title}`} aria-pressed={part.id === selected} style={{ left: `${part.hotspot.x}px`, top: `${part.hotspot.y}px` }} onClick={() => selectPart(part.id)}><span className="sr-only">{part.title}</span></button>)}
            <aside className="respiratory-system__instruction" data-testid="respiratory-instruction"><MousePointerClick aria-hidden="true" /><span>{isComplete ? '6/6 bagian telah dipelajari' : 'Klik bagian organ untuk melihat informasinya.'}</span></aside>
          </section>
        </section>

        {showHint && <div className="respiratory-system__hint" role="status">Pilih nama bagian di kiri atau label pada ilustrasi tubuh.</div>}
        <button className="respiratory-system__bottom-back" type="button" data-testid="respiratory-system-back-button" onClick={onBack}><ChevronRight aria-hidden="true" />Sebelumnya</button>
        <button className="respiratory-system__next" type="button" disabled={!isComplete} data-testid="respiratory-system-next-button" onClick={onComplete}>Lanjutkan<ChevronRight aria-hidden="true" /></button>
      </div>
    </main>
  )
}
