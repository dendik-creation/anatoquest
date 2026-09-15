import explorerPernapasan from '../../assets/02_scene/05_sistem_pernapasan_kardiovaskular_lumfatik/07_preview_utama_sistem_organ.png'
import explorerKardiovaskular from '../../assets/02_scene/05_sistem_pernapasan_kardiovaskular_lumfatik/09_preview_detail_kardiovaskular.png'
import explorerLimfatik from '../../assets/02_scene/05_sistem_pernapasan_kardiovaskular_lumfatik/10_preview_detail_limfatik.png'
import badgeIconPernapasan from '../../assets/02_scene/05_sistem_pernapasan_kardiovaskular_lumfatik/08_preview_detail_pernapasan.png'
import badgeIconKardiovaskular from '../../assets/02_scene/05_sistem_pernapasan_kardiovaskular_lumfatik/09_preview_detail_kardiovaskular.png'
import badgeIconLimfatik from '../../assets/02_scene/05_sistem_pernapasan_kardiovaskular_lumfatik/10_preview_detail_limfatik.png'
import organHidung from '../../assets/02_scene/05_sistem_pernapasan_kardiovaskular_lumfatik/13_organ_hidung.png'
import organFaring from '../../assets/02_scene/05_sistem_pernapasan_kardiovaskular_lumfatik/14_organ_faring.png'
import organLaring from '../../assets/02_scene/05_sistem_pernapasan_kardiovaskular_lumfatik/15_organ_laring.png'
import organTrakea from '../../assets/02_scene/05_sistem_pernapasan_kardiovaskular_lumfatik/16_organ_trakea.png'
import organBronkus from '../../assets/02_scene/05_sistem_pernapasan_kardiovaskular_lumfatik/17_organ_bronkus.png'
import organAlveolus from '../../assets/02_scene/05_sistem_pernapasan_kardiovaskular_lumfatik/18_organ_alveolus.png'

/**
 * SC-06 Materi 2: Respiratory / Heart / Vessels & Lymphatic — content data
 * (`PROPOSED`). The Figma "Main" frame (node 58:3, file h11RPHZrZurTNsU3U0DWFZ)
 * only spells out full copy for the default Pernapasan → Paru-paru state (the
 * "Keterangan : ......." placeholders); Kardiovaskular/Limfatik organ facts
 * and every "proses fisiologi" line below are written for plausibility from
 * the approved learning scope, the same way `fundamentalContent.ts` and
 * `caseStudyContent.ts` are drafts pending SME sign-off — not a confirmed,
 * medically reviewed answer key. Do not ship without SME review.
 *
 * Asset mapping (`PROPOSED`, all four real Figma-exported files are used):
 * - `07_preview_utama_sistem_organ` is the literal AnatomyExplorer image for
 *   the Figma-authored default (Pernapasan) state.
 * - `09_preview_detail_kardiovaskular` / `10_preview_detail_limfatik` are the
 *   matching per-system exports for the other two AnatomyExplorer states —
 *   the task brief requires the explorer preview to swap per selected system.
 * - `08_preview_detail_pernapasan` had no remaining explorer slot once 07
 *   filled the default state, so it is reused as Pernapasan's small badge
 *   thumbnail in "Organ Terpilih"; Kardiovaskular/Limfatik reuse their own
 *   explorer image at thumbnail size for the same slot.
 *
 * The `02_card_alur_belajar`, `03/04/05_button_*`, `06_card_jelajahi_sistem_organ`,
 * `11_info_organ_terpilih` and `12_card_aktivitas_susun_jalur_pernapasan` Figma
 * exports bake their copy (and, for the three selector buttons, a large
 * transparent export margin) into flattened PNG pixels. Per the working
 * agreement a flattened image is never the accessible/interactive copy source
 * (see `SceneHeader.tsx`'s doc comment for the same call on SC-01), so this
 * scene rebuilds that chrome as real DOM/CSS instead of importing those
 * files; only the text-free illustration exports are used directly.
 */

export type OrganSystemId = 'pernapasan' | 'kardiovaskular' | 'limfatik'

export type OrganSystemInfo = {
  id: OrganSystemId
  /** Tab label, exactly as given on the Figma selector pills. */
  label: string
  /** `docs/design/04-game-visual-language.md` organ-system colour map. */
  color: string
  colorSoft: string
  /** AnatomyExplorer centre-panel body art for this system. */
  explorerImage: string
  /** Small round thumbnail beside the organ name in "Organ Terpilih". */
  badgeIcon: string
  organ: {
    name: string
    badge: string
    description: string
    location: string
    function: string
    process: string
  }
}

export const ORGAN_SYSTEMS: OrganSystemInfo[] = [
  {
    id: 'pernapasan',
    label: 'Pernapasan',
    color: '#117151',
    colorSoft: '#e3f6ec',
    explorerImage: explorerPernapasan,
    badgeIcon: badgeIconPernapasan,
    organ: {
      name: 'Paru-paru',
      badge: 'Sistem Pernapasan',
      description:
        'Paru-paru adalah organ utama sistem pernapasan yang berfungsi untuk pertukaran gas, yaitu mengambil oksigen dari udara dan mengeluarkan karbon dioksida dari tubuh.',
      location: 'Di dalam rongga dada, kanan dan kiri jantung, dilindungi oleh tulang rusuk.',
      function: 'Tempat pertukaran gas antara oksigen dan karbon dioksida dengan bantuan alveolus.',
      process:
        'Udara yang dihirup mengalir dari hidung menuju alveolus, tempat oksigen berpindah ke darah dan karbon dioksida dikeluarkan saat menghembuskan napas.',
    },
  },
  {
    id: 'kardiovaskular',
    label: 'Kardiovaskular',
    color: '#b42318',
    colorSoft: '#fce9e7',
    explorerImage: explorerKardiovaskular,
    badgeIcon: badgeIconKardiovaskular,
    organ: {
      name: 'Jantung',
      badge: 'Sistem Kardiovaskular',
      description:
        'Jantung adalah organ utama sistem kardiovaskular yang berfungsi memompa darah agar oksigen dan sari makanan sampai ke seluruh tubuh.',
      location: 'Di dalam rongga dada, sedikit condong ke kiri, di antara kedua paru-paru.',
      function: 'Memompa darah kaya oksigen ke seluruh tubuh dan menerima kembali darah yang kaya karbon dioksida.',
      process:
        'Jantung berdetak memompa darah keluar melalui arteri ke seluruh tubuh, lalu menerimanya kembali melalui vena untuk dialirkan ke paru-paru.',
    },
  },
  {
    id: 'limfatik',
    label: 'Limfatik',
    color: '#2463a5',
    colorSoft: '#e6f0fb',
    explorerImage: explorerLimfatik,
    badgeIcon: badgeIconLimfatik,
    organ: {
      name: 'Kelenjar Getah Bening',
      badge: 'Sistem Limfatik',
      description:
        'Kelenjar getah bening adalah bagian sistem limfatik yang menyaring cairan tubuh dan membantu melawan infeksi.',
      location: 'Tersebar di beberapa titik tubuh, seperti leher, ketiak, dan lipat paha.',
      function: 'Menyaring kuman dan sel asing dari cairan limfa serta menghasilkan sel darah putih untuk melawan infeksi.',
      process:
        'Cairan limfa mengalir melalui pembuluh limfatik dan disaring di kelenjar getah bening sebelum kembali ke aliran darah.',
    },
  },
]

export const DEFAULT_SYSTEM_ID: OrganSystemId = 'pernapasan'

export const LEARNING_PATH_STEPS = [
  {
    id: 'pahami-konsep',
    title: 'Pahami Konsep',
    body: 'Kenali peran dan hubungan antar sistem',
  },
  {
    id: 'jelajahi-organ',
    title: 'Jelajahi Organ',
    body: 'Amati struktur dan fungsinya secara interaktif',
  },
  {
    id: 'coba-aktivitas',
    title: 'Coba Aktivitas',
    body: 'Latih pemahamanmu dengan aktivitas seru',
  },
] as const

export type RespiratoryStepId = 'hidung' | 'faring' | 'laring' | 'trakea' | 'bronkus' | 'alveolus'

export type RespiratoryOrgan = {
  id: RespiratoryStepId
  label: string
  image: string
  /** 0-based position in the correct hidung→alveolus airway order. */
  correctIndex: number
  explanation: string
}

/** Correct order per the storyboard prompt: Hidung → Faring → Laring → Trakea → Bronkus → Alveolus. */
export const RESPIRATORY_SEQUENCE: RespiratoryOrgan[] = [
  {
    id: 'hidung',
    label: 'Hidung',
    image: organHidung,
    correctIndex: 0,
    explanation: 'Udara masuk dan disaring serta dihangatkan di rongga hidung.',
  },
  {
    id: 'faring',
    label: 'Faring',
    image: organFaring,
    correctIndex: 1,
    explanation: 'Udara melewati faring, persimpangan saluran napas dan saluran pencernaan.',
  },
  {
    id: 'laring',
    label: 'Laring',
    image: organLaring,
    correctIndex: 2,
    explanation: 'Udara melewati laring yang juga berperan menghasilkan suara.',
  },
  {
    id: 'trakea',
    label: 'Trakea',
    image: organTrakea,
    correctIndex: 3,
    explanation: 'Udara mengalir melalui trakea menuju percabangan bronkus.',
  },
  {
    id: 'bronkus',
    label: 'Bronkus',
    image: organBronkus,
    correctIndex: 4,
    explanation: 'Udara diteruskan lewat bronkus menuju paru-paru kanan dan kiri.',
  },
  {
    id: 'alveolus',
    label: 'Alveolus',
    image: organAlveolus,
    correctIndex: 5,
    explanation: 'Udara sampai di alveolus, tempat pertukaran oksigen dan karbon dioksida terjadi.',
  },
]

/**
 * Initial pool order — deliberately not the answer order, so the activity is
 * a real recall task rather than a pre-sorted list to click through.
 */
export const RESPIRATORY_POOL_ORDER: RespiratoryStepId[] = [
  'laring',
  'alveolus',
  'hidung',
  'trakea',
  'faring',
  'bronkus',
]

/**
 * Second drag/drop activity from the proposal ("memasangkan organ dengan
 * fungsi fisiologinya" — `EXPLICIT` per the pasted proposal excerpt), reusing
 * the same six respiratory organs/art as `RESPIRATORY_SEQUENCE`. Each function
 * line is a short, distinct phrase (not the longer pathway `explanation`
 * above) so a learner can match by content rather than by position.
 * `PROPOSED` copy pending SME review, same status as the rest of this file.
 */
export const RESPIRATORY_FUNCTIONS: Record<RespiratoryStepId, string> = {
  hidung: 'Menyaring, menghangatkan, dan melembapkan udara yang masuk.',
  faring: 'Menjadi persimpangan jalur udara dan jalur makanan.',
  laring: 'Menghasilkan suara dan melindungi saluran napas saat menelan.',
  trakea: 'Menyalurkan udara dari leher menuju percabangan bronkus.',
  bronkus: 'Membagi aliran udara menuju paru-paru kanan dan kiri.',
  alveolus: 'Menjadi tempat pertukaran oksigen dan karbon dioksida.',
}

/** Short on-card label for each function card (the full sentence above is
 *  still the accessible name/feedback copy) — kept to 2-3 words so it fits
 *  the same compact slot the sequencing activity uses. */
export const RESPIRATORY_FUNCTION_TAGS: Record<RespiratoryStepId, string> = {
  hidung: 'Saring udara',
  faring: 'Jalur ganda',
  laring: 'Hasilkan suara',
  trakea: 'Saluran udara',
  bronkus: 'Percabangan',
  alveolus: 'Tukar gas',
}

/** Function-card display order — deliberately different from both the correct
 *  airway sequence and the sequencing pool order above. */
export const MATCH_SLOT_ORDER: RespiratoryStepId[] = [
  'bronkus',
  'hidung',
  'alveolus',
  'faring',
  'trakea',
  'laring',
]

/** Organ-chip pool order for the matching activity — distinct from `RESPIRATORY_POOL_ORDER`. */
export const MATCH_POOL_ORDER: RespiratoryStepId[] = [
  'trakea',
  'hidung',
  'bronkus',
  'laring',
  'alveolus',
  'faring',
]

export const MATCH_FEEDBACK_INCORRECT = 'Belum cocok. Baca kembali fungsi organ tersebut.'

/**
 * Shown until a correct/incorrect placement event replaces it. Figma node
 * 68:101 spells out a raw copywriting placeholder
 * ("<Organ ini> tidak disini atau Semua sudah berurutan") instead of real
 * copy — that is not user-facing text, so this is written as a normal
 * instruction instead of reproducing the placeholder literally.
 */
export const RESPIRATORY_IDLE_HINT =
  'Seret organ ke kotak urutan yang sesuai, dari yang paling luar menuju paru-paru.'

export const RESPIRATORY_FEEDBACK_INCORRECT =
  'Belum tepat. Urutkan dari organ paling luar menuju paru-paru.'
