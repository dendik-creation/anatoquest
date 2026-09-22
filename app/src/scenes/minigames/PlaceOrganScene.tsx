import { useState, type CSSProperties, type DragEvent } from 'react'

import backArt from '../../assets/01_reusable/buttons/btn_back.png'
import bgmOffArt from '../../assets/01_reusable/buttons/btn_bgm_off.png'
import bgmOnArt from '../../assets/01_reusable/buttons/btn_bgm_on.png'
import helpArt from '../../assets/01_reusable/buttons/btn_help.png'
import homeArt from '../../assets/01_reusable/buttons/btn_home.png'
import headerBanner from '../../assets/02_scene/02_home/01_header_banner.png'
import backgroundArt from '../../assets/02_scene/04_fundamental/backgrounds/00_background.png'
import lightbulbArt from '../../assets/02_scene/06_sistem_organ_2/6.3/icon_lightbulb.png'
import { useSceneExitTransition } from '../../hooks/useSceneExitTransition'
import { useStageCoverScale } from '../../hooks/useStageCoverScale'
import { RESPIRATORY_ASSETS } from './miniGameAssets'
import './PlaceOrganScene.css'

const DEBUG_ORGAN_PLACEMENT = false

const ORGANS = [
  { id: 'lungs', label: 'Paru-paru', art: RESPIRATORY_ASSETS.lungs, target: { x: 124, y: 342, width: 270, height: 222, padding: 20 } },
  { id: 'trachea', label: 'Trakea', art: RESPIRATORY_ASSETS.trachea, target: { x: 242, y: 294, width: 30, height: 116, padding: 15 } },
  { id: 'bronchi', label: 'Bronkus', art: RESPIRATORY_ASSETS.bronchi, target: { x: 165, y: 371, width: 185, height: 148, padding: 20 } },
  { id: 'diaphragm', label: 'Diafragma', art: RESPIRATORY_ASSETS.diaphragm, target: { x: 147, y: 524, width: 222, height: 138, padding: 20 } },
  { id: 'nasal', label: 'Rongga Hidung', art: RESPIRATORY_ASSETS.nasal, target: { x: 227, y: 164, width: 60, height: 62, padding: 15 } },
  { id: 'larynx', label: 'Laring', art: RESPIRATORY_ASSETS.larynx, target: { x: 228, y: 241, width: 58, height: 135, padding: 16 } },
] as const

type OrganId = (typeof ORGANS)[number]['id']
type Feedback = { tone: 'correct' | 'wrong'; text: string } | null

type PlaceOrganSceneProps = { onBackToMenu: () => void; onBackToHome: () => void }

export function PlaceOrganScene({ onBackToMenu, onBackToHome }: PlaceOrganSceneProps) {
  const [placed, setPlaced] = useState<Set<OrganId>>(new Set())
  const [selected, setSelected] = useState<OrganId | null>(null)
  const [feedback, setFeedback] = useState<Feedback>(null)
  const [audioOn, setAudioOn] = useState(true)
  const scale = useStageCoverScale(1920, 1080, 1860, 1046)
  const { isExiting, exitTo } = useSceneExitTransition()
  const complete = placed.size === ORGANS.length

  const rejectPlacement = () => {
    setFeedback({ tone: 'wrong', text: 'Belum tepat. Coba tempatkan organ pada posisi yang sesuai.' })
    setSelected(null)
  }
  const attemptPlace = (id: OrganId, target: OrganId) => {
    if (complete) return
    if (id !== target) {
      rejectPlacement()
      return
    }
    const organ = ORGANS.find((item) => item.id === target)!
    setPlaced((current) => new Set(current).add(target))
    setSelected(null)
    setFeedback({ tone: 'correct', text: `✓ Tepat! ${organ.label} berhasil dipasang.` })
  }
  const place = (target: OrganId) => { if (selected) attemptPlace(selected, target) }
  const drop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const id = event.dataTransfer.getData('text/plain') as OrganId
    const organ = ORGANS.find((item) => item.id === id)
    if (!organ) return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - rect.left) * 515 / rect.width
    const y = (event.clientY - rect.top) * 696 / rect.height
    const { target } = organ
    if (x >= target.x - target.padding && x <= target.x + target.width + target.padding && y >= target.y - target.padding && y <= target.y + target.height + target.padding) attemptPlace(id, id)
    else rejectPlacement()
  }

  return (
    <main className="place-organ" data-testid="place-organ-scene" data-exiting={isExiting} style={{ '--stage-scale': scale } as CSSProperties}>
      <div className="place-organ__stage">
        <img className="place-organ__background" src={backgroundArt} alt="" aria-hidden="true" />
        <img className="place-organ__anim place-organ__header-banner" src={headerBanner} alt="" aria-hidden="true" />
        <button className="place-organ__anim place-organ__icon place-organ__home" type="button" aria-label="Kembali ke Beranda" onClick={() => exitTo(onBackToHome)}><img src={homeArt} alt="" aria-hidden="true" /></button>
        <button className="place-organ__anim place-organ__icon place-organ__back-icon" type="button" aria-label="Kembali ke menu mini games" onClick={() => exitTo(onBackToMenu)}><img src={backArt} alt="" aria-hidden="true" /></button>
        <p className="place-organ__anim place-organ__eyebrow">Mini Games - Pasang Organ</p>
        <h1 className="place-organ__anim place-organ__title">Sistem Pernapasan</h1>
        <p className="place-organ__anim place-organ__subtitle">Seret dan lepaskan organ ke posisi yang tepat pada anatomi tubuh.</p>
        <button className="place-organ__anim place-organ__icon place-organ__audio" type="button" aria-label={audioOn ? 'Matikan musik latar' : 'Aktifkan musik latar'} aria-pressed={audioOn} onClick={() => setAudioOn((on) => !on)}><img src={audioOn ? bgmOnArt : bgmOffArt} alt="" aria-hidden="true" /></button>
        <button className="place-organ__anim place-organ__icon place-organ__help" type="button" aria-label="Bantuan pasang organ"><img src={helpArt} alt="" aria-hidden="true" /></button>

        <section className="place-organ__anim place-organ__tray" aria-labelledby="available-organs-heading"><h2 id="available-organs-heading">Organ yang Tersedia</h2><div className="place-organ__cards">{ORGANS.map((organ) => !placed.has(organ.id) && <button key={organ.id} type="button" draggable className="place-organ__card" data-testid={`place-organ-card-${organ.id}`} data-selected={selected === organ.id} onClick={() => setSelected((current) => current === organ.id ? null : organ.id)} onDragStart={(event) => { event.dataTransfer.setData('text/plain', organ.id); setSelected(organ.id) }}><img src={organ.art} alt={organ.label} /></button>)}</div></section>

        <section className="place-organ__anim place-organ__anatomy" aria-label="Area Anatomi">
          <div className="place-organ__anatomy-stage" onDragOver={(event) => event.preventDefault()} onDrop={drop}>
            <img className="place-organ__body" src={RESPIRATORY_ASSETS.body} alt="Anatomi tubuh dasar" />
            <img className="place-organ__guide" src={RESPIRATORY_ASSETS.guide} alt="Petunjuk posisi sistem pernapasan" data-hidden={complete} />
            {ORGANS.map((organ) => {
              const { x, y, width, height, padding } = organ.target
              return <button key={organ.id} type="button" className="place-organ__target" data-testid={`place-organ-target-${organ.id}`} data-placed={placed.has(organ.id)} data-selected-target={selected === organ.id} style={{ left: x - padding, top: y - padding, width: width + padding * 2, height: height + padding * 2 }} aria-label={`Target ${organ.label}`} onClick={() => place(organ.id)}>
                {(placed.has(organ.id) || DEBUG_ORGAN_PLACEMENT) && <img className="place-organ__placed-organ" src={organ.art} alt={placed.has(organ.id) ? organ.label : ''} style={{ left: padding, top: padding, width, height }} />}
                {DEBUG_ORGAN_PLACEMENT && <><i className="place-organ__debug-center" /><span className="place-organ__debug-label">{organ.id}</span></>}
              </button>
            })}
            {complete && <img className="place-organ__complete-art" src={RESPIRATORY_ASSETS.complete} alt="Sistem pernapasan lengkap" />}
          </div>
          {feedback && <aside className={`place-organ__feedback place-organ__feedback--${feedback.tone}`} role="status">{complete ? 'Pasang Organ Selesai! Kamu berhasil menempatkan seluruh bagian sistem pernapasan pada posisi yang tepat.' : feedback.text}</aside>}
        </section>

        <aside className="place-organ__anim place-organ__progress"><h2>Progress <b>{placed.size} / 6</b></h2><div className="place-organ__bar"><span style={{ width: `${(placed.size / ORGANS.length) * 100}%` }} /></div><p><img src={lightbulbArt} alt="" aria-hidden="true" />Lengkapi seluruh organ pada posisi yang tepat untuk menyelesaikan permainan ini.</p></aside>
        <button className="place-organ__anim place-organ__previous" type="button" onClick={() => exitTo(onBackToMenu)}>‹ <span>Sebelumnya</span></button><button className="place-organ__anim place-organ__finish" type="button" data-testid="place-organ-finish" disabled={!complete} onClick={() => exitTo(onBackToMenu)}>{complete ? 'Selesaikan Mini Game' : 'Selesai'} <b>›</b></button>
      </div>
    </main>
  )
}
