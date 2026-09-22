import heart11 from '../../assets/02_scene/08_minigames/micro_scenes/games_1/splitted/jantung_splitted/split_1_1.png'
import heart12 from '../../assets/02_scene/08_minigames/micro_scenes/games_1/splitted/jantung_splitted/split_1_2.png'
import heart21 from '../../assets/02_scene/08_minigames/micro_scenes/games_1/splitted/jantung_splitted/split_2_1.png'
import heart22 from '../../assets/02_scene/08_minigames/micro_scenes/games_1/splitted/jantung_splitted/split_2_2.png'
import heart31 from '../../assets/02_scene/08_minigames/micro_scenes/games_1/splitted/jantung_splitted/split_3_1.png'
import heart32 from '../../assets/02_scene/08_minigames/micro_scenes/games_1/splitted/jantung_splitted/split_3_2.png'
import brain11 from '../../assets/02_scene/08_minigames/micro_scenes/games_1/splitted/otak_splitted/split_1_1.png'
import brain12 from '../../assets/02_scene/08_minigames/micro_scenes/games_1/splitted/otak_splitted/split_1_2.png'
import brain21 from '../../assets/02_scene/08_minigames/micro_scenes/games_1/splitted/otak_splitted/split_2_1.png'
import brain22 from '../../assets/02_scene/08_minigames/micro_scenes/games_1/splitted/otak_splitted/split_2_2.png'
import brain31 from '../../assets/02_scene/08_minigames/micro_scenes/games_1/splitted/otak_splitted/split_3_1.png'
import brain32 from '../../assets/02_scene/08_minigames/micro_scenes/games_1/splitted/otak_splitted/split_3_2.png'
import lungs11 from '../../assets/02_scene/08_minigames/micro_scenes/games_1/splitted/paru_paru_splitted/split_1_1.png'
import lungs12 from '../../assets/02_scene/08_minigames/micro_scenes/games_1/splitted/paru_paru_splitted/split_1_2.png'
import lungs21 from '../../assets/02_scene/08_minigames/micro_scenes/games_1/splitted/paru_paru_splitted/split_2_1.png'
import lungs22 from '../../assets/02_scene/08_minigames/micro_scenes/games_1/splitted/paru_paru_splitted/split_2_2.png'
import lungs31 from '../../assets/02_scene/08_minigames/micro_scenes/games_1/splitted/paru_paru_splitted/split_3_1.png'
import lungs32 from '../../assets/02_scene/08_minigames/micro_scenes/games_1/splitted/paru_paru_splitted/split_3_2.png'
import nasal from '../../assets/02_scene/08_minigames/micro_scenes/games_2/01_rongga_hidung.png'
import larynx from '../../assets/02_scene/08_minigames/micro_scenes/games_2/02_laring.png'
import trachea from '../../assets/02_scene/08_minigames/micro_scenes/games_2/03_trakea.png'
import bronchi from '../../assets/02_scene/08_minigames/micro_scenes/games_2/04_bronkus.png'
import lungs from '../../assets/02_scene/08_minigames/micro_scenes/games_2/05_paru_paru.png'
import diaphragm from '../../assets/02_scene/08_minigames/micro_scenes/games_2/06_diafragma.png'
import body from '../../assets/02_scene/08_minigames/micro_scenes/games_2/07_anak_laki_rangka_dada.png'
import guide from '../../assets/02_scene/08_minigames/micro_scenes/games_2/08_anak_laki_transparan_biru_outline.png'
import complete from '../../assets/02_scene/08_minigames/micro_scenes/games_2/09_anak_laki_organ_pernapasan_lengkap.png'
import matchBrain from '../../assets/02_scene/04_fundamental/micro_scenes/4.2/02_brain.png'
import matchHeart from '../../assets/02_scene/04_fundamental/micro_scenes/4.2/04_heart.png'
import matchStomach from '../../assets/02_scene/04_fundamental/micro_scenes/4.2/06_stomach.png'
import matchKidneys from '../../assets/02_scene/04_fundamental/micro_scenes/4.2/09_kidneys_pair.png'
import matchLungs from '../../assets/02_scene/04_fundamental/micro_scenes/4.2/03_lungs.png'
import digestiveMouth from '../../assets/02_scene/06_sistem_organ_2/6.2/mouth.png'
import digestiveEsophagus from '../../assets/02_scene/06_sistem_organ_2/6.2/esophagus.png'
import digestiveStomach from '../../assets/02_scene/06_sistem_organ_2/6.2/stomach.png'
import digestiveSmallIntestine from '../../assets/02_scene/06_sistem_organ_2/6.2/small_intestine.png'
import digestiveLargeIntestine from '../../assets/02_scene/06_sistem_organ_2/6.2/large_intestine.png'
import digestiveBody from '../../assets/02_scene/06_sistem_organ_2/6.2/body_anatomy.png'

export type PuzzlePiece = { id: string; row: number; col: number; targetSlot: string; asset: string }

const gridPieces = (assets: readonly string[]): PuzzlePiece[] => assets.map((asset, index) => ({
  id: `piece-0${index + 1}`,
  row: Math.floor(index / 2),
  col: index % 2,
  targetSlot: `slot-0${index + 1}`,
  asset,
}))

export const PUZZLE_ORGANS = [
  { id: 'lungs', name: 'Paru-paru', boardSize: { width: 540, height: 552 }, aspectRatio: 270 / 276, pieces: gridPieces([lungs11, lungs12, lungs21, lungs22, lungs31, lungs32]) },
  { id: 'heart', name: 'Jantung', boardSize: { width: 408, height: 594 }, aspectRatio: 204 / 297, pieces: gridPieces([heart11, heart12, heart21, heart22, heart31, heart32]) },
  { id: 'brain', name: 'Otak', boardSize: { width: 564, height: 546 }, aspectRatio: 282 / 273, pieces: gridPieces([brain11, brain12, brain21, brain22, brain31, brain32]) },
] as const

export const RESPIRATORY_ASSETS = { nasal, larynx, trachea, bronchi, lungs, diaphragm, body, guide, complete } as const
export const MATCH_ORGAN_ASSETS = { lungs: matchLungs, heart: matchHeart, brain: matchBrain, stomach: matchStomach, kidneys: matchKidneys } as const
export const DIGESTIVE_FLOW_ASSETS = { mouth: digestiveMouth, esophagus: digestiveEsophagus, stomach: digestiveStomach, smallIntestine: digestiveSmallIntestine, largeIntestine: digestiveLargeIntestine, rectumAnus: digestiveBody } as const
