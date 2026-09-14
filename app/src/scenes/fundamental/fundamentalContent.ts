import boneArt from '../../assets/02_scene/04_fundamental/micro_scenes/4.1/04_bone.png'
import cellArt from '../../assets/02_scene/04_fundamental/micro_scenes/4.1/02_cell.png'
import gearArt from '../../assets/02_scene/04_fundamental/micro_scenes/4.1/09_gear.png'
import heartArt from '../../assets/02_scene/04_fundamental/micro_scenes/4.1/06_heart.png'
import lungsArt from '../../assets/02_scene/04_fundamental/micro_scenes/4.1/07_lungs.png'
import muscleArt from '../../assets/02_scene/04_fundamental/micro_scenes/4.1/05_muscle.png'
import stomachArt from '../../assets/02_scene/04_fundamental/micro_scenes/4.1/08_stomach.png'
import tissueArt from '../../assets/02_scene/04_fundamental/micro_scenes/4.1/03_tissue_block.png'
import anatomyBodyArt from '../../assets/02_scene/04_fundamental/micro_scenes/4.2/01_full_body_figure.png'
import anatomyBrainArt from '../../assets/02_scene/04_fundamental/micro_scenes/4.2/02_brain.png'
import anatomyBoneArt from '../../assets/02_scene/04_fundamental/micro_scenes/4.2/12_bone.png'
import anatomyHeartArt from '../../assets/02_scene/04_fundamental/micro_scenes/4.2/04_heart.png'
import anatomyLayersArt from '../../assets/02_scene/04_fundamental/micro_scenes/4.2/14_layers_icon.png'
import anatomyLargeIntestineArt from '../../assets/02_scene/04_fundamental/micro_scenes/4.2/08_large_intestine.png'
import anatomyLiverArt from '../../assets/02_scene/04_fundamental/micro_scenes/4.2/05_liver.png'
import anatomyLungsArt from '../../assets/02_scene/04_fundamental/micro_scenes/4.2/03_lungs.png'
import anatomyKidneysArt from '../../assets/02_scene/04_fundamental/micro_scenes/4.2/09_kidneys_pair.png'
import anatomyPinArt from '../../assets/02_scene/04_fundamental/micro_scenes/4.2/13_location_pin.png'
import anatomySmallIntestineArt from '../../assets/02_scene/04_fundamental/micro_scenes/4.2/07_small_intestine.png'
import anatomyStomachArt from '../../assets/02_scene/04_fundamental/micro_scenes/4.2/06_stomach.png'

export const FUNDAMENTAL_COPY = {
  eyebrow: 'Pengantar Materi (1/6)',
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

export const ANATOMY_42_COPY = {
  eyebrow: 'Dasar Anatomi (2/6)',
  heading: 'Apa itu Anatomi?',
  subtitle: 'Mari mengenal struktur, bentuk, dan letak bagian tubuh manusia.',
  intro: 'Anatomi adalah ilmu yang mempelajari struktur tubuh manusia, mulai dari bentuk, letak, dan susunan bagian-bagiannya.',
  instruction: 'Pilih bagian tubuh untuk mengenal strukturnya.',
} as const

export const ANATOMY_42_CONCEPTS = [
  { id: 'shape', title: 'Bentuk', body: 'Mempelajari bentuk dan ciri-ciri setiap bagian tubuh.', art: anatomyBoneArt, tone: 'blue' },
  { id: 'location', title: 'Letak', body: 'Mempelajari di mana bagian tubuh berada dalam tubuh.', art: anatomyPinArt, tone: 'coral' },
  { id: 'arrangement', title: 'Susunan', body: 'Mempelajari bagaimana bagian-bagian tubuh saling tersusun.', art: anatomyLayersArt, tone: 'purple' },
] as const

export const ANATOMY_42_BODY_ART = anatomyBodyArt

/**
 * Hotspot centre percentages map directly to the 486 × 986 full-body asset.
 * Only structures visibly illustrated in that asset are made selectable.
 */
export const ANATOMY_42_ORGANS = [
  { id: 'brain', label: 'Otak', art: anatomyBrainArt, position: { x: 50, y: 6.5 }, location: 'Rongga tengkorak', structure: 'Organ saraf yang tersusun dari jaringan saraf', function: 'Mengatur dan mengoordinasikan kerja tubuh.' },
  { id: 'lungs', label: 'Paru-paru', art: anatomyLungsArt, position: { x: 46, y: 27.5 }, location: 'Rongga dada, kanan dan kiri jantung', structure: 'Sepasang organ bertekstur spons', function: 'Tempat pertukaran oksigen dan karbon dioksida.' },
  { id: 'heart', label: 'Jantung', art: anatomyHeartArt, position: { x: 53.5, y: 29 }, location: 'Rongga dada, sedikit ke kiri', structure: 'Organ berotot yang tersusun dari jaringan otot jantung', function: 'Memompa darah ke seluruh tubuh.' },
  { id: 'liver', label: 'Hati', art: anatomyLiverArt, position: { x: 42.5, y: 36 }, location: 'Rongga perut kanan atas', structure: 'Organ besar dengan jaringan hati dan saluran empedu', function: 'Membantu mengolah zat gizi dan menghasilkan empedu.' },
  { id: 'stomach', label: 'Lambung', art: anatomyStomachArt, position: { x: 57, y: 37.5 }, location: 'Rongga perut kiri atas', structure: 'Kantung berotot pada saluran pencernaan', function: 'Mengaduk dan mencerna makanan.' },
  { id: 'large_intestine', label: 'Usus Besar', art: anatomyLargeIntestineArt, position: { x: 50, y: 45 }, location: 'Rongga perut bagian bawah', structure: 'Saluran pencernaan yang mengelilingi usus halus', function: 'Menyerap air dan membentuk feses.' },
  { id: 'small_intestine', label: 'Usus Halus', art: anatomySmallIntestineArt, position: { x: 50, y: 48.5 }, location: 'Rongga perut bagian bawah', structure: 'Saluran panjang yang berlipat-lipat', function: 'Menyerap sebagian besar zat gizi makanan.' },
  { id: 'kidneys', label: 'Ginjal', art: anatomyKidneysArt, position: { x: 39.5, y: 40.5 }, location: 'Kanan dan kiri tulang belakang di rongga perut', structure: 'Sepasang organ berbentuk kacang', function: 'Menyaring darah dan membentuk urine.' },
] as const
