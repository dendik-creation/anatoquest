import { type CSSProperties } from 'react'
import { useGlobalAudio } from '../../audio/GlobalAudio'

import backgroundArt from '../../assets/02_scene/04_fundamental/backgrounds/00_background.png'
import homeArt from '../../assets/01_reusable/buttons/btn_home.png'
import backArt from '../../assets/01_reusable/buttons/btn_back.png'
import bgmOnArt from '../../assets/01_reusable/buttons/btn_bgm_on.png'
import bgmOffArt from '../../assets/01_reusable/buttons/btn_bgm_off.png'
import respiratoryArt from '../../assets/02_scene/10_simulasi_organ/micro_scenes/menu/01_card_pernapasan.png'
import bloodArt from '../../assets/02_scene/10_simulasi_organ/micro_scenes/menu/02_card_aliran_darah.png'
import digestionArt from '../../assets/02_scene/10_simulasi_organ/micro_scenes/menu/03_card_pencernaan.png'
import nerveArt from '../../assets/02_scene/10_simulasi_organ/micro_scenes/menu/04_card_impuls_saraf.png'
import urinaryArt from '../../assets/02_scene/10_simulasi_organ/micro_scenes/menu/05_card_pembentukan_urin.png'
import movementArt from '../../assets/02_scene/10_simulasi_organ/micro_scenes/menu/06_card_gerak_otot_tulang.png'
import sensoryArt from '../../assets/02_scene/10_simulasi_organ/micro_scenes/menu/07_card_penerimaan_rangsangan.png'
import endocrineArt from '../../assets/02_scene/10_simulasi_organ/micro_scenes/menu/08_card_pelepasan_hormon.png'
import { useStageCoverScale } from '../../hooks/useStageCoverScale'
import './SimulationMenuScene.css'

const SIMULATIONS = [
  { id: 'respiratory', label: 'Pernapasan', art: respiratoryArt }, { id: 'blood-flow', label: 'Aliran Darah', art: bloodArt },
  { id: 'digestion', label: 'Pencernaan', art: digestionArt }, { id: 'nerve-impulse', label: 'Impuls Saraf', art: nerveArt },
  { id: 'urine-formation', label: 'Pembentukan Urin', art: urinaryArt }, { id: 'musculoskeletal', label: 'Gerak Otot & Tulang', art: movementArt },
  { id: 'sensory', label: 'Penerimaan Rangsangan', art: sensoryArt }, { id: 'endocrine', label: 'Pelepasan Hormon', art: endocrineArt },
] as const

export type SimulationId = (typeof SIMULATIONS)[number]['id']
type Props = { onBackToHome: () => void; onSelectSimulation: (id: SimulationId) => void }

export function SimulationMenuScene({ onBackToHome, onSelectSimulation }: Props) {
  const { audioOn, toggleAudio } = useGlobalAudio()
  const scale = useStageCoverScale(1920, 1080, 1860, 1046)
  return <main className="simulation-menu" data-testid="simulation-menu-scene" style={{ '--stage-scale': scale } as CSSProperties}><div className="simulation-menu__stage">
    <img className="simulation-menu__background" src={backgroundArt} alt="" aria-hidden="true" />
    <button className="simulation-menu__icon simulation-menu__home" type="button" aria-label="Kembali ke Beranda" onClick={onBackToHome}><img src={homeArt} alt="" /></button><button className="simulation-menu__icon simulation-menu__top-back" type="button" aria-label="Kembali ke Beranda" onClick={onBackToHome}><img src={backArt} alt="" /></button>
    <p className="simulation-menu__pill">Simulasi Organ</p><header className="simulation-menu__heading"><h1>Jelajahi Simulasi Organ</h1><p>Pilih salah satu simulasi untuk melihat cara kerja organ di dalam tubuh manusia.</p></header>
    <button className="simulation-menu__icon simulation-menu__audio" type="button" aria-label={audioOn ? 'Matikan musik latar' : 'Aktifkan musik latar'} aria-pressed={audioOn} onClick={() => toggleAudio()}><img src={audioOn ? bgmOnArt : bgmOffArt} alt="" /></button>
    <section className="simulation-menu__grid" aria-label="Pilih simulasi organ">{SIMULATIONS.map((simulation, index) => <button key={simulation.id} type="button" className="simulation-menu__card" style={{ '--delay': `${index * 40}ms` } as CSSProperties} data-testid={`simulation-card-${simulation.id}`} aria-label={simulation.label} onClick={() => onSelectSimulation(simulation.id)}><img src={simulation.art} alt="" /></button>)}</section>
    <button className="simulation-menu__back" type="button" onClick={onBackToHome}><img src={backArt} alt="" />Kembali ke Beranda</button>
  </div></main>
}
