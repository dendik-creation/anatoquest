import { useState, type CSSProperties, type DragEvent, type MouseEvent } from 'react'

import backArt from '../../assets/01_reusable/buttons/btn_back.png'
import bgmOffArt from '../../assets/01_reusable/buttons/btn_bgm_off.png'
import bgmOnArt from '../../assets/01_reusable/buttons/btn_bgm_on.png'
import helpArt from '../../assets/01_reusable/buttons/btn_help.png'
import homeArt from '../../assets/01_reusable/buttons/btn_home.png'
import backgroundArt from '../../assets/02_scene/04_fundamental/backgrounds/00_background.png'
import lightbulbArt from '../../assets/02_scene/04_fundamental/micro_scenes/4.5/10_lightbulb.png'
import { useSceneExitTransition } from '../../hooks/useSceneExitTransition'
import { useStageCoverScale } from '../../hooks/useStageCoverScale'
import { DIGESTIVE_FLOW_ASSETS } from './miniGameAssets'
import './DigestiveFlowScene.css'

const STAGES = [
  { id: 'mouth', title: 'Mulut', text: 'Makanan dikunyah dan bercampur dengan saliva.', art: DIGESTIVE_FLOW_ASSETS.mouth },
  { id: 'esophagus', title: 'Kerongkongan', text: 'Makanan didorong menuju lambung.', art: DIGESTIVE_FLOW_ASSETS.esophagus },
  { id: 'stomach', title: 'Lambung', text: 'Makanan dicerna secara mekanis dan kimiawi.', art: DIGESTIVE_FLOW_ASSETS.stomach },
  { id: 'small-intestine', title: 'Usus Halus', text: 'Pencernaan dilanjutkan dan zat gizi diserap.', art: DIGESTIVE_FLOW_ASSETS.smallIntestine },
  { id: 'large-intestine', title: 'Usus Besar', text: 'Menyerap air dan membentuk sisa pencernaan.', art: DIGESTIVE_FLOW_ASSETS.largeIntestine },
  { id: 'rectum-anus', title: 'Rektum/Anus', text: 'Sisa pencernaan dikeluarkan dari tubuh.', art: DIGESTIVE_FLOW_ASSETS.rectumAnus, crop: true },
] as const

type StageId = (typeof STAGES)[number]['id']
type Feedback = { tone: 'info' | 'wrong' | 'correct'; text: string } | null
type DigestiveFlowSceneProps = { onBackToMenu: () => void; onBackToHome: () => void }
const CORRECT_ORDER: readonly StageId[] = STAGES.map((stage) => stage.id)
const VISUAL_SLOTS = [0, 1, 2, 5, 4, 3] as const
const shuffle = <T,>(items: readonly T[]) => [...items].sort(() => Math.random() - .5)

export function DigestiveFlowScene({ onBackToMenu, onBackToHome }: DigestiveFlowSceneProps) {
  const [sourceOrder] = useState(() => shuffle(STAGES.map((stage) => stage.id)))
  const [board, setBoard] = useState<(StageId | null)[]>(Array(6).fill(null))
  const [selected, setSelected] = useState<StageId | null>(null)
  const [checked, setChecked] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [feedback, setFeedback] = useState<Feedback>(null)
  const [audioOn, setAudioOn] = useState(true)
  const scale = useStageCoverScale(1920, 1080, 1860, 1046)
  const { isExiting, exitTo } = useSceneExitTransition()
  const placed = new Set(board.filter((id): id is StageId => Boolean(id)))
  const getStage = (id: StageId) => STAGES.find((stage) => stage.id === id)!
  const slotStatus = (index: number) => checked ? board[index] === CORRECT_ORDER[index] ? 'correct' : 'wrong' : 'empty'

  const place = (stageId: StageId, target: number) => {
    if (completed) return
    setBoard((current) => {
      const next = [...current]
      const from = next.indexOf(stageId)
      if (from >= 0) next[from] = next[target]
      next[target] = stageId
      return next
    })
    setSelected(null)
    setChecked(false)
    setFeedback(null)
  }
  const onDrop = (event: DragEvent<HTMLElement>, target: number) => {
    event.preventDefault()
    const stageId = event.dataTransfer.getData('text/plain') as StageId
    if (STAGES.some((stage) => stage.id === stageId)) place(stageId, target)
  }
  const pick = (stageId: StageId) => { if (!completed) setSelected(stageId) }
  const checkAnswers = () => {
    if (completed) return exitTo(onBackToMenu)
    if (board.some((id) => !id)) return setFeedback({ tone: 'info', text: 'Lengkapi semua tahapan terlebih dahulu.' })
    const allCorrect = board.every((id, index) => id === CORRECT_ORDER[index])
    setChecked(true)
    if (allCorrect) {
      setCompleted(true)
      setFeedback({ tone: 'correct', text: 'Hebat! Kamu berhasil menyusun alur sistem pencernaan dengan benar.' })
    } else setFeedback({ tone: 'wrong', text: 'Beberapa tahapan belum tepat. Susun kembali urutannya.' })
  }
  const dragProps = (stageId: StageId) => ({ draggable: !completed, onDragStart: (event: DragEvent<HTMLElement>) => { event.dataTransfer.setData('text/plain', stageId); event.dataTransfer.effectAllowed = 'move'; pick(stageId) } })

  return <main className="digestive-flow" data-testid="digestive-flow-scene" data-exiting={isExiting} style={{ '--stage-scale': scale } as CSSProperties}>
    <div className="digestive-flow__stage">
      <img className="digestive-flow__background" src={backgroundArt} alt="" aria-hidden="true" />
      <button className="digestive-flow__anim digestive-flow__icon digestive-flow__home" type="button" aria-label="Kembali ke Beranda" onClick={() => exitTo(onBackToHome)}><img src={homeArt} alt="" /></button>
      <button className="digestive-flow__anim digestive-flow__icon digestive-flow__back-icon" type="button" aria-label="Kembali ke menu mini games" onClick={() => exitTo(onBackToMenu)}><img src={backArt} alt="" /></button>
      <p className="digestive-flow__anim digestive-flow__eyebrow">Mini Games - Susun Alur Fisiologi</p>
      <h1 className="digestive-flow__anim digestive-flow__title">Susun Alur Sistem Pencernaan</h1>
      <p className="digestive-flow__anim digestive-flow__subtitle">Seret setiap tahapan ke posisi yang tepat untuk membentuk urutan perjalanan makanan<br />dalam sistem pencernaan.</p>
      <button className="digestive-flow__anim digestive-flow__icon digestive-flow__audio" type="button" aria-label={audioOn ? 'Matikan musik latar' : 'Aktifkan musik latar'} aria-pressed={audioOn} onClick={() => setAudioOn((on) => !on)}><img src={audioOn ? bgmOnArt : bgmOffArt} alt="" /></button>
      <button className="digestive-flow__anim digestive-flow__icon digestive-flow__help" type="button" aria-label="Bantuan susun alur fisiologi"><img src={helpArt} alt="" /></button>

      <section className="digestive-flow__anim digestive-flow__panel digestive-flow__source" aria-labelledby="digestive-flow-source-heading">
        <h2 id="digestive-flow-source-heading">Tahapan Tersedia</h2><p>Seret tahap sistem pencernaan di bawah ini ke urutan yang benar.</p>
        <div className="digestive-flow__source-list">
          {sourceOrder.filter((id) => !placed.has(id)).map((id) => <StageCard key={id} stage={getStage(id)} selected={selected === id} onPick={() => pick(id)} dragProps={dragProps(id)} testId={`flow-source-${id}`} />)}
        </div>
      </section>

      <section className="digestive-flow__anim digestive-flow__panel digestive-flow__board" aria-labelledby="digestive-flow-board-heading">
        <h2 id="digestive-flow-board-heading">Susun Urutan Tahapan Pencernaan</h2><p>Letakkan setiap tahap pada kotak sesuai urutan yang benar.</p>
        <i className={`digestive-flow__arrow digestive-flow__arrow--one ${completed ? 'is-complete' : ''}`}>›</i><i className={`digestive-flow__arrow digestive-flow__arrow--two ${completed ? 'is-complete' : ''}`}>›</i><i className={`digestive-flow__arrow digestive-flow__arrow--down ${completed ? 'is-complete' : ''}`}>›</i><i className={`digestive-flow__arrow digestive-flow__arrow--four ${completed ? 'is-complete' : ''}`}>‹</i><i className={`digestive-flow__arrow digestive-flow__arrow--five ${completed ? 'is-complete' : ''}`}>‹</i>
        {VISUAL_SLOTS.map((slot) => {
          const stageId = board[slot]
          return <div key={slot} className={`digestive-flow__slot digestive-flow__slot--${slot + 1}`} data-status={slotStatus(slot)} data-testid={`flow-slot-${slot + 1}`} onDragOver={(event) => event.preventDefault()} onDrop={(event) => onDrop(event, slot)} onClickCapture={(event) => { if (selected) { event.stopPropagation(); place(selected, slot) } }}>
            <b>{String(slot + 1).padStart(2, '0')}</b>
            {stageId ? <StageCard stage={getStage(stageId)} selected={selected === stageId} onPick={(event) => { event.stopPropagation(); pick(stageId) }} dragProps={dragProps(stageId)} testId={`flow-board-${stageId}`} compact /> : <span className="digestive-flow__placeholder"><em>+</em>Letakkan tahap<br />di sini</span>}
          </div>
        })}
      </section>
      {feedback && <aside className={`digestive-flow__feedback digestive-flow__feedback--${feedback.tone}`} role="status">{feedback.text}</aside>}
      <button className="digestive-flow__anim digestive-flow__previous" type="button" onClick={() => exitTo(onBackToMenu)}>‹ <span>Sebelumnya</span></button>
      <p className="digestive-flow__anim digestive-flow__tip"><img src={lightbulbArt} alt="" />Ikuti perjalanan makanan sejak masuk ke tubuh<br />hingga sisa pencernaan dikeluarkan.</p>
      <button className="digestive-flow__anim digestive-flow__check" data-testid="digestive-flow-check" type="button" onClick={checkAnswers}>{completed ? 'Selesaikan Mini Game' : 'Periksa Jawaban'} <b>›</b></button>
    </div>
  </main>
}

function StageCard({ stage, selected, onPick, dragProps, compact, testId }: { stage: (typeof STAGES)[number]; selected: boolean; onPick: (event: MouseEvent<HTMLButtonElement>) => void; dragProps: { draggable: boolean; onDragStart: (event: DragEvent<HTMLButtonElement>) => void }; compact?: boolean; testId: string }) {
  return <button className={`digestive-flow__card ${compact ? 'digestive-flow__card--compact' : ''}`} data-selected={selected} data-testid={testId} type="button" onClick={onPick} {...dragProps}>
    <span className={`digestive-flow__art ${'crop' in stage ? 'digestive-flow__art--rectum' : ''}`}><img src={stage.art} alt="" /></span><span><strong>{stage.title}</strong><small>{stage.text}</small></span><i aria-hidden="true">⠿</i>
  </button>
}
