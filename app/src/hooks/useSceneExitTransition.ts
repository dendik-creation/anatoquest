import { useCallback, useEffect, useRef, useState } from 'react'

export const SCENE_EXIT_DURATION_MS = 800

/** Keeps a scene mounted long enough for its staged exit animation to finish. */
export function useSceneExitTransition() {
  const [isExiting, setIsExiting] = useState(false)
  const isExitingRef = useRef(false)
  const timerRef = useRef<number | undefined>(undefined)

  useEffect(() => () => {
    if (timerRef.current !== undefined) window.clearTimeout(timerRef.current)
  }, [])

  const exitTo = useCallback((action?: () => void) => {
    if (!action || isExitingRef.current) return

    isExitingRef.current = true
    setIsExiting(true)
    timerRef.current = window.setTimeout(action, SCENE_EXIT_DURATION_MS)
  }, [])

  return { isExiting, exitTo }
}
