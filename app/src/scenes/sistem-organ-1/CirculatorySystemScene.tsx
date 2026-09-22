import { useState, type CSSProperties } from 'react'
import { useGlobalAudio } from '../../audio/GlobalAudio'
import { ArrowLeft, ArrowRight, ChevronRight } from 'lucide-react'

import backgroundArt from '../../assets/02_scene/05_sistem_organ_1/backgrounds/00_background.png'
import bodyArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.5/body_full_circulatory.png'
import heartArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.5/heart.png'
import arteryArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.5/artery_tube_red.png'
import veinArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.5/vein_tube_blue.png'
import capillaryArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.5/capillary_branch.png'
import redArteriesArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.5/body_red_arteries.png'
import blueVeinsArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.5/body_blue_veins.png'
import fadedBodyArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.5/body_purple_faded.png'
import pinArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.5/pin_icon.png'
import gearArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.5/gear_icon.png'
import lightbulbArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.5/lightbulb_icon.png'
import bgmOffArt from '../../assets/01_reusable/buttons/btn_bgm_off.png'
import bgmOnArt from '../../assets/01_reusable/buttons/btn_bgm_on.png'
import homeArt from '../../assets/01_reusable/buttons/btn_home.png'
import { useStageCoverScale } from '../../hooks/useStageCoverScale'
import './CirculatorySystemScene.css'

const DESIGN_WIDTH = 1920
const DESIGN_HEIGHT = 1080
const SAFE_WIDTH = 1860
const SAFE_HEIGHT = 1046

const PARTS = [
  { id: 'jantung', title: 'Jantung', art: heartArt, description: 'Organ berotot yang memompa darah ke seluruh tubuh.', location: 'Di rongga dada, sedikit ke kiri dari garis tengah tubuh.', function: 'Memompa darah agar dapat beredar ke seluruh tubuh.', fact: 'Jantung orang dewasa rata-rata berdetak sekitar 60–100 kali setiap menit saat istirahat.' },
  { id: 'arteri', title: 'Arteri', art: arteryArt, description: 'Pembuluh darah yang membawa darah keluar dari jantung.', location: 'Tersebar dari jantung menuju seluruh bagian tubuh.', function: 'Membawa darah kaya oksigen dari jantung ke jaringan tubuh.', fact: 'Arteri memiliki dinding yang tebal dan elastis untuk menahan tekanan darah.' },
  { id: 'vena', title: 'Vena', art: veinArt, description: 'Pembuluh darah yang membawa darah kembali ke jantung.', location: 'Tersebar dari jaringan tubuh menuju jantung.', function: 'Mengembalikan darah dari seluruh tubuh menuju jantung.', fact: 'Banyak vena memiliki katup untuk mencegah darah mengalir kembali.' },
  { id: 'kapiler', title: 'Kapiler', art: capillaryArt, description: 'Pembuluh darah sangat kecil yang menghubungkan arteri dan vena.', location: 'Menyebar rapat di hampir semua jaringan tubuh.', function: 'Menjadi tempat pertukaran oksigen, zat gizi, dan zat sisa.', fact: 'Dinding kapiler sangat tipis sehingga zat dapat berpindah dengan mudah.' },
] as const

type PartId = (typeof PARTS)[number]['id']
type CirculatorySystemSceneProps = { onBackToHome?: () => void; onBack?: () => void; onComplete?: () => void; transitionState?: 'entering' | 'entered' | 'exiting' }

export function CirculatorySystemScene({ onBackToHome, onBack, onComplete, transitionState = 'entered' }: CirculatorySystemSceneProps) {
  const scale = useStageCoverScale(DESIGN_WIDTH, DESIGN_HEIGHT, SAFE_WIDTH, SAFE_HEIGHT)
  const { audioOn, toggleAudio } = useGlobalAudio()
  const [selected, setSelected] = useState<PartId>('jantung')
  const active = PARTS.find((part) => part.id === selected) ?? PARTS[0]
  const style = { '--stage-scale': scale } as CSSProperties

  return <main className="circulatory-system" data-testid="circulatory-system-scene" data-microscene="5.5" data-transition={transitionState} data-selected={selected} style={style} aria-labelledby="circulatory-system-heading">
    <div className="circulatory-system__stage">
      <img className="circulatory-system__background" src={backgroundArt} alt="" aria-hidden="true" />
      <button className="circulatory-system__icon circulatory-system__home" type="button" aria-label="Kembali ke Beranda" onClick={onBackToHome}><img src={homeArt} alt="" /></button>

      <button className="circulatory-system__icon circulatory-system__audio" type="button" aria-label={audioOn ? 'Matikan musik latar' : 'Aktifkan musik latar'} aria-pressed={audioOn} onClick={() => toggleAudio()}><img src={audioOn ? bgmOnArt : bgmOffArt} alt="" /></button>
      <header className="circulatory-system__header"><p>Materi 2 - Sistem Organ Tubuh (5 / 8)</p><h1 id="circulatory-system-heading">Kenali Sistem Jantung &amp; Pembuluh Darah</h1><span>Kenali bagian utama yang bekerja bersama untuk mengedarkan darah ke seluruh tubuh.</span></header>
      <section className="circulatory-system__workspace">
        <aside className="circulatory-system__list" aria-label="Pilih bagian sistem jantung dan pembuluh darah"><h2>Pilih Bagian</h2><p>Klik salah satu bagian untuk melihat informasi dan lokasinya pada gambar.</p><div>{PARTS.map((part) => <button key={part.id} type="button" data-testid={`circulatory-part-${part.id}`} data-selected={part.id === selected} aria-pressed={part.id === selected} onClick={() => setSelected(part.id)}><img src={part.art} alt="" aria-hidden="true" /><span>{part.title}</span><ChevronRight aria-hidden="true" /></button>)}</div></aside>
        <section className="circulatory-system__anatomy" aria-label={`Ilustrasi sistem peredaran darah: ${active.title}`}><div className="circulatory-system__halo" /><img className="circulatory-system__body" data-testid="circulatory-anatomy-body" src={bodyArt} alt="Ilustrasi tubuh dengan sistem jantung dan pembuluh darah" /><img className="circulatory-system__overlay circulatory-system__overlay--arteri" data-testid="circulatory-anatomy-arteri" src={redArteriesArt} alt="" aria-hidden="true" /><img className="circulatory-system__overlay circulatory-system__overlay--vena" data-testid="circulatory-anatomy-vena" src={blueVeinsArt} alt="" aria-hidden="true" /><img className="circulatory-system__overlay circulatory-system__overlay--kapiler" data-testid="circulatory-anatomy-kapiler" src={fadedBodyArt} alt="" aria-hidden="true" /><img className="circulatory-system__heart-highlight" src={heartArt} alt="" aria-hidden="true" /></section>
        <aside className="circulatory-system__info" data-testid="circulatory-part-information" aria-live="polite"><header><img src={active.art} alt="" aria-hidden="true" /><div><h2>{active.title}</h2><p>{active.description}</p></div></header><hr /><section><img src={pinArt} alt="" aria-hidden="true" /><div><h3>Lokasi</h3><p>{active.location}</p></div></section><section><img src={gearArt} alt="" aria-hidden="true" /><div><h3>Fungsi Utama</h3><p>{active.function}</p></div></section><footer><img src={lightbulbArt} alt="" aria-hidden="true" /><div><h3>Tahukah Kamu?</h3><p>{active.fact}</p></div></footer></aside>
      </section>
      <button className="circulatory-system__bottom-back" type="button" onClick={onBack}><ArrowLeft aria-hidden="true" />Sebelumnya</button><button className="circulatory-system__next" type="button" data-testid="circulatory-system-next-button" onClick={onComplete}>Selanjutnya<ArrowRight aria-hidden="true" /></button>
    </div>
  </main>
}
