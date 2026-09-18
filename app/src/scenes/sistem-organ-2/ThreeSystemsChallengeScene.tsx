import { useMemo, useRef, useState, type CSSProperties, type DragEvent } from 'react'
import { ArrowLeft, ArrowRight, Check, GripVertical, Play, RotateCcw, Target } from 'lucide-react'

import backgroundArt from '../../assets/02_scene/06_sistem_organ_2/6.3/background.png'
import digestiveBodyArt from '../../assets/02_scene/06_sistem_organ_2/6.1/body_digestive.png'
import nervousBodyArt from '../../assets/02_scene/06_sistem_organ_2/6.3/body_nervous1.png'
import urinaryBodyArt from '../../assets/02_scene/06_sistem_organ_2/6.4/02_body_urinary_system_posterior.png'
import mouthArt from '../../assets/02_scene/06_sistem_organ_2/6.2/mouth.png'
import esophagusArt from '../../assets/02_scene/06_sistem_organ_2/6.2/esophagus.png'
import stomachArt from '../../assets/02_scene/06_sistem_organ_2/6.2/stomach.png'
import smallIntestineArt from '../../assets/02_scene/06_sistem_organ_2/6.2/small_intestine.png'
import largeIntestineArt from '../../assets/02_scene/06_sistem_organ_2/6.2/large_intestine.png'
import brainArt from '../../assets/02_scene/06_sistem_organ_2/6.3/brain_pink_organ.png'
import neuronArt from '../../assets/02_scene/06_sistem_organ_2/6.3/neuron_icon.png'
import touchHandArt from '../../assets/02_scene/06_sistem_organ_2/6.3/touch_hand_icon.png'
import flexingArmArt from '../../assets/02_scene/06_sistem_organ_2/6.3/flexing_arm_icon.png'
import spineArt from '../../assets/01_reusable/organs/04_persarafan/sumsum_tulang_belakang.png'
import kidneyArt from '../../assets/02_scene/06_sistem_organ_2/6.4/35_kidney_cross_section_with_vessel_droplets.png'
import ureterArt from '../../assets/02_scene/06_sistem_organ_2/6.4/39_ureter_squiggle_tube_B.png'
import bladderArt from '../../assets/02_scene/06_sistem_organ_2/6.4/38_bladder_with_ureter_stubs_icon.png'
import urethraArt from '../../assets/02_scene/06_sistem_organ_2/6.4/41_urethra_line_icon.png'
import backArt from '../../assets/01_reusable/buttons/btn_back.png'
import bgmOffArt from '../../assets/01_reusable/buttons/btn_bgm_off.png'
import bgmOnArt from '../../assets/01_reusable/buttons/btn_bgm_on.png'
import homeArt from '../../assets/01_reusable/buttons/btn_home.png'
import helpArt from '../../assets/01_reusable/buttons/btn_help.png'
import lightbulbArt from '../../assets/02_scene/06_sistem_organ_2/6.3/icon_lightbulb.png'
import { useSceneExitTransition } from '../../hooks/useSceneExitTransition'
import { useStageCoverScale } from '../../hooks/useStageCoverScale'
import './ThreeSystemsChallengeScene.css'

const DESIGN_WIDTH = 1920
const DESIGN_HEIGHT = 1080
const SAFE_WIDTH = 1860
const SAFE_HEIGHT = 1046
const CHALLENGE_DRAG_TYPE = 'application/x-anatoquest-system-order'

const SYSTEMS = [
  {
    id: 'pencernaan', label: 'Sistem Pencernaan', short: 'Pencernaan', tabArt: stomachArt, bodyArt: digestiveBodyArt,
    chooseTitle: 'Pilih Organ', chooseCopy: 'Seret organ ke kolom urutan di sebelah kanan!', orderCopy: 'Letakkan organ sesuai urutan perjalanan makanan di dalam tubuh.',
    goal: 'Urutkan organ dengan tepat sesuai proses pencernaan yang telah kamu pelajari.',
    order: ['mulut', 'kerongkongan', 'lambung', 'usus-halus', 'usus-besar'],
    items: [
      { id: 'usus-besar', label: 'Usus Besar', art: largeIntestineArt },
      { id: 'lambung', label: 'Lambung', art: stomachArt },
      { id: 'usus-halus', label: 'Usus Halus', art: smallIntestineArt },
      { id: 'mulut', label: 'Mulut', art: mouthArt },
      { id: 'kerongkongan', label: 'Kerongkongan', art: esophagusArt },
    ],
  },
  {
    id: 'persarafan', label: 'Sistem Persarafan', short: 'Persarafan', tabArt: brainArt, bodyArt: nervousBodyArt,
    chooseTitle: 'Pilih Komponen', chooseCopy: 'Seret komponen ke kolom urutan di sebelah kanan!', orderCopy: 'Letakkan komponen sesuai urutan perjalanan impuls saraf di dalam tubuh.',
    goal: 'Memahami alur perjalanan impuls saraf dari rangsangan hingga respons.',
    order: ['rangsangan', 'saraf', 'sumsum', 'otak', 'respons'],
    items: [
      { id: 'saraf', label: 'Saraf', art: neuronArt },
      { id: 'otak', label: 'Otak', art: brainArt },
      { id: 'respons', label: 'Respons', art: flexingArmArt },
      { id: 'rangsangan', label: 'Rangsangan', art: touchHandArt },
      { id: 'sumsum', label: 'Sumsum Tulang Belakang', art: spineArt },
    ],
  },
  {
    id: 'perkemihan', label: 'Sistem Perkemihan', short: 'Perkemihan', tabArt: kidneyArt, bodyArt: urinaryBodyArt,
    chooseTitle: 'Pilih Komponen', chooseCopy: 'Seret komponen ke kolom urutan di sebelah kanan!', orderCopy: 'Letakkan komponen sesuai urutan aliran urin di dalam tubuh.',
    goal: 'Memahami jalur aliran urin mulai dari pembentukan hingga pengeluaran dari tubuh.',
    order: ['ginjal', 'ureter', 'kandung-kemih', 'uretra'],
    items: [
      { id: 'ginjal', label: 'Ginjal', art: kidneyArt },
      { id: 'ureter', label: 'Ureter', art: ureterArt },
      { id: 'kandung-kemih', label: 'Kandung Kemih', art: bladderArt },
      { id: 'uretra', label: 'Uretra', art: urethraArt },
    ],
  },
] as const

type SystemId = (typeof SYSTEMS)[number]['id']
type ItemId = (typeof SYSTEMS)[number]['items'][number]['id']

type ThreeSystemsChallengeSceneProps = {
  onBackToHome?: () => void
  onBack?: () => void
  onComplete?: () => void
}

export function ThreeSystemsChallengeScene({ onBackToHome, onBack, onComplete }: ThreeSystemsChallengeSceneProps) {
  const scale = useStageCoverScale(DESIGN_WIDTH, DESIGN_HEIGHT, SAFE_WIDTH, SAFE_HEIGHT)
  const [audioOn, setAudioOn] = useState(true)
  const [activeId, setActiveId] = useState<SystemId>('pencernaan')
  const [completed, setCompleted] = useState<ReadonlySet<SystemId>>(() => new Set())
  const [assignments, setAssignments] = useState<Array<ItemId | null>>(() => Array(SYSTEMS[0].order.length).fill(null))
  const [feedback, setFeedback] = useState<string | null>(null)
  const [showHint, setShowHint] = useState(false)
  const draggedItemRef = useRef<ItemId | null>(null)
  const { isExiting, exitTo } = useSceneExitTransition()
  const activeIndex = SYSTEMS.findIndex((system) => system.id === activeId)
  const activeSystem = SYSTEMS[activeIndex] ?? SYSTEMS[0]
  const allComplete = completed.size === SYSTEMS.length
  const placed = assignments.filter(Boolean).length
  const style = { '--stage-scale': scale } as CSSProperties

  const labels = useMemo(() => new Map(activeSystem.items.map((item) => [item.id, item])), [activeSystem])
  const isActiveItemId = (candidate: string): candidate is ItemId => labels.has(candidate as ItemId)

  const placeItem = (itemId: ItemId, slotIndex?: number) => {
    if (allComplete || completed.has(activeSystem.id) || !isActiveItemId(itemId)) return
    setAssignments((current) => {
      const target = slotIndex ?? current.findIndex((item) => item === null)
      if (target === -1 || target < 0 || target >= current.length || current.includes(itemId) || current[target] !== null) return current
      const next = [...current]
      next[target] = itemId
      return next
    })
    setFeedback(null)
  }

  const dragStart = (event: DragEvent<HTMLButtonElement>, itemId: ItemId) => {
    if (assignments.includes(itemId)) {
      event.preventDefault()
      return
    }
    draggedItemRef.current = itemId
    event.dataTransfer.setData(CHALLENGE_DRAG_TYPE, itemId)
    event.dataTransfer.setData('text/plain', itemId)
    event.dataTransfer.effectAllowed = 'move'
  }

  const dragEnd = () => {
    draggedItemRef.current = null
  }

  const dragOverSlot = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }

  const dropOnSlot = (event: DragEvent<HTMLDivElement>, slotIndex: number) => {
    event.preventDefault()
    const itemId = draggedItemRef.current
      || event.dataTransfer.getData(CHALLENGE_DRAG_TYPE)
      || event.dataTransfer.getData('text/plain')
    draggedItemRef.current = null
    if (isActiveItemId(itemId)) placeItem(itemId, slotIndex)
  }

  const resetCurrent = () => {
    draggedItemRef.current = null
    setAssignments(Array(activeSystem.order.length).fill(null))
    setFeedback(null)
  }

  const checkAnswer = () => {
    if (placed !== activeSystem.order.length) {
      setFeedback('Lengkapi semua kartu terlebih dahulu.')
      return
    }
    const correct = activeSystem.order.every((itemId, index) => assignments[index] === itemId)
    if (!correct) {
      setFeedback('Urutan belum tepat. Atur ulang dan coba lagi.')
      return
    }

    const nextIndex = activeIndex + 1
    setCompleted((current) => new Set(current).add(activeSystem.id))
    setFeedback('Jawaban benar! Tantangan berikutnya terbuka.')
    if (nextIndex < SYSTEMS.length) {
      const next = SYSTEMS[nextIndex]
      setActiveId(next.id)
      setAssignments(Array(next.order.length).fill(null))
    }
  }

  return (
    <main className="three-systems-challenge" data-testid="three-systems-challenge-scene" data-microscene="6.5" data-active-system={activeSystem.id} data-complete={allComplete} data-exiting={isExiting} style={style} aria-labelledby="three-systems-challenge-heading">
      <div className="three-systems-challenge__stage">
        <img className="three-systems-challenge__background" src={backgroundArt} alt="" aria-hidden="true" />

        <button className="three-systems-challenge__icon three-systems-challenge__home" type="button" aria-label="Kembali ke Beranda" onClick={() => exitTo(onBackToHome)}><img src={homeArt} alt="" /></button>
        <button className="three-systems-challenge__icon three-systems-challenge__top-back" type="button" aria-label="Kembali ke materi sebelumnya" onClick={() => exitTo(onBack)}><img src={backArt} alt="" /></button>
        <button className="three-systems-challenge__icon three-systems-challenge__audio" type="button" aria-label={audioOn ? 'Matikan musik latar' : 'Aktifkan musik latar'} aria-pressed={audioOn} onClick={() => setAudioOn((value) => !value)}><img src={audioOn ? bgmOnArt : bgmOffArt} alt="" /></button>
        <button className="three-systems-challenge__icon three-systems-challenge__help" type="button" aria-label="Bantuan tantangan tiga sistem" onClick={() => setShowHint((value) => !value)}><img src={helpArt} alt="" /></button>

        <header className="three-systems-challenge__header">
          <p>Materi 3 - Sistem Organ Tubuh (5 / 5)</p>
          <h1 id="three-systems-challenge-heading">Tantangan Tiga Sistem!</h1>
          <span>{activeSystem.id === 'pencernaan' ? 'Susun urutan organ pada sistem pencernaan, persarafan, dan perkemihan sesuai yang telah kamu pelajari.' : `Susun urutan komponen dalam ${activeSystem.label.toLowerCase()} sesuai yang telah kamu pelajari.`}</span>
        </header>

        <nav className="three-systems-challenge__tabs" aria-label="Pilih sistem tantangan">
          {SYSTEMS.map((system, index) => {
            const isActive = system.id === activeSystem.id
            const locked = index > activeIndex
            return <button key={system.id} className="three-systems-challenge__tab" type="button" data-testid={`challenge-tab-${system.id}`} data-system={system.id} data-active={isActive} data-complete={completed.has(system.id)} disabled={locked || (!isActive && completed.has(system.id))} aria-current={isActive ? 'page' : undefined} onClick={() => setActiveId(system.id)}>
              <img src={system.tabArt} alt="" aria-hidden="true" /><span>{system.label}</span>
            </button>
          })}
        </nav>

        <div className="three-systems-challenge__board">
          <aside className="three-systems-challenge__choices" aria-label={activeSystem.chooseTitle}>
            <h2>{activeSystem.chooseTitle}</h2>
            <p>{activeSystem.chooseCopy}</p>
            <div className="three-systems-challenge__cards">
              {activeSystem.items.map((item) => {
                const isUsed = assignments.includes(item.id)
                return <button key={item.id} className="three-systems-challenge__card" type="button" data-testid={`challenge-card-${item.id}`} data-used={isUsed} disabled={isUsed || allComplete} draggable={!isUsed && !allComplete} onDragStart={(event) => dragStart(event, item.id)} onDragEnd={dragEnd} onClick={() => placeItem(item.id)}>
                <GripVertical aria-hidden="true" /><img src={item.art} alt="" aria-hidden="true" /><span>{item.label}</span>
                </button>
              })}
            </div>
          </aside>

          <section className="three-systems-challenge__workspace" data-system={activeSystem.id} aria-label="Urutan sistem yang sedang ditantang">
            <img className="three-systems-challenge__body" src={activeSystem.bodyArt} alt="" aria-hidden="true" />
            <div className="three-systems-challenge__order">
              <h2>Susun Urutan yang Benar</h2>
              <p>{activeSystem.orderCopy}</p>
              <div className="three-systems-challenge__slots">
                {activeSystem.order.map((_, index) => {
                  const itemId = assignments[index]
                  const item = itemId ? labels.get(itemId) : undefined
                  return <div key={index} className="three-systems-challenge__slot-row">
                    <span className="three-systems-challenge__slot-number">{index + 1}</span>
                    <div className="three-systems-challenge__slot" data-testid={`challenge-slot-${index + 1}`} data-filled={Boolean(item)} onDragOver={dragOverSlot} onDrop={(event) => dropOnSlot(event, index)} onClick={() => item && placeItem(item.id, index)}>
                      {item && <><img src={item.art} alt="" aria-hidden="true" /><span>{item.label}</span></>}
                    </div>
                    {index < activeSystem.order.length - 1 && <ArrowDown />}
                  </div>
                })}
              </div>
            </div>
          </section>

          <aside className="three-systems-challenge__tips" aria-label="Petunjuk tantangan">
            <section><img src={lightbulbArt} alt="" aria-hidden="true" /><div><h2>Petunjuk</h2><ol><li>Seret kartu {activeSystem.id === 'pencernaan' ? 'organ' : 'komponen'} dari sebelah kiri ke kolom urutan di tengah.</li><li>Susun sesuai urutan perjalanan {activeSystem.id === 'pencernaan' ? 'makanan' : activeSystem.id === 'persarafan' ? 'impuls saraf' : 'aliran urin'} yang telah kamu pelajari.</li><li>Setelah semua kartu terisi, tekan tombol <strong>Periksa Jawaban</strong> untuk melihat hasilnya.</li></ol></div></section>
            <section className="three-systems-challenge__goal"><Target aria-hidden="true" /><div><h2>Tujuan</h2><p>{activeSystem.goal}</p></div></section>
            <footer><span>★</span><p>Setiap sistem memiliki tantangan berbeda. Selesaikan ketiganya untuk menuntaskan Materi 3!</p></footer>
          </aside>
        </div>

        {showHint && <p className="three-systems-challenge__hint" role="status">Seret atau klik kartu untuk menempatkannya ke urutan kosong. Susun dari awal hingga akhir proses.</p>}
        {feedback && <p className="three-systems-challenge__feedback" role="status" data-testid="challenge-feedback">{feedback}</p>}
        <button className="three-systems-challenge__bottom-back" type="button" onClick={() => exitTo(onBack)}><ArrowLeft aria-hidden="true" />Sebelumnya</button>
        <footer className="three-systems-challenge__progress" aria-label="Progress tantangan">
          <strong>Progress Tantangan</strong>
          <div className="three-systems-challenge__progress-track">
            {SYSTEMS.map((system) => {
              const isComplete = completed.has(system.id)
              return <span key={system.id} data-active={system.id === activeSystem.id} data-complete={isComplete}>
                <span className="three-systems-challenge__progress-marker" aria-hidden="true">{isComplete && <Check />}</span>
                <b>{system.short}</b>
              </span>
            })}
          </div>
          <div><strong>{placed} dari {activeSystem.order.length}</strong><span>{activeSystem.id === 'pencernaan' ? 'organ' : 'komponen'} ditempatkan</span></div>
        </footer>
        <button className="three-systems-challenge__reset" type="button" data-testid="challenge-reset" onClick={resetCurrent} disabled={allComplete}><RotateCcw aria-hidden="true" />Atur Ulang</button>
        <button className="three-systems-challenge__check" type="button" data-testid="challenge-check" onClick={allComplete ? () => exitTo(onComplete) : checkAnswer}>{allComplete ? <Play aria-hidden="true" fill="currentColor" /> : <Check aria-hidden="true" />} {allComplete ? 'Lanjut: Materi 4' : 'Periksa Jawaban'}<ArrowRight aria-hidden="true" /></button>
      </div>
    </main>
  )
}

function ArrowDown() {
  return <span className="three-systems-challenge__slot-arrow" aria-hidden="true">↓</span>
}
