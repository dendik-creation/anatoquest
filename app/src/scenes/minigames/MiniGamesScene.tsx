import { useState, type CSSProperties } from 'react'

import mainLogo from '../../assets/00_identity/main_logo.png'
import backArt from '../../assets/01_reusable/buttons/btn_back.png'
import bgmOffArt from '../../assets/01_reusable/buttons/btn_bgm_off.png'
import bgmOnArt from '../../assets/01_reusable/buttons/btn_bgm_on.png'
import helpArt from '../../assets/01_reusable/buttons/btn_help.png'
import headerBanner from '../../assets/02_scene/02_home/01_header_banner.png'
import backgroundArt from '../../assets/02_scene/02_home/background/1.png'
import speechArt from '../../assets/02_scene/08_minigames/micro_scenes/menu/01_balon_ucapan.png'
import puzzleArt from '../../assets/02_scene/08_minigames/micro_scenes/menu/02_card_puzzle_organ.png'
import placeArt from '../../assets/02_scene/08_minigames/micro_scenes/menu/03_card_pasang_organ.png'
import matchArt from '../../assets/02_scene/08_minigames/micro_scenes/menu/04_card_hubungkan_fungsi.png'
import sequenceArt from '../../assets/02_scene/08_minigames/micro_scenes/menu/05_card_susun_alur_fisiologi.png'
import doctorArt from '../../assets/02_scene/08_minigames/micro_scenes/menu/06_karakter_dokter_cilik.png'
import { useStageCoverScale } from '../../hooks/useStageCoverScale'
import './MiniGamesScene.css'

const GAMES = [
  { id: 'puzzle-organ', label: 'Puzzle Organ', art: puzzleArt, className: 'mini-games__game--puzzle' },
  { id: 'pasang-organ', label: 'Pasang Organ', art: placeArt, className: 'mini-games__game--place' },
  { id: 'hubungkan-fungsi', label: 'Hubungkan Fungsi', art: matchArt, className: 'mini-games__game--match' },
  { id: 'susun-alur-fisiologi', label: 'Susun Alur Fisiologi', art: sequenceArt, className: 'mini-games__game--sequence' },
] as const

type MiniGamesSceneProps = { onBackToHome: () => void; onSelectGame?: (id: (typeof GAMES)[number]['id']) => void }

export function MiniGamesScene({ onBackToHome, onSelectGame }: MiniGamesSceneProps) {
  const [audioOn, setAudioOn] = useState(true)
  const scale = useStageCoverScale(1920, 1080, 1860, 1046)

  return (
    <main className="mini-games" data-testid="mini-games-scene" style={{ '--stage-scale': scale } as CSSProperties}>
      <div className="mini-games__stage">
        <img className="mini-games__background" src={backgroundArt} alt="" aria-hidden="true" />
        <img className="mini-games__anim mini-games__header-banner" src={headerBanner} alt="" aria-hidden="true" />
        <img className="mini-games__anim mini-games__logo" src={mainLogo} alt="AnatoQuest: Human Body Explorer" />

        <header className="mini-games__anim mini-games__heading">
          <h1>Mini Games</h1>
          <p>Belajar jadi lebih seru! Pilih permainan yang ingin kamu mainkan.</p>
        </header>

        <button className="mini-games__anim mini-games__icon mini-games__audio" type="button" data-testid="mini-games-audio" aria-label={audioOn ? 'Matikan musik latar' : 'Aktifkan musik latar'} aria-pressed={audioOn} onClick={() => setAudioOn((on) => !on)}>
          <img src={audioOn ? bgmOnArt : bgmOffArt} alt="" aria-hidden="true" />
        </button>
        <button className="mini-games__anim mini-games__icon mini-games__help" type="button" aria-label="Bantuan mini games">
          <img src={helpArt} alt="" aria-hidden="true" />
        </button>

        {GAMES.map((game) => (
          <button key={game.id} className={`mini-games__anim mini-games__game ${game.className}`} type="button" data-testid={`mini-games-${game.id}`} aria-label={game.label} onClick={() => onSelectGame?.(game.id)}>
            <img src={game.art} alt="" aria-hidden="true" />
          </button>
        ))}

        <img className="mini-games__anim mini-games__doctor" src={doctorArt} alt="" aria-hidden="true" />
        <img className="mini-games__anim mini-games__speech" src={speechArt} alt="Pilih permainan dan uji pemahamanmu!" />
        <button className="mini-games__anim mini-games__back" type="button" data-testid="mini-games-back" onClick={onBackToHome}>
          <img src={backArt} alt="" aria-hidden="true" />
          <span>Kembali ke Beranda</span>
        </button>
        <p className="mini-games__anim mini-games__tip"><span aria-hidden="true">💡</span>Setiap permainan membantumu<br />memahami anatomi tubuh dengan cara yang seru!</p>
      </div>
    </main>
  )
}
