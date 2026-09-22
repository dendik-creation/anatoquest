import type { CSSProperties, DragEvent } from 'react'

import type { PuzzlePiece } from './miniGameAssets'

type PuzzleGrid2x3Props = {
  pieces: readonly PuzzlePiece[]
  aspectRatio: number
  boardSize?: { width: number; height: number }
  placed: ReadonlySet<string>
  activeSlot?: string | null
  complete?: boolean
  label: string
  className?: string
  onSelectSlot?: (slot: string) => void
  onDragEnter?: (slot: string) => void
  onDrop?: (event: DragEvent<HTMLButtonElement>, slot: string) => void
}

export function PuzzleGrid2x3({ pieces, aspectRatio, boardSize, placed, activeSlot, complete = false, label, className = '', onSelectSlot, onDragEnter, onDrop }: PuzzleGrid2x3Props) {
  const interactive = Boolean(onSelectSlot)

  return <div className={`puzzle-grid ${className}`} data-complete={complete} aria-label={label} style={{ '--puzzle-aspect': aspectRatio, ...(boardSize && { '--puzzle-width': `${boardSize.width}px`, '--puzzle-height': `${boardSize.height}px` }) } as CSSProperties}>
    {pieces.map((piece) => {
      const filled = placed.has(piece.id)
      const slot = <span className="puzzle-grid__slot-art">{filled && <img src={piece.asset} alt="" aria-hidden="true" />}</span>

      return interactive
        ? <button key={piece.id} className="puzzle-grid__slot" type="button" data-testid={`puzzle-slot-${piece.id}`} data-filled={filled} data-hovered={activeSlot === piece.targetSlot && !filled} aria-label={`Slot ${piece.targetSlot}`} disabled={filled} onClick={() => onSelectSlot?.(piece.targetSlot)} onDragOver={(event) => event.preventDefault()} onDragEnter={() => onDragEnter?.(piece.targetSlot)} onDragLeave={() => onDragEnter?.('')} onDrop={(event) => onDrop?.(event, piece.targetSlot)}>{slot}</button>
        : <div key={piece.id} className="puzzle-grid__slot" data-filled="true" aria-hidden="true">{slot}</div>
    })}
  </div>
}
