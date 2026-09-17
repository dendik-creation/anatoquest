import { useState, type CSSProperties, type DragEvent } from 'react'
import { Check, GripVertical, Lightbulb, RotateCcw } from 'lucide-react'

import backgroundArt from '../../assets/02_scene/05_sistem_organ_1/backgrounds/00_background.png'
import torsoArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.3/10_body_skeleton_chest.png'
import headArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.3/11_head_neck_cross_section.png'
import bronchiTreeArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.3/12_bronchi_tree_center.png'
import leftLungArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.3/15_lung_left.png'
import rightLungArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.3/16_lung_right.png'
import diaphragmArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.3/08_diaphragm.png'
import noseArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.2/01_nose-clean.png'
import pharynxArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.2/02_pharynx-clean.png'
import larynxArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.2/03_larynx-clean.png'
import tracheaArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.2/04_trachea_rings-clean.png'
import bronchiArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.2/05_bronchi_tree-clean.png'
import lungsArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.2/06_lungs-clean.png'
import backArt from '../../assets/01_reusable/buttons/btn_back.png'
import bgmOffArt from '../../assets/01_reusable/buttons/btn_bgm_off.png'
import bgmOnArt from '../../assets/01_reusable/buttons/btn_bgm_on.png'
import homeArt from '../../assets/01_reusable/buttons/btn_home.png'
import { HelpButton } from '../../components/HelpButton'
import { useStageCoverScale } from '../../hooks/useStageCoverScale'
import './AirwayOrderingScene.css'

const DESIGN_WIDTH = 1920
const DESIGN_HEIGHT = 1080
const SAFE_WIDTH = 1860
const SAFE_HEIGHT = 1046

const PARTS = [
  { id: 'hidung', title: 'Rongga Hidung', art: noseArt, point: { x: 337, y: 75 }, slot: { x: 433, y: 31 } },
  { id: 'faring', title: 'Faring', art: pharynxArt, point: { x: 332, y: 135 }, slot: { x: 420, y: 132 } },
  { id: 'laring', title: 'Laring', art: larynxArt, point: { x: 321, y: 207 }, slot: { x: 408, y: 226 } },
  { id: 'trakea', title: 'Trakea', art: tracheaArt, point: { x: 308, y: 329 }, slot: { x: 362, y: 326 } },
  { id: 'bronkus', title: 'Bronkus', art: bronchiArt, point: { x: 262, y: 432 }, slot: { x: 20, y: 399 } },
  { id: 'paru', title: 'Paru-paru', art: lungsArt, point: { x: 412, y: 538 }, slot: { x: 486, y: 512 } },
] as const

type PartId = (typeof PARTS)[number]['id']
type AirwayOrderingSceneProps = {
  onBackToHome?: () => void
  onBack?: () => void
  onComplete?: () => void
  transitionState?: 'entering' | 'entered' | 'exiting'
}

export function AirwayOrderingScene({ onBackToHome, onBack, onComplete, transitionState = 'entered' }: AirwayOrderingSceneProps) {
  const scale = useStageCoverScale(DESIGN_WIDTH, DESIGN_HEIGHT, SAFE_WIDTH, SAFE_HEIGHT)
  const [audioOn, setAudioOn] = useState(true)
  const [selected, setSelected] = useState<PartId | null>(null)
  const [placed, setPlaced] = useState<Partial<Record<PartId, PartId>>>({})
  const [notice, setNotice] = useState('')
  const [showHint, setShowHint] = useState(false)
  const style = { '--stage-scale': scale } as CSSProperties
  const count = Object.keys(placed).length
  const complete = count === PARTS.length

  const reset = () => {
    setSelected(null)
    setPlaced({})
    setNotice('')
  }

  const tryPlace = (slotId: PartId, incoming: PartId | null) => {
    if (!incoming || placed[slotId]) return
    if (incoming === slotId) {
      setPlaced((current) => ({ ...current, [slotId]: incoming }))
      setSelected(null)
      setNotice('')
      return
    }
    setSelected(null)
    setNotice('Bagian ini belum sesuai. Coba lagi!')
  }

  const dragStart = (event: DragEvent<HTMLButtonElement>, id: PartId) => {
    event.dataTransfer.setData('text/plain', id)
    event.dataTransfer.effectAllowed = 'move'
    setSelected(id)
  }

  return (
    <main className="airway-ordering" data-testid="airway-ordering-scene" data-microscene="5.4" data-transition={transitionState} style={style} aria-labelledby="airway-ordering-heading">
      <div className="airway-ordering__stage">
        <img className="airway-ordering__background" src={backgroundArt} alt="" aria-hidden="true" />
        <button className="airway-ordering__icon airway-ordering__home" type="button" aria-label="Kembali ke Beranda" onClick={onBackToHome}><img src={homeArt} alt="" /></button>
        <button className="airway-ordering__icon airway-ordering__top-back" type="button" aria-label="Kembali ke materi sebelumnya" onClick={onBack}><img src={backArt} alt="" /></button>
        <button className="airway-ordering__icon airway-ordering__audio" type="button" aria-label={audioOn ? 'Matikan musik latar' : 'Aktifkan musik latar'} aria-pressed={audioOn} onClick={() => setAudioOn((value) => !value)}><img src={audioOn ? bgmOnArt : bgmOffArt} alt="" /></button>
        <HelpButton className="airway-ordering__icon airway-ordering__help" label="Bantuan latihan jalur udara" onClick={() => setShowHint((value) => !value)} />

        <header className="airway-ordering__header">
          <p>Materi 2 - Sistem Organ Tubuh (4 / 8)</p>
          <h1 id="airway-ordering-heading">Susun Jalur Udara</h1>
          <span>Susun bagian sistem pernapasan sesuai urutan yang dilalui udara hingga mencapai paru-paru.</span>
        </header>

        <aside className="airway-ordering__cards" aria-label="Kartu Bagian Organ">
          <h2>Kartu Bagian Organ</h2>
          <p>Seret kartu ke posisi yang tepat, atau<br />pilih kartu lalu pilih slot tujuan.</p>
          <div className="airway-ordering__card-list">
            {PARTS.map((part) => {
              const isPlaced = Object.values(placed).includes(part.id)
              return <button key={part.id} type="button" draggable={!isPlaced} className="airway-ordering__card" data-testid={`airway-card-${part.id}`} data-selected={selected === part.id} disabled={isPlaced} onDragStart={(event) => dragStart(event, part.id)} onClick={() => setSelected((current) => current === part.id ? null : part.id)}>
                <img src={part.art} alt="" aria-hidden="true" /><span>{part.title}</span><GripVertical aria-hidden="true" />
              </button>
            })}
          </div>
        </aside>

        <section className="airway-ordering__diagram" aria-label="Diagram jalur udara">
          <div className="airway-ordering__halo" />
          <div className="airway-ordering__body" aria-label="Ilustrasi sistem pernapasan manusia">
            <img className="airway-ordering__torso" src={torsoArt} alt="" />
            <img className="airway-ordering__head" src={headArt} alt="" />
            <img className="airway-ordering__bronchi" src={bronchiTreeArt} alt="" />
            <img className="airway-ordering__lung airway-ordering__lung--left" src={leftLungArt} alt="" />
            <img className="airway-ordering__lung airway-ordering__lung--right" src={rightLungArt} alt="" />
            <img className="airway-ordering__diaphragm" src={diaphragmArt} alt="" />
          </div>
          <svg className="airway-ordering__connectors" viewBox="0 0 684 666" aria-hidden="true">
            {PARTS.map((part) => <g key={`${part.id}-line`}><line x1={part.point.x} y1={part.point.y} x2={part.slot.x + 25} y2={part.slot.y + 33} /><circle cx={part.point.x} cy={part.point.y} r="7" /></g>)}
          </svg>
          {PARTS.map((part, index) => {
            const placement = placed[part.id]
            const placedPart = placement ? PARTS.find((entry) => entry.id === placement) : undefined
            return <button key={part.id} type="button" className="airway-ordering__slot" data-testid={`airway-slot-${part.id}`} data-filled={Boolean(placement)} style={{ left: part.slot.x, top: part.slot.y }} onDragOver={(event) => event.preventDefault()} onDrop={(event) => tryPlace(part.id, event.dataTransfer.getData('text/plain') as PartId)} onClick={() => tryPlace(part.id, selected)} aria-label={`Slot ${index + 1}: ${part.title}`}>
              <span className="airway-ordering__slot-number">{index + 1}</span>
              {placedPart && <span className="airway-ordering__slot-answer"><img src={placedPart.art} alt="" />{placedPart.title}</span>}
            </button>
          })}
        </section>

        <aside className="airway-ordering__help-panel" aria-label="Petunjuk">
          <h2><Lightbulb aria-hidden="true" />Petunjuk</h2>
          <ol>
            <li><span>1</span><p>Amati jalur udara pada gambar.</p></li>
            <li><span>2</span><p>Seret kartu dari sebelah kiri ke slot yang sesuai, atau klik kartu lalu klik slot tujuan.</p></li>
            <li><span>3</span><p>Setelah semua bagian terpasang, tekan tombol Periksa Jawaban.</p></li>
          </ol>
        </aside>

        <section className="airway-ordering__controls" aria-label="Status latihan">
          <div><strong>{count} dari 6 ditempatkan</strong><span className="airway-ordering__dots" aria-label={`${count} dari 6 jawaban ditempatkan`}>{PARTS.map((part, index) => <i key={part.id} data-active={index < count} />)}</span></div>
          <button type="button" data-testid="airway-reset-button" onClick={reset}><RotateCcw aria-hidden="true" />Atur Ulang</button>
          <button type="button" data-testid="airway-check-button" disabled={!complete} onClick={onComplete}><Check aria-hidden="true" />Periksa Jawaban</button>
        </section>
        {notice && <p className="airway-ordering__notice" role="status">{notice}</p>}
        {showHint && <p className="airway-ordering__hint" role="status">Urutannya adalah rongga hidung, faring, laring, trakea, bronkus, lalu paru-paru.</p>}
        <button className="airway-ordering__bottom-back" type="button" onClick={onBack}><span>‹</span>Sebelumnya</button>
      </div>
    </main>
  )
}
