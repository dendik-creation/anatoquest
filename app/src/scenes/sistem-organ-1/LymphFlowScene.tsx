import { useEffect, useState, type CSSProperties } from 'react'
import { ArrowLeft, ChevronRight, Pause, Play } from 'lucide-react'

import backgroundArt from '../../assets/02_scene/05_sistem_organ_1/backgrounds/00_background.png'
import bodyArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.8/body_lymphatic_small.png'
import tissueArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.8/tissue_cell_diagram.png'
import greenTubeArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.8/green_straight_tube.png'
import greenVesselArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.8/green_vessel_curvy.png'
import lymphNodeArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.8/green_cell_oval.png'
import junctionArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.8/vessel_junction.png'
import fluidParticleArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.8/teal_cell_small.png'
import lymphParticleArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.8/teal_cell_big.png'
import foreignParticleArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.8/purple_virus_cell.png'
import arrowCurvedArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.8/arrow_teal_curved.png'
import arrowStraightArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.8/arrow_teal_straight.png'
import backArt from '../../assets/01_reusable/buttons/btn_back.png'
import bgmOffArt from '../../assets/01_reusable/buttons/btn_bgm_off.png'
import bgmOnArt from '../../assets/01_reusable/buttons/btn_bgm_on.png'
import homeArt from '../../assets/01_reusable/buttons/btn_home.png'
import lightbulbArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.5/lightbulb_icon.png'
import { HelpButton } from '../../components/HelpButton'
import { useStageCoverScale } from '../../hooks/useStageCoverScale'
import './LymphFlowScene.css'

const DESIGN_WIDTH = 1920
const DESIGN_HEIGHT = 1080
const SAFE_WIDTH = 1860
const SAFE_HEIGHT = 1046

const STAGES = [
  {
    id: 'tissue',
    listTitle: 'Cairan berasal dari jaringan',
    title: 'Cairan berasal dari jaringan',
    description: 'Sebagian cairan dari pembuluh darah merembes ke jaringan tubuh untuk menyalurkan nutrisi dan oksigen ke sel. Cairan yang tidak kembali ke pembuluh darah akan masuk ke pembuluh limfa dan menjadi cairan limfa.',
    fact: 'Setiap hari, sekitar 2–4 liter cairan jaringan masuk ke sistem limfatik. Tanpa sistem ini, cairan akan menumpuk dan menyebabkan pembengkakan (edema).',
  },
  {
    id: 'vessel',
    listTitle: 'Masuk ke pembuluh limfa',
    title: 'Cairan masuk ke pembuluh limfa',
    description: 'Pembuluh limfa mengumpulkan kelebihan cairan dari ruang antarjaringan. Katup kecil di dalamnya membantu cairan limfa tetap mengalir ke satu arah.',
    fact: 'Tidak seperti darah yang dipompa jantung, cairan limfa bergerak perlahan karena gerakan otot tubuh dan katup pembuluh limfa.',
  },
  {
    id: 'node',
    listTitle: 'Melewati kelenjar limfa',
    title: 'Cairan disaring di kelenjar limfa',
    description: 'Cairan limfa melewati kelenjar limfa. Di tempat ini, zat asing disaring dan sel-sel imun membantu tubuh melawan kuman yang terbawa oleh cairan limfa.',
    fact: 'Saat tubuh melawan infeksi, kelenjar limfa dapat membesar karena sedang aktif menyaring dan membantu sistem kekebalan tubuh.',
  },
  {
    id: 'return',
    listTitle: 'Kembali ke peredaran darah',
    title: 'Cairan kembali ke peredaran darah',
    description: 'Setelah dikumpulkan dan disaring, cairan limfa mengalir ke pembuluh limfa yang lebih besar lalu kembali bergabung dengan pembuluh darah di dekat jantung.',
    fact: 'Sistem limfatik menjaga jumlah cairan tubuh tetap seimbang sekaligus mengembalikan protein yang ikut keluar dari pembuluh darah.',
  },
] as const

type StageId = (typeof STAGES)[number]['id']

type LymphFlowSceneProps = {
  onBackToHome?: () => void
  onBack?: () => void
  onComplete?: () => void
  transitionState?: 'entering' | 'entered' | 'exiting'
}

function StageDiagram({ stage }: { stage: StageId }) {
  if (stage === 'tissue') {
    return (
      <div className="lymph-flow__diagram lymph-flow__diagram--tissue" aria-label="Cairan jaringan bergerak menuju pembuluh limfa">
        <img className="lymph-flow__tissue-composite" src={tissueArt} alt="Diagram jaringan dan pembuluh limfa" />
        <div className="lymph-flow__tissue-particles" aria-hidden="true">
          {Array.from({ length: 6 }, (_, index) => <img key={index} src={fluidParticleArt} alt="" style={{ '--particle': index } as CSSProperties} />)}
        </div>
        <span className="lymph-flow__diagram-label lymph-flow__diagram-label--tissue">Cairan di sekitar<br />jaringan</span>
        <span className="lymph-flow__diagram-label lymph-flow__diagram-label--vessel">Pembuluh limfa</span>
      </div>
    )
  }

  if (stage === 'vessel') {
    return (
      <div className="lymph-flow__diagram lymph-flow__diagram--vessel" aria-label="Cairan limfa mengalir dalam pembuluh limfa melalui katup">
        <img className="lymph-flow__vessel-tube" src={greenTubeArt} alt="" />
        <img className="lymph-flow__vessel-branch" src={greenVesselArt} alt="" />
        <img className="lymph-flow__vessel-arrow" src={arrowStraightArt} alt="" />
        <div className="lymph-flow__valve lymph-flow__valve--upper" aria-hidden="true" />
        <div className="lymph-flow__valve lymph-flow__valve--lower" aria-hidden="true" />
        <div className="lymph-flow__moving-particles lymph-flow__moving-particles--vessel" aria-hidden="true">
          {Array.from({ length: 5 }, (_, index) => <img key={index} src={lymphParticleArt} alt="" style={{ '--particle': index } as CSSProperties} />)}
        </div>
        <span className="lymph-flow__diagram-caption">Katup menjaga limfa tetap mengalir ke atas</span>
      </div>
    )
  }

  if (stage === 'node') {
    return (
      <div className="lymph-flow__diagram lymph-flow__diagram--node" aria-label="Kelenjar limfa menyaring cairan limfa">
        <img className="lymph-flow__node-vessel lymph-flow__node-vessel--in" src={greenVesselArt} alt="" />
        <img className="lymph-flow__node-vessel lymph-flow__node-vessel--out" src={greenVesselArt} alt="" />
        <span className="lymph-flow__node-pulse" aria-hidden="true" />
        <img className="lymph-flow__single-node" src={lymphNodeArt} alt="Kelenjar limfa" />
        <img className="lymph-flow__node-arrow lymph-flow__node-arrow--in" src={arrowCurvedArt} alt="" />
        <img className="lymph-flow__node-arrow lymph-flow__node-arrow--out" src={arrowCurvedArt} alt="" />
        <img className="lymph-flow__foreign-particle" src={foreignParticleArt} alt="Zat asing yang disaring" />
        <div className="lymph-flow__moving-particles lymph-flow__moving-particles--node" aria-hidden="true">
          {Array.from({ length: 4 }, (_, index) => <img key={index} src={lymphParticleArt} alt="" style={{ '--particle': index } as CSSProperties} />)}
        </div>
        <span className="lymph-flow__diagram-caption">Kelenjar limfa menyaring zat asing</span>
      </div>
    )
  }

  return (
    <div className="lymph-flow__diagram lymph-flow__diagram--return" aria-label="Cairan limfa kembali bergabung dengan pembuluh darah">
      <img className="lymph-flow__junction" src={junctionArt} alt="Pertemuan pembuluh limfa dengan pembuluh darah" />
      <img className="lymph-flow__return-arrow" src={arrowCurvedArt} alt="" />
      <div className="lymph-flow__moving-particles lymph-flow__moving-particles--return" aria-hidden="true">
        {Array.from({ length: 4 }, (_, index) => <img key={index} src={lymphParticleArt} alt="" style={{ '--particle': index } as CSSProperties} />)}
      </div>
      <span className="lymph-flow__return-label lymph-flow__return-label--lymph">Pembuluh limfa</span>
      <span className="lymph-flow__return-label lymph-flow__return-label--blood">Pembuluh darah</span>
    </div>
  )
}

export function LymphFlowScene({ onBackToHome, onBack, onComplete, transitionState = 'entered' }: LymphFlowSceneProps) {
  const scale = useStageCoverScale(DESIGN_WIDTH, DESIGN_HEIGHT, SAFE_WIDTH, SAFE_HEIGHT)
  const [stageIndex, setStageIndex] = useState(0)
  const [audioOn, setAudioOn] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playStart, setPlayStart] = useState(0)
  const [visited, setVisited] = useState<ReadonlySet<StageId>>(() => new Set(['tissue']))
  const [showHint, setShowHint] = useState(false)
  const stage = STAGES[stageIndex]
  const style = { '--stage-scale': scale } as CSSProperties

  useEffect(() => {
    if (!isPlaying) return undefined
    const timer = window.setTimeout(() => {
      const nextIndex = (stageIndex + 1) % STAGES.length
      setStageIndex(nextIndex)
      setVisited((current) => new Set(current).add(STAGES[nextIndex].id))
      if (nextIndex === playStart) setIsPlaying(false)
    }, 2200)
    return () => window.clearTimeout(timer)
  }, [isPlaying, playStart, stageIndex])

  const selectStage = (index: number) => {
    setIsPlaying(false)
    setStageIndex(index)
    setVisited((current) => new Set(current).add(STAGES[index].id))
  }

  const toggleAnimation = () => {
    if (isPlaying) {
      setIsPlaying(false)
      return
    }
    setPlayStart(stageIndex)
    setIsPlaying(true)
  }

  return (
    <main className="lymph-flow" data-testid="lymph-flow-scene" data-microscene="5.8" data-stage={stage.id} data-playing={isPlaying} data-explored={visited.size} data-transition={transitionState} style={style} aria-labelledby="lymph-flow-heading">
      <div className="lymph-flow__stage">
        <img className="lymph-flow__background" src={backgroundArt} alt="" aria-hidden="true" />

        <button className="lymph-flow__icon lymph-flow__home" type="button" aria-label="Kembali ke Beranda" onClick={onBackToHome}><img src={homeArt} alt="" /></button>
        <button className="lymph-flow__icon lymph-flow__top-back" type="button" aria-label="Kembali ke materi sebelumnya" onClick={onBack}><img src={backArt} alt="" /></button>
        <button className="lymph-flow__icon lymph-flow__audio" type="button" aria-label={audioOn ? 'Matikan musik latar' : 'Aktifkan musik latar'} aria-pressed={audioOn} onClick={() => setAudioOn((value) => !value)}><img src={audioOn ? bgmOnArt : bgmOffArt} alt="" /></button>
        <HelpButton className="lymph-flow__icon lymph-flow__help" label="Bantuan perjalanan cairan limfa" onClick={() => setShowHint((value) => !value)} />

        <header className="lymph-flow__header">
          <p>Materi 2 - Sistem Organ Tubuh (8 / 8)</p>
          <h1 id="lymph-flow-heading">Bagaimana Sistem Limfatik Bekerja?</h1>
          <span>Amati perjalanan cairan limfa dari jaringan, melalui pembuluh limfa, melewati kelenjar limfa, lalu kembali ke peredaran darah.</span>
        </header>

        <aside className="lymph-flow__steps" aria-label="Tahapan perjalanan cairan limfa">
          <h2>Perjalanan Cairan Limfa</h2>
          <p>Klik tiap tahap atau putar animasi<br />untuk melihat prosesnya.</p>
          <div className="lymph-flow__step-list">
            {STAGES.map((item, index) => (
              <button key={item.id} type="button" data-testid={`lymph-flow-step-${item.id}`} data-selected={index === stageIndex} aria-pressed={index === stageIndex} onClick={() => selectStage(index)}>
                <span>{index + 1}</span><strong>{item.listTitle}</strong><ChevronRight aria-hidden="true" />
              </button>
            ))}
          </div>
          <button className="lymph-flow__play" type="button" data-testid="lymph-flow-play-button" aria-pressed={isPlaying} onClick={toggleAnimation}>
            {isPlaying ? <Pause aria-hidden="true" fill="currentColor" /> : <Play aria-hidden="true" fill="currentColor" />} {isPlaying ? 'Jeda Animasi' : 'Putar Animasi'}
          </button>
        </aside>

        <section className="lymph-flow__anatomy" aria-label="Ilustrasi sistem limfatik manusia">
          <span className={`lymph-flow__focus lymph-flow__focus--${stage.id}`} aria-hidden="true" />
          <img className="lymph-flow__body" src={bodyArt} alt="Ilustrasi tubuh manusia dengan organ dan sistem limfatik" />
          <span className="lymph-flow__callout lymph-flow__callout--thymus">Timus</span>
          <span className="lymph-flow__callout lymph-flow__callout--node">Kelenjar Limfa</span>
          <span className="lymph-flow__callout lymph-flow__callout--spleen">Limpa</span>
          {stage.id === 'tissue' && (
            <div className="lymph-flow__magnifier" aria-label="Perbesaran cairan jaringan menuju pembuluh limfa">
              <img src={tissueArt} alt="Perbesaran jaringan dan pembuluh limfa" />
              <span className="lymph-flow__magnifier-label lymph-flow__magnifier-label--fluid">Cairan jaringan</span>
              <span className="lymph-flow__magnifier-label lymph-flow__magnifier-label--entry">Masuk ke<br />pembuluh limfa</span>
            </div>
          )}
        </section>

        <aside className="lymph-flow__details" data-testid="lymph-flow-information" aria-live="polite">
          <p className="lymph-flow__stage-count">Tahap {stageIndex + 1} dari 4</p>
          <h2>{stage.title}</h2>
          <p className="lymph-flow__description">{stage.description}</p>
          <StageDiagram stage={stage.id} />
          <footer>
            <img src={lightbulbArt} alt="" aria-hidden="true" />
            <div><h3>Tahukah Kamu?</h3><p>{stage.fact}</p></div>
          </footer>
        </aside>

        {showHint && <p className="lymph-flow__hint" role="status">Pilih tahap perjalanan cairan limfa, atau tekan Putar Animasi untuk melihat satu siklus lengkap.</p>}
        <button className="lymph-flow__bottom-back" type="button" onClick={onBack}><ArrowLeft aria-hidden="true" />Sebelumnya</button>
        <button className="lymph-flow__complete" type="button" data-testid="lymph-flow-complete-button" onClick={onComplete}>Selesaikan Materi 2<ChevronRight aria-hidden="true" /></button>
      </div>
    </main>
  )
}
