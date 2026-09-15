import type { CSSProperties } from 'react'

import './SceneHeader.css'

type SceneHeaderProps = {
  title: string
  subtitle: string
  'data-testid'?: string
  /** Lets a scene attach its own enter/exit animation class. */
  className?: string
  style?: CSSProperties
}

/**
 * Reusable scene title/subtitle pill.
 *
 * The Figma frame for this element is a flattened image; per the working
 * agreement generated visual assets should not be used for text content, so
 * this is authored as a real heading/paragraph instead — reusable across
 * scenes that need the same top-centre title treatment.
 */
export function SceneHeader({ title, subtitle, className, style, ...rest }: SceneHeaderProps) {
  return (
    <div
      className={`scene-header${className ? ` ${className}` : ''}`}
      style={style}
      data-testid={rest['data-testid']}
    >
      <span className="scene-header__dot scene-header__dot--a" aria-hidden="true" />
      <span className="scene-header__dot scene-header__dot--b" aria-hidden="true" />
      <h1 className="scene-header__title">{title}</h1>
      <p className="scene-header__subtitle">{subtitle}</p>
    </div>
  )
}
