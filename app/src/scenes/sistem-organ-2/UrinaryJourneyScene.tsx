import { useEffect, useState, type CSSProperties } from 'react'
import { useGlobalAudio } from '../../audio/GlobalAudio'
import { ArrowLeft, ArrowRight, ChevronRight, ClipboardList, LoaderCircle, Play, RotateCcw } from 'lucide-react'

import backgroundArt from '../../assets/02_scene/06_sistem_organ_2/6.3/background.png'
import bodyUrinaryArt from '../../assets/02_scene/06_sistem_organ_2/6.4/02_body_urinary_system_posterior.png'
import kidneySectionArt from '../../assets/02_scene/06_sistem_organ_2/6.4/05_kidney_sagittal_section_zoom_glomerulus.png'
import kidneyVesselArt from '../../assets/02_scene/06_sistem_organ_2/6.4/35_kidney_cross_section_with_vessel_droplets.png'
import bloodVesselArt from '../../assets/02_scene/06_sistem_organ_2/6.4/06_blood_vessel_cross_section_with_cells.png'
import redBloodCellArt from '../../assets/02_scene/06_sistem_organ_2/6.4/09_red_blood_cell_tiny.png'
import yellowDropArt from '../../assets/02_scene/06_sistem_organ_2/6.4/28_droplet_yellow_small_A.png'
import ureterArt from '../../assets/02_scene/06_sistem_organ_2/6.4/39_ureter_squiggle_tube_B.png'
import bladderIconArt from '../../assets/02_scene/06_sistem_organ_2/6.4/38_bladder_with_ureter_stubs_icon.png'
import urethraArt from '../../assets/02_scene/06_sistem_organ_2/6.4/41_urethra_line_icon.png'
import pinArt from '../../assets/02_scene/06_sistem_organ_2/6.3/icon_pin.png'
import gearArt from '../../assets/02_scene/06_sistem_organ_2/6.3/icon_gear.png'
import lightbulbArt from '../../assets/02_scene/06_sistem_organ_2/6.3/icon_lightbulb.png'
import bgmOffArt from '../../assets/01_reusable/buttons/btn_bgm_off.png'
import bgmOnArt from '../../assets/01_reusable/buttons/btn_bgm_on.png'
import homeArt from '../../assets/01_reusable/buttons/btn_home.png'
import { useSceneExitTransition } from '../../hooks/useSceneExitTransition'
import { useStageCoverScale } from '../../hooks/useStageCoverScale'
import './UrinaryJourneyScene.css'

const DESIGN_WIDTH = 1920
const DESIGN_HEIGHT = 1080
const SAFE_WIDTH = 1860
const SAFE_HEIGHT = 1046
const STEP_DURATION = 2_250

const ORGANS = {
  ginjal: {
    title: 'Ginjal', art: kidneyVesselArt,
    description: 'Ginjal merupakan organ utama sistem perkemihan yang berfungsi menyaring darah dan membuang zat sisa melalui urin.',
    location: 'Terletak di bagian belakang rongga perut, di sisi kanan dan kiri tulang belakang.',
    function: 'Menyaring darah serta membantu membuang zat sisa dan kelebihan cairan melalui urin.',
    system: 'Ginjal menjadi tempat awal proses pembentukan urin sebelum urin dialirkan menuju ureter.',
    fact: 'Setiap hari, ginjal dapat menyaring sekitar 180 liter darah untuk membentuk urin, namun urin yang dikeluarkan hanya sekitar 1–2 liter.',
  },
  ureter: {
    title: 'Ureter', art: ureterArt,
    description: 'Ureter adalah sepasang saluran yang membawa urin dari ginjal menuju kandung kemih.',
    location: 'Memanjang dari setiap ginjal menuju kandung kemih di area perut hingga panggul.',
    function: 'Mengalirkan urin dari ginjal ke kandung kemih melalui gerakan otot dinding ureter.',
    system: 'Ureter menjadi jalur penghubung agar urin hasil penyaringan dapat tersimpan di kandung kemih.',
    fact: 'Otot ureter dapat berkontraksi lembut untuk membantu mendorong urin ke kandung kemih.',
  },
  kandungKemih: {
    title: 'Kandung Kemih', art: bladderIconArt,
    description: 'Kandung kemih adalah organ berongga yang menyimpan urin sementara sebelum dikeluarkan dari tubuh.',
    location: 'Berada di bagian bawah rongga panggul, di bawah kedua ureter.',
    function: 'Menyimpan urin sementara dan mengatur pengeluarannya saat kandung kemih telah terisi.',
    system: 'Urin dari kedua ureter dikumpulkan di kandung kemih sebelum dikeluarkan melalui uretra.',
    fact: 'Kandung kemih dapat mengembang saat menampung urin dan kembali mengecil setelah dikosongkan.',
  },
  uretra: {
    title: 'Uretra', art: urethraArt,
    description: 'Uretra merupakan saluran terakhir pada sistem perkemihan yang membawa urin keluar dari tubuh.',
    location: 'Terhubung dari bagian bawah kandung kemih menuju bagian luar tubuh.',
    function: 'Menjadi jalur keluarnya urin dari kandung kemih ke luar tubuh.',
    system: 'Uretra menyelesaikan jalur perkemihan setelah urin disimpan sementara di kandung kemih.',
    fact: 'Uretra bekerja bersama otot di sekitar kandung kemih saat tubuh mengeluarkan urin.',
  },
} as const

const STEPS = [
  { id: 'darah-menuju-ginjal', number: 1, title: 'Darah Menuju Ginjal', art: bloodVesselArt, summary: 'Darah membawa zat yang akan disaring menuju ginjal.', callout: 'Darah masuk ke ginjal', what: 'Darah membawa zat sisa dan kelebihan cairan menuju ginjal untuk disaring.' },
  { id: 'darah-disaring', number: 2, title: 'Darah Disaring', art: kidneyVesselArt, summary: 'Ginjal menyaring darah dan memisahkan zat yang diperlukan dari zat sisa.', callout: 'Darah disaring di ginjal', what: 'Di ginjal, zat yang masih diperlukan tetap berada dalam darah, sedangkan filtrat diteruskan untuk diproses.' },
  { id: 'urin-terbentuk', number: 3, title: 'Urin Terbentuk', art: yellowDropArt, summary: 'Zat sisa dan kelebihan cairan menjadi bagian dari urin.', callout: 'Urin mulai terbentuk', what: 'Filtrat mengandung zat sisa dan kelebihan cairan, lalu menjadi bagian dari urin.' },
  { id: 'urin-dialirkan', number: 4, title: 'Urin Dialirkan', art: bladderIconArt, summary: 'Urin mengalir melalui ureter menuju kandung kemih.', callout: 'Urin disimpan sementara di kandung kemih', what: 'Urin dari kedua ginjal bergerak melalui ureter dan terkumpul sementara di kandung kemih.' },
] as const

type OrganId = keyof typeof ORGANS
type StepId = (typeof STEPS)[number]['id']

type UrinaryJourneySceneProps = {
  onBackToHome?: () => void
  onBack?: () => void
  onComplete?: () => void
  simulationMode?: boolean
}

export function UrinaryJourneyScene({ onBackToHome, onBack, onComplete, simulationMode = false }: UrinaryJourneySceneProps) {
  const scale = useStageCoverScale(DESIGN_WIDTH, DESIGN_HEIGHT, SAFE_WIDTH, SAFE_HEIGHT)
  const { audioOn, toggleAudio } = useGlobalAudio()
  const [selectedOrgan, setSelectedOrgan] = useState<OrganId>('ginjal')
  const [selectedStep, setSelectedStep] = useState<StepId>('darah-menuju-ginjal')
  const [journeyMode, setJourneyMode] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [completed, setCompleted] = useState<ReadonlySet<StepId>>(() => new Set())
  const { isExiting, exitTo } = useSceneExitTransition()
  const stepIndex = STEPS.findIndex((step) => step.id === selectedStep)
  const activeStep = STEPS[stepIndex] ?? STEPS[0]
  const activeOrgan = ORGANS[selectedOrgan]
  const journeyFocus: OrganId = selectedStep === 'urin-dialirkan' ? 'kandungKemih' : 'ginjal'
  const focus = journeyMode ? journeyFocus : selectedOrgan
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

  const chooseOrgan = (id: OrganId) => {
    setSelectedOrgan(id)
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
    setSelectedStep('darah-menuju-ginjal')
    setIsPlaying(true)
  }

  return (
    <main className="urinary-journey" data-testid="urinary-journey-scene" data-microscene="6.4" data-selected-step={selectedStep} data-selected-organ={selectedOrgan} data-playing={isPlaying} data-complete={isComplete} data-exiting={isExiting} style={style} aria-labelledby="urinary-journey-heading">
      <div className="urinary-journey__stage">
        <img className="urinary-journey__background" src={backgroundArt} alt="" aria-hidden="true" />

        <button className="urinary-journey__icon urinary-journey__home" type="button" aria-label="Kembali ke Beranda" onClick={() => exitTo(onBackToHome)}><img src={homeArt} alt="" /></button>

        <button className="urinary-journey__icon urinary-journey__audio" type="button" aria-label={audioOn ? 'Matikan musik latar' : 'Aktifkan musik latar'} aria-pressed={audioOn} onClick={() => toggleAudio()}><img src={audioOn ? bgmOnArt : bgmOffArt} alt="" /></button>

        <header className="urinary-journey__header">
          <p>Materi 3 - Sistem Organ Tubuh (4 / 5)</p>
          <h1 id="urinary-journey-heading">Bagaimana Urin Terbentuk?</h1>
          <span>Kenali organ sistem perkemihan dan ikuti proses penyaringan darah hingga terbentuk urin.</span>
        </header>

        <aside className="urinary-journey__list" aria-label="Tahapan pembentukan urin">
          <h2>Proses Pembentukan Urin</h2>
          <p>Klik setiap tahap untuk melihat prosesnya<br />atau putar animasi.</p>
          <div className="urinary-journey__steps">
            {STEPS.map((step) => {
              const complete = completed.has(step.id)
              const active = step.id === selectedStep
              return <button key={step.id} className="urinary-journey__step" type="button" data-testid={`urinary-step-${step.id}`} data-active={active} data-complete={complete} aria-pressed={active} onClick={() => chooseStep(step.id)}>
                <span className="urinary-journey__step-number">{complete ? '✓' : step.number}</span>
                <img src={step.art} alt="" aria-hidden="true" />
                <span className="urinary-journey__step-copy"><strong>{step.title}</strong><span>{step.summary}</span></span>
                <ChevronRight aria-hidden="true" />
              </button>
            })}
          </div>
          <button className="urinary-journey__play" type="button" data-testid="urinary-play-button" aria-label={isComplete ? 'Putar ulang proses pembentukan urin' : 'Putar proses pembentukan urin'} onClick={playJourney} disabled={isPlaying}>
            {isPlaying ? <LoaderCircle className="urinary-journey__loading" aria-hidden="true" /> : isComplete ? <RotateCcw aria-hidden="true" /> : <Play aria-hidden="true" fill="currentColor" />} {isComplete ? 'Putar Ulang' : 'Putar Proses Pembentukan Urin'}
          </button>
        </aside>

        <section className="urinary-journey__anatomy" data-focus={focus} data-stage={journeyMode ? selectedStep : 'explore'} aria-label="Ilustrasi sistem perkemihan">
          <img className="urinary-journey__body" src={bodyUrinaryArt} alt="Ilustrasi tubuh manusia dengan ginjal, ureter, kandung kemih, dan uretra" />
          <button className="urinary-journey__hotspot urinary-journey__hotspot--ginjal" type="button" data-testid="urinary-organ-ginjal" data-active={focus === 'ginjal'} aria-label="Pilih Ginjal" onClick={() => chooseOrgan('ginjal')} />
          <button className="urinary-journey__hotspot urinary-journey__hotspot--ureter" type="button" data-testid="urinary-organ-ureter" data-active={focus === 'ureter'} aria-label="Pilih Ureter" onClick={() => chooseOrgan('ureter')} />
          <button className="urinary-journey__hotspot urinary-journey__hotspot--kandung-kemih" type="button" data-testid="urinary-organ-kandung-kemih" data-active={focus === 'kandungKemih'} aria-label="Pilih Kandung Kemih" onClick={() => chooseOrgan('kandungKemih')} />
          <button className="urinary-journey__hotspot urinary-journey__hotspot--uretra" type="button" data-testid="urinary-organ-uretra" data-active={focus === 'uretra'} aria-label="Pilih Uretra" onClick={() => chooseOrgan('uretra')} />
          <button className="urinary-journey__callout urinary-journey__callout--ginjal" type="button" data-active={focus === 'ginjal'} onClick={() => chooseOrgan('ginjal')}>Ginjal</button>
          <button className="urinary-journey__callout urinary-journey__callout--ureter" type="button" data-active={focus === 'ureter'} onClick={() => chooseOrgan('ureter')}>Ureter</button>
          <button className="urinary-journey__callout urinary-journey__callout--kandung-kemih" type="button" data-active={focus === 'kandungKemih'} onClick={() => chooseOrgan('kandungKemih')}>Kandung Kemih</button>
          <button className="urinary-journey__callout urinary-journey__callout--uretra" type="button" data-active={focus === 'uretra'} onClick={() => chooseOrgan('uretra')}>Uretra</button>
          {journeyMode && <UrineProcessAnimation stage={selectedStep} />}
        </section>

        <aside className="urinary-journey__info" data-testid="urinary-information" aria-live="polite">
          {journeyMode ? <JourneyInformation step={activeStep} /> : <OrganInformation organ={activeOrgan} />}
        </aside>

        {isComplete && <p className="urinary-journey__complete" data-testid="urinary-complete-message" role="status">✓ Proses Pembentukan Urin Selesai</p>}
        <p className="urinary-journey__callout-copy" aria-live="polite">{isPlaying ? activeStep.callout : ''}</p>
        {!simulationMode && <button className="urinary-journey__bottom-back" type="button" onClick={() => exitTo(onBack)}><ArrowLeft aria-hidden="true" />Sebelumnya</button>}
        <button className="urinary-journey__next" type="button" onClick={() => exitTo(onComplete)}>{simulationMode ? 'Selesaikan Simulasi' : 'Lanjut: Tantangan'}<ArrowRight aria-hidden="true" /></button>
      </div>
    </main>
  )
}

function OrganInformation({ organ }: { organ: (typeof ORGANS)[OrganId] }) {
  return <>
    <header><img src={organ.art} alt="" aria-hidden="true" /><div><h2>{organ.title}</h2><p>{organ.description}</p></div></header>
    <section><img className="urinary-journey__pin" src={pinArt} alt="" aria-hidden="true" /><div><h3>Lokasi Utama</h3><p>{organ.location}</p></div></section>
    <section><img src={gearArt} alt="" aria-hidden="true" /><div><h3>Fungsi Utama</h3><p>{organ.function}</p></div></section>
    <section className="urinary-journey__system-info"><span><ClipboardList aria-hidden="true" /></span><div><h3>Dalam Sistem Perkemihan</h3><p>{organ.system}</p></div></section>
    <footer><img src={lightbulbArt} alt="" aria-hidden="true" /><div><h3>Tahukah Kamu?</h3><p>{organ.fact}</p></div></footer>
  </>
}

function JourneyInformation({ step }: { step: (typeof STEPS)[number] }) {
  return <div className="urinary-journey__journey-panel">
    <span>Tahap {step.number} dari 4</span>
    <img src={step.art} alt="" aria-hidden="true" />
    <h2>{step.title}</h2>
    <h3>Apa yang Terjadi?</h3>
    <p>{step.what}</p>
  </div>
}

function UrineProcessAnimation({ stage }: { stage: StepId }) {
  if (stage === 'darah-menuju-ginjal') return <div className="urinary-journey__process urinary-journey__process--darah" aria-hidden="true"><BloodParticles /><span className="urinary-journey__kidney-pulse" /></div>
  if (stage === 'darah-disaring') return <div className="urinary-journey__process urinary-journey__process--filtrasi" aria-hidden="true"><FiltrationInset stage={stage} /></div>
  if (stage === 'urin-terbentuk') return <div className="urinary-journey__process urinary-journey__process--urin" aria-hidden="true"><FiltrationInset stage={stage} /></div>
  return <div className="urinary-journey__process urinary-journey__process--dialirkan" aria-hidden="true"><UrineParticles /><span className="urinary-journey__bladder-pulse" /></div>
}

function BloodParticles() {
  return <span className="urinary-journey__blood-particles">{[0, 1, 2, 3].map((particle) => <img key={particle} src={redBloodCellArt} alt="" />)}</span>
}

function FiltrationInset({ stage }: { stage: 'darah-disaring' | 'urin-terbentuk' }) {
  return <div className="urinary-journey__filtration-inset" data-stage={stage}>
    <img className="urinary-journey__filtration-kidney" src={kidneySectionArt} alt="" />
    <span className="urinary-journey__filtration-title">FILTRASI</span>
    <span className="urinary-journey__return-blood"><img src={redBloodCellArt} alt="" /><b>Kembali ke darah</b></span>
    <span className="urinary-journey__filtrate"><i /><i /><i /><b>Filtrat</b></span>
    <span className="urinary-journey__urine-drops"><img src={yellowDropArt} alt="" /><img src={yellowDropArt} alt="" /><img src={yellowDropArt} alt="" /><b>Urin</b></span>
  </div>
}

function UrineParticles() {
  return <span className="urinary-journey__urine-particles">{[0, 1, 2, 3].map((particle) => <img key={particle} src={yellowDropArt} alt="" />)}</span>
}
