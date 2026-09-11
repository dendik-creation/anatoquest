import { useCallback, useEffect, useId, useRef, useState, type CSSProperties } from 'react'

import mainLogo from '../../assets/00_identity/main_logo.png'
import bgmOff from '../../assets/01_reusable/buttons/bgm_off.png'
import bgmOn from '../../assets/01_reusable/buttons/bgm_on.png'
import keluarArt from '../../assets/01_reusable/buttons/keluar.png'
import tentangInfoArt from '../../assets/01_reusable/buttons/tentang_info.png'
import homeBackground from '../../assets/02_scene/02_home/background/1.png'
import mascotGreeting from '../../assets/02_scene/02_home/mascot_greeting.png'
import glosariumArt from '../../assets/02_scene/02_home/menus/glosarium.png'
import kuisArt from '../../assets/02_scene/02_home/menus/kuis.png'
import miniGameArt from '../../assets/02_scene/02_home/menus/mini_game.png'
import mulaiPembelajaranArt from '../../assets/02_scene/02_home/menus/mulai_pembelajaran.png'
import simulasiOrganArt from '../../assets/02_scene/02_home/menus/simulasi_organ.png'
import materiArt from '../../assets/02_scene/02_home/menus/materi.png'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { useStageCoverScale } from '../../hooks/useStageCoverScale'
import './HomeScene.css'

/**
 * SC-02 Home.
 *
 * `entering` — every element (background excluded) bubbles/fades in, staggered.
 * `idle`     — at rest; the exit-confirm dialog can open on top.
 * `exiting`  — the same elements bubble/fade out in reverse order, then the
 *              window closes.
 */
type HomePhase = 'entering' | 'idle' | 'exiting'

const DESIGN_WIDTH = 1920
const DESIGN_HEIGHT = 1080

/** Logo through the mascot/exit button, plus a slim margin; never cropped. */
const SAFE_WIDTH = 1860
const SAFE_HEIGHT = 1046

const STAGGER_STEP_MS = 50
const ENTER_DURATION_MS = 480
const EXIT_DURATION_MS = 420
const REDUCED_MOTION_MS = 140

/** Six activity cards, in the order they should pop in. */
const MENU_CARDS = [
  { id: 'mulai_pembelajaran', label: 'Mulai Pembelajaran', art: mulaiPembelajaranArt },
  { id: 'materi', label: 'Materi', art: materiArt },
  { id: 'simulasi_organ', label: 'Simulasi Organ', art: simulasiOrganArt },
  { id: 'mini_game', label: 'Mini Game', art: miniGameArt },
  { id: 'kuis', label: 'Kuis', art: kuisArt },
  { id: 'glosarium', label: 'Glosarium', art: glosariumArt },
] as const

export type HomeMenuId = (typeof MENU_CARDS)[number]['id']

/** Every staggered element, in enter order. Index doubles as the stagger key. */
const STAGGER_KEYS = [
  'logo',
  'title',
  'subtitle',
  'info',
  'audio',
  'card-mulai_pembelajaran',
  'card-materi',
  'card-simulasi_organ',
  'card-mini_game',
  'card-kuis',
  'card-glosarium',
  'mascot',
  'exit',
] as const

const STAGGER_INDEX: Record<string, number> = Object.fromEntries(
  STAGGER_KEYS.map((key, index) => [key, index]),
)
const STAGGER_COUNT = STAGGER_KEYS.length

function staggerStyle(key: (typeof STAGGER_KEYS)[number]): CSSProperties {
  return { '--stagger': STAGGER_INDEX[key] } as CSSProperties
}

type HomeSceneProps = {
  /** Optional hook for a future scene router; unimplemented destinations are a no-op. */
  onSelectMenu?: (menuId: HomeMenuId) => void
}

export function HomeScene({ onSelectMenu }: HomeSceneProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const stageScale = useStageCoverScale(DESIGN_WIDTH, DESIGN_HEIGHT, SAFE_WIDTH, SAFE_HEIGHT)

  const [phase, setPhase] = useState<HomePhase>('entering')
  const [audioOn, setAudioOn] = useState(true)
  const [confirmExitOpen, setConfirmExitOpen] = useState(false)
  const [infoOpen, setInfoOpen] = useState(false)

  const exitButtonRef = useRef<HTMLButtonElement>(null)
  const infoButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (phase !== 'entering') return

    const duration = prefersReducedMotion
      ? REDUCED_MOTION_MS
      : STAGGER_COUNT * STAGGER_STEP_MS + ENTER_DURATION_MS
    const timer = window.setTimeout(() => setPhase('idle'), duration)

    return () => window.clearTimeout(timer)
  }, [phase, prefersReducedMotion])

  useEffect(() => {
    if (phase !== 'exiting') return

    const duration = prefersReducedMotion
      ? REDUCED_MOTION_MS
      : STAGGER_COUNT * STAGGER_STEP_MS + EXIT_DURATION_MS
    const timer = window.setTimeout(() => window.close(), duration)

    return () => window.clearTimeout(timer)
  }, [phase, prefersReducedMotion])

  const handleSelectMenu = useCallback(
    (menuId: HomeMenuId) => {
      onSelectMenu?.(menuId)
    },
    [onSelectMenu],
  )

  const openConfirmExit = useCallback(() => setConfirmExitOpen(true), [])
  const closeConfirmExit = useCallback(() => {
    setConfirmExitOpen(false)
    exitButtonRef.current?.focus()
  }, [])
  const confirmExit = useCallback(() => {
    setConfirmExitOpen(false)
    setPhase('exiting')
  }, [])

  const openInfo = useCallback(() => setInfoOpen(true), [])
  const closeInfo = useCallback(() => {
    setInfoOpen(false)
    infoButtonRef.current?.focus()
  }, [])

  return (
    <div className="home" data-phase={phase} data-testid="home-scene">
      <div
        className="home__stage"
        data-testid="home-stage"
        style={{ '--stage-scale': stageScale } as CSSProperties}
      >
        <img className="home__background" src={homeBackground} alt="" aria-hidden="true" />

        <img
          className="home__anim home__logo"
          data-testid="home-logo"
          style={staggerStyle('logo')}
          src={mainLogo}
          alt="AnatoQuest: Human Body Explorer"
        />

        <div className="home__anim home__heading" style={staggerStyle('title')}>
          <h1 className="home__title" data-testid="home-title">
            Pilih Aktivitas Belajar
          </h1>
        </div>
        <p
          className="home__anim home__subtitle"
          data-testid="home-subtitle"
          style={staggerStyle('subtitle')}
        >
          Jelajahi anatomi dan fisiologi tubuh manusia melalui aktivitas interaktif.
        </p>

        <button
          ref={infoButtonRef}
          type="button"
          className="home__anim home__icon-button home__info-button"
          data-testid="home-info-button"
          style={staggerStyle('info')}
          aria-label="Tentang AnatoQuest"
          aria-haspopup="dialog"
          onClick={openInfo}
        >
          <img src={tentangInfoArt} alt="" aria-hidden="true" />
        </button>

        <button
          type="button"
          className="home__anim home__icon-button home__audio-button"
          data-testid="home-audio-button"
          style={staggerStyle('audio')}
          aria-pressed={audioOn}
          aria-label={audioOn ? 'Matikan musik latar' : 'Aktifkan musik latar'}
          onClick={() => setAudioOn((current) => !current)}
        >
          <img src={audioOn ? bgmOn : bgmOff} alt="" aria-hidden="true" />
        </button>

        {MENU_CARDS.map((card) => (
          <button
            key={card.id}
            type="button"
            className={`home__anim home__card home__card--${card.id}`}
            data-testid={`home-card-${card.id.replace(/_/g, '-')}`}
            style={staggerStyle(`card-${card.id}`)}
            aria-label={card.label}
            onClick={() => handleSelectMenu(card.id)}
          >
            <img src={card.art} alt="" aria-hidden="true" />
          </button>
        ))}

        <img
          className="home__anim home__mascot"
          data-testid="home-mascot"
          style={staggerStyle('mascot')}
          src={mascotGreeting}
          alt=""
          aria-hidden="true"
        />

        <button
          ref={exitButtonRef}
          type="button"
          className="home__anim home__exit-button"
          data-testid="home-exit-button"
          style={staggerStyle('exit')}
          aria-label="Keluar dari aplikasi"
          aria-haspopup="dialog"
          onClick={openConfirmExit}
        >
          <img src={keluarArt} alt="" aria-hidden="true" />
        </button>
      </div>

      {confirmExitOpen && (
        <ConfirmExitDialog onConfirm={confirmExit} onCancel={closeConfirmExit} />
      )}

      {infoOpen && <InfoDialog onClose={closeInfo} />}
    </div>
  )
}

type ConfirmExitDialogProps = {
  onConfirm: () => void
  onCancel: () => void
}

function ConfirmExitDialog({ onConfirm, onCancel }: ConfirmExitDialogProps) {
  const titleId = useId()
  const descId = useId()
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    panelRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onCancel()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onCancel])

  return (
    <div className="home-dialog" data-testid="home-exit-dialog">
      <button
        type="button"
        className="home-dialog__backdrop"
        aria-label="Tutup dialog"
        onClick={onCancel}
      />
      <div
        ref={panelRef}
        className="home-dialog__panel home-dialog__panel--confirm"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        tabIndex={-1}
      >
        <h2 id={titleId} className="home-dialog__title">
          Yakin ingin keluar?
        </h2>
        <p id={descId} className="home-dialog__body">
          Kamu akan keluar dari AnatoQuest: Human Body Explorer.
        </p>
        <div className="home-dialog__actions">
          <button
            type="button"
            className="home-dialog__button home-dialog__button--quiet"
            data-testid="home-exit-cancel"
            onClick={onCancel}
          >
            Tidak
          </button>
          <button
            type="button"
            className="home-dialog__button home-dialog__button--primary"
            data-testid="home-exit-confirm"
            onClick={onConfirm}
          >
            Ya
          </button>
        </div>
      </div>
    </div>
  )
}

type InfoDialogProps = {
  onClose: () => void
}

function InfoDialog({ onClose }: InfoDialogProps) {
  const titleId = useId()
  const descId = useId()
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    panelRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div className="home-dialog" data-testid="home-info-dialog">
      <button
        type="button"
        className="home-dialog__backdrop"
        aria-label="Tutup dialog"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        className="home-dialog__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        tabIndex={-1}
      >
        <h2 id={titleId} className="home-dialog__title">
          Tentang AnatoQuest
        </h2>
        <p id={descId} className="home-dialog__body">
          Gim pembelajaran anatomi dan fisiologi untuk kelas X Layanan Kesehatan. Jelajahi
          sepuluh sistem organ tubuh manusia lewat visualisasi, latihan, dan kuis.
        </p>
        <div className="home-dialog__actions home-dialog__actions--single">
          <button
            type="button"
            className="home-dialog__button home-dialog__button--primary"
            data-testid="home-info-close"
            onClick={onClose}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  )
}
