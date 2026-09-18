import { useState, type CSSProperties } from 'react'
import { ArrowLeft, ArrowRight, ChevronRight } from 'lucide-react'

import backgroundArt from '../../assets/02_scene/05_sistem_organ_1/backgrounds/00_background.png'
import brainArt from '../../assets/02_scene/06_sistem_organ_2/6.1/brain_organ.png'
import digestiveArt from '../../assets/02_scene/06_sistem_organ_2/6.1/digestive_system_organ.png'
import urinaryArt from '../../assets/02_scene/06_sistem_organ_2/6.1/kidney_bladder_green.png'
import bodyDigestiveArt from '../../assets/02_scene/06_sistem_organ_2/6.1/body_digestive.png'
import bodyNervousArt from '../../assets/02_scene/06_sistem_organ_2/6.1/body_nervous.png'
import bodyUrinaryArt from '../../assets/02_scene/06_sistem_organ_2/6.1/body_urinary.png'
import pinArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.3/18_pin_icon.png'
import gearArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.3/19_gear_icon.png'
import lightbulbArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.3/20_lightbulb_icon.png'
import backArt from '../../assets/01_reusable/buttons/btn_back.png'
import bgmOffArt from '../../assets/01_reusable/buttons/btn_bgm_off.png'
import bgmOnArt from '../../assets/01_reusable/buttons/btn_bgm_on.png'
import homeArt from '../../assets/01_reusable/buttons/btn_home.png'
import { HelpButton } from '../../components/HelpButton'
import { useStageCoverScale } from '../../hooks/useStageCoverScale'
import { useSceneExitTransition } from '../../hooks/useSceneExitTransition'
import './SistemOrgan2Scene.css'

const DESIGN_WIDTH = 1920
const DESIGN_HEIGHT = 1080
const SAFE_WIDTH = 1860
const SAFE_HEIGHT = 1046

const SYSTEMS = [
  {
    id: 'pencernaan',
    title: 'Sistem Pencernaan',
    cardDescription: 'Mengolah makanan menjadi\nzat gizi yang dapat diserap tubuh.',
    description: 'Sistem pencernaan bertugas mengolah makanan menjadi zat gizi yang dapat diserap tubuh untuk menghasilkan energi.',
    location: 'Dimulai dari mulut, berlangsung di rongga perut, hingga usus besar.',
    function: 'Memecah makanan secara mekanik dan kimiawi menjadi zat gizi yang dapat diserap tubuh.',
    fact: 'Proses pencernaan melibatkan gerakan otot dan enzim khusus yang bekerja di setiap bagiannya.',
    art: digestiveArt,
    bodyArt: bodyDigestiveArt,
    tone: 'digestive',
    label: 'Sistem Pencernaan',
  },
  {
    id: 'persarafan',
    title: 'Sistem Persarafan',
    cardDescription: 'Menerima, memproses, dan\nmengirimkan informasi untuk\nmengatur aktivitas tubuh.',
    description: 'Sistem persarafan menerima, memproses, dan mengirimkan informasi untuk mengatur berbagai aktivitas tubuh.',
    location: 'Terdiri atas otak, sumsum tulang belakang, serta jaringan saraf yang tersebar ke seluruh tubuh.',
    function: 'Menerima rangsangan, memproses informasi, dan mengirimkan impuls untuk mengatur respons serta aktivitas tubuh.',
    fact: 'Impuls saraf memungkinkan informasi dikirim dengan cepat antara otak, sumsum tulang belakang, dan berbagai bagian tubuh.',
    art: brainArt,
    bodyArt: bodyNervousArt,
    tone: 'nervous',
    label: 'Sistem Persarafan',
  },
  {
    id: 'perkemihan',
    title: 'Sistem Perkemihan',
    cardDescription: 'Menyaring darah, membuang zat sisa,\ndan membantu menjaga\nkeseimbangan cairan tubuh.',
    description: 'Sistem perkemihan membantu membuang zat sisa dari tubuh melalui proses penyaringan darah dan pembentukan urin.',
    location: 'Terdiri atas ginjal, ureter, kandung kemih, dan uretra yang berada di area perut hingga panggul.',
    function: 'Menyaring darah, membuang zat sisa melalui urin, serta membantu menjaga keseimbangan cairan dan elektrolit tubuh.',
    fact: 'Ginjal terus menyaring darah untuk mempertahankan komposisi cairan tubuh sekaligus membuang zat sisa melalui urin.',
    art: urinaryArt,
    bodyArt: bodyUrinaryArt,
    tone: 'urinary',
    label: 'Sistem Perkemihan',
  },
] as const

type SystemId = (typeof SYSTEMS)[number]['id']

type SistemOrgan2SceneProps = {
  onBackToHome?: () => void
  onBack?: () => void
  onComplete?: () => void
}

export function SistemOrgan2Scene({ onBackToHome, onBack, onComplete }: SistemOrgan2SceneProps) {
  const scale = useStageCoverScale(DESIGN_WIDTH, DESIGN_HEIGHT, SAFE_WIDTH, SAFE_HEIGHT)
  const [audioOn, setAudioOn] = useState(true)
  const [selected, setSelected] = useState<SystemId>('pencernaan')
  const [showHint, setShowHint] = useState(false)
  const { isExiting, exitTo } = useSceneExitTransition()
  const active = SYSTEMS.find((system) => system.id === selected) ?? SYSTEMS[0]
  const style = { '--stage-scale': scale } as CSSProperties

  return (
    <main className="sistem-organ-2" data-testid="sistem-organ-2-scene" data-microscene="6.1" data-selected={selected} data-exiting={isExiting} style={style} aria-labelledby="sistem-organ-2-heading">
      <div className="sistem-organ-2__stage">
        <img className="sistem-organ-2__background" src={backgroundArt} alt="" aria-hidden="true" />

        <button className="sistem-organ-2__icon sistem-organ-2__home" type="button" aria-label="Kembali ke Beranda" onClick={() => exitTo(onBackToHome)}><img src={homeArt} alt="" /></button>
        <button className="sistem-organ-2__icon sistem-organ-2__top-back" type="button" aria-label="Kembali ke materi sebelumnya" onClick={() => exitTo(onBack)}><img src={backArt} alt="" /></button>
        <button className="sistem-organ-2__icon sistem-organ-2__audio" type="button" aria-label={audioOn ? 'Matikan musik latar' : 'Aktifkan musik latar'} aria-pressed={audioOn} onClick={() => setAudioOn((value) => !value)}><img src={audioOn ? bgmOnArt : bgmOffArt} alt="" /></button>
        <HelpButton className="sistem-organ-2__icon sistem-organ-2__help" label="Bantuan tiga sistem organ tubuh" onClick={() => setShowHint((value) => !value)} />

        <header className="sistem-organ-2__header">
          <p>Materi 3 - Sistem Organ Tubuh (1 / 5)</p>
          <h1 id="sistem-organ-2-heading">Kenali Tiga Sistem Organ Tubuh</h1>
          <span>Jelajahi bagaimana tubuh mengolah makanan, mengirimkan informasi, dan membuang zat sisa.</span>
        </header>

        <aside className="sistem-organ-2__list" aria-label="Pilih sistem organ">
          <h2>Pilih Sistem Organ</h2>
          <p>Klik salah satu sistem untuk melihat<br />peran utamanya pada tubuh.</p>
          <div className="sistem-organ-2__cards">
            {SYSTEMS.map((system) => (
              <button key={system.id} className={`sistem-organ-2__card sistem-organ-2__card--${system.tone}`} type="button" data-testid={`sistem-organ-2-selector-${system.id}`} data-selected={system.id === selected} aria-pressed={system.id === selected} onClick={() => setSelected(system.id)}>
                <span className="sistem-organ-2__card-art"><img src={system.art} alt="" aria-hidden="true" /></span>
                <span className="sistem-organ-2__card-copy"><strong>{system.title}</strong><span>{system.cardDescription.split('\n').map((line) => <span key={line}>{line}<br /></span>)}</span></span>
                <ChevronRight aria-hidden="true" />
              </button>
            ))}
          </div>
        </aside>

        <section className="sistem-organ-2__anatomy" aria-label={`Ilustrasi tubuh dengan ${active.title}`}>
          <div className="sistem-organ-2__halo" aria-hidden="true" />
          <img className={`sistem-organ-2__body sistem-organ-2__body--${active.tone}`} src={active.bodyArt} alt="" aria-hidden="true" />
          <div className="sistem-organ-2__callout sistem-organ-2__callout--nervous">Sistem Persarafan</div>
          <div className="sistem-organ-2__callout sistem-organ-2__callout--digestive">Sistem Pencernaan</div>
          <div className="sistem-organ-2__callout sistem-organ-2__callout--urinary">Sistem Perkemihan</div>
        </section>

        <aside className="sistem-organ-2__info" data-testid="sistem-organ-2-information" aria-live="polite">
          <header>
            <img src={active.art} alt="" aria-hidden="true" />
            <div><h2>{active.title}</h2><p>{active.description}</p></div>
          </header>
          <section><img src={pinArt} alt="" aria-hidden="true" /><div><h3>Lokasi Utama</h3><p>{active.location}</p></div></section>
          <section><img src={gearArt} alt="" aria-hidden="true" /><div><h3>Fungsi Utama</h3><p>{active.function}</p></div></section>
          <footer><img src={lightbulbArt} alt="" aria-hidden="true" /><div><h3>Tahukah Kamu?</h3><p>{active.fact}</p></div></footer>
        </aside>

        {showHint && <p className="sistem-organ-2__hint" role="status">Pilih Sistem Pencernaan, Sistem Persarafan, atau Sistem Perkemihan untuk membaca informasinya.</p>}
        <button className="sistem-organ-2__bottom-back" type="button" onClick={() => exitTo(onBack)}><ArrowLeft aria-hidden="true" />Sebelumnya</button>
        <button className="sistem-organ-2__next" type="button" data-testid="sistem-organ-2-next-button" onClick={() => exitTo(onComplete)}>Mulai dari Sistem Pencernaan<ArrowRight aria-hidden="true" /></button>
      </div>
    </main>
  )
}
