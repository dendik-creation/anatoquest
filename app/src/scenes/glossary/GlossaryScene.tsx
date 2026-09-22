import { useEffect, useState, type CSSProperties } from 'react'
import { useGlobalAudio } from '../../audio/GlobalAudio'
import { ArrowLeft, ArrowRight } from 'lucide-react'

import glossary from './glossary.json'
import backgroundArt from '../../assets/02_scene/02_home/background/1.png'
import homeArt from '../../assets/01_reusable/buttons/btn_home.png'
import backArt from '../../assets/01_reusable/buttons/btn_back.png'
import bgmOnArt from '../../assets/01_reusable/buttons/btn_bgm_on.png'
import bgmOffArt from '../../assets/01_reusable/buttons/btn_bgm_off.png'
import lungsArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.6/lungs.png'
import heartArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.6/heart.png'
import brainArt from '../../assets/02_scene/06_sistem_organ_2/6.1/brain_organ.png'
import kidneyArt from '../../assets/02_scene/06_sistem_organ_2/6.1/kidney_bladder_green.png'
import stomachArt from '../../assets/02_scene/06_sistem_organ_2/6.2/stomach.png'
import uterusArt from '../../assets/02_scene/07_sistem_organ_3/micro_scenes/7.1/02_uterus_reproduksi.png'
import muscleArt from '../../assets/02_scene/07_sistem_organ_3/micro_scenes/7.1/03_otot_muscle.png'
import eyeArt from '../../assets/02_scene/07_sistem_organ_3/micro_scenes/7.4/indra/01_icon_mata_sederhana.png'
import earArt from '../../assets/02_scene/07_sistem_organ_3/micro_scenes/7.4/indra/02_icon_telinga_sederhana.png'
import thyroidArt from '../../assets/02_scene/07_sistem_organ_3/micro_scenes/7.4/endokrin/03_icon_tiroid.png'
import { useStageCoverScale } from '../../hooks/useStageCoverScale'
import './GlossaryScene.css'

const ORGAN_BY_KEY = { lungs: lungsArt, heart: heartArt, brain: brainArt, kidney: kidneyArt, stomach: stomachArt, uterus: uterusArt, muscle: muscleArt, eye: eyeArt, ear: earArt, thyroid: thyroidArt } as const
type AssetKey = keyof typeof ORGAN_BY_KEY
type Props = { onBackToHome: () => void }

export function GlossaryScene({ onBackToHome }: Props) {
  const scale = useStageCoverScale(1920, 1080, 1860, 1046)
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState<'next' | 'previous'>('next')
  const { audioOn, toggleAudio } = useGlobalAudio()
  const entry = glossary[index]
  const go = (next: number) => { setDirection(next > index ? 'next' : 'previous'); setIndex(next) }
  useEffect(() => { const onKey = (event: KeyboardEvent) => { if (event.target instanceof HTMLButtonElement) return; if (event.key === 'ArrowLeft' && index > 0) go(index - 1); if (event.key === 'ArrowRight' && index < glossary.length - 1) go(index + 1) }; window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey) })
  const organ = ORGAN_BY_KEY[entry.assetKey as AssetKey]

  return <main className="glossary" data-testid="glossary-scene" style={{ '--stage-scale': scale } as CSSProperties}><div className="glossary__stage">
    <img className="glossary__background" src={backgroundArt} alt="" aria-hidden="true" />
    <button className="glossary__icon glossary__home" type="button" aria-label="Kembali ke Beranda" onClick={onBackToHome}><img src={homeArt} alt="" /></button><button className="glossary__icon glossary__top-back" type="button" aria-label="Kembali ke Beranda" onClick={onBackToHome}><img src={backArt} alt="" /></button><p className="glossary__pill">Glosarium Anatomi</p><button className="glossary__icon glossary__audio" type="button" aria-label={audioOn ? 'Matikan musik latar' : 'Aktifkan musik latar'} aria-pressed={audioOn} onClick={() => toggleAudio()}><img src={audioOn ? bgmOnArt : bgmOffArt} alt="" /></button>
    <header className="glossary__heading"><h1>Glosarium Anatomi &amp; Fisiologi</h1><p>Pelajari kembali istilah penting yang telah kamu temui selama menjelajahi AnatoQuest.</p></header>
    <section className="glossary__carousel" aria-live="polite"><article className="glossary__card" key={entry.id} data-direction={direction}><img className="glossary__organ" src={organ} alt="" aria-hidden="true" /><div><p className="glossary__category">{entry.category}</p><h2>{entry.term}</h2><p className="glossary__definition">{entry.definition}</p><h3>Fungsi</h3><p className="glossary__function">{entry.function}</p></div></article><nav aria-label="Navigasi glosarium"><button type="button" data-testid="glossary-previous" disabled={index === 0} onClick={() => go(index - 1)}><ArrowLeft />Sebelumnya</button><strong data-testid="glossary-counter">{String(index + 1).padStart(2, '0')} / {String(glossary.length).padStart(2, '0')}</strong><button type="button" data-testid="glossary-next" disabled={index === glossary.length - 1} onClick={() => go(index + 1)}>Selanjutnya<ArrowRight /></button></nav></section>
  </div></main>
}
