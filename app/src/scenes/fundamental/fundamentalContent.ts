import boneArt from '../../assets/02_scene/04_fundamental/micro_scenes/4.1/04_bone.png'
import cellArt from '../../assets/02_scene/04_fundamental/micro_scenes/4.1/02_cell.png'
import gearArt from '../../assets/02_scene/04_fundamental/micro_scenes/4.1/09_gear.png'
import heartArt from '../../assets/02_scene/04_fundamental/micro_scenes/4.1/06_heart.png'
import lungsArt from '../../assets/02_scene/04_fundamental/micro_scenes/4.1/07_lungs.png'
import muscleArt from '../../assets/02_scene/04_fundamental/micro_scenes/4.1/05_muscle.png'
import stomachArt from '../../assets/02_scene/04_fundamental/micro_scenes/4.1/08_stomach.png'
import tissueArt from '../../assets/02_scene/04_fundamental/micro_scenes/4.1/03_tissue_block.png'

export const FUNDAMENTAL_COPY = {
  eyebrow: 'Pengantar Materi',
  heading: 'Pengertian Anatomi dan Fisiologi Tubuh Manusia',
  subtitle: 'Kenali struktur tubuh dan pahami bagaimana setiap bagiannya bekerja.',
  anatomy: {
    title: 'ANATOMI',
    kicker: 'Mempelajari Struktur Tubuh',
    body: 'Anatomi merupakan cabang ilmu yang mempelajari struktur tubuh manusia, mulai dari tingkat terkecil yaitu sel, kemudian jaringan, organ, hingga sistem organ.',
    footer: 'Struktur membentuk tubuh.',
  },
  physiology: {
    title: 'FISIOLOGI',
    kicker: 'Mempelajari Fungsi Tubuh',
    body: 'Fisiologi merupakan ilmu yang mempelajari fungsi setiap organ dan bagaimana organ-organ tersebut bekerja secara terpadu untuk mempertahankan kehidupan melalui proses homeostasis.',
    footer: 'Fungsi menjaga kehidupan.',
  },
  relation: 'Struktur + Fungsi',
  relationCaption: '= Memahami Tubuh Manusia',
} as const

export const ANATOMY_LEVELS = [
  { id: 'cell', label: 'Sel', art: cellArt },
  { id: 'tissue', label: 'Jaringan', art: tissueArt },
  { id: 'bone', label: 'Tulang', art: boneArt },
  { id: 'muscle', label: 'Otot', art: muscleArt },
] as const

export const PHYSIOLOGY_EXAMPLES = [
  { id: 'heart', label: 'Detak Jantung', art: heartArt },
  { id: 'lungs', label: 'Pernapasan', art: lungsArt },
  { id: 'stomach', label: 'Pencernaan', art: stomachArt },
] as const

export const PHYSIOLOGY_GEAR_ART = gearArt
