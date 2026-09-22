import { useRef, useState, type CSSProperties } from 'react'
import { ArrowLeft, ArrowRight, BookOpen, ChevronRight, Lightbulb, MapPin, Play, RotateCcw, Settings } from 'lucide-react'
import backgroundArt from '../../assets/02_scene/07_sistem_organ_3/backgrounds/1.png'
import straightArmArt from '../../assets/02_scene/07_sistem_organ_3/micro_scenes/7.3/01_lengan_penuh_lurus.png'
import flexedArmArt from '../../assets/02_scene/07_sistem_organ_3/micro_scenes/7.3/02_lengan_penuh_tertekuk_bisep.png'
import movementArt from '../../assets/02_scene/07_sistem_organ_3/micro_scenes/7.3/animation.mp4'
import jointArt from '../../assets/02_scene/07_sistem_organ_3/micro_scenes/7.3/09_sendi_siku_tampak_A.png'
import muscleArt from '../../assets/02_scene/07_sistem_organ_3/micro_scenes/7.1/03_otot_muscle.png'
import boneArt from '../../assets/02_scene/07_sistem_organ_3/micro_scenes/7.1/04_tulang_bone.png'
import bookArt from '../../assets/02_scene/07_sistem_organ_3/micro_scenes/7.1/08_icon_buku_biru.png'
import backArt from '../../assets/01_reusable/buttons/btn_back.png'
import bgmOffArt from '../../assets/01_reusable/buttons/btn_bgm_off.png'
import bgmOnArt from '../../assets/01_reusable/buttons/btn_bgm_on.png'
import homeArt from '../../assets/01_reusable/buttons/btn_home.png'
import { HelpButton } from '../../components/HelpButton'
import { useSceneExitTransition } from '../../hooks/useSceneExitTransition'
import { useStageCoverScale } from '../../hooks/useStageCoverScale'
import './MuscleBoneScene.css'

type Part = 'bone' | 'joint' | 'muscle'
type Position = 'straight' | 'flexed'
type Animation = 'idle' | 'playing' | 'completed'
type Props = { onBackToHome?: () => void; onBack?: () => void; onComplete?: () => void; simulationMode?: boolean }
const PARTS = {
  bone: { label: 'Tulang', icon: boneArt, description: 'Menopang tubuh dan menjadi bagian yang digerakkan oleh otot.', location: 'Menyusun rangka lengan, dari bahu hingga tangan.', function: 'Menopang tubuh dan menjadi pengungkit saat otot berkontraksi.', system: 'Tulang bekerja bersama sendi dan otot untuk menghasilkan gerakan.', fact: 'Tulang lengan terdiri dari humerus, radius, dan ulna.' },
  joint: { label: 'Sendi', icon: jointArt, description: 'Tempat pertemuan tulang yang memungkinkan terjadinya gerakan.', location: 'Terletak di antara tulang, misalnya pada siku.', function: 'Memungkinkan tulang bergerak dengan arah tertentu.', system: 'Sendi siku menjadi titik putar ketika lengan menekuk.', fact: 'Sendi siku membantu lengan bergerak seperti engsel.' },
  muscle: { label: 'Otot Rangka', icon: muscleArt, description: 'Otot yang melekat pada tulang dan bekerja secara sadar untuk menghasilkan gerakan tubuh.', location: 'Melekat pada tulang di berbagai bagian tubuh, misalnya lengan, kaki, punggung, dan leher.', function: 'Bergerak dengan cara berkontraksi dan relaksasi untuk menghasilkan gaya yang menggerakkan tulang.', system: 'Otot rangka bekerja sama dengan tulang dan sendi untuk menghasilkan gerakan tubuh, seperti menekuk lengan atau berjalan.', fact: 'Otot hanya dapat menarik (berkontraksi), sehingga setiap gerakan biasanya melibatkan pasangan otot yang saling bekerja berlawanan.' },
} as const

export function MuscleBoneScene({ onBackToHome, onBack, onComplete, simulationMode = false }: Props) {
  const scale = useStageCoverScale(1920, 1080, 1860, 1046)
  const { isExiting, exitTo } = useSceneExitTransition()
  const video = useRef<HTMLVideoElement>(null)
  const [selected, setSelected] = useState<Part>('muscle')
  const [position, setPosition] = useState<Position>('straight')
  const [animation, setAnimation] = useState<Animation>('idle')
  const [audioOn, setAudioOn] = useState(true)
  const [hint, setHint] = useState(false)
  const reset = () => { video.current?.pause(); if (video.current) video.current.currentTime = 0; setPosition('straight'); setAnimation('idle') }
  const choosePosition = (next: Position) => { video.current?.pause(); setAnimation('idle'); setPosition(next) }
  const play = () => { setSelected('muscle'); setPosition('straight'); setAnimation('playing'); void video.current?.play() }
  const active = PARTS[selected]
  const style = { '--stage-scale': scale } as CSSProperties
  const armArt = position === 'straight' ? straightArmArt : flexedArmArt
  return <main className="muscle-bone" data-testid="muscle-bone-scene" data-microscene="7.3" data-selected={selected} data-position={position} data-animation={animation} data-exiting={isExiting} style={style} aria-labelledby="muscle-bone-heading">
    <div className="muscle-bone__stage"><img className="muscle-bone__background" src={backgroundArt} alt="" />
      <button className="muscle-bone__icon muscle-bone__home" type="button" aria-label="Kembali ke Beranda" onClick={() => exitTo(onBackToHome)}><img src={homeArt} alt="" /></button><button className="muscle-bone__icon muscle-bone__top-back" type="button" aria-label="Kembali ke materi sebelumnya" onClick={() => exitTo(onBack)}><img src={backArt} alt="" /></button><button className="muscle-bone__icon muscle-bone__audio" type="button" aria-label={audioOn ? 'Matikan musik latar' : 'Aktifkan musik latar'} onClick={() => setAudioOn(!audioOn)}><img src={audioOn ? bgmOnArt : bgmOffArt} alt="" /></button><HelpButton className="muscle-bone__icon muscle-bone__help" label="Bantuan gerak lengan" onClick={() => setHint(!hint)} />
      <header className="muscle-bone__header"><p>Materi 4 - Sistem Organ Tubuh (3/5)</p><h1 id="muscle-bone-heading">Bagaimana Tubuh Bergerak?</h1><span>Amati bagaimana otot, tulang, dan sendi bekerja bersama untuk menghasilkan gerakan tubuh.</span></header>
      <aside className="muscle-bone__parts"><h2><BookOpen />Kenali Bagian</h2>{(Object.keys(PARTS) as Part[]).map((part) => <button key={part} type="button" data-testid={`movement-part-${part}`} data-selected={selected === part} disabled={animation === 'playing'} onClick={() => setSelected(part)}><img src={PARTS[part].icon} alt="" /><span><strong>{PARTS[part].label}</strong><small>{PARTS[part].description}</small></span><ChevronRight /></button>)}</aside>
      <section className="muscle-bone__simulation" aria-label="Simulasi gerak lengan"><div className="muscle-bone__tabs" role="tablist"><button role="tab" aria-selected={position === 'straight'} disabled={animation === 'playing'} onClick={() => choosePosition('straight')}>Lengan Lurus</button><button role="tab" aria-selected={position === 'flexed'} disabled={animation === 'playing'} onClick={() => choosePosition('flexed')}>Lengan Menekuk</button></div>
        <div className="muscle-bone__anatomy">{animation === 'playing' ? <video data-testid="movement-video" autoPlay muted playsInline src={movementArt} onEnded={() => { setPosition('flexed'); setAnimation('completed') }} /> : <img data-testid="movement-arm" data-position={position} src={armArt} alt={position === 'straight' ? 'Anatomi lengan lurus' : 'Anatomi lengan menekuk'} />}</div>
        <div className="muscle-bone__controls"><button data-testid="movement-play" type="button" onClick={play} disabled={animation === 'playing'}><Play />{animation === 'completed' ? 'Putar Ulang' : 'Putar Gerakan'}</button><button data-testid="movement-reset" type="button" onClick={reset}><RotateCcw />Reset</button></div>{animation === 'completed' && <p className="muscle-bone__feedback">Gerakan Berhasil Diamati — Kontraksi otot menghasilkan gaya yang membantu menggerakkan tulang pada sendi.</p>}</section>
      <aside className="muscle-bone__info" data-testid="movement-information" aria-live="polite"><header><img src={active.icon} alt="" /><div><h2>{active.label}</h2><p>{active.description}</p></div></header><section><MapPin /><div><h3>Lokasi</h3><p>{active.location}</p></div></section><section><Settings /><div><h3>Fungsi Utama</h3><p>{active.function}</p></div></section><section><img src={bookArt} alt="" /><div><h3>Dalam Sistem Gerak</h3><p>{active.system}</p></div></section><footer><Lightbulb /><div><h3>Tahukah Kamu?</h3><p>{active.fact}</p></div></footer></aside>{hint && <p className="muscle-bone__hint">Pilih bagian lengan, bandingkan posisi, atau putar gerakan.</p>}{!simulationMode && <button className="muscle-bone__bottom-back" type="button" onClick={() => exitTo(onBack)}><ArrowLeft />Sebelumnya</button>}<button className="muscle-bone__next" type="button" onClick={() => exitTo(onComplete)}>{simulationMode ? 'Selesaikan Simulasi' : 'Lanjut: Indra & Endokrin'}<ArrowRight /></button>
    </div>
  </main>
}
