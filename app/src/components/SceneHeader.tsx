import type { CSSProperties } from 'react'

import './SceneHeader.css'

type SceneHeaderProps = {
  title: string
  subtitle: string
  /** Small pill above the title (e.g. a scene/microscene label). Omit to skip it — it's optional. */
  eyebrow?: string
  /**
   * `card` (default) keeps the existing translucent pill behind title/subtitle,
   * used by scenes whose background has no dedicated header treatment.
   * `plain` drops that pill so title/subtitle sit directly on the scene
   * background — for scenes (e.g. microscene headers) whose background art
   * already frames the header area.
   */
  variant?: 'card' | 'plain'
  'data-testid'?: string
  /** Lets a scene attach its own enter/exit animation class. */
  className?: string
  style?: CSSProperties
}

/**
 * Reusable scene title/subtitle heading, with an optional eyebrow pill.
 *
 * The Figma frame for this element is a flattened image; per the working
 * agreement generated visual assets should not be used for text content, so
 * this is authored as a real heading/paragraph instead — reusable across
 * scenes that need the same top-centre title treatment.
 */
export function SceneHeader({
  title,
  subtitle,
  eyebrow,
  variant = 'card',
  className,
  style,
  ...rest
}: SceneHeaderProps) {
  return (
    <div
      className={`scene-header scene-header--${variant}${className ? ` ${className}` : ''}`}
      style={style}
      data-testid={rest['data-testid']}
    >
      {variant === 'card' && (
        <>
          <span className="scene-header__dot scene-header__dot--a" aria-hidden="true" />
          <span className="scene-header__dot scene-header__dot--b" aria-hidden="true" />
        </>
      )}
      {eyebrow && <span className="scene-header__eyebrow">{eyebrow}</span>}
      <h1 className="scene-header__title">{title}</h1>
      <p className="scene-header__subtitle">{subtitle}</p>
    </div>
  )
}
