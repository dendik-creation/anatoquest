import { useEffect, useState, type CSSProperties } from 'react'
import { ArrowLeft, ArrowRight, ChevronRight, LoaderCircle, Play, RotateCcw, Utensils } from 'lucide-react'

import backgroundArt from '../../assets/02_scene/06_sistem_organ_2/6.2/background.png'
import bodyArt from '../../assets/02_scene/06_sistem_organ_2/6.2/body_anatomy.png'
import mouthArt from '../../assets/02_scene/06_sistem_organ_2/6.2/mouth.png'
import esophagusArt from '../../assets/02_scene/06_sistem_organ_2/6.2/esophagus.png'
import stomachArt from '../../assets/02_scene/06_sistem_organ_2/6.2/stomach.png'
import smallIntestineArt from '../../assets/02_scene/06_sistem_organ_2/6.2/small_intestine.png'
import largeIntestineArt from '../../assets/02_scene/06_sistem_organ_2/6.2/large_intestine.png'
import pinArt from '../../assets/02_scene/06_sistem_organ_2/6.2/icon_pin.png'
import gearArt from '../../assets/02_scene/06_sistem_organ_2/6.2/icon_gear.png'
import lightbulbArt from '../../assets/02_scene/06_sistem_organ_2/6.2/icon_lightbulb.png'
import backArt from '../../assets/02_scene/06_sistem_organ_2/6.2/btn_back.png'
import bgmOffArt from '../../assets/02_scene/06_sistem_organ_2/6.2/btn_bgm_off.png'
import bgmOnArt from '../../assets/02_scene/06_sistem_organ_2/6.2/btn_bgm_on.png'
import homeArt from '../../assets/02_scene/06_sistem_organ_2/6.2/btn_home.png'
import helpArt from '../../assets/02_scene/06_sistem_organ_2/6.2/btn_help.png'
import { useStageCoverScale } from '../../hooks/useStageCoverScale'
import { useSceneExitTransition } from '../../hooks/useSceneExitTransition'
import './DigestionJourneyScene.css'

const DESIGN_WIDTH = 1920
const DESIGN_HEIGHT = 1080
const SAFE_WIDTH = 1860
const SAFE_HEIGHT = 1046
const STEP_DURATION = 2_000

const STAGES = [
  {
    id: 'mulut', number: 1, title: 'Mulut', art: mouthArt,
    summary: 'Makanan dikunyah dan bercampur dengan saliva.',
    description: 'Mulut merupakan bagian awal saluran pencernaan yang berperan penting dalam memulai proses pencernaan makanan.',
    location: 'Terletak di bagian kepala, merupakan pintu masuk saluran pencernaan.',
    function: 'Mengunyah makanan dan mencampurnya dengan saliva (air liur).',
    journey: 'Makanan mulai dipecah menjadi bagian yang lebih kecil sebelum ditelan menuju kerongkongan.',
    fact: 'Pencernaan sudah dimulai sejak makanan berada di dalam mulut.',
    callout: 'Makanan dikunyah dan bercampur dengan saliva',
  },
  {
    id: 'kerongkongan', number: 2, title: 'Kerongkongan', art: esophagusArt,
    summary: 'Makanan diteruskan menuju lambung.',
    description: 'Kerongkongan adalah saluran otot yang menghubungkan mulut dengan lambung.',
    location: 'Berada di leher dan dada, di belakang saluran pernapasan.',
    function: 'Mendorong makanan menuju lambung melalui gerakan peristaltik.',
    journey: 'Otot kerongkongan mendorong bolus makanan secara bertahap menuju lambung.',
    fact: 'Gerakan peristaltik tetap bekerja walaupun tubuh sedang berbaring.',
    callout: 'Otot mendorong makanan menuju lambung',
  },
  {
    id: 'lambung', number: 3, title: 'Lambung', art: stomachArt,
    summary: 'Makanan diaduk dan bercampur dengan cairan pencernaan.',
    description: 'Lambung adalah organ berotot yang mengolah makanan dengan bantuan asam dan enzim pencernaan.',
    location: 'Terletak di bagian kiri atas rongga perut, tepat di bawah hati.',
    function: 'Mengaduk makanan dan memecahnya menjadi bagian yang lebih sederhana.',
    journey: 'Makanan diaduk dan bercampur dengan cairan pencernaan sebelum diteruskan ke usus halus.',
    fact: 'Lambung dapat mengembang untuk menampung makanan yang baru masuk.',
    callout: 'Makanan diaduk dan bercampur dengan cairan pencernaan',
  },
  {
    id: 'usus-halus', number: 4, title: 'Usus Halus', art: smallIntestineArt,
    summary: 'Pencernaan dilanjutkan dan zat gizi diserap.',
    description: 'Usus halus merupakan tempat utama pencernaan lanjutan dan penyerapan zat gizi dari makanan.',
    location: 'Berada di rongga perut, melingkar di bagian tengah hingga bawah perut.',
    function: 'Menyerap zat gizi hasil pencernaan untuk dialirkan ke seluruh tubuh.',
    journey: 'Zat gizi dari makanan diserap melalui dinding usus dan masuk ke pembuluh darah.',
    fact: 'Usus halus memiliki lipatan dan vili yang memperluas area penyerapan zat gizi.',
    callout: 'Zat gizi diserap oleh tubuh',
  },
  {
    id: 'usus-besar', number: 5, title: 'Usus Besar', art: largeIntestineArt,
    summary: 'Air diserap dan sisa pencernaan diproses lebih lanjut.',
    description: 'Usus besar mengolah sisa pencernaan setelah sebagian besar zat gizi diserap di usus halus.',
    location: 'Mengelilingi usus halus di bagian perut hingga menuju rektum.',
    function: 'Menyerap air dari sisa pencernaan dan membentuk sisa makanan.',
    journey: 'Air diserap dari sisa pencernaan sebelum sisa makanan diteruskan ke bagian akhir saluran pencernaan.',
    fact: 'Usus besar juga menjadi tempat hidup banyak bakteri baik yang membantu tubuh.',
    callout: 'Air diserap dari sisa pencernaan',
  },
] as const

type StageId = (typeof STAGES)[number]['id']

type DigestionJourneySceneProps = {
  onBackToHome?: () => void
  onBack?: () => void
  onComplete?: () => void
}

export function DigestionJourneyScene({ onBackToHome, onBack, onComplete }: DigestionJourneySceneProps) {
  const scale = useStageCoverScale(DESIGN_WIDTH, DESIGN_HEIGHT, SAFE_WIDTH, SAFE_HEIGHT)
  const [audioOn, setAudioOn] = useState(true)
  const [selected, setSelected] = useState<StageId>('mulut')
  const [isPlaying, setIsPlaying] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [completed, setCompleted] = useState<ReadonlySet<StageId>>(() => new Set())
  const [showHint, setShowHint] = useState(false)
  const { isExiting, exitTo } = useSceneExitTransition()
  const activeIndex = STAGES.findIndex((stage) => stage.id === selected)
  const active = STAGES[activeIndex] ?? STAGES[0]
  const style = { '--stage-scale': scale } as CSSProperties

  useEffect(() => {
    if (!isPlaying) return undefined

    const timer = window.setTimeout(() => {
      setCompleted((current) => new Set(current).add(selected))
      if (activeIndex === STAGES.length - 1) {
        setIsPlaying(false)
        setIsComplete(true)
        return
      }
      setSelected(STAGES[activeIndex + 1].id)
    }, STEP_DURATION)

    return () => window.clearTimeout(timer)
  }, [activeIndex, isPlaying, selected])

  const selectStage = (stageId: StageId) => {
    setIsPlaying(false)
    setIsComplete(false)
    setSelected(stageId)
  }

  const playJourney = () => {
    setCompleted(new Set())
    setIsComplete(false)
    setSelected('mulut')
    setIsPlaying(true)
  }

  return (
    <main className="digestion-journey" data-testid="digestion-journey-scene" data-microscene="6.2" data-selected={selected} data-playing={isPlaying} data-complete={isComplete} data-exiting={isExiting} style={style} aria-labelledby="digestion-journey-heading">
      <div className="digestion-journey__stage">
        <img className="digestion-journey__background" src={backgroundArt} alt="" aria-hidden="true" />

        <button className="digestion-journey__icon digestion-journey__home" type="button" aria-label="Kembali ke Beranda" onClick={() => exitTo(onBackToHome)}><img src={homeArt} alt="" /></button>
        <button className="digestion-journey__icon digestion-journey__top-back" type="button" aria-label="Kembali ke materi sebelumnya" onClick={() => exitTo(onBack)}><img src={backArt} alt="" /></button>
        <button className="digestion-journey__icon digestion-journey__audio" type="button" aria-label={audioOn ? 'Matikan musik latar' : 'Aktifkan musik latar'} aria-pressed={audioOn} onClick={() => setAudioOn((value) => !value)}><img src={audioOn ? bgmOnArt : bgmOffArt} alt="" /></button>
        <button className="digestion-journey__icon digestion-journey__help" type="button" aria-label="Bantuan perjalanan makanan" onClick={() => setShowHint((value) => !value)}><img src={helpArt} alt="" /></button>

        <header className="digestion-journey__header">
          <p>Materi 3 - Sistem Organ Tubuh (2 / 5)</p>
          <h1 id="digestion-journey-heading">Bagaimana Makanan Dicerna?</h1>
          <span>Kenali organ pencernaan dan ikuti perjalanan makanan saat diolah oleh tubuh.</span>
        </header>

        <aside className="digestion-journey__list" aria-label="Tahapan perjalanan makanan">
          <h2>Perjalanan Makanan</h2>
          <p>Klik setiap tahap untuk melihat prosesnya<br />atau putar animasi.</p>
          <div className="digestion-journey__steps">
            {STAGES.map((stage) => {
              const complete = completed.has(stage.id)
              const activeStep = stage.id === selected
              return (
                <button key={stage.id} className="digestion-journey__step" type="button" data-testid={`digestion-stage-${stage.id}`} data-active={activeStep} data-complete={complete} aria-pressed={activeStep} onClick={() => selectStage(stage.id)}>
                  <span className="digestion-journey__step-number">{complete ? '✓' : stage.number}</span>
                  <img src={stage.art} alt="" aria-hidden="true" />
                  <span className="digestion-journey__step-copy"><strong>{stage.title}</strong><span>{stage.summary}</span></span>
                  <ChevronRight aria-hidden="true" />
                </button>
              )
            })}
          </div>
          <button className="digestion-journey__play" type="button" data-testid="digestion-play-button" aria-label={isComplete ? 'Putar ulang perjalanan makanan' : 'Putar perjalanan makanan'} onClick={playJourney} disabled={isPlaying}>
            {isPlaying ? <LoaderCircle className="digestion-journey__loading" aria-hidden="true" /> : isComplete ? <RotateCcw aria-hidden="true" /> : <Play aria-hidden="true" fill="currentColor" />} {isComplete ? 'Putar Ulang' : 'Putar Perjalanan Makanan'}
          </button>
        </aside>

        <section className="digestion-journey__anatomy" aria-label={`Ilustrasi proses pencernaan: ${active.title}`}>
          <div className="digestion-journey__halo" aria-hidden="true" />
          <img className="digestion-journey__body" src={bodyArt} alt="Ilustrasi tubuh manusia dengan organ pencernaan" />
          <img className="digestion-journey__organ digestion-journey__organ--mulut" src={mouthArt} alt="" aria-hidden="true" />
          <img className="digestion-journey__organ digestion-journey__organ--tract" src={esophagusArt} alt="" aria-hidden="true" />
          <img className="digestion-journey__organ digestion-journey__organ--small" src={smallIntestineArt} alt="" aria-hidden="true" />
          <img className="digestion-journey__organ digestion-journey__organ--large" src={largeIntestineArt} alt="" aria-hidden="true" />
          {STAGES.map((stage) => <button key={stage.id} className={`digestion-journey__hotspot digestion-journey__hotspot--${stage.id}`} type="button" data-testid={`digestion-organ-${stage.id}`} data-active={stage.id === selected} aria-label={`Pilih ${stage.title}`} onClick={() => selectStage(stage.id)}><span className="sr-only">{stage.title}</span></button>)}
          <button className="digestion-journey__callout digestion-journey__callout--mulut" type="button" data-active={selected === 'mulut'} onClick={() => selectStage('mulut')}>Mulut</button>
          <button className="digestion-journey__callout digestion-journey__callout--kerongkongan" type="button" data-active={selected === 'kerongkongan'} onClick={() => selectStage('kerongkongan')}>Kerongkongan</button>
          <button className="digestion-journey__callout digestion-journey__callout--lambung" type="button" data-active={selected === 'lambung'} onClick={() => selectStage('lambung')}>Lambung</button>
          <button className="digestion-journey__callout digestion-journey__callout--usus-halus" type="button" data-active={selected === 'usus-halus'} onClick={() => selectStage('usus-halus')}>Usus Halus</button>
          <button className="digestion-journey__callout digestion-journey__callout--usus-besar" type="button" data-active={selected === 'usus-besar'} onClick={() => selectStage('usus-besar')}>Usus Besar</button>
          {isPlaying && <FoodAnimation stage={selected} />}
          {selected === 'usus-halus' && isPlaying && <div className="digestion-journey__absorption" aria-hidden="true"><span>Zat gizi</span><i /><i /><i /><b>→ pembuluh darah</b></div>}
        </section>

        <aside className="digestion-journey__info" data-testid="digestion-information" aria-live="polite">
          <header><img src={active.art} alt="" aria-hidden="true" /><div><h2>{active.title}</h2><p>{active.description}</p></div></header>
          <section><img className="digestion-journey__pin" src={pinArt} alt="" aria-hidden="true" /><div><h3>Lokasi</h3><p>{active.location}</p></div></section>
          <section><img src={gearArt} alt="" aria-hidden="true" /><div><h3>Fungsi Utama</h3><p>{active.function}</p></div></section>
          <section className="digestion-journey__journey-info"><span><Utensils aria-hidden="true" /></span><div><h3>Dalam Perjalanan Makanan</h3><p>{active.journey}</p></div></section>
          <footer><img src={lightbulbArt} alt="" aria-hidden="true" /><div><h3>Tahukah Kamu?</h3><p>{active.fact}</p></div></footer>
        </aside>

        {showHint && <p className="digestion-journey__hint" role="status">Pilih organ pada tubuh atau salah satu tahapan di panel kiri. Tekan Putar Perjalanan Makanan untuk melihat urutannya.</p>}
        {isComplete && <p className="digestion-journey__complete" data-testid="digestion-complete-message" role="status">✓ Perjalanan Makanan Selesai</p>}
        <p className="digestion-journey__callout-copy" aria-live="polite">{isPlaying ? active.callout : ''}</p>
        <button className="digestion-journey__bottom-back" type="button" onClick={() => exitTo(onBack)}><ArrowLeft aria-hidden="true" />Sebelumnya</button>
        <button className="digestion-journey__next" type="button" onClick={() => exitTo(onComplete)}>Lanjut: Sistem Persarafan<ArrowRight aria-hidden="true" /></button>
      </div>
    </main>
  )
}

function FoodAnimation({ stage }: { stage: StageId }) {
  if (stage === 'mulut') return <div className="digestion-journey__food digestion-journey__food--mulut" aria-hidden="true"><i /><i /><i /><i /></div>
  if (stage === 'usus-halus') return <div className="digestion-journey__food digestion-journey__food--usus-halus" aria-hidden="true"><i /><i /><i /><i /></div>
  if (stage === 'usus-besar') return <div className="digestion-journey__food digestion-journey__food--usus-besar" aria-hidden="true"><i /><i /><i /></div>
  return <div className={`digestion-journey__food digestion-journey__food--${stage}`} aria-hidden="true"><i /></div>
}
