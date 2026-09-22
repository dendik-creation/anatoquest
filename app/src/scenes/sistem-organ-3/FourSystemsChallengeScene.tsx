import { useRef, useState, type CSSProperties, type DragEvent } from 'react'
import { useGlobalAudio } from '../../audio/GlobalAudio'
import { ArrowLeft, ArrowRight, Check, GripVertical, Lightbulb, RotateCcw } from 'lucide-react'

import backgroundArt from '../../assets/02_scene/07_sistem_organ_3/backgrounds/1.png'
import uterusArt from '../../assets/02_scene/07_sistem_organ_3/micro_scenes/7.1/02_uterus_reproduksi.png'
import muscleArt from '../../assets/02_scene/07_sistem_organ_3/micro_scenes/7.1/03_otot_muscle.png'
import boneArt from '../../assets/02_scene/07_sistem_organ_3/micro_scenes/7.1/04_tulang_bone.png'
import eyeArt from '../../assets/02_scene/07_sistem_organ_3/micro_scenes/7.4/indra/01_icon_mata_sederhana.png'
import earArt from '../../assets/02_scene/07_sistem_organ_3/micro_scenes/7.4/indra/02_icon_telinga_sederhana.png'
import noseArt from '../../assets/02_scene/07_sistem_organ_3/micro_scenes/7.4/indra/03_icon_hidung_sederhana.png'
import tongueArt from '../../assets/02_scene/07_sistem_organ_3/micro_scenes/7.4/indra/04_icon_lidah_sederhana.png'
import skinArt from '../../assets/02_scene/07_sistem_organ_3/micro_scenes/7.4/indra/05_icon_folikel_rambut_kulit.png'
import ovaryArt from '../../assets/02_scene/07_sistem_organ_3/micro_scenes/7.2/08_ovarium.png'
import thyroidArt from '../../assets/02_scene/07_sistem_organ_3/micro_scenes/7.4/endokrin/03_icon_tiroid.png'
import pancreasArt from '../../assets/02_scene/07_sistem_organ_3/micro_scenes/7.4/endokrin/04_icon_pankreas.png'
import adrenalArt from '../../assets/02_scene/07_sistem_organ_3/micro_scenes/7.4/endokrin/13_ginjal_kelenjar_adrenal_detail.png'
import bgmOffArt from '../../assets/01_reusable/buttons/btn_bgm_off.png'
import bgmOnArt from '../../assets/01_reusable/buttons/btn_bgm_on.png'
import homeArt from '../../assets/01_reusable/buttons/btn_home.png'
import { useSceneExitTransition } from '../../hooks/useSceneExitTransition'
import { useStageCoverScale } from '../../hooks/useStageCoverScale'
import './FourSystemsChallengeScene.css'

const DRAG_TYPE = 'application/x-anatoquest-four-systems'

const SYSTEMS = [
  { id: 'reproduksi', label: 'Sistem Reproduksi', copy: 'Menghasilkan sel reproduksi\ndan hormon reproduksi.', art: uterusArt, secondArt: undefined, tone: 'reproduction' },
  { id: 'otot-tulang', label: 'Sistem Otot & Tulang', copy: 'Memberikan bentuk tubuh,\nmenopang, dan memungkinkan\ngerakan.', art: boneArt, secondArt: muscleArt, tone: 'muscle' },
  { id: 'indra', label: 'Sistem Indra', copy: 'Menerima rangsangan dari\nlingkungan dan mengirimkan\ninformasi ke sistem saraf.', art: eyeArt, secondArt: earArt, tone: 'senses' },
  { id: 'endokrin', label: 'Sistem Endokrin', copy: 'Menghasilkan hormon yang\nmembantu mengatur fungsi\ntubuh.', art: thyroidArt, secondArt: pancreasArt, tone: 'endocrine' },
] as const

const ORGANS = [
  { id: 'mata', label: 'Mata', system: 'indra', art: eyeArt },
  { id: 'telinga', label: 'Telinga', system: 'indra', art: earArt },
  { id: 'hidung', label: 'Hidung', system: 'indra', art: noseArt },
  { id: 'lidah', label: 'Lidah', system: 'indra', art: tongueArt },
  { id: 'kulit', label: 'Kulit', system: 'indra', art: skinArt },
  { id: 'tiroid', label: 'Tiroid', system: 'endokrin', art: thyroidArt },
  { id: 'pankreas', label: 'Pankreas', system: 'endokrin', art: pancreasArt },
  { id: 'uterus', label: 'Uterus', system: 'reproduksi', art: uterusArt },
  { id: 'ovarium', label: 'Ovarium', system: 'reproduksi', art: ovaryArt },
  { id: 'otot-rangka', label: 'Otot Rangka', system: 'otot-tulang', art: muscleArt },
  { id: 'tulang', label: 'Tulang', system: 'otot-tulang', art: boneArt },
  { id: 'kelenjar-adrenal', label: 'Kelenjar Adrenal', system: 'endokrin', art: adrenalArt },
] as const

type SystemId = (typeof SYSTEMS)[number]['id']
type OrganId = (typeof ORGANS)[number]['id']
type Feedback = { tone: 'success' | 'error' | 'complete'; text: string; system?: SystemId } | null

type Props = { onBackToHome?: () => void; onBack?: () => void; onComplete?: () => void }

export function FourSystemsChallengeScene({ onBackToHome, onBack, onComplete }: Props) {
  const scale = useStageCoverScale(1920, 1080, 1860, 1046)
  const { audioOn, toggleAudio } = useGlobalAudio()
  const [selected, setSelected] = useState<OrganId | null>(null)
  const [placed, setPlaced] = useState<Partial<Record<OrganId, SystemId>>>({})
  const [feedback, setFeedback] = useState<Feedback>(null)
  const [dragging, setDragging] = useState<OrganId | null>(null)
  const draggedRef = useRef<OrganId | null>(null)
  const { isExiting, exitTo } = useSceneExitTransition()
  const count = Object.keys(placed).length
  const complete = count === ORGANS.length
  const style = { '--stage-scale': scale } as CSSProperties

  const isOrganId = (value: string): value is OrganId => ORGANS.some((organ) => organ.id === value)
  const choose = (id: OrganId) => {
    if (placed[id]) return
    setSelected((current) => current === id ? null : id)
    setFeedback(null)
  }
  const place = (id: OrganId | null, system: SystemId) => {
    if (!id || placed[id]) return
    const organ = ORGANS.find((item) => item.id === id)
    if (!organ) return
    setSelected(null)
    if (organ.system !== system) {
      setFeedback({ tone: 'error', system, text: 'Belum tepat. Perhatikan kembali fungsi organ tersebut.' })
      return
    }
    const nextCount = count + 1
    setPlaced((current) => ({ ...current, [id]: system }))
    setFeedback(nextCount === ORGANS.length
      ? { tone: 'complete', system, text: 'Tantangan Selesai! Kamu berhasil mengelompokkan semua organ.' }
      : { tone: 'success', system, text: `Tepat! ${organ.label} termasuk ${SYSTEMS.find((item) => item.id === system)?.label}.` })
  }
  const dragStart = (event: DragEvent<HTMLButtonElement>, id: OrganId) => {
    draggedRef.current = id
    setDragging(id)
    event.dataTransfer.setData(DRAG_TYPE, id)
    event.dataTransfer.setData('text/plain', id)
    event.dataTransfer.effectAllowed = 'move'
    setSelected(id)
  }
  const drop = (event: DragEvent<HTMLButtonElement>, system: SystemId) => {
    event.preventDefault()
    const id = draggedRef.current ?? event.dataTransfer.getData(DRAG_TYPE) ?? event.dataTransfer.getData('text/plain')
    draggedRef.current = null
    setDragging(null)
    place(isOrganId(id) ? id : null, system)
  }
  const reset = () => {
    draggedRef.current = null
    setDragging(null)
    setSelected(null)
    setPlaced({})
    setFeedback(null)
  }

  return <main className="four-systems-challenge" data-testid="four-systems-challenge-scene" data-microscene="7.5" data-complete={complete} data-count={count} data-exiting={isExiting} style={style} aria-labelledby="four-systems-challenge-heading">
    <div className="four-systems-challenge__stage">
      <img className="four-systems-challenge__background" src={backgroundArt} alt="" aria-hidden="true" />
      <button className="four-systems-challenge__icon four-systems-challenge__home" type="button" aria-label="Kembali ke Beranda" onClick={() => exitTo(onBackToHome)}><img src={homeArt} alt="" /></button>

      <button className="four-systems-challenge__icon four-systems-challenge__audio" type="button" aria-label={audioOn ? 'Matikan musik latar' : 'Aktifkan musik latar'} aria-pressed={audioOn} onClick={() => toggleAudio()}><img src={audioOn ? bgmOnArt : bgmOffArt} alt="" /></button>

      <header className="four-systems-challenge__header"><p>Materi 4 - Sistem Organ Tubuh (5/5)</p><h1 id="four-systems-challenge-heading">Tantangan Empat Sistem</h1><span>Kelompokkan setiap organ ke sistem tubuh yang tepat berdasarkan fungsi yang telah kamu pelajari.</span></header>

      <aside className="four-systems-challenge__source" aria-label="Organ yang tersedia">
        <h2>Organ yang Tersedia</h2><p>Seret organ ke sistem yang sesuai.</p>
        <div className="four-systems-challenge__organ-grid">
          {ORGANS.map((organ) => <button key={organ.id} type="button" className="four-systems-challenge__organ" data-testid={`four-systems-organ-${organ.id}`} data-selected={selected === organ.id} data-dragging={dragging === organ.id} data-placed={Boolean(placed[organ.id])} disabled={Boolean(placed[organ.id])} draggable={!placed[organ.id]} onClick={() => choose(organ.id)} onDragStart={(event) => dragStart(event, organ.id)} onDragEnd={() => { draggedRef.current = null; setDragging(null) }}><img src={organ.art} alt="" aria-hidden="true" /><span>{organ.label}</span><GripVertical aria-hidden="true" /></button>)}
        </div>
        <footer><span>i</span><p>Seret dan lepaskan organ ke salah satu sistem di sebelah kanan.</p></footer>
      </aside>

      <section className="four-systems-challenge__systems" aria-label="Sistem tubuh">
        {SYSTEMS.map((system) => {
          const systemOrgans = ORGANS.filter((organ) => placed[organ.id] === system.id)
          const isTarget = selected ? ORGANS.find((organ) => organ.id === selected)?.system === system.id : false
          return <article key={system.id} className={`four-systems-challenge__system four-systems-challenge__system--${system.tone}`} data-target={isTarget} data-error={feedback?.tone === 'error' && feedback.system === system.id}>
            <h2>{system.label}</h2><p>{system.copy.split('\n').map((line) => <span key={line}>{line}<br /></span>)}</p>
            <div className="four-systems-challenge__system-art"><img src={system.art} alt="" aria-hidden="true" />{system.secondArt && <img src={system.secondArt} alt="" aria-hidden="true" />}</div>
            <button type="button" className="four-systems-challenge__drop" data-testid={`four-systems-drop-${system.id}`} data-filled={systemOrgans.length > 0} onDragOver={(event) => event.preventDefault()} onDrop={(event) => drop(event, system.id)} onClick={() => place(selected, system.id)} aria-label={`Kelompokkan ke ${system.label}`}>
              {systemOrgans.length ? <span className="four-systems-challenge__chips">{systemOrgans.map((organ) => <span key={organ.id}><img src={organ.art} alt="" />{organ.label}<Check aria-hidden="true" /></span>)}</span> : <><b>↓</b><span>Lepaskan organ di sini</span></>}
            </button>
          </article>
        })}
      </section>

      <section className="four-systems-challenge__progress" aria-label="Progress tantangan"><div><strong>{count} / {ORGANS.length} Organ Dikelompokkan</strong><span><i style={{ width: `${count / ORGANS.length * 100}%` }} /></span></div><p><Lightbulb aria-hidden="true" />Ingat kembali fungsi setiap organ<br />dari materi sebelumnya!</p><button type="button" data-testid="four-systems-reset" onClick={reset}><RotateCcw aria-hidden="true" />Reset</button></section>
      {feedback && <p className="four-systems-challenge__feedback" role="status" data-tone={feedback.tone} data-testid="four-systems-feedback">{feedback.text}</p>}
      {complete && <p className="four-systems-challenge__complete" role="status">✓ Sistem Reproduksi &nbsp; ✓ Sistem Otot & Tulang &nbsp; ✓ Sistem Indra &nbsp; ✓ Sistem Endokrin</p>}
      <button className="four-systems-challenge__bottom-back" type="button" onClick={() => exitTo(onBack)}><ArrowLeft aria-hidden="true" />Sebelumnya</button>
      <button className="four-systems-challenge__finish" type="button" data-testid="four-systems-finish" disabled={!complete} onClick={() => exitTo(onComplete)}>Selesaikan Tantangan<ArrowRight aria-hidden="true" /></button>
    </div>
  </main>
}
