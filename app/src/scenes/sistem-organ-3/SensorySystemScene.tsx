import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { useGlobalAudio } from '../../audio/GlobalAudio'
import { ArrowLeft, ArrowRight, BookOpen, ChevronRight, Play, RotateCcw } from 'lucide-react'

import backgroundArt from '../../assets/02_scene/07_sistem_organ_3/backgrounds/1.png'
import eyeIcon from '../../assets/02_scene/07_sistem_organ_3/micro_scenes/7.4/indra/01_icon_mata_sederhana.png'
import earIcon from '../../assets/02_scene/07_sistem_organ_3/micro_scenes/7.4/indra/02_icon_telinga_sederhana.png'
import noseIcon from '../../assets/02_scene/07_sistem_organ_3/micro_scenes/7.4/indra/03_icon_hidung_sederhana.png'
import tongueIcon from '../../assets/02_scene/07_sistem_organ_3/micro_scenes/7.4/indra/04_icon_lidah_sederhana.png'
import skinIcon from '../../assets/02_scene/07_sistem_organ_3/micro_scenes/7.4/indra/05_icon_folikel_rambut_kulit.png'
import eyeArt from '../../assets/02_scene/07_sistem_organ_3/micro_scenes/7.4/indra/06_anatomi_mata_detail.png'
import earArt from '../../assets/02_scene/07_sistem_organ_3/micro_scenes/7.4/indra/07_anatomi_telinga_detail.png'
import noseArt from '../../assets/02_scene/07_sistem_organ_3/micro_scenes/7.4/indra/08_anatomi_hidung_detail.png'
import tongueArt from '../../assets/02_scene/07_sistem_organ_3/micro_scenes/7.4/indra/09_lidah_dan_pengecap_zoom.png'
import skinArt from '../../assets/02_scene/07_sistem_organ_3/micro_scenes/7.4/indra/10_tangan_dan_kulit_zoom.png'
import eyeVideo from '../../assets/02_scene/07_sistem_organ_3/micro_scenes/7.4/indra/indra_mata_simulation.mp4'
import earVideo from '../../assets/02_scene/07_sistem_organ_3/micro_scenes/7.4/indra/indra_telinga_simulation.mp4'
import noseVideo from '../../assets/02_scene/07_sistem_organ_3/micro_scenes/7.4/indra/indra_hidung_simulation.mp4'
import tongueVideo from '../../assets/02_scene/07_sistem_organ_3/micro_scenes/7.4/indra/indra_lidah_simulation.mp4'
import skinVideo from '../../assets/02_scene/07_sistem_organ_3/micro_scenes/7.4/indra/indra_kulit_simulation.mp4'
import endocrineBodyArt from '../../assets/02_scene/07_sistem_organ_3/micro_scenes/7.4/endokrin/01_tubuh_penuh_transparan_endokrin.png'
import brainIcon from '../../assets/02_scene/07_sistem_organ_3/micro_scenes/7.4/endokrin/02_icon_otak.png'
import thyroidIcon from '../../assets/02_scene/07_sistem_organ_3/micro_scenes/7.4/endokrin/03_icon_tiroid.png'
import pancreasIcon from '../../assets/02_scene/07_sistem_organ_3/micro_scenes/7.4/endokrin/04_icon_pankreas.png'
import leftKidneyIcon from '../../assets/02_scene/07_sistem_organ_3/micro_scenes/7.4/endokrin/05_icon_ginjal_kiri.png'
import rightKidneyIcon from '../../assets/02_scene/07_sistem_organ_3/micro_scenes/7.4/endokrin/06_icon_ginjal_kanan.png'
import testisIcon from '../../assets/02_scene/07_sistem_organ_3/micro_scenes/7.4/endokrin/07_icon_testis_kiri.png'
import rightTestisIcon from '../../assets/02_scene/07_sistem_organ_3/micro_scenes/7.4/endokrin/08_icon_testis_kanan.png'
import pituitaryArt from '../../assets/02_scene/07_sistem_organ_3/micro_scenes/7.4/endokrin/10_otak_potongan_sagital.png'
import thyroidArt from '../../assets/02_scene/07_sistem_organ_3/micro_scenes/7.4/endokrin/11_leher_tiroid_tampak_luar.png'
import pancreasArt from '../../assets/02_scene/07_sistem_organ_3/micro_scenes/7.4/endokrin/12_pankreas_usus_detail.png'
import adrenalArt from '../../assets/02_scene/07_sistem_organ_3/micro_scenes/7.4/endokrin/13_ginjal_kelenjar_adrenal_detail.png'
import gonadArt from '../../assets/02_scene/07_sistem_organ_3/micro_scenes/7.4/endokrin/14_sistem_reproduksi_pria_detail.png'
import endocrineVideo from '../../assets/02_scene/07_sistem_organ_3/micro_scenes/7.4/endokrin/endokrin_simulation.mp4'
import bookArt from '../../assets/02_scene/07_sistem_organ_3/micro_scenes/7.1/08_icon_buku_biru.png'
import pinArt from '../../assets/02_scene/06_sistem_organ_2/6.3/icon_pin.png'
import gearArt from '../../assets/02_scene/06_sistem_organ_2/6.3/icon_gear.png'
import lightbulbArt from '../../assets/02_scene/06_sistem_organ_2/6.3/icon_lightbulb.png'
import bgmOffArt from '../../assets/01_reusable/buttons/btn_bgm_off.png'
import bgmOnArt from '../../assets/01_reusable/buttons/btn_bgm_on.png'
import homeArt from '../../assets/01_reusable/buttons/btn_home.png'
import { useSceneExitTransition } from '../../hooks/useSceneExitTransition'
import { useStageCoverScale } from '../../hooks/useStageCoverScale'
import './SensorySystemScene.css'

type SenseId = 'eye' | 'ear' | 'nose' | 'tongue' | 'skin'
type GlandId = 'pituitary' | 'thyroid' | 'pancreas' | 'adrenal' | 'gonad'
type TabId = 'indra' | 'endokrin'
type MediaMode = 'illustration' | 'video'
type VideoState = 'idle' | 'loading' | 'playing' | 'completed' | 'error'
type Props = { onBackToHome?: () => void; onBack?: () => void; onComplete?: () => void; simulationMode?: boolean; initialTab?: TabId }

const SENSES = {
  eye: { label: 'Mata', icon: eyeIcon, illustration: eyeArt, video: eyeVideo, location: 'Terletak di bagian wajah.', function: 'Menerima rangsangan cahaya sehingga tubuh dapat memperoleh informasi visual dari lingkungan.', process: 'Cahaya masuk ke mata, difokuskan oleh lensa, kemudian diubah menjadi impuls saraf yang diteruskan ke otak melalui saraf optik.', fact: 'Mata dapat membedakan lebih dari juta warna yang berbeda!' },
  ear: { label: 'Telinga', icon: earIcon, illustration: earArt, video: earVideo, location: 'Terletak di sisi kiri dan kanan kepala.', function: 'Menerima rangsangan berupa gelombang suara dan membantu tubuh memperoleh informasi pendengaran dari lingkungan.', process: 'Gelombang suara masuk melalui telinga luar dan menyebabkan getaran pada gendang telinga. Rangsangan kemudian diubah menjadi impuls saraf dan diteruskan menuju otak untuk diproses.', fact: 'Telinga juga memiliki bagian yang berperan dalam membantu menjaga keseimbangan tubuh.' },
  nose: { label: 'Hidung', icon: noseIcon, illustration: noseArt, video: noseVideo, location: 'Terletak di bagian hidung, pada rongga hidung.', function: 'Menerima rangsangan bau sehingga tubuh dapat mengenali berbagai aroma di lingkungan.', process: 'Partikel bau yang masuk melalui udara terikat pada reseptor di rongga hidung, kemudian diubah menjadi impuls saraf yang diteruskan ke otak untuk diproses sebagai sensasi bau.', fact: 'Hidung manusia dapat membedakan ribuan jenis bau yang berbeda.' },
  tongue: { label: 'Lidah', icon: tongueIcon, illustration: tongueArt, video: tongueVideo, location: 'Terletak di dalam rongga mulut pada bagian lidah.', function: 'Menerima rangsangan rasa sehingga tubuh dapat mengenali berbagai rasa makanan dan minuman.', process: 'Zat kimia dari makanan larut dalam air liur, kemudian berikatan dengan reseptor rasa pada permukaan lidah. Rangsangan ini diubah menjadi impuls saraf yang diteruskan ke otak untuk diproses sebagai sensasi rasa.', fact: 'Lidah memiliki ribuan kuncup rasa yang dapat mengenali lima rasa utama: manis, asin, asam, pahit, dan umami.' },
  skin: { label: 'Kulit', icon: skinIcon, illustration: skinArt, video: skinVideo, location: 'Tersebar di seluruh permukaan tubuh.', function: 'Menerima rangsangan sentuhan, tekanan, suhu (panas dan dingin), serta nyeri sehingga tubuh dapat menyesuaikan diri dengan lingkungan.', process: 'Rangsangan dari lingkungan diterima oleh reseptor sensorik di kulit, kemudian diubah menjadi impuls saraf yang diteruskan ke otak untuk diproses sebagai sensasi sentuhan, tekanan, suhu, atau nyeri.', fact: 'Kulit adalah organ indra terbesar dalam tubuh manusia dengan luas sekitar 1,5–2 meter persegi.' },
} as const

// ponytail: one supplied endocrine video covers this tab; add gland-specific videos only when assets exist.
const GLANDS = {
  pituitary: { label: 'Hipofisis', icons: [brainIcon], illustration: pituitaryArt, video: endocrineVideo, location: 'Terletak di dasar otak.', function: 'Mengatur kerja banyak kelenjar endokrin lain melalui hormon.', process: 'Melepaskan hormon yang membantu mengatur pertumbuhan, reproduksi, dan keseimbangan tubuh.', fact: 'Hipofisis sering disebut kelenjar pengendali karena membantu mengatur banyak kelenjar lain.' },
  thyroid: { label: 'Tiroid', icons: [thyroidIcon], illustration: thyroidArt, video: endocrineVideo, location: 'Terletak di bagian depan leher, tepat di bawah laring (jakun).', function: 'Menghasilkan hormon yang membantu mengatur metabolisme tubuh.', process: 'Hormon tiroid membantu mengatur penggunaan energi, suhu tubuh, pertumbuhan, dan perkembangan sistem saraf.', fact: 'Kelenjar tiroid berbentuk seperti kupu-kupu dan menghasilkan hormon tiroksin (T4) dan triiodotironin (T3).' },
  pancreas: { label: 'Pankreas', icons: [pancreasIcon], illustration: pancreasArt, video: endocrineVideo, location: 'Terletak di belakang lambung.', function: 'Menghasilkan hormon yang membantu mengatur kadar gula darah.', process: 'Insulin dan glukagon membantu menjaga kadar gula darah tetap seimbang.', fact: 'Pankreas juga menghasilkan enzim yang membantu proses pencernaan.' },
  adrenal: { label: 'Adrenal', icons: [leftKidneyIcon, rightKidneyIcon], illustration: adrenalArt, video: endocrineVideo, location: 'Terletak di atas kedua ginjal.', function: 'Menghasilkan hormon yang membantu tubuh merespons stres.', process: 'Hormon adrenal membantu mengatur respons tubuh saat menghadapi tekanan atau bahaya.', fact: 'Kelenjar adrenal menghasilkan adrenalin yang dapat meningkatkan denyut jantung.' },
  gonad: { label: 'Gonad', icons: [testisIcon, rightTestisIcon], illustration: gonadArt, video: endocrineVideo, location: 'Terletak pada organ reproduksi.', function: 'Menghasilkan hormon yang berperan dalam pertumbuhan dan fungsi reproduksi.', process: 'Hormon seks membantu mengatur perubahan tubuh pada masa pubertas dan fungsi reproduksi.', fact: 'Gonad adalah testis pada laki-laki dan ovarium pada perempuan.' },
} as const

const GLAND_CALLOUTS: { id: GlandId; label: string }[] = [
  { id: 'pituitary', label: 'Hipofisis' }, { id: 'thyroid', label: 'Tiroid' }, { id: 'pancreas', label: 'Pankreas' }, { id: 'adrenal', label: 'Adrenal' }, { id: 'gonad', label: 'Gonad' },
]

export function SensorySystemScene({ onBackToHome, onBack, onComplete, simulationMode = false, initialTab = 'indra' }: Props) {
  const scale = useStageCoverScale(1920, 1080, 1860, 1046)
  const { isExiting, exitTo } = useSceneExitTransition()
  const video = useRef<HTMLVideoElement>(null)
  const [activeTab, setActiveTab] = useState<TabId>(initialTab)
  const [selectedSense, setSelectedSense] = useState<SenseId>('eye')
  const [selectedGland, setSelectedGland] = useState<GlandId>('thyroid')
  const [mediaMode, setMediaMode] = useState<MediaMode>('illustration')
  const [videoState, setVideoState] = useState<VideoState>('idle')
  const { audioOn, toggleAudio } = useGlobalAudio()
  const selectedItem = activeTab === 'indra' ? selectedSense : selectedGland
  const currentItem = activeTab === 'indra' ? SENSES[selectedSense] : GLANDS[selectedGland]
  const style = { '--stage-scale': scale } as CSSProperties

  const stopVideo = useCallback(() => {
    const element = video.current
    if (!element) return
    element.pause()
    try { element.currentTime = 0 } catch { /* metadata is not ready yet */ }
  }, [])
  const reset = useCallback(() => { stopVideo(); setMediaMode('illustration'); setVideoState('idle') }, [stopVideo])
  const selectSense = useCallback((sense: SenseId) => { stopVideo(); setSelectedSense(sense); setMediaMode('illustration'); setVideoState('idle') }, [stopVideo])
  const selectGland = useCallback((gland: GlandId) => { stopVideo(); setSelectedGland(gland); setMediaMode('illustration'); setVideoState('idle') }, [stopVideo])
  const selectTab = useCallback((tab: TabId) => { stopVideo(); setActiveTab(tab); setMediaMode('illustration'); setVideoState('idle') }, [stopVideo])
  const play = () => {
    const element = video.current
    if (!element || videoState === 'playing') return
    try { element.currentTime = 0 } catch { /* play waits for metadata */ }
    setMediaMode('video')
    setVideoState('loading')
    void element.play().then(() => setVideoState('playing')).catch(() => { setMediaMode('illustration'); setVideoState('error') })
  }

  useEffect(() => () => stopVideo(), [stopVideo])
  // Event callbacks are not invoked during render; this avoids a false positive from the ref rule.
  // eslint-disable-next-line react-hooks/refs
  const selectorPanel = <aside className="sensory-system__list" aria-label={activeTab === 'indra' ? 'Pilih Organ Indra' : 'Pilih Kelenjar'}><h2><BookOpen aria-hidden="true" />{activeTab === 'indra' ? 'Pilih Organ Indra' : 'Pilih Kelenjar'}</h2>{activeTab === 'indra' ? (Object.keys(SENSES) as SenseId[]).map((sense) => <button key={sense} type="button" data-testid={`sensory-selector-${sense}`} data-selected={sense === selectedSense} aria-pressed={sense === selectedSense} onClick={() => selectSense(sense)}><img src={SENSES[sense].icon} alt="" /><strong>{SENSES[sense].label}</strong><ChevronRight aria-hidden="true" /></button>) : (Object.keys(GLANDS) as GlandId[]).map((gland) => <button key={gland} type="button" data-testid={`gland-selector-${gland}`} data-selected={gland === selectedGland} aria-pressed={gland === selectedGland} onClick={() => selectGland(gland)}><span className="sensory-system__gland-icons">{GLANDS[gland].icons.map((icon) => <img key={icon} src={icon} alt="" />)}</span><strong>{GLANDS[gland].label}</strong><ChevronRight aria-hidden="true" /></button>)}</aside>

  return <main className="sensory-system" data-testid="sensory-system-scene" data-microscene="7.4" data-tab={activeTab} data-selected={selectedItem} data-media-mode={mediaMode} data-video-state={videoState} data-exiting={isExiting} style={style} aria-labelledby="sensory-system-heading">
    <div className="sensory-system__stage">
      <img className="sensory-system__background" src={backgroundArt} alt="" />
      <button className="sensory-system__icon sensory-system__home" type="button" aria-label="Kembali ke Beranda" onClick={() => { stopVideo(); exitTo(onBackToHome) }}><img src={homeArt} alt="" /></button>

      <button className="sensory-system__icon sensory-system__audio" type="button" aria-label={audioOn ? 'Matikan musik latar' : 'Aktifkan musik latar'} aria-pressed={audioOn} onClick={() => toggleAudio()}><img src={audioOn ? bgmOnArt : bgmOffArt} alt="" /></button>

      <header className="sensory-system__header"><p>Materi 4 - Sistem Organ Tubuh (4/5)</p><h1 id="sensory-system-heading">Bagaimana Tubuh Menerima dan Mengatur Informasi?</h1><span>Pelajari bagaimana organ indra menerima rangsangan dan sistem endokrin membantu mengatur fungsi tubuh melalui hormon.</span></header>
      <div className="sensory-system__tabs" role="tablist" aria-label="Pilih sistem"><button type="button" role="tab" aria-selected={activeTab === 'indra'} onClick={() => selectTab('indra')}>Sistem Indra</button><button type="button" role="tab" aria-selected={activeTab === 'endokrin'} onClick={() => selectTab('endokrin')}>Sistem Endokrin</button></div>
      {selectorPanel}
      <section className="sensory-system__simulation" aria-label={`Simulasi ${activeTab === 'indra' ? 'penerimaan rangsangan' : 'pelepasan hormon'} ${currentItem.label}`}>
        <div className="sensory-system__media-stage">
          {activeTab === 'indra' ? <img className="sensory-system__illustration" data-visible={mediaMode === 'illustration'} src={currentItem.illustration} alt={`Ilustrasi anatomi ${currentItem.label}`} /> : <div className="sensory-system__endocrine-hero" data-visible={mediaMode === 'illustration'}><img className="sensory-system__endocrine-body" src={endocrineBodyArt} alt="Anatomi sistem endokrin" />{GLAND_CALLOUTS.map((callout) => <span key={callout.id} className={`sensory-system__gland-callout sensory-system__gland-callout--${callout.id}${callout.id === selectedGland ? ' is-active' : ''}`}>{callout.label}</span>)}<img className="sensory-system__endocrine-detail" src={currentItem.illustration} alt={`Ilustrasi detail ${currentItem.label}`} /></div>}
          <video ref={video} className="sensory-system__video" data-visible={mediaMode === 'video'} data-testid="sensory-video" src={currentItem.video} muted playsInline preload="metadata" onCanPlay={() => { if (videoState === 'loading') setVideoState('playing') }} onWaiting={() => setVideoState('loading')} onEnded={() => setVideoState('completed')} onError={() => { setMediaMode('illustration'); setVideoState('error') }} />
          {videoState === 'loading' && <p className="sensory-system__loading" role="status">Menyiapkan simulasi...</p>}
          {videoState === 'error' && <p className="sensory-system__error" role="status">Simulasi belum dapat diputar.</p>}
        </div>
        <div className="sensory-system__controls"><button data-testid="sensory-play" type="button" disabled={videoState === 'playing' || videoState === 'loading'} aria-label={`${videoState === 'completed' ? 'Putar ulang' : 'Putar'} simulasi ${activeTab === 'indra' ? 'penerimaan rangsangan' : 'pelepasan hormon'} ${currentItem.label}`} onClick={play}><Play aria-hidden="true" />{videoState === 'completed' ? 'Putar Ulang' : videoState === 'error' ? 'Coba Lagi' : activeTab === 'indra' ? 'Putar Penerimaan Rangsangan' : 'Putar Pelepasan Hormon'}</button><button data-testid="sensory-reset" type="button" onClick={reset}><RotateCcw aria-hidden="true" />Reset</button></div>
      </section>
      <aside className="sensory-system__info" data-tab={activeTab} data-testid="sensory-information" aria-live="polite">{activeTab === 'endokrin' && <header className="sensory-system__info-title"><span className="sensory-system__gland-icons">{GLANDS[selectedGland].icons.map((icon) => <img key={icon} src={icon} alt="" />)}</span><h2>{currentItem.label}</h2></header>}<section><img src={pinArt} alt="" style={{ width: 58, height: 58 }} /><div><h3>Lokasi</h3><p>{currentItem.location}</p></div></section><section><img src={gearArt} alt="" style={{ width: 58, height: 58 }} /><div><h3>Fungsi Utama</h3><p>{currentItem.function}</p></div></section><section><img src={bookArt} alt="" style={{ width: 58, height: 58 }} /><div><h3>{activeTab === 'indra' ? 'Bagaimana Bekerja?' : 'Peran Hormon'}</h3><p>{currentItem.process}</p></div></section><footer><img src={lightbulbArt} alt="" style={{ width: 58, height: 58 }} /><div><h3>Tahukah Kamu?</h3><p>{currentItem.fact}</p></div></footer></aside>
      {!simulationMode && <button className="sensory-system__bottom-back" type="button" onClick={() => { stopVideo(); exitTo(onBack) }}><ArrowLeft aria-hidden="true" />Sebelumnya</button>}
      <button className="sensory-system__next" type="button" onClick={() => { stopVideo(); exitTo(onComplete) }}>{simulationMode ? 'Selesaikan Simulasi' : 'Lanjut: Tantangan Empat Sistem'}<ArrowRight aria-hidden="true" /></button>
    </div>
  </main>
}
