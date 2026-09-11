import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'

import mainLogo from '../../assets/00_identity/main_logo.png'
import splashBackground from '../../assets/02_scene/01_splash/splash_bg.png'
import touchAnything from '../../assets/02_scene/01_splash/touch_anything.png'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { useStageCoverScale } from '../../hooks/useStageCoverScale'
import { APP_ASSET_URLS, preloadAppAssets } from '../../lib/assetPreloader'
import './SplashScene.css'

/**
 * SC-01 Splash.
 *
 * `loading`      — logo and progress enter, real asset preload runs.
 * `loading-exit` — progress group leaves (bubble in + fade out).
 * `ready`        — tap prompt enters; any pointer/keyboard input continues.
 * `exiting`      — stage fades out before the host swaps the route.
 */
export type SplashPhase = 'loading' | 'loading-exit' | 'ready' | 'exiting'

const DESIGN_WIDTH = 1920
const DESIGN_HEIGHT = 1080

/** Logo, progress group and prompt plus breathing room; never cropped. */
const SAFE_WIDTH = 640
const SAFE_HEIGHT = 764

const MIN_LOADING_MS = 1600
const LOADING_EXIT_MS = 420
const EXIT_MS = 420
const REDUCED_MOTION_MS = 140

type SplashSceneProps = {
  onContinue: () => void
}

export function SplashScene({ onContinue }: SplashSceneProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const stageScale = useStageCoverScale(
    DESIGN_WIDTH,
    DESIGN_HEIGHT,
    SAFE_WIDTH,
    SAFE_HEIGHT,
  )

  const [phase, setPhase] = useState<SplashPhase>('loading')
  const [progress, setProgress] = useState(0)

  const targetProgressRef = useRef(0)
  const startedAtRef = useRef(0)

  // Real preload of every bundled asset. Progress drives the bar.
  useEffect(() => {
    let cancelled = false
    startedAtRef.current = performance.now()

    void preloadAppAssets(APP_ASSET_URLS, ({ ratio }) => {
      if (!cancelled) targetProgressRef.current = ratio
    })

    return () => {
      cancelled = true
    }
  }, [])

  // Eases the displayed value toward the real one so a warm cache does not make
  // the bar jump straight to 100%.
  useEffect(() => {
    if (phase !== 'loading') return

    let frame = 0
    let displayed = 0

    const tick = () => {
      const elapsed = performance.now() - startedAtRef.current
      const target = Math.min(targetProgressRef.current, elapsed / MIN_LOADING_MS)

      displayed += (target - displayed) * 0.14
      if (target - displayed < 0.003) displayed = target
      setProgress(displayed)

      if (targetProgressRef.current >= 1 && displayed >= 0.999) {
        setProgress(1)
        setPhase('loading-exit')
        return
      }

      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [phase])

  useEffect(() => {
    if (phase !== 'loading-exit') return

    const duration = prefersReducedMotion ? REDUCED_MOTION_MS : LOADING_EXIT_MS
    const timer = window.setTimeout(() => setPhase('ready'), duration)

    return () => window.clearTimeout(timer)
  }, [phase, prefersReducedMotion])

  useEffect(() => {
    if (phase !== 'exiting') return

    const duration = prefersReducedMotion ? REDUCED_MOTION_MS : EXIT_MS
    const timer = window.setTimeout(onContinue, duration)

    return () => window.clearTimeout(timer)
  }, [phase, prefersReducedMotion, onContinue])

  const handleContinue = useCallback(() => {
    if (phase !== 'ready') return

    // Best-effort: browsers can deny this (no user-gesture context, an
    // <iframe> missing allow="fullscreen", or the user already declined).
    // The learner must still continue into the app either way.
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {})
    }

    setPhase('exiting')
  }, [phase])

  // "Ketuk di mana saja" has to work from the keyboard too, without forcing the
  // learner to tab to the invisible surface first.
  useEffect(() => {
    if (phase !== 'ready') return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Enter' && event.key !== ' ' && event.key !== 'Spacebar') return
      event.preventDefault()
      handleContinue()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [phase, handleContinue])

  const percent = Math.round(progress * 100)
  const isLoading = phase === 'loading' || phase === 'loading-exit'
  const canContinue = phase === 'ready' || phase === 'exiting'

  return (
    <div
      className="splash"
      data-phase={phase}
      data-progress={percent}
      data-testid="splash-scene"
      style={{ '--stage-scale': stageScale } as CSSProperties}
    >
      <div className="splash__stage" data-testid="splash-stage">
        <img className="splash__background" src={splashBackground} alt="" aria-hidden="true" />
        <div className="splash__veil splash__veil--right" aria-hidden="true" />
        <div className="splash__veil splash__veil--left" aria-hidden="true" />

        <img
          className="splash__logo"
          data-testid="splash-logo"
          src={mainLogo}
          alt="AnatoQuest: Human Body Explorer"
        />

        {isLoading && (
          <div className="splash__loading" data-testid="splash-loading">
            <div
              className="splash__bar"
              data-testid="splash-progressbar"
              role="progressbar"
              aria-label="Memuat konten AnatoQuest"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={percent}
              aria-valuetext={`${percent} persen memuat konten`}
            >
              <div
                className="splash__bar-fill"
                data-testid="splash-progress-fill"
                style={{ width: `${percent}%` }}
              />
            </div>
            <p className="splash__loading-label" data-testid="splash-loading-label">
              {percent}% Memuat Konten
            </p>
          </div>
        )}

        {canContinue && (
          <>
            {/* The slot holds the design box; only the art inside animates, so
                the prompt's layout position never moves. */}
            <span
              className="splash__touch-icon"
              data-testid="splash-touch-icon"
              aria-hidden="true"
            >
              <img className="splash__touch-icon-art" src={touchAnything} alt="" />
            </span>
            <p
              className="splash__touch-label"
              data-testid="splash-touch-label"
              id="splash-continue-label"
            >
              Ketuk Dimana Saja untuk Melanjutkan
            </p>
          </>
        )}
      </div>

      {canContinue && (
        <button
          type="button"
          className="splash__continue"
          data-testid="splash-continue"
          aria-labelledby="splash-continue-label"
          onClick={handleContinue}
        />
      )}

      <p className="sr-only" role="status">
        {phase === 'ready' ? 'Konten siap. Ketuk di mana saja untuk melanjutkan.' : ''}
      </p>
    </div>
  )
}
