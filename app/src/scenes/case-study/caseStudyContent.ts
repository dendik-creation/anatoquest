import cardHeart from '../../assets/02_scene/03_case_study/card_heart.png'
import cardLungs from '../../assets/02_scene/03_case_study/card_lungs.png'
import cardSad from '../../assets/02_scene/03_case_study/card_sad.png'
import cardSleepy from '../../assets/02_scene/03_case_study/card_sleepy.png'

/**
 * SC-04 Apersepsi & Studi Kasus — content configuration.
 *
 * `PROPOSED`: the four symptoms, the two-organ hotspot set, and the
 * symptom-to-organ mapping below are an implementation draft for this build,
 * not an SME-approved answer key. `TASKS.md` Phase 04 and Phase 00 still list
 * "confirm in-app case ... four symptoms, response mapping" and medical
 * review as open. Keep this mapping here (content data), not hard-coded in
 * component logic, so a future SME-approved revision only touches this file.
 */

export type OrganHotspotId = 'lung' | 'heart'

export type OrganHotspot = {
  id: OrganHotspotId
  label: string
  /** Design-space (1920x1080) centre of the hotspot's hit target. */
  x: number
  y: number
  /**
   * Signed vertical offset (design px) from `y` where placed-symptom badges
   * stack, chosen per organ so the lung (fewer, above the heart) and heart
   * (more, below the lungs) badge clusters grow away from each other instead
   * of colliding in the gap between the two hotspots.
   */
  badgeOffsetY: number
}

export type CaseStudySymptom = {
  id: string
  label: string
  art: string
  correctHotspot: OrganHotspotId
  /**
   * Short, non-diagnostic physiology explanation shown as immediate feedback
   * once the symptom is placed correctly. General mechanism only — never a
   * claim about this character's diagnosis, per the SC-04 product boundary.
   */
  explanation: string
  /** Resting position in the 1920x1080 design stage, from the Figma frame. */
  home: { x: number; y: number; width: number; height: number }
}

/**
 * Hotspot centres are read directly off the shipped background artwork
 * (`assets/02_scene/03_case_study/backgrounds/1.png`, rendered full-bleed at
 * the 1920x1080 design size) — the lung/heart illustration already lives in
 * that background, so these are plain overlay drop points, not a second
 * anatomy image.
 */
export const CASE_STUDY_ORGANS: OrganHotspot[] = [
  { id: 'lung', label: 'Paru-paru', x: 888, y: 456, badgeOffsetY: -70 },
  { id: 'heart', label: 'Jantung', x: 867, y: 520, badgeOffsetY: 100 },
]

export const CASE_STUDY_SYMPTOMS: CaseStudySymptom[] = [
  {
    id: 'sesak_napas',
    label: 'Sesak napas',
    art: cardLungs,
    correctHotspot: 'lung',
    explanation:
      'Sesak napas muncul ketika paru-paru kesulitan menukar oksigen dan karbondioksida secara maksimal.',
    home: { x: 1085, y: 285, width: 267, height: 226 },
  },
  {
    id: 'jantung_berdebar',
    label: 'Jantung berdebar',
    art: cardHeart,
    correctHotspot: 'heart',
    explanation:
      'Jantung berdebar adalah tanda jantung memompa darah lebih cepat atau tidak beraturan dari biasanya.',
    home: { x: 1372, y: 285, width: 267, height: 226 },
  },
  {
    id: 'lelah',
    label: 'Lelah',
    art: cardSleepy,
    correctHotspot: 'heart',
    explanation:
      'Rasa lelah dapat muncul ketika jantung tidak memompa cukup darah kaya oksigen ke seluruh tubuh.',
    home: { x: 1085, y: 535, width: 267, height: 226 },
  },
  {
    id: 'pucat',
    label: 'Pucat',
    art: cardSad,
    correctHotspot: 'heart',
    explanation:
      'Wajah pucat dapat menandakan aliran darah ke permukaan kulit berkurang akibat kerja jantung yang terganggu.',
    home: { x: 1372, y: 535, width: 267, height: 226 },
  },
]

export const CASE_STUDY_INSTRUCTION = 'Pilih atau seret setiap gejala ke organ yang berkaitan.'
export const CASE_STUDY_PROMPT_PENDING = 'Pilih satu gejala, lalu letakkan pada organ yang berkaitan.'
export const CASE_STUDY_FEEDBACK_INCORRECT =
  'Belum tepat. Coba pikirkan organ lain yang berkaitan dengan gejala ini.'
export const CASE_STUDY_COMPLETE_TITLE = 'Studi Kasus Telah Dipelajari'
export const CASE_STUDY_COMPLETE_BODY =
  'Kamu berhasil menghubungkan seluruh gejala dengan organ yang berkaitan.'
