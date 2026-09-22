import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'

import mainBgm from '../assets/01_reusable/sounds/long/main_bgm.ogg'
import clickSound from '../assets/01_reusable/sounds/short/click.webm'

const BGM_VOLUME = 0.16
const CLICK_VOLUME = 0.55
const FADE_MS = 220

type GlobalAudio = {
  audioOn: boolean
  startAudio: () => void
  toggleAudio: () => void
}

const GlobalAudioContext = createContext<GlobalAudio | null>(null)

export function GlobalAudioProvider({ children }: { children: ReactNode }) {
  const [audioOn, setAudioOn] = useState(true)
  const bgmRef = useRef<HTMLAudioElement | null>(null)
  const clickRef = useRef<HTMLAudioElement | null>(null)
  const startedRef = useRef(false)
  const fadeFrameRef = useRef<number | undefined>(undefined)

  const fadeBgm = useCallback((target: number, done?: () => void) => {
    const bgm = bgmRef.current
    if (!bgm) return
    cancelAnimationFrame(fadeFrameRef.current ?? 0)
    const from = bgm.volume
    const startedAt = performance.now()
    const step = (now: number) => {
      const progress = Math.min((now - startedAt) / FADE_MS, 1)
      bgm.volume = from + (target - from) * progress
      if (progress < 1) fadeFrameRef.current = requestAnimationFrame(step)
      else done?.()
    }
    fadeFrameRef.current = requestAnimationFrame(step)
  }, [])

  useEffect(() => {
    const bgm = new Audio(mainBgm)
    bgm.loop = true
    bgm.volume = 0
    const click = new Audio(clickSound)
    click.volume = CLICK_VOLUME
    bgmRef.current = bgm
    clickRef.current = click

    const playClick = () => {
      click.currentTime = 0
      void click.play().catch(() => {})
    }
    const playKeyClick = (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') playClick()
    }
    document.addEventListener('pointerdown', playClick, true)
    document.addEventListener('keydown', playKeyClick, true)
    return () => {
      cancelAnimationFrame(fadeFrameRef.current ?? 0)
      document.removeEventListener('pointerdown', playClick, true)
      document.removeEventListener('keydown', playKeyClick, true)
      bgm.pause()
      bgmRef.current = null
      clickRef.current = null
    }
  }, [])

  const startAudio = useCallback(() => {
    const bgm = bgmRef.current
    if (!bgm || startedRef.current || !audioOn) return
    startedRef.current = true
    bgm.volume = 0
    void bgm.play().then(() => fadeBgm(BGM_VOLUME)).catch(() => { startedRef.current = false })
  }, [audioOn, fadeBgm])

  const toggleAudio = useCallback(() => {
    const bgm = bgmRef.current
    if (!bgm) return
    if (audioOn) {
      setAudioOn(false)
      fadeBgm(0, () => bgm.pause())
      return
    }
    setAudioOn(true)
    startedRef.current = true
    bgm.volume = 0
    void bgm.play().then(() => fadeBgm(BGM_VOLUME)).catch(() => {
      startedRef.current = false
      setAudioOn(false)
    })
  }, [audioOn, fadeBgm])

  const value = useMemo(() => ({ audioOn, startAudio, toggleAudio }), [audioOn, startAudio, toggleAudio])
  return <GlobalAudioContext.Provider value={value}>{children}</GlobalAudioContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useGlobalAudio() {
  const audio = useContext(GlobalAudioContext)
  if (!audio) throw new Error('useGlobalAudio must be used inside GlobalAudioProvider')
  return audio
}
