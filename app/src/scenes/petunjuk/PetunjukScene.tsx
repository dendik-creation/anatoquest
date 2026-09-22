import { type CSSProperties } from 'react'
import { ArrowLeft, ArrowRight, Lightbulb } from 'lucide-react'

import { useGlobalAudio } from '../../audio/GlobalAudio'
import bgmOffArt from '../../assets/01_reusable/buttons/btn_bgm_off.png'
import bgmOnArt from '../../assets/01_reusable/buttons/btn_bgm_on.png'
import homeArt from '../../assets/01_reusable/buttons/btn_home.png'
import backgroundArt from '../../assets/02_scene/02_home/background/1.png'
import navigationArt from '../../assets/02_scene/02.5_petunjuk/01_icon_navigasi_browser.png'
import clickArt from '../../assets/02_scene/02.5_petunjuk/02_icon_klik_dokumen.png'
import dragArt from '../../assets/02_scene/02.5_petunjuk/03_icon_drag_drop_jantung.png'
import simulationArt from '../../assets/02_scene/02.5_petunjuk/04_icon_video_player_tubuh.png'
import { useSceneExitTransition } from '../../hooks/useSceneExitTransition'
import { useStageCoverScale } from '../../hooks/useStageCoverScale'
import './PetunjukScene.css'

const GUIDES = [
  { title: 'Navigasi Halaman', text: 'Gunakan tombol Home untuk kembali ke halaman utama dan tombol navigasi untuk berpindah antarhalaman.', art: navigationArt },
  { title: 'Klik & Pilih', text: 'Klik card, tombol, tab, atau bagian organ untuk membuka materi dan informasi yang tersedia.', art: clickArt },
  { title: 'Drag & Drop', text: 'Tekan dan seret objek ke area tujuan pada aktivitas puzzle, pemasangan organ, dan permainan lainnya.', art: dragArt },
  { title: 'Simulasi & Aktivitas', text: 'Gunakan tombol simulasi untuk mengamati proses fisiologi. Ikuti instruksi pada setiap aktivitas hingga selesai.', art: simulationArt },
] as const

type PetunjukSceneProps = {
  onBackToHome: () => void
  onComplete: () => void
}

export function PetunjukScene({ onBackToHome, onComplete }: PetunjukSceneProps) {
  const scale = useStageCoverScale(1920, 1080, 1860, 1046)
  const { audioOn, toggleAudio } = useGlobalAudio()
  const { isExiting, exitTo } = useSceneExitTransition()

  return <main className="petunjuk" data-testid="petunjuk-scene" data-exiting={isExiting} style={{ '--stage-scale': scale } as CSSProperties}>
    <div className="petunjuk__stage">
      <img className="petunjuk__background" src={backgroundArt} alt="" aria-hidden="true" />
      <button className="petunjuk__icon petunjuk__home" type="button" aria-label="Kembali ke Beranda" onClick={() => exitTo(onBackToHome)}><img src={homeArt} alt="" /></button>
      <h1 className="petunjuk__pill">Petunjuk</h1>
      <button className="petunjuk__icon petunjuk__audio" type="button" aria-label={audioOn ? 'Matikan musik latar' : 'Aktifkan musik latar'} aria-pressed={audioOn} onClick={toggleAudio}><img src={audioOn ? bgmOnArt : bgmOffArt} alt="" /></button>

      <header className="petunjuk__heading"><h2>Petunjuk Penggunaan</h2><p>Pelajari cara menggunakan AnatoQuest sebelum memulai eksplorasi.</p></header>
      <section className="petunjuk__guides" aria-label="Petunjuk penggunaan">
        {GUIDES.map(({ title, text, art }, index) => <article className="petunjuk__guide" key={title}>
          <img src={art} alt="" aria-hidden="true" />
          <div><h3><span>{String(index + 1).padStart(2, '0')}</span>{title}</h3><p>{text}</p></div>
        </article>)}
      </section>
      <p className="petunjuk__tips"><Lightbulb aria-hidden="true" /><strong>Tips:</strong> Perhatikan instruksi pada setiap halaman. Beberapa aktivitas memiliki cara interaksi yang berbeda sesuai materi yang sedang dipelajari.</p>
      <button className="petunjuk__nav petunjuk__nav--back" type="button" data-testid="petunjuk-back-button" onClick={() => exitTo(onBackToHome)}><ArrowLeft aria-hidden="true" />Sebelumnya</button>
      <button className="petunjuk__nav petunjuk__nav--next" type="button" data-testid="petunjuk-next-button" onClick={() => exitTo(onComplete)}>Selanjutnya<ArrowRight aria-hidden="true" /></button>
    </div>
  </main>
}
