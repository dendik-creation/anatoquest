import type { ButtonHTMLAttributes } from 'react'

import helpArt from '../assets/01_reusable/buttons/help.png'
import './HelpButton.css'

type HelpButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'children'> & {
  /** Defaults to "Bantuan"; override for a scene-specific accessible name. */
  label?: string
}

/**
 * `UI-04` reusable help/`?` icon button (`docs/design/11-design-decisions.md`
 * DD-14): same circular-button pattern as the shipped Home `Tentang` button,
 * used across scenes to trigger that scene's own guided tour.
 */
export function HelpButton({ label = 'Bantuan', className, ...rest }: HelpButtonProps) {
  return (
    <button
      type="button"
      className={`help-button${className ? ` ${className}` : ''}`}
      aria-label={label}
      aria-haspopup="dialog"
      {...rest}
    >
      <img src={helpArt} alt="" aria-hidden="true" />
    </button>
  )
}
