import { useState, type CSSProperties } from 'react'
import { ArrowLeft, ArrowRight, ChevronRight } from 'lucide-react'

import backgroundArt from '../../assets/02_scene/07_sistem_organ_3/backgrounds/1.png'
import bodyArt from '../../assets/02_scene/07_sistem_organ_3/micro_scenes/7.1/01_body_anatomy_muscle_skeleton.png'
import reproductionArt from '../../assets/02_scene/07_sistem_organ_3/micro_scenes/7.1/02_uterus_reproduksi.png'
import muscleArt from '../../assets/02_scene/07_sistem_organ_3/micro_scenes/7.1/03_otot_muscle.png'
import boneArt from '../../assets/02_scene/07_sistem_organ_3/micro_scenes/7.1/04_tulang_bone.png'
import targetArt from '../../assets/02_scene/07_sistem_organ_3/micro_scenes/7.1/05_icon_target_pencapaian.png'
import sensesArt from '../../assets/02_scene/07_sistem_organ_3/micro_scenes/7.1/06_panca_indra_mata_telinga_hidung_lidah_tangan.png'
import endocrineArt from '../../assets/02_scene/07_sistem_organ_3/micro_scenes/7.1/07_kelenjar_tiroid_endokrin.png'
import bookArt from '../../assets/02_scene/07_sistem_organ_3/micro_scenes/7.1/08_icon_buku_biru.png'
import backArt from '../../assets/01_reusable/buttons/btn_back.png'
import bgmOffArt from '../../assets/01_reusable/buttons/btn_bgm_off.png'
import bgmOnArt from '../../assets/01_reusable/buttons/btn_bgm_on.png'
import homeArt from '../../assets/01_reusable/buttons/btn_home.png'
import { HelpButton } from '../../components/HelpButton'
import { useStageCoverScale } from '../../hooks/useStageCoverScale'
import { useSceneExitTransition } from '../../hooks/useSceneExitTransition'
import { ReproductionSystemScene } from './ReproductionSystemScene'
import { MuscleBoneScene } from './MuscleBoneScene'
import { SensorySystemScene } from './SensorySystemScene'
import { FourSystemsChallengeScene } from './FourSystemsChallengeScene'
import './SistemOrgan3Scene.css'

const SYSTEMS = [
  { id: 'reproduksi', title: 'Sistem Reproduksi', description: 'Berperan dalam fungsi reproduksi\ndan menghasilkan keturunan.', art: reproductionArt, secondArt: undefined, tone: 'reproduction', role: 'Memungkinkan manusia berkembang biak\ndan menghasilkan keturunan.', lesson: 'Organ utama sistem reproduksi dan\nfungsinya.', next: 'Mempelajari lebih dalam setiap organ pada\nsistem reproduksi, baik pada perempuan\nmaupun laki-laki.' },
  { id: 'otot-tulang', title: 'Sistem Otot & Tulang', description: 'Menopang tubuh, mempertahankan\npostur, dan memungkinkan tubuh\nbergerak.', art: muscleArt, secondArt: boneArt, tone: 'muscle', role: 'Menopang tubuh, melindungi organ,\ndan membantu tubuh bergerak.', lesson: 'Otot, tulang, dan sendi serta fungsinya.', next: 'Mempelajari cara otot dan tulang bekerja\nsama saat tubuh bergerak.' },
  { id: 'indra', title: 'Sistem Indra', description: 'Menerima berbagai rangsangan\ndari lingkungan.', art: sensesArt, secondArt: undefined, tone: 'senses', role: 'Menerima dan meneruskan rangsangan\ndari lingkungan.', lesson: 'Pancaindra dan cara kerjanya.', next: 'Mempelajari fungsi mata, telinga, hidung,\nlidah, dan kulit.' },
  { id: 'endokrin', title: 'Sistem Endokrin', description: 'Menghasilkan hormon yang membantu\nmengatur berbagai fungsi tubuh.', art: endocrineArt, secondArt: undefined, tone: 'endocrine', role: 'Mengatur fungsi tubuh melalui hormon.', lesson: 'Kelenjar endokrin dan hormon utamanya.', next: 'Mempelajari peran hormon dalam\nmengatur fungsi tubuh.' },
] as const

type SystemId = (typeof SYSTEMS)[number]['id']
type Props = { onBackToHome?: () => void; onBack?: () => void; onComplete?: () => void; initialMicroscene?: '7.1' | '7.2' | '7.3' | '7.4' | '7.5'; simulationMode?: boolean; simulationTab?: 'indra' | 'endokrin' }

export function SistemOrgan3Scene({ onBackToHome, onBack, onComplete, initialMicroscene = '7.1', simulationMode = false, simulationTab = 'indra' }: Props) {
  const scale = useStageCoverScale(1920, 1080, 1860, 1046)
  const [microscene, setMicroscene] = useState(initialMicroscene)
  const [audioOn, setAudioOn] = useState(true)
  const [selected, setSelected] = useState<SystemId>('reproduksi')
  const [showHint, setShowHint] = useState(false)
  const { isExiting, exitTo } = useSceneExitTransition()
  const active = SYSTEMS.find((system) => system.id === selected) ?? SYSTEMS[0]
  const style = { '--stage-scale': scale } as CSSProperties

  if (microscene === '7.5') return <FourSystemsChallengeScene onBackToHome={onBackToHome} onBack={() => setMicroscene('7.4')} onComplete={onComplete} />
  if (microscene === '7.4') return <SensorySystemScene onBackToHome={onBackToHome} onBack={simulationMode ? onBack : () => setMicroscene('7.3')} onComplete={simulationMode ? onComplete : () => setMicroscene('7.5')} simulationMode={simulationMode} initialTab={simulationTab} />
  if (microscene === '7.3') return <MuscleBoneScene onBackToHome={onBackToHome} onBack={simulationMode ? onBack : () => setMicroscene('7.2')} onComplete={simulationMode ? onComplete : () => setMicroscene('7.4')} simulationMode={simulationMode} />
  if (microscene === '7.2') return <ReproductionSystemScene onBackToHome={onBackToHome} onBack={() => setMicroscene('7.1')} onComplete={() => setMicroscene('7.3')} />

  return <main className="sistem-organ-3" data-testid="sistem-organ-3-scene" data-microscene="7.1" data-selected={selected} data-exiting={isExiting} style={style} aria-labelledby="sistem-organ-3-heading">
    <div className="sistem-organ-3__stage">
      <img className="sistem-organ-3__background" src={backgroundArt} alt="" aria-hidden="true" />
      <button className="sistem-organ-3__icon sistem-organ-3__home" type="button" aria-label="Kembali ke Beranda" onClick={() => exitTo(onBackToHome)}><img src={homeArt} alt="" /></button>
      <button className="sistem-organ-3__icon sistem-organ-3__top-back" type="button" aria-label="Kembali ke materi sebelumnya" onClick={() => exitTo(onBack)}><img src={backArt} alt="" /></button>
      <button className="sistem-organ-3__icon sistem-organ-3__audio" type="button" aria-label={audioOn ? 'Matikan musik latar' : 'Aktifkan musik latar'} aria-pressed={audioOn} onClick={() => setAudioOn((value) => !value)}><img src={audioOn ? bgmOnArt : bgmOffArt} alt="" /></button>
      <HelpButton className="sistem-organ-3__icon sistem-organ-3__help" label="Bantuan empat sistem tubuh" onClick={() => setShowHint((value) => !value)} />

      <header className="sistem-organ-3__header"><p>Materi 4 - Sistem Organ Tubuh (1/5)</p><h1 id="sistem-organ-3-heading">Kenali Empat Sistem Tubuh</h1><span>Jelajahi sistem yang membantu tubuh bereproduksi, bergerak, menerima rangsangan,<br />dan mengatur berbagai fungsi tubuh.</span></header>
      <aside className="sistem-organ-3__list" aria-label="Pilih sistem tubuh">
        {SYSTEMS.map((system) => <button key={system.id} className={`sistem-organ-3__card sistem-organ-3__card--${system.tone}`} type="button" data-testid={`sistem-organ-3-selector-${system.id}`} data-selected={system.id === selected} aria-pressed={system.id === selected} onClick={() => setSelected(system.id)}>
          <span className="sistem-organ-3__card-art"><img src={system.art} alt="" />{system.secondArt && <img src={system.secondArt} alt="" />}</span><span><strong>{system.title}</strong><small>{system.description.split('\n').map((line) => <span key={line}>{line}<br /></span>)}</small></span><i><ChevronRight aria-hidden="true" /></i>
        </button>)}
      </aside>
      <img className="sistem-organ-3__body" src={bodyArt} alt="Ilustrasi anatomi otot dan tulang manusia" />
      <aside className="sistem-organ-3__info" data-testid="sistem-organ-3-information" aria-live="polite">
        <header><img src={active.art} alt="" /><div><h2>{active.title}</h2><p>{active.description.replace('\n', ' ')}</p></div></header>
        <section><img src={targetArt} alt="" /><div><h3>Peran Utama</h3><p>{active.role.split('\n').map((line) => <span key={line}>{line}<br /></span>)}</p></div></section>
        <section><img src={bookArt} alt="" /><div><h3>Bagian yang Akan Dipelajari</h3><p>{active.lesson.split('\n').map((line) => <span key={line}>{line}<br /></span>)}</p></div></section>
        <footer><i><ChevronRight aria-hidden="true" /></i><div><h3>Selanjutnya Kamu Akan...</h3><p>{active.next.split('\n').map((line) => <span key={line}>{line}<br /></span>)}</p></div></footer>
      </aside>
      {showHint && <p className="sistem-organ-3__hint" role="status">Klik salah satu kartu untuk melihat informasi sistem tubuh.</p>}
      <button className="sistem-organ-3__bottom-back" type="button" onClick={() => exitTo(onBack)}><ArrowLeft aria-hidden="true" />Sebelumnya</button>
      <button className="sistem-organ-3__next" type="button" onClick={() => exitTo(() => setMicroscene('7.2'))}>Mulai: {active.title}<ArrowRight aria-hidden="true" /></button>
    </div>
  </main>
}
