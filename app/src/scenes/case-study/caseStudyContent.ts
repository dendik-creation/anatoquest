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
   * Short, non-diagnostic physiology explanation announced (screen-reader
   * only, see `CaseStudyScene`) the moment the symptom is placed correctly.
   * General mechanism only — never a claim about this character's
   * diagnosis, per the SC-04 product boundary.
   */
  explanation: string
  /** Resting position in the 1920x1080 design stage, from the Figma frame. */
  home: { x: number; y: number; width: number; height: number }
}

/**
 * Hotspot centres are read directly off the shipped body-anatomy overlay
 * (`assets/02_scene/03_case_study/body_anatomy_full.png`), scaled and
 * shifted by the same transform as `.case-study__body-art` (see
 * `CaseStudyScene.css`) so the drop targets stay pinned to the printed
 * lung/heart illustration.
 */
export const CASE_STUDY_ORGANS: OrganHotspot[] = [
  { id: 'lung', label: 'Paru-paru', x: 814, y: 582, badgeOffsetY: -70 },
  { id: 'heart', label: 'Jantung', x: 797, y: 632, badgeOffsetY: 100 },
]

export const CASE_STUDY_SYMPTOMS: CaseStudySymptom[] = [
  {
    id: 'sesak_napas',
    label: 'Sesak napas',
    art: cardLungs,
    correctHotspot: 'lung',
    explanation:
      'Sesak napas muncul ketika paru-paru kesulitan menukar oksigen dan karbondioksida secara maksimal.',
    home: { x: 1085, y: 435, width: 227, height: 192 },
  },
  {
    id: 'jantung_berdebar',
    label: 'Jantung berdebar',
    art: cardHeart,
    correctHotspot: 'heart',
    explanation:
      'Jantung berdebar adalah tanda jantung memompa darah lebih cepat atau tidak beraturan dari biasanya.',
    home: { x: 1329, y: 435, width: 227, height: 192 },
  },
  {
    id: 'lelah',
    label: 'Lelah',
    art: cardSleepy,
    correctHotspot: 'heart',
    explanation:
      'Rasa lelah dapat muncul ketika jantung tidak memompa cukup darah kaya oksigen ke seluruh tubuh.',
    home: { x: 1085, y: 648, width: 227, height: 192 },
  },
  {
    id: 'pucat',
    label: 'Pucat',
    art: cardSad,
    correctHotspot: 'heart',
    explanation:
      'Wajah pucat dapat menandakan aliran darah ke permukaan kulit berkurang akibat kerja jantung yang terganggu.',
    home: { x: 1329, y: 648, width: 227, height: 192 },
  },
]

export const CASE_STUDY_TITLE = 'Analisis Kasus Pasien'
export const CASE_STUDY_SUBTITLE = 'Analisis gejala yang dialami pasien.'

export const CASE_STUDY_BRIEF_LABEL = 'Studi Kasus Analisis Gejala'
export const CASE_STUDY_BRIEF_BODY =
  'Seorang pasien datang dengan keluhan sesak napas, jantung berdebar, mudah lelah, dan tampak pucat.'
export const CASE_STUDY_BRIEF_TASK_LEAD = 'Tugasmu :'
export const CASE_STUDY_BRIEF_TASK =
  'Hubungkan setiap gejala dengan organ yang paling berkaitan.'

export const CASE_STUDY_BODY_HEADING = 'Analisis Tubuh'
export const CASE_STUDY_SYMPTOM_HEADING = 'Gejala Pasien'
export const CASE_STUDY_PROGRESS_LABEL = 'Progres Analisis'

export const CASE_STUDY_FEEDBACK_INCORRECT =
  'Belum tepat. Coba pikirkan organ lain yang berkaitan dengan gejala ini.'

export const CASE_STUDY_CHECK_BUTTON = 'Periksa Analisis'
export const CASE_STUDY_CONTINUE_BUTTON = 'Lanjut ke Pembahasan'
export const CASE_STUDY_START_MATERI_BUTTON = 'Mulai Materi 1'

export const CASE_STUDY_RESULT_TITLE = 'Hasil Analisis'
export const CASE_STUDY_RESULT_BODY =
  'Gejala yang dialami pasien menunjukkan keterkaitan dengan beberapa fungsi sistem organ. Hubungan tersebut akan dipelajari lebih lanjut pada materi berikutnya.'
