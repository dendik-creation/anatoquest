import { type CSSProperties } from 'react'
import { useGlobalAudio } from '../../audio/GlobalAudio'

import mainLogo from '../../assets/00_identity/main_logo.png'
import backArt from '../../assets/01_reusable/buttons/btn_back.png'
import bgmOffArt from '../../assets/01_reusable/buttons/btn_bgm_off.png'
import bgmOnArt from '../../assets/01_reusable/buttons/btn_bgm_on.png'
import headerBanner from '../../assets/02_scene/02_home/01_header_banner.png'
import backgroundArt from '../../assets/02_scene/02_home/background/1.png'
import lightbulbArt from '../../assets/02_scene/06_sistem_organ_2/6.3/icon_lightbulb.png'
import caseStudyArt from '../../assets/02_scene/09_materi/micro_scene/menu/01_card_studi_kasus.png'
import fundamentalArt from '../../assets/02_scene/09_materi/micro_scene/menu/02_card_fundamental.png'
import organOneArt from '../../assets/02_scene/09_materi/micro_scene/menu/03_card_sistem_organ_1.png'
import organTwoArt from '../../assets/02_scene/09_materi/micro_scene/menu/04_card_sistem_organ_2.png'
import organThreeArt from '../../assets/02_scene/09_materi/micro_scene/menu/05_card_sistem_organ_3.png'
import arrowStraightArt from '../../assets/02_scene/09_materi/micro_scene/menu/06_panah_putus_lurus.png'
import arrowCurveAArt from '../../assets/02_scene/09_materi/micro_scene/menu/07_panah_putus_lengkung_A.png'
import arrowWaveArt from '../../assets/02_scene/09_materi/micro_scene/menu/09_panah_putus_gelombang.png'
import { useSceneExitTransition } from '../../hooks/useSceneExitTransition'
import { useStageCoverScale } from '../../hooks/useStageCoverScale'
import './MateriMenuScene.css'

const MATERIALS = [
  { id: 'case-study', label: 'Studi Kasus', art: caseStudyArt, action: 'case-study', className: 'materi-menu__card--case-study' },
  { id: 'fundamental', label: 'Fundamental', art: fundamentalArt, action: 'fundamental', className: 'materi-menu__card--fundamental' },
  { id: 'sistem-organ-1', label: 'Sistem Organ 1', art: organOneArt, action: 'sistem-organ-1', className: 'materi-menu__card--sistem-organ-1' },
  { id: 'sistem-organ-2', label: 'Sistem Organ 2', art: organTwoArt, action: 'sistem-organ-2', className: 'materi-menu__card--sistem-organ-2' },
  { id: 'sistem-organ-3', label: 'Sistem Organ 3', art: organThreeArt, action: 'sistem-organ-3', className: 'materi-menu__card--sistem-organ-3' },
] as const

export type MateriMenuTarget = (typeof MATERIALS)[number]['action']

type MateriMenuSceneProps = {
  onBackToHome: () => void
  onSelectMaterial: (target: MateriMenuTarget) => void
}

export function MateriMenuScene({ onBackToHome, onSelectMaterial }: MateriMenuSceneProps) {
  const { audioOn, toggleAudio } = useGlobalAudio()
  const scale = useStageCoverScale(1920, 1080, 1860, 1046)
  const { isExiting, exitTo } = useSceneExitTransition()
  const sceneStyle = { '--stage-scale': scale } as CSSProperties

  return (
    <main className="materi-menu" data-testid="materi-menu-scene" data-exiting={isExiting} style={sceneStyle}>
      <div className="materi-menu__stage">
        <img className="materi-menu__background" src={backgroundArt} alt="" aria-hidden="true" />
        <img className="materi-menu__anim materi-menu__header-banner" src={headerBanner} alt="" aria-hidden="true" />
        <img className="materi-menu__anim materi-menu__logo" src={mainLogo} alt="AnatoQuest: Human Body Explorer" />
        <header className="materi-menu__anim materi-menu__heading">
          <h1>Pilih Materi Pembelajaran</h1>
          <p>Ikuti urutan materi untuk memahami anatomi dan fisiologi tubuh manusia<br />secara menyeluruh.</p>
        </header>

        <button className="materi-menu__anim materi-menu__icon materi-menu__audio" type="button" data-testid="materi-menu-audio" aria-label={audioOn ? 'Matikan musik latar' : 'Aktifkan musik latar'} aria-pressed={audioOn} onClick={() => toggleAudio()}><img src={audioOn ? bgmOnArt : bgmOffArt} alt="" aria-hidden="true" /></button>

        {MATERIALS.map((material) => (
          <button key={material.id} className={`materi-menu__anim materi-menu__card ${material.className}`} type="button" data-testid={`materi-menu-${material.id}`} aria-label={material.label} onClick={() => exitTo(() => onSelectMaterial(material.action))}>
            <img src={material.art} alt="" aria-hidden="true" />
          </button>
        ))}

        <img className="materi-menu__anim materi-menu__arrow materi-menu__arrow--1" src={arrowStraightArt} alt="" aria-hidden="true" />
        <img className="materi-menu__anim materi-menu__arrow materi-menu__arrow--2" src={arrowStraightArt} alt="" aria-hidden="true" />
        <img className="materi-menu__anim materi-menu__arrow materi-menu__arrow--3" src={arrowStraightArt} alt="" aria-hidden="true" />
        <img className="materi-menu__anim materi-menu__arrow materi-menu__arrow--4" src={arrowWaveArt} alt="" aria-hidden="true" />
        <img className="materi-menu__anim materi-menu__arrow materi-menu__arrow--5" src={arrowCurveAArt} alt="" aria-hidden="true" />

        <button className="materi-menu__anim materi-menu__back" type="button" data-testid="materi-menu-back" onClick={() => exitTo(onBackToHome)}><img src={backArt} alt="" aria-hidden="true" /><span>Kembali ke Beranda</span></button>
        <p className="materi-menu__anim materi-menu__tip"><img src={lightbulbArt} alt="" aria-hidden="true" />Selesaikan semua materi untuk<br />menjadi ahli anatomi tubuh manusia!</p>
      </div>
    </main>
  )
}
