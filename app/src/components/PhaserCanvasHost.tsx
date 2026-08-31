import { useEffect, useRef, useState } from 'react'
import './PhaserCanvasHost.css'

export function PhaserCanvasHost() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    let isDisposed = false
    let destroyGame: (() => void) | undefined

    void import('../game/createPhaserGame')
      .then(({ createPhaserGame }) => {
        if (isDisposed || !containerRef.current) return

        destroyGame = createPhaserGame(containerRef.current, {
          onReady: () => setStatus('ready'),
        })
      })
      .catch(() => {
        if (!isDisposed) setStatus('error')
      })

    return () => {
      isDisposed = true
      destroyGame?.()
    }
  }, [])

  const statusText =
    status === 'ready'
      ? 'Phaser 3 runtime siap untuk scene interaktif.'
      : status === 'error'
        ? 'Phaser tidak dapat dimuat. Periksa konsol pengembangan lalu muat ulang.'
        : 'Memuat Phaser 3…'

  return (
    <section className="phaser-host" aria-label="Status game engine">
      <div className="phaser-canvas" ref={containerRef} aria-hidden="true" />
      <p className={`phaser-status phaser-status--${status}`} role="status">
        {statusText}
      </p>
    </section>
  )
}
