import { useState, type CSSProperties, type DragEvent } from 'react'

import backArt from '../../assets/01_reusable/buttons/btn_back.png'
import bgmOffArt from '../../assets/01_reusable/buttons/btn_bgm_off.png'
import bgmOnArt from '../../assets/01_reusable/buttons/btn_bgm_on.png'
import helpArt from '../../assets/01_reusable/buttons/btn_help.png'
import homeArt from '../../assets/01_reusable/buttons/btn_home.png'
import backgroundArt from '../../assets/02_scene/04_fundamental/backgrounds/00_background.png'
import lightbulbArt from '../../assets/02_scene/06_sistem_organ_2/6.3/icon_lightbulb.png'
import { useSceneExitTransition } from '../../hooks/useSceneExitTransition'
import { useStageCoverScale } from '../../hooks/useStageCoverScale'
import { PuzzleGrid2x3 } from './PuzzleGrid2x3'
import { PUZZLE_ORGANS, type PuzzlePiece } from './miniGameAssets'
import './PuzzleOrganScene.css'

type Feedback = { tone: 'correct' | 'wrong'; text: string } | null
type PuzzleOrganSceneProps = { onBackToMenu: () => void; onBackToHome: () => void }

const shuffle = <T,>(items: readonly T[]) => [...items].sort(() => Math.random() - .5)

export function PuzzleOrganScene({ onBackToMenu, onBackToHome }: PuzzleOrganSceneProps) {
  const [step, setStep] = useState(0)
  const [completed, setCompleted] = useState<Set<number>>(new Set())
  const [placed, setPlaced] = useState<Set<string>>(new Set())
  const [sourcePieces, setSourcePieces] = useState<PuzzlePiece[]>(() => shuffle(PUZZLE_ORGANS[0].pieces))
  const [selected, setSelected] = useState<string | null>(null)
  const [hoveredSlot, setHoveredSlot] = useState<string | null>(null)
  const [wrong, setWrong] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<Feedback>(null)
  const [showCompletion, setShowCompletion] = useState(false)
  const [audioOn, setAudioOn] = useState(true)
  const scale = useStageCoverScale(1920, 1080, 1860, 1046)
  const { isExiting, exitTo } = useSceneExitTransition()
  const puzzle = PUZZLE_ORGANS[step]
  const isComplete = placed.size === puzzle.pieces.length || completed.has(step)

  const clearSelection = () => { setSelected(null); setHoveredSlot(null) }
  const rejectPiece = (pieceId: string) => {
    setWrong(pieceId)
    setFeedback({ tone: 'wrong', text: 'Belum tepat. Coba posisi lainnya.' })
    window.setTimeout(() => setWrong(null), 380)
    clearSelection()
  }
  const attemptPlace = (pieceId: string, slot: string) => {
    if (completed.has(step)) return
    const piece = puzzle.pieces.find((item) => item.id === pieceId)
    if (!piece || piece.targetSlot !== slot) return rejectPiece(pieceId)
    setPlaced((current) => new Set(current).add(pieceId))
    setFeedback({ tone: 'correct', text: placed.size + 1 === puzzle.pieces.length ? `Puzzle ${puzzle.name} selesai!` : '✓ Potongan berhasil terpasang!' })
    clearSelection()
  }
  const selectSlot = (slot: string) => { if (selected) attemptPlace(selected, slot) }
  const dropPiece = (event: DragEvent<HTMLButtonElement>, slot: string) => {
    event.preventDefault()
    attemptPlace(event.dataTransfer.getData('text/plain'), slot)
  }
  const beginDrag = (event: DragEvent<HTMLButtonElement>, id: string) => {
    event.dataTransfer.setData('text/plain', id)
    event.dataTransfer.effectAllowed = 'move'
  }
  const reset = () => {
    if (completed.has(step)) return
    setPlaced(new Set())
    setSourcePieces(shuffle(puzzle.pieces))
    setFeedback(null)
    clearSelection()
  }
  const advance = () => {
    if (!isComplete) return
    if (step === PUZZLE_ORGANS.length - 1) return setShowCompletion(true)
    setCompleted((current) => new Set(current).add(step))
    const nextStep = step + 1
    setStep(nextStep)
    setPlaced(new Set())
    setSourcePieces(shuffle(PUZZLE_ORGANS[nextStep].pieces))
    setFeedback(null)
    clearSelection()
  }
  const previous = () => {
    if (step === 0) return exitTo(onBackToMenu)
    const previousStep = step - 1
    setStep(previousStep)
    setPlaced(new Set(PUZZLE_ORGANS[previousStep].pieces.map((piece) => piece.id)))
    setSourcePieces(PUZZLE_ORGANS[previousStep].pieces)
    setFeedback(null)
    clearSelection()
  }

  return <main className="puzzle-organ" data-testid="puzzle-organ-scene" data-exiting={isExiting} style={{ '--stage-scale': scale } as CSSProperties}>
    <div className="puzzle-organ__stage" key={puzzle.id}>
      <img className="puzzle-organ__background" src={backgroundArt} alt="" aria-hidden="true" />
      <button className="puzzle-organ__anim puzzle-organ__icon puzzle-organ__home" type="button" aria-label="Kembali ke Beranda" onClick={() => exitTo(onBackToHome)}><img src={homeArt} alt="" aria-hidden="true" /></button>
      <button className="puzzle-organ__anim puzzle-organ__icon puzzle-organ__back-icon" type="button" aria-label="Kembali ke menu mini games" onClick={() => exitTo(onBackToMenu)}><img src={backArt} alt="" aria-hidden="true" /></button>
      <p className="puzzle-organ__anim puzzle-organ__eyebrow">Mini Games - Puzzle Organ ({step + 1}/3)</p>
      <h1 className="puzzle-organ__anim puzzle-organ__title">Susun Puzzle {puzzle.name}</h1>
      <p className="puzzle-organ__anim puzzle-organ__subtitle">Seret dan lepaskan potongan puzzle untuk menyusun organ {puzzle.name.toLowerCase()} yang lengkap.</p>
      <button className="puzzle-organ__anim puzzle-organ__icon puzzle-organ__audio" type="button" aria-label={audioOn ? 'Matikan musik latar' : 'Aktifkan musik latar'} aria-pressed={audioOn} onClick={() => setAudioOn((on) => !on)}><img src={audioOn ? bgmOnArt : bgmOffArt} alt="" aria-hidden="true" /></button>
      <button className="puzzle-organ__anim puzzle-organ__icon puzzle-organ__help" type="button" aria-label="Bantuan puzzle organ"><img src={helpArt} alt="" aria-hidden="true" /></button>

      <section className="puzzle-organ__anim puzzle-organ__tray" aria-labelledby="puzzle-pieces-heading">
        <h2 id="puzzle-pieces-heading">Potongan Puzzle</h2><p>Seret potongan di bawah ini ke area yang sesuai.</p>
        <div className="puzzle-organ__pieces">
          {sourcePieces.map((piece) => !placed.has(piece.id) && <button key={piece.id} className="puzzle-organ__piece" type="button" data-testid={`puzzle-piece-${piece.id}`} data-selected={selected === piece.id} data-wrong={wrong === piece.id} draggable onDragStart={(event) => beginDrag(event, piece.id)} onDragEnd={clearSelection} onClick={() => setSelected((current) => current === piece.id ? null : piece.id)}><img src={piece.asset} alt={`Potongan puzzle ${piece.id}`} /></button>)}
        </div>
      </section>

      <section className="puzzle-organ__anim puzzle-organ__canvas" aria-labelledby="puzzle-canvas-heading">
        <h2 id="puzzle-canvas-heading">Area Penyusunan Puzzle</h2><p>Lepaskan potongan puzzle di sini untuk membentuk {puzzle.name.toLowerCase()} yang lengkap.</p>
        <PuzzleGrid2x3 className="puzzle-organ__board" pieces={puzzle.pieces} aspectRatio={puzzle.aspectRatio} boardSize={puzzle.boardSize} placed={placed} activeSlot={hoveredSlot} complete={isComplete} label={`Papan puzzle ${puzzle.name}`} onSelectSlot={selectSlot} onDragEnter={setHoveredSlot} onDrop={dropPiece} />
        {feedback && <aside className={`puzzle-organ__feedback puzzle-organ__feedback--${feedback.tone}`} role="status">{feedback.text}</aside>}
        {!completed.has(step) && !isComplete && <button className="puzzle-organ__reset" type="button" onClick={reset}>Reset Puzzle</button>}
      </section>

      <aside className="puzzle-organ__anim puzzle-organ__progress" aria-label="Progress Puzzle">
        <h2>Progress Puzzle <b>{step + 1} / 3</b></h2><div className="puzzle-organ__bar"><span style={{ width: `${((step + 1) / 3) * 100}%` }} /></div>
        {PUZZLE_ORGANS.map((item, index) => {
          const done = completed.has(index) || (index === step && isComplete)
          return <div key={item.id} className="puzzle-organ__progress-item" data-active={index === step} data-complete={done}><PuzzleGrid2x3 className="puzzle-organ__progress-preview" pieces={item.pieces} aspectRatio={item.aspectRatio} placed={new Set(item.pieces.map((piece) => piece.id))} label={`Pratinjau ${item.name}`} /><b>{done ? '✓' : index + 1}</b><span><strong>{item.name}</strong><small>{done ? '✓ Selesai' : index === step ? `${placed.size}/6 terpasang` : 'Terkunci 🔒'}</small></span></div>
        })}
        <p className="puzzle-organ__progress-tip"><img src={lightbulbArt} alt="" aria-hidden="true" />Perhatikan bentuk dan warna setiap potongan puzzle untuk membantumu menyusun organ.</p>
      </aside>

      <button className="puzzle-organ__anim puzzle-organ__previous" type="button" onClick={previous}>‹ <span>Sebelumnya</span></button>
      <button className="puzzle-organ__anim puzzle-organ__next" type="button" data-testid="puzzle-organ-next" disabled={!isComplete} onClick={advance}>{step === 2 ? 'Selesaikan Mini Game' : `Lanjut ke Puzzle ${step + 2}`} <b>›</b></button>
      {showCompletion && <section className="puzzle-organ__completion" data-testid="puzzle-organ-completion" role="dialog" aria-modal="true" aria-labelledby="puzzle-completion-title"><h2 id="puzzle-completion-title">Puzzle Organ Selesai! ✓</h2><p>3 dari 3 organ berhasil disusun</p><ul><li>✓ Paru-paru</li><li>✓ Jantung</li><li>✓ Otak</li></ul><button type="button" onClick={() => exitTo(onBackToMenu)}>Kembali ke Menu Mini Games</button></section>}
    </div>
  </main>
}
