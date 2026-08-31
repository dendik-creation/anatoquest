import { useEffect, useState } from 'react'

/**
 * Scales a fixed design stage to the viewport.
 *
 * Preference order:
 * 1. cover the viewport, so the scene background is full bleed;
 * 2. never crop the safe box (the band that holds logo, progress and prompt),
 *    because AnatoQuest must stay readable down to small landscape phones.
 *
 * When rule 2 wins the stage is letterboxed and the host paints the backdrop
 * token behind it.
 */
export function useStageCoverScale(
  designWidth: number,
  designHeight: number,
  safeWidth: number,
  safeHeight: number,
): number {
  const [scale, setScale] = useState(() =>
    computeScale(designWidth, designHeight, safeWidth, safeHeight),
  )

  useEffect(() => {
    const update = () =>
      setScale(computeScale(designWidth, designHeight, safeWidth, safeHeight))

    update()
    window.addEventListener('resize', update)
    window.addEventListener('orientationchange', update)

    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('orientationchange', update)
    }
  }, [designWidth, designHeight, safeWidth, safeHeight])

  return scale
}

function computeScale(
  designWidth: number,
  designHeight: number,
  safeWidth: number,
  safeHeight: number,
): number {
  if (typeof window === 'undefined') return 1

  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  if (!viewportWidth || !viewportHeight) return 1

  const cover = Math.max(viewportWidth / designWidth, viewportHeight / designHeight)
  const safeContain = Math.min(viewportWidth / safeWidth, viewportHeight / safeHeight)

  return Math.min(cover, safeContain)
}
