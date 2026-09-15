import { useCallback, useRef } from 'react'
import { driver, type Driver, type Alignment, type Side } from 'driver.js'
import 'driver.js/dist/driver.css'
import './useGuidedTour.css'

import { usePrefersReducedMotion } from './usePrefersReducedMotion'

export type TourStep = {
  /** CSS selector for the element this step highlights. */
  target: string
  title: string
  body: string
  /** Override driver.js's auto-placement when the default overlaps other UI. */
  side?: Side
  align?: Alignment
}

/**
 * Typed wrapper around driver.js for the cross-scene help/guided-tour pattern
 * (`docs/design/11-design-decisions.md` DD-14, `TASKS.md` Phase 03). Each
 * scene supplies its own ordered `steps` as data; this hook owns library
 * wiring only — no shared script of steps across scenes.
 */
export function useGuidedTour(steps: TourStep[]) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const driverRef = useRef<Driver | null>(null)

  const start = useCallback(() => {
    driverRef.current?.destroy()

    const instance = driver({
      animate: !prefersReducedMotion,
      showProgress: true,
      progressText: '{{current}} / {{total}}',
      nextBtnText: 'Lanjut',
      prevBtnText: 'Kembali',
      doneBtnText: 'Selesai',
      allowClose: true,
      overlayColor: 'rgb(4 24 43)',
      overlayOpacity: 0.78,
      popoverOffset: 14,
      stagePadding: 12,
      stageRadius: 12,
      steps: steps.map((step) => ({
        element: step.target,
        popover: {
          title: step.title,
          description: step.body,
          side: step.side,
          align: step.align,
        },
      })),
    })

    driverRef.current = instance
    instance.drive()
  }, [steps, prefersReducedMotion])

  return { start }
}
