import { useEffect, useState, type CSSProperties } from 'react'
import { useGlobalAudio } from '../../audio/GlobalAudio'
import { ArrowLeft, ArrowRight, ChevronRight, ClipboardList, LoaderCircle, Play, RotateCcw } from 'lucide-react'

import backgroundArt from '../../assets/02_scene/06_sistem_organ_2/6.3/background.png'
import bodyNervousArt from '../../assets/02_scene/06_sistem_organ_2/6.3/body_nervous1.png'
import brainPinkArt from '../../assets/02_scene/06_sistem_organ_2/6.3/brain_pink_organ.png'
import brainBlueArt from '../../assets/02_scene/06_sistem_organ_2/6.3/brain_blue_icon.png'
import touchHandArt from '../../assets/02_scene/06_sistem_organ_2/6.3/touch_hand_icon.png'
import neuronArt from '../../assets/02_scene/06_sistem_organ_2/6.3/neuron_icon.png'
import flexingArmArt from '../../assets/02_scene/06_sistem_organ_2/6.3/flexing_arm_icon.png'
import painPulseArt from '../../assets/02_scene/06_sistem_organ_2/6.3/pain_pulse_red.png'
import particleArt from '../../assets/02_scene/06_sistem_organ_2/6.3/ball_tiny.png'
import arrowUpArt from '../../assets/02_scene/06_sistem_organ_2/6.3/arrow_up.png'
import arrowDownArt from '../../assets/02_scene/06_sistem_organ_2/6.3/arrow_down.png'
import motionBlurArt from '../../assets/02_scene/06_sistem_organ_2/6.3/motion_blur_horizontal.png'
import pinArt from '../../assets/02_scene/06_sistem_organ_2/6.3/icon_pin.png'
import gearArt from '../../assets/02_scene/06_sistem_organ_2/6.3/icon_gear.png'
import lightbulbArt from '../../assets/02_scene/06_sistem_organ_2/6.3/icon_lightbulb.png'
import bgmOffArt from '../../assets/02_scene/06_sistem_organ_2/6.3/btn_bgm_off.png'
import bgmOnArt from '../../assets/02_scene/06_sistem_organ_2/6.3/btn_bgm_on.png'
import homeArt from '../../assets/02_scene/06_sistem_organ_2/6.3/btn_home.png'
import { useStageCoverScale } from '../../hooks/useStageCoverScale'
import { useSceneExitTransition } from '../../hooks/useSceneExitTransition'
import './NerveImpulseScene.css'

const DESIGN_WIDTH = 1920
const DESIGN_HEIGHT = 1080
const SAFE_WIDTH = 1860
const SAFE_HEIGHT = 1046
const STEP_DURATION = 2_000

const ANATOMY = {
  otak: {
    title: 'Otak', art: brainPinkArt,
    description: 'Otak merupakan pusat pengendali tubuh yang menerima, memproses, dan menafsirkan berbagai informasi dari lingkungan dan dari dalam tubuh.',
    location: 'Terletak di dalam rongga tengkorak.',
    function: 'Mengolah informasi, mengambil keputusan, dan mengatur berbagai aktivitas tubuh.',
    system: 'Otak bekerja sebagai pusat pemrosesan informasi sebelum tubuh menghasilkan respons.',
    fact: 'Otak dapat memproses informasi dengan sangat cepat, bahkan dalam hitungan milidetik.',
  },
  sumsum: {
    title: 'Sumsum Tulang Belakang', art: brainBlueArt,
    description: 'Sumsum tulang belakang merupakan jalur utama yang menghubungkan otak dengan saraf di berbagai bagian tubuh.',
    location: 'Memanjang dari bagian bawah otak melalui ruas tulang belakang.',
    function: 'Menghubungkan otak dengan berbagai bagian tubuh dan menjadi jalur penghantaran impuls saraf.',
    system: 'Impuls dari tubuh dapat bergerak melalui sumsum tulang belakang menuju pusat saraf atau kembali menuju bagian tubuh.',
    fact: 'Sumsum tulang belakang membantu impuls bergerak cepat antara pusat saraf dan tubuh.',
  },
  saraf: {
    title: 'Saraf Perifer', art: neuronArt,
    description: 'Saraf perifer adalah jaringan saraf yang menghubungkan sistem saraf pusat dengan berbagai bagian tubuh.',
    location: 'Tersebar dari otak dan sumsum tulang belakang menuju berbagai bagian tubuh.',
    function: 'Membawa informasi antara sistem saraf pusat dan bagian tubuh.',
    system: 'Saraf membawa informasi rangsangan menuju pusat saraf dan membawa perintah respons kembali ke tubuh.',
    fact: 'Saraf perifer menjangkau kulit, otot, dan organ di seluruh tubuh.',
  },
} as const

const STEPS = [
  { id: 'rangsangan', number: 1, title: 'Rangsangan Diterima', art: touchHandArt, summary: 'Tubuh menerima informasi dari lingkungan.', callout: 'Rangsangan diterima', what: 'Reseptor menerima rangsangan dan mengubahnya menjadi informasi yang dapat diteruskan melalui sistem saraf.' },
  { id: 'impuls', number: 2, title: 'Impuls Dikirim', art: neuronArt, summary: 'Informasi dibawa melalui saraf menuju sistem saraf pusat.', callout: 'Impuls menuju sistem saraf pusat', what: 'Informasi dari rangsangan dibawa melalui saraf menuju sistem saraf pusat.' },
  { id: 'diproses', number: 3, title: 'Informasi Diproses', art: brainBlueArt, summary: 'Sistem saraf pusat menerima dan memproses informasi.', callout: 'Informasi diproses', what: 'Sistem saraf pusat menerima informasi dan menentukan respons yang sesuai.' },
  { id: 'respons', number: 4, title: 'Respons Dikirim', art: flexingArmArt, summary: 'Perintah dikirim melalui saraf menuju bagian tubuh.', callout: 'Respons dikirim ke tubuh', what: 'Impuls respons bergerak melalui saraf menuju bagian tubuh yang akan melakukan tindakan.' },
] as const

type AnatomyId = keyof typeof ANATOMY
type StepId = (typeof STEPS)[number]['id']

type NerveImpulseSceneProps = {
  onBackToHome?: () => void
  onBack?: () => void
  onComplete?: () => void
  simulationMode?: boolean
}

export function NerveImpulseScene({ onBackToHome, onBack, onComplete, simulationMode = false }: NerveImpulseSceneProps) {
  const scale = useStageCoverScale(DESIGN_WIDTH, DESIGN_HEIGHT, SAFE_WIDTH, SAFE_HEIGHT)
  const { audioOn, toggleAudio } = useGlobalAudio()
  const [selectedAnatomy, setSelectedAnatomy] = useState<AnatomyId>('otak')
  const [selectedStep, setSelectedStep] = useState<StepId>('rangsangan')
  const [journeyMode, setJourneyMode] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [completed, setCompleted] = useState<ReadonlySet<StepId>>(() => new Set())
  const { isExiting, exitTo } = useSceneExitTransition()
  const stepIndex = STEPS.findIndex((step) => step.id === selectedStep)
  const activeStep = STEPS[stepIndex] ?? STEPS[0]
  const anatomy = ANATOMY[selectedAnatomy]
  const anatomyFocus: AnatomyId = journeyMode ? (selectedStep === 'diproses' ? 'otak' : 'saraf') : selectedAnatomy
  const style = { '--stage-scale': scale } as CSSProperties

  useEffect(() => {
    if (!isPlaying) return undefined

    const timer = window.setTimeout(() => {
      setCompleted((current) => new Set(current).add(selectedStep))
      if (stepIndex === STEPS.length - 1) {
        setIsPlaying(false)
        setIsComplete(true)
        setJourneyMode(false)
        return
      }
      setSelectedStep(STEPS[stepIndex + 1].id)
    }, STEP_DURATION)

    return () => window.clearTimeout(timer)
  }, [isPlaying, selectedStep, stepIndex])

  const chooseAnatomy = (id: AnatomyId) => {
    setSelectedAnatomy(id)
    setJourneyMode(false)
    setIsPlaying(false)
    setIsComplete(false)
  }

  const chooseStep = (id: StepId) => {
    setSelectedStep(id)
    setJourneyMode(true)
    setIsPlaying(false)
    setIsComplete(false)
    setCompleted(new Set())
  }

  const playJourney = () => {
    setCompleted(new Set())
    setIsComplete(false)
    setJourneyMode(true)
    setSelectedStep('rangsangan')
    setIsPlaying(true)
  }

  return (
    <main className="nerve-impulse" data-testid="nerve-impulse-scene" data-microscene="6.3" data-selected-step={selectedStep} data-selected-anatomy={selectedAnatomy} data-playing={isPlaying} data-complete={isComplete} data-exiting={isExiting} style={style} aria-labelledby="nerve-impulse-heading">
      <div className="nerve-impulse__stage">
        <img className="nerve-impulse__background" src={backgroundArt} alt="" aria-hidden="true" />

        <button className="nerve-impulse__icon nerve-impulse__home" type="button" aria-label="Kembali ke Beranda" onClick={() => exitTo(onBackToHome)}><img src={homeArt} alt="" /></button>

        <button className="nerve-impulse__icon nerve-impulse__audio" type="button" aria-label={audioOn ? 'Matikan musik latar' : 'Aktifkan musik latar'} aria-pressed={audioOn} onClick={() => toggleAudio()}><img src={audioOn ? bgmOnArt : bgmOffArt} alt="" /></button>

        <header className="nerve-impulse__header">
          <p>Materi 3 - Sistem Organ Tubuh (3 / 5)</p>
          <h1 id="nerve-impulse-heading">Bagaimana Tubuh Mengirim Pesan?</h1>
          <span>Kenali bagian utama sistem persarafan dan amati bagaimana impuls membawa informasi melalui tubuh.</span>
        </header>

        <aside className="nerve-impulse__list" aria-label="Tahapan perjalanan impuls">
          <h2>Perjalanan Impuls</h2>
          <p>Klik setiap tahap untuk melihat prosesnya<br />atau putar animasi.</p>
          <div className="nerve-impulse__steps">
            {STEPS.map((step) => {
              const complete = completed.has(step.id)
              const active = step.id === selectedStep
              return <button key={step.id} className="nerve-impulse__step" type="button" data-testid={`nerve-step-${step.id}`} data-active={active} data-complete={complete} aria-pressed={active} onClick={() => chooseStep(step.id)}>
                <span className="nerve-impulse__step-number">{complete ? '✓' : step.number}</span>
                <img src={step.art} alt="" aria-hidden="true" />
                <span className="nerve-impulse__step-copy"><strong>{step.title}</strong><span>{step.summary}</span></span>
                <ChevronRight aria-hidden="true" />
              </button>
            })}
          </div>
          <button className="nerve-impulse__play" type="button" data-testid="nerve-play-button" aria-label={isComplete ? 'Putar ulang impuls saraf' : 'Putar impuls saraf'} onClick={playJourney} disabled={isPlaying}>
            {isPlaying ? <LoaderCircle className="nerve-impulse__loading" aria-hidden="true" /> : isComplete ? <RotateCcw aria-hidden="true" /> : <Play aria-hidden="true" fill="currentColor" />} {isComplete ? 'Putar Ulang' : 'Putar Impuls Saraf'}
          </button>
        </aside>

        <section className="nerve-impulse__anatomy" data-stage={journeyMode ? selectedStep : 'explore'} aria-label="Ilustrasi tubuh manusia dengan sistem persarafan">
          <div className="nerve-impulse__halo" aria-hidden="true" />
          <img className="nerve-impulse__body" src={bodyNervousArt} alt="Ilustrasi tubuh manusia dengan otak, sumsum tulang belakang, dan saraf perifer" />
          <button className="nerve-impulse__hotspot nerve-impulse__hotspot--otak" type="button" data-testid="nerve-organ-otak" data-active={anatomyFocus === 'otak'} aria-label="Pilih Otak" onClick={() => chooseAnatomy('otak')} />
          <button className="nerve-impulse__hotspot nerve-impulse__hotspot--sumsum" type="button" data-testid="nerve-organ-sumsum" data-active={anatomyFocus === 'sumsum'} aria-label="Pilih Sumsum Tulang Belakang" onClick={() => chooseAnatomy('sumsum')} />
          <button className="nerve-impulse__hotspot nerve-impulse__hotspot--saraf" type="button" data-testid="nerve-organ-saraf" data-active={anatomyFocus === 'saraf'} aria-label="Pilih Saraf Perifer" onClick={() => chooseAnatomy('saraf')} />
          <button className="nerve-impulse__callout nerve-impulse__callout--otak" type="button" data-active={anatomyFocus === 'otak'} onClick={() => chooseAnatomy('otak')}>Otak</button>
          <button className="nerve-impulse__callout nerve-impulse__callout--sumsum" type="button" data-active={anatomyFocus === 'sumsum'} onClick={() => chooseAnatomy('sumsum')}>Sumsum<br />Tulang Belakang</button>
          <button className="nerve-impulse__callout nerve-impulse__callout--saraf" type="button" data-active={anatomyFocus === 'saraf'} onClick={() => chooseAnatomy('saraf')}>Saraf Perifer</button>
          <button className="nerve-impulse__callout nerve-impulse__callout--rangsangan" type="button" data-active={journeyMode && selectedStep === 'rangsangan'} onClick={() => chooseStep('rangsangan')}>Rangsangan</button>
          {isPlaying && <ImpulseAnimation stage={selectedStep} />}
        </section>

        <aside className="nerve-impulse__info" data-testid="nerve-information" aria-live="polite">
          {journeyMode ? <JourneyInformation step={activeStep} /> : <AnatomyInformation anatomy={anatomy} />}
        </aside>

        {isComplete && <p className="nerve-impulse__complete" data-testid="nerve-complete-message" role="status">✓ Perjalanan Impuls Selesai</p>}
        <p className="nerve-impulse__callout-copy" aria-live="polite">{isPlaying ? activeStep.callout : ''}</p>
        {!simulationMode && <button className="nerve-impulse__bottom-back" type="button" onClick={() => exitTo(onBack)}><ArrowLeft aria-hidden="true" />Sebelumnya</button>}
        <button className="nerve-impulse__next" type="button" onClick={() => exitTo(onComplete)}>{simulationMode ? 'Selesaikan Simulasi' : 'Lanjut: Sistem Perkemihan'}<ArrowRight aria-hidden="true" /></button>
      </div>
    </main>
  )
}

function AnatomyInformation({ anatomy }: { anatomy: (typeof ANATOMY)[AnatomyId] }) {
  return <>
    <header><img src={anatomy.art} alt="" aria-hidden="true" /><div><h2>{anatomy.title}</h2><p>{anatomy.description}</p></div></header>
    <section><img className="nerve-impulse__pin" src={pinArt} alt="" aria-hidden="true" /><div><h3>Lokasi Utama</h3><p>{anatomy.location}</p></div></section>
    <section><img src={gearArt} alt="" aria-hidden="true" /><div><h3>Fungsi Utama</h3><p>{anatomy.function}</p></div></section>
    <section className="nerve-impulse__system-info"><span><ClipboardList aria-hidden="true" /></span><div><h3>Dalam Sistem Persarafan</h3><p>{anatomy.system}</p></div></section>
    <footer><img src={lightbulbArt} alt="" aria-hidden="true" /><div><h3>Tahukah Kamu?</h3><p>{anatomy.fact}</p></div></footer>
  </>
}

function JourneyInformation({ step }: { step: (typeof STEPS)[number] }) {
  return <div className="nerve-impulse__journey-panel">
    <span>Tahap {step.number} dari 4</span>
    <img src={step.art} alt="" aria-hidden="true" />
    <h2>{step.title}</h2>
    <h3>Apa yang Terjadi?</h3>
    <p>{step.what}</p>
  </div>
}

function ImpulseAnimation({ stage }: { stage: StepId }) {
  if (stage === 'rangsangan') return <div className="nerve-impulse__impulse nerve-impulse__impulse--rangsangan" aria-hidden="true"><img className="nerve-impulse__pulse" src={painPulseArt} alt="" /><img className="nerve-impulse__particle" src={particleArt} alt="" /><span className="nerve-impulse__stimulus-spark" /></div>
  if (stage === 'impuls') return <div className="nerve-impulse__impulse nerve-impulse__impulse--impuls" aria-hidden="true"><SignalRoute direction="up" /><img className="nerve-impulse__particle" src={particleArt} alt="" /><img className="nerve-impulse__up" src={arrowUpArt} alt="" /></div>
  if (stage === 'diproses') return <div className="nerve-impulse__impulse nerve-impulse__impulse--diproses" aria-hidden="true"><span className="nerve-impulse__processing-glow" /><img className="nerve-impulse__particle nerve-impulse__particle--one" src={particleArt} alt="" /><img className="nerve-impulse__particle nerve-impulse__particle--two" src={particleArt} alt="" /><img className="nerve-impulse__particle nerve-impulse__particle--three" src={particleArt} alt="" /></div>
  return <div className="nerve-impulse__impulse nerve-impulse__impulse--respons" aria-hidden="true"><SignalRoute direction="down" /><img className="nerve-impulse__particle" src={particleArt} alt="" /><img className="nerve-impulse__down" src={arrowDownArt} alt="" /><img className="nerve-impulse__motion" src={motionBlurArt} alt="" /><span className="nerve-impulse__response-pulse" /></div>
}

function SignalRoute({ direction }: { direction: 'up' | 'down' }) {
  return <span className={`nerve-impulse__route nerve-impulse__route--${direction}`}><i /><i /><i /></span>
}
