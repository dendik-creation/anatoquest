import otakImg from '../../assets/01_reusable/organs/04_persarafan/otak.png'
import sumsumImg from '../../assets/01_reusable/organs/04_persarafan/sumsum_tulang_belakang.png'
import jantungImg from '../../assets/01_reusable/organs/02_sirkulasi_limfatik/jantung.png'
import paruParuImg from '../../assets/01_reusable/organs/01_pernapasan/paru_paru.png'
import hatiImg from '../../assets/01_reusable/organs/03_pencernaan/hati.png'
import lambungImg from '../../assets/01_reusable/organs/03_pencernaan/lambung.png'
import ususHalusImg from '../../assets/01_reusable/organs/03_pencernaan/usus_halus.png'
import ginjalImg from '../../assets/01_reusable/organs/05_perkemihan/ginjal.png'
import ototPunggungImg from '../../assets/01_reusable/organs/07_otot_tulang/kelompok_otot_rangka.png'

/**
 * SC-05 Materi 1: Fundamentals — draft content (`PROPOSED`).
 *
 * Organ name/location/function copy and the anatomy-vs-physiology grouping
 * items below are an implementation draft written for plausibility from the
 * approved learning scope (`docs/prd/01-learning-content.md`), the same way
 * `caseStudyContent.ts` is a draft pending SME sign-off — not a confirmed,
 * medically reviewed answer key. Do not ship without SME review.
 */

export type AnatomyMode = 'front' | 'back'

export type FundamentalOrgan = {
  id: string
  label: string
  location: string
  function: string
  image: string
  /** Hotspot centre as a fraction (0-1) of the anatomy image's own box, per mode it appears in. */
  positions: Partial<Record<AnatomyMode, { x: number; y: number }>>
}

export const FUNDAMENTAL_ORGANS: FundamentalOrgan[] = [
  {
    id: 'otak',
    label: 'Otak',
    location: 'Rongga tengkorak (kranium)',
    function: 'Pusat kendali tubuh dan sistem saraf.',
    image: otakImg,
    positions: { front: { x: 0.485, y: 0.055 }, back: { x: 0.49, y: 0.055 } },
  },
  {
    id: 'jantung',
    label: 'Jantung',
    location: 'Rongga dada, agak ke kiri',
    function: 'Memompa darah ke seluruh tubuh.',
    image: jantungImg,
    positions: { front: { x: 0.535, y: 0.275 } },
  },
  {
    id: 'paru_paru',
    label: 'Paru-paru',
    location: 'Rongga dada, di kanan dan kiri jantung',
    function: 'Tempat pertukaran oksigen dan karbon dioksida.',
    image: paruParuImg,
    positions: { front: { x: 0.49, y: 0.225 } },
  },
  {
    id: 'hati',
    label: 'Hati',
    location: 'Rongga perut kanan atas',
    function: 'Menyaring darah dan menghasilkan empedu.',
    image: hatiImg,
    positions: { front: { x: 0.44, y: 0.345 } },
  },
  {
    id: 'lambung',
    label: 'Lambung',
    location: 'Rongga perut kiri atas',
    function: 'Mencerna makanan secara mekanik dan kimiawi.',
    image: lambungImg,
    positions: { front: { x: 0.565, y: 0.34 } },
  },
  {
    id: 'ginjal',
    label: 'Ginjal',
    location: 'Rongga perut belakang, kanan dan kiri tulang belakang',
    function: 'Menyaring darah dan membentuk urine.',
    image: ginjalImg,
    positions: { front: { x: 0.505, y: 0.4 }, back: { x: 0.505, y: 0.4 } },
  },
  {
    id: 'usus_halus',
    label: 'Usus Halus',
    location: 'Rongga perut bagian bawah',
    function: 'Menyerap sari-sari makanan.',
    image: ususHalusImg,
    positions: { front: { x: 0.49, y: 0.47 } },
  },
  {
    id: 'sumsum_tulang_belakang',
    label: 'Sumsum Tulang Belakang',
    location: 'Di dalam ruas tulang belakang',
    function: 'Menghantarkan impuls saraf antara otak dan tubuh.',
    image: sumsumImg,
    positions: { back: { x: 0.49, y: 0.48 } },
  },
  {
    id: 'otot_punggung',
    label: 'Otot Punggung',
    location: 'Melekat pada tulang punggung dan tubuh',
    function: 'Menggerakkan tubuh dan menjaga postur.',
    image: ototPunggungImg,
    positions: { back: { x: 0.49, y: 0.29 } },
  },
]

export function organsForMode(mode: AnatomyMode): FundamentalOrgan[] {
  return FUNDAMENTAL_ORGANS.filter((organ) => organ.positions[mode])
}

export const DEFAULT_ORGAN_ID = 'jantung'

export const CONCEPT_STEPS = [
  { id: 'sel', label: 'Sel' },
  { id: 'jaringan', label: 'Jaringan' },
  { id: 'organ', label: 'Organ' },
  { id: 'sistem_organ', label: 'Sistem Organ' },
] as const

export const CONCEPT_NOTES = [
  {
    id: 'anatomi',
    title: 'Anatomi',
    body: 'Anatomi mempelajari struktur tubuh manusia.',
  },
  {
    id: 'fisiologi',
    title: 'Fisiologi',
    body: 'Fisiologi mempelajari cara kerja dan fungsi tubuh.',
  },
] as const

export type ActivityGroup = 'struktur' | 'fungsi'

export type ActivityStatement = {
  id: string
  text: string
  group: ActivityGroup
  explanation: string
  home: { x: number; y: number; width: number; height: number }
}

export const ACTIVITY_STATEMENTS: ActivityStatement[] = [
  {
    id: 'bentuk_jantung',
    text: 'Bentuk jantung memiliki empat ruang',
    group: 'struktur',
    explanation: 'Ini menjelaskan struktur jantung: dua atrium dan dua ventrikel.',
    home: { x: 265, y: 885, width: 340, height: 64 },
  },
  {
    id: 'jantung_memompa',
    text: 'Jantung memompa darah',
    group: 'fungsi',
    explanation: 'Ini menjelaskan fungsi jantung, yaitu memompa darah ke seluruh tubuh.',
    home: { x: 625, y: 885, width: 340, height: 64 },
  },
  {
    id: 'paru_kerucut',
    text: 'Paru-paru berbentuk seperti kerucut',
    group: 'struktur',
    explanation: 'Ini menjelaskan bentuk (struktur) paru-paru, bukan cara kerjanya.',
    home: { x: 265, y: 960, width: 340, height: 64 },
  },
  {
    id: 'pertukaran_gas',
    text: 'Pertukaran gas terjadi di alveolus',
    group: 'fungsi',
    explanation: 'Ini menjelaskan fungsi paru-paru dalam pertukaran oksigen dan karbon dioksida.',
    home: { x: 625, y: 960, width: 340, height: 64 },
  },
]

export const ACTIVITY_ZONES: { id: ActivityGroup; label: string; x: number; y: number; width: number; height: number }[] = [
  { id: 'struktur', label: 'Struktur', x: 985, y: 885, width: 330, height: 140 },
  { id: 'fungsi', label: 'Fungsi', x: 1335, y: 885, width: 330, height: 140 },
]

export const FEEDBACK_INCORRECT = 'Belum tepat. Coba pikirkan lagi apakah pernyataan ini tentang bentuk atau cara kerja.'
