import './ProgressDots.css'

type ProgressDotsProps = {
  total: number
  completed: number
  /** e.g. "gejala" — used only to build the accessible label. */
  unitLabel: string
  'data-testid'?: string
}

/**
 * Reusable step-dot progress indicator (not a percentage bar): one dot per
 * unit, filled as each unit completes. See `docs/design/11-design-decisions.md`
 * DD-14 note on scene-owned, data-driven progress affordances.
 */
export function ProgressDots({ total, completed, unitLabel, ...rest }: ProgressDotsProps) {
  const dots = Array.from({ length: total }, (_, index) => index < completed)

  return (
    <div
      className="progress-dots"
      role="img"
      aria-label={`Kemajuan: ${completed} dari ${total} ${unitLabel} ditempatkan`}
      data-testid={rest['data-testid']}
    >
      {dots.map((isDone, index) => (
        <span
          key={index}
          className={`progress-dots__dot${isDone ? ' progress-dots__dot--done' : ''}`}
          aria-hidden="true"
        />
      ))}
    </div>
  )
}
