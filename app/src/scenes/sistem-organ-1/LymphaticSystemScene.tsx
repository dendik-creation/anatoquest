import { useState, type CSSProperties } from 'react'
import { useGlobalAudio } from '../../audio/GlobalAudio'
import { ArrowLeft, ArrowRight, ChevronRight } from 'lucide-react'

import backgroundArt from '../../assets/02_scene/05_sistem_organ_1/backgrounds/00_background.png'
import bodyArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.7/body_lymphatic_full.png'
import lymphNodeArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.7/lymph_node_cluster_green.png'
import lymphVesselArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.7/lymph_vessel_branch_single.png'
import spleenArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.7/kidney_purple.png'
import thymusArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.7/thymus_orange.png'
import pinArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.5/pin_icon.png'
import gearArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.5/gear_icon.png'
import lightbulbArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.5/lightbulb_icon.png'
import bgmOffArt from '../../assets/01_reusable/buttons/btn_bgm_off.png'
import bgmOnArt from '../../assets/01_reusable/buttons/btn_bgm_on.png'
import homeArt from '../../assets/01_reusable/buttons/btn_home.png'
import { useStageCoverScale } from '../../hooks/useStageCoverScale'
import './LymphaticSystemScene.css'

const DESIGN_WIDTH = 1920
const DESIGN_HEIGHT = 1080
const SAFE_WIDTH = 1860
const SAFE_HEIGHT = 1046

const PARTS = [
  {
    id: 'kelenjar',
    title: 'Kelenjar Limfa',
    art: lymphNodeArt,
    description: 'Struktur kecil berbentuk bulat yang menyaring cairan limfa dan berperan dalam pertahanan tubuh.',
    location: 'Tersebar di beberapa bagian tubuh, termasuk leher, ketiak, dan selangkangan.',
    function: 'Menyaring cairan limfa dari kuman, bakteri, atau zat asing, serta membantu mengaktifkan sel-sel imun.',
    fact: 'Kelenjar limfa berukuran kecil, tetapi jumlahnya ratusan dan tersebar di seluruh tubuh!',
  },
  {
    id: 'pembuluh',
    title: 'Pembuluh Limfa',
    art: lymphVesselArt,
    description: 'Jaringan pembuluh halus yang membawa cairan limfa dari jaringan tubuh menuju pembuluh darah.',
    location: 'Menyebar hampir di seluruh tubuh, terutama di bawah permukaan kulit dan di sekitar organ.',
    function: 'Mengumpulkan kelebihan cairan dari jaringan dan mengalirkannya kembali ke peredaran darah.',
    fact: 'Pembuluh limfa memiliki katup yang membantu cairan limfa mengalir ke satu arah.',
  },
  {
    id: 'limpa',
    title: 'Limpa',
    art: spleenArt,
    description: 'Organ limfatik yang membantu menyaring darah dan mendukung pertahanan tubuh.',
    location: 'Berada di bagian kiri atas perut, di bawah tulang rusuk.',
    function: 'Menyaring sel darah yang sudah tua dan membantu tubuh melawan kuman melalui sel imun.',
    fact: 'Limpa merupakan organ limfatik terbesar di dalam tubuh.',
  },
  {
    id: 'timus',
    title: 'Timus',
    art: thymusArt,
    description: 'Kelenjar limfatik yang berperan penting dalam perkembangan sel imun.',
    location: 'Terletak di dada bagian atas, di belakang tulang dada dan di antara paru-paru.',
    function: 'Membantu pematangan sel T, yaitu salah satu jenis sel penting dalam sistem kekebalan tubuh.',
    fact: 'Timus paling aktif saat masa kanak-kanak dan mengecil secara bertahap ketika dewasa.',
  },
] as const

type PartId = (typeof PARTS)[number]['id']

type LymphaticSystemSceneProps = {
  onBackToHome?: () => void
  onBack?: () => void
  onComplete?: () => void
  transitionState?: 'entering' | 'entered' | 'exiting'
}

export function LymphaticSystemScene({ onBackToHome, onBack, onComplete, transitionState = 'entered' }: LymphaticSystemSceneProps) {
  const scale = useStageCoverScale(DESIGN_WIDTH, DESIGN_HEIGHT, SAFE_WIDTH, SAFE_HEIGHT)
  const { audioOn, toggleAudio } = useGlobalAudio()
  const [selected, setSelected] = useState<PartId>('kelenjar')
  const [explored, setExplored] = useState<ReadonlySet<PartId>>(() => new Set())
  const active = PARTS.find((part) => part.id === selected) ?? PARTS[0]
  const style = { '--stage-scale': scale, '--exploration-progress': `${(explored.size / PARTS.length) * 100}%` } as CSSProperties

  const selectPart = (partId: PartId) => {
    setSelected(partId)
    setExplored((current) => new Set(current).add(partId))
  }

  return (
    <main className="lymphatic-system" data-testid="lymphatic-system-scene" data-microscene="5.7" data-transition={transitionState} data-selected={selected} style={style} aria-labelledby="lymphatic-system-heading">
      <div className="lymphatic-system__stage">
        <img className="lymphatic-system__background" src={backgroundArt} alt="" aria-hidden="true" />

        <button className="lymphatic-system__icon lymphatic-system__home" type="button" aria-label="Kembali ke Beranda" onClick={onBackToHome}><img src={homeArt} alt="" /></button>

        <button className="lymphatic-system__icon lymphatic-system__audio" type="button" aria-label={audioOn ? 'Matikan musik latar' : 'Aktifkan musik latar'} aria-pressed={audioOn} onClick={() => toggleAudio()}><img src={audioOn ? bgmOnArt : bgmOffArt} alt="" /></button>

        <header className="lymphatic-system__header">
          <p>Materi 2 - Sistem Organ Tubuh (7 / 8)</p>
          <h1 id="lymphatic-system-heading">Kenali Sistem Limfatik</h1>
          <span>Jelajahi bagian utama sistem limfatik dan temukan perannya dalam menjaga keseimbangan cairan serta pertahanan tubuh.</span>
        </header>

        <aside className="lymphatic-system__list" aria-label="Jelajahi bagian sistem limfatik">
          <h2>Jelajahi Bagian</h2>
          <p>Klik salah satu bagian untuk melihat lokasi dan fungsinya pada gambar.</p>
          <div className="lymphatic-system__part-list">
            {PARTS.map((part) => (
              <button key={part.id} type="button" data-testid={`lymphatic-part-${part.id}`} data-selected={part.id === selected} aria-pressed={part.id === selected} onClick={() => selectPart(part.id)}>
                <img src={part.art} alt="" aria-hidden="true" />
                <span>{part.title}</span>
                <ChevronRight aria-hidden="true" />
              </button>
            ))}
          </div>
          <footer>
            <p>Bagian yang telah dieksplorasi</p>
            <div className="lymphatic-system__progress" role="progressbar" aria-label="Bagian limfatik yang telah dieksplorasi" aria-valuemin={0} aria-valuemax={PARTS.length} aria-valuenow={explored.size}>
              <span />
            </div>
            <strong data-testid="lymphatic-exploration-count">{explored.size} / {PARTS.length}</strong>
          </footer>
        </aside>

        <section className="lymphatic-system__anatomy" aria-label={`Ilustrasi sistem limfatik: ${active.title}`}>
          <div className="lymphatic-system__halo" />
          <img className="lymphatic-system__body" src={bodyArt} alt="Ilustrasi tubuh manusia dengan sistem limfatik" />
        </section>

        <aside className="lymphatic-system__info" data-testid="lymphatic-part-information" aria-live="polite">
          <header>
            <img src={active.art} alt="" aria-hidden="true" />
            <div><h2>{active.title}</h2><p>{active.description}</p></div>
          </header>
          <hr />
          <section><img src={pinArt} alt="" aria-hidden="true" /><div><h3>Lokasi</h3><p>{active.location}</p></div></section>
          <section><img src={gearArt} alt="" aria-hidden="true" /><div><h3>Fungsi Utama</h3><p>{active.function}</p></div></section>
          <footer><img src={lightbulbArt} alt="" aria-hidden="true" /><div><h3>Tahukah Kamu?</h3><p>{active.fact}</p></div></footer>
        </aside>

        <button className="lymphatic-system__bottom-back" type="button" onClick={onBack}><ArrowLeft aria-hidden="true" />Sebelumnya</button>
        <button className="lymphatic-system__next" type="button" data-testid="lymphatic-system-next-button" onClick={onComplete}>Selanjutnya<ArrowRight aria-hidden="true" /></button>
      </div>
    </main>
  )
}
