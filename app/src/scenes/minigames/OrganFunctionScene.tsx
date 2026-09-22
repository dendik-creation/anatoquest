import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react'
import { useGlobalAudio } from '../../audio/GlobalAudio'

import backArt from '../../assets/01_reusable/buttons/btn_back.png'
import bgmOffArt from '../../assets/01_reusable/buttons/btn_bgm_off.png'
import bgmOnArt from '../../assets/01_reusable/buttons/btn_bgm_on.png'
import homeArt from '../../assets/01_reusable/buttons/btn_home.png'
import backgroundArt from '../../assets/02_scene/04_fundamental/backgrounds/00_background.png'
import lightbulbArt from '../../assets/02_scene/04_fundamental/micro_scenes/4.5/10_lightbulb.png'
import { useSceneExitTransition } from '../../hooks/useSceneExitTransition'
import { useStageCoverScale } from '../../hooks/useStageCoverScale'
import { MATCH_ORGAN_ASSETS } from './miniGameAssets'
import './OrganFunctionScene.css'

const ORGANS = [
  { id: 'lungs', label: 'Paru-paru', art: MATCH_ORGAN_ASSETS.lungs, answer: 'gas-exchange' },
  { id: 'heart', label: 'Jantung', art: MATCH_ORGAN_ASSETS.heart, answer: 'pump-blood' },
  { id: 'brain', label: 'Otak', art: MATCH_ORGAN_ASSETS.brain, answer: 'control-body' },
  { id: 'stomach', label: 'Lambung', art: MATCH_ORGAN_ASSETS.stomach, answer: 'digestion' },
  { id: 'kidneys', label: 'Ginjal', art: MATCH_ORGAN_ASSETS.kidneys, answer: 'filter-blood' },
] as const

const FUNCTIONS = [
  { id: 'pump-blood', text: 'Memompa darah ke seluruh tubuh.' },
  { id: 'filter-blood', text: 'Menyaring darah dan membuang zat sisa berupa urin.' },
  { id: 'control-body', text: 'Mengendalikan pikiran, gerak, dan fungsi tubuh lainnya.' },
  { id: 'digestion', text: 'Tempat terjadinya pencernaan makanan dengan bantuan asam lambung dan enzim.' },
  { id: 'gas-exchange', text: 'Tempat pertukaran oksigen dan karbon dioksida.' },
] as const

type OrganId = (typeof ORGANS)[number]['id']
type FunctionId = (typeof FUNCTIONS)[number]['id']
type Connection = Partial<Record<OrganId, FunctionId>>
type ActiveConnection = { organId: OrganId; pointerId: number; x: number; y: number }
type Feedback = { tone: 'info' | 'correct' | 'wrong'; text: string } | null
type Point = { x: number; y: number }
type RenderedLine = { id: OrganId; path: string; status: 'connected' | 'correct' | 'wrong' }
type OrganFunctionSceneProps = { onBackToMenu: () => void; onBackToHome: () => void }

const shuffle = <T,>(items: readonly T[]) => [...items].sort(() => Math.random() - .5)
const curve = (from: Point, to: Point) => `M ${from.x} ${from.y} C ${from.x + 170} ${from.y}, ${to.x - 170} ${to.y}, ${to.x} ${to.y}`

export function OrganFunctionScene({ onBackToMenu, onBackToHome }: OrganFunctionSceneProps) {
  const [functions] = useState(() => shuffle(FUNCTIONS))
  const [connections, setConnections] = useState<Connection>({})
  const [active, setActive] = useState<ActiveConnection | null>(null)
  const [hoverFunction, setHoverFunction] = useState<FunctionId | null>(null)
  const [locked, setLocked] = useState<Set<OrganId>>(new Set())
  const [checked, setChecked] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [feedback, setFeedback] = useState<Feedback>(null)
  const [lineEpoch, setLineEpoch] = useState(0)
  const [linePaths, setLinePaths] = useState<{ permanent: RenderedLine[]; active?: string }>({ permanent: [] })
  const { audioOn, toggleAudio } = useGlobalAudio()
  const stageRef = useRef<HTMLDivElement>(null)
  const pointRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const scale = useStageCoverScale(1920, 1080, 1860, 1046)
  const { isExiting, exitTo } = useSceneExitTransition()

  const toStagePoint = useCallback((clientX: number, clientY: number): Point => {
    const rect = stageRef.current?.getBoundingClientRect()
    if (!rect) return { x: 0, y: 0 }
    return { x: (clientX - rect.left) * 1920 / rect.width, y: (clientY - rect.top) * 1080 / rect.height }
  }, [])
  const pointCenter = useCallback((key: string): Point | null => {
    const point = pointRefs.current[key]
    const stage = stageRef.current
    if (!point || !stage) return null
    const rect = point.getBoundingClientRect()
    return toStagePoint(rect.left + rect.width / 2, rect.top + rect.height / 2)
  }, [toStagePoint])
  const lineStatus = useCallback((organ: (typeof ORGANS)[number]): RenderedLine['status'] => locked.has(organ.id) ? 'correct' : checked ? 'wrong' : 'connected', [checked, locked])

  const connect = useCallback((organId: OrganId, functionId: FunctionId) => {
    const owner = ORGANS.find((organ) => connections[organ.id] === functionId)?.id
    if (owner && owner !== organId && locked.has(owner)) {
      setFeedback({ tone: 'info', text: 'Pasangan yang sudah benar tidak dapat diubah.' })
      return
    }
    setConnections((current) => {
      const next = { ...current, [organId]: functionId }
      for (const organ of ORGANS) if (organ.id !== organId && next[organ.id] === functionId) next[organ.id] = undefined
      return next
    })
    setChecked(false)
    setFeedback(null)
  }, [connections, locked])

  useEffect(() => {
    if (!active) return
    const functionAt = (event: PointerEvent) => (document.elementFromPoint(event.clientX, event.clientY) as HTMLElement | null)?.closest<HTMLButtonElement>('[data-function-point]')?.dataset.functionPoint as FunctionId | undefined
    const move = (event: PointerEvent) => {
      if (event.pointerId !== active.pointerId) return
      const next = toStagePoint(event.clientX, event.clientY)
      setActive((current) => current && current.pointerId === event.pointerId ? { ...current, ...next } : current)
      setHoverFunction(functionAt(event) ?? null)
    }
    const end = (event: PointerEvent) => {
      if (event.pointerId !== active.pointerId) return
      const functionId = functionAt(event)
      if (functionId) connect(active.organId, functionId)
      setActive(null)
      setHoverFunction(null)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', end)
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', end) }
  }, [active, connect, toStagePoint])

  useEffect(() => {
    const refresh = () => setLineEpoch((current) => current + 1)
    window.addEventListener('resize', refresh)
    document.fonts?.ready.then(refresh)
    refresh()
    return () => window.removeEventListener('resize', refresh)
  }, [])

  useLayoutEffect(() => {
    const frame = requestAnimationFrame(() => {
      const permanent: RenderedLine[] = ORGANS.flatMap((organ) => {
        const functionId = connections[organ.id]
        const from = pointCenter(`organ-${organ.id}`)
        const to = functionId && pointCenter(`function-${functionId}`)
        return from && to ? [{ id: organ.id, path: curve(from, to), status: lineStatus(organ) }] : []
      })
      const activeStart = active && pointCenter(`organ-${active.organId}`)
      setLinePaths({ permanent, active: active && activeStart ? curve(activeStart, active) : undefined })
    })
    return () => cancelAnimationFrame(frame)
  }, [active, connections, lineEpoch, lineStatus, pointCenter])

  const beginConnection = (event: ReactPointerEvent<HTMLButtonElement>, organId: OrganId) => {
    if (locked.has(organId) || completed) return
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    setActive({ organId, pointerId: event.pointerId, ...toStagePoint(event.clientX, event.clientY) })
    setHoverFunction(null)
  }
  const checkAnswers = () => {
    if (completed) return exitTo(onBackToMenu)
    if (!ORGANS.every((organ) => connections[organ.id])) return setFeedback({ tone: 'info', text: 'Hubungkan semua organ terlebih dahulu.' })
    const correct = ORGANS.filter((organ) => connections[organ.id] === organ.answer).map((organ) => organ.id)
    setLocked((current) => new Set([...current, ...correct]))
    setChecked(true)
    if (correct.length === ORGANS.length) {
      setCompleted(true)
      setFeedback({ tone: 'correct', text: 'Hebat! Semua organ berhasil dihubungkan dengan fungsi yang tepat.' })
    } else setFeedback({ tone: 'wrong', text: 'Beberapa pasangan belum tepat. Coba periksa kembali.' })
  }
  return <main className="organ-function" data-testid="organ-function-scene" data-exiting={isExiting} style={{ '--stage-scale': scale } as CSSProperties}>
    <div className="organ-function__stage" ref={stageRef}>
      <img className="organ-function__background" src={backgroundArt} alt="" aria-hidden="true" />
      <button className="organ-function__anim organ-function__icon organ-function__home" type="button" aria-label="Kembali ke Beranda" onClick={() => exitTo(onBackToHome)}><img src={homeArt} alt="" aria-hidden="true" /></button>
      <button className="organ-function__anim organ-function__icon organ-function__back-icon" type="button" aria-label="Kembali ke menu mini games" onClick={() => exitTo(onBackToMenu)}><img src={backArt} alt="" aria-hidden="true" /></button>
      <p className="organ-function__anim organ-function__eyebrow">Mini Games - Hubungkan Organ dengan Fungsi</p>
      <h1 className="organ-function__anim organ-function__title">Hubungkan Organ dengan Fungsinya</h1>
      <p className="organ-function__anim organ-function__subtitle">Seret garis dari organ di sebelah kiri ke fungsi yang sesuai di sebelah kanan.</p>
      <button className="organ-function__anim organ-function__icon organ-function__audio" type="button" aria-label={audioOn ? 'Matikan musik latar' : 'Aktifkan musik latar'} aria-pressed={audioOn} onClick={() => toggleAudio()}><img src={audioOn ? bgmOnArt : bgmOffArt} alt="" aria-hidden="true" /></button>

      <svg className="organ-function__lines" viewBox="0 0 1920 1080" preserveAspectRatio="none" data-line-epoch={lineEpoch} aria-hidden="true">
        {linePaths.permanent.map((line) => <path key={line.id} className={`organ-function__line organ-function__line--${line.status}`} d={line.path} />)}
        {linePaths.active && <path className="organ-function__line organ-function__line--active" d={linePaths.active} />}
      </svg>

      <section className="organ-function__anim organ-function__panel organ-function__organ-panel" aria-labelledby="organ-heading">
        <h2 id="organ-heading">Pilih Organ</h2><p>Seret dari titik di samping organ untuk menghubungkan ke fungsi yang sesuai.</p>
        <div className="organ-function__cards">
          {ORGANS.map((organ) => <article key={organ.id} className="organ-function__card" data-status={lineStatus(organ)}><img src={organ.art} alt="" aria-hidden="true" /><strong>{organ.label}</strong><button ref={(node) => { pointRefs.current[`organ-${organ.id}`] = node }} className="organ-function__point" data-testid={`organ-point-${organ.id}`} data-status={lineStatus(organ)} type="button" disabled={locked.has(organ.id)} aria-label={`Mulai menghubungkan ${organ.label}`} onPointerDown={(event) => beginConnection(event, organ.id)} /></article>)}
        </div>
      </section>

      <section className="organ-function__anim organ-function__panel organ-function__function-panel" aria-labelledby="function-heading">
        <h2 id="function-heading">Hubungkan ke Fungsi yang Sesuai</h2><p>Lepaskan garis ke titik di samping fungsi yang menurutmu paling tepat.</p>
        <div className="organ-function__cards">
          {functions.map((item) => {
            const owner = ORGANS.find((organ) => connections[organ.id] === item.id)
            return <article key={item.id} className="organ-function__card organ-function__function-card" data-status={owner && lineStatus(owner)}><button ref={(node) => { pointRefs.current[`function-${item.id}`] = node }} className="organ-function__point" data-testid={`function-point-${item.id}`} data-function-point={item.id} data-status={owner && lineStatus(owner)} data-hovered={hoverFunction === item.id} type="button" aria-label={`Target fungsi: ${item.text}`} /><span>{item.text}</span></article>
          })}
        </div>
      </section>

      {feedback && <aside className={`organ-function__feedback organ-function__feedback--${feedback.tone}`} role="status">{feedback.text}</aside>}
      <button className="organ-function__anim organ-function__previous" type="button" onClick={() => exitTo(onBackToMenu)}>‹ <span>Sebelumnya</span></button>
      <p className="organ-function__anim organ-function__tip"><img src={lightbulbArt} alt="" aria-hidden="true" />Setiap organ hanya cocok<br />dengan satu fungsi.</p>
      <button className="organ-function__anim organ-function__check" type="button" data-testid="organ-function-check" onClick={checkAnswers}>{completed ? 'Selesai' : 'Periksa Jawaban'} <b>›</b></button>
    </div>
  </main>
}
