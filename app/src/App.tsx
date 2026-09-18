import { useCallback, useState } from 'react'

import { CaseStudyScene } from './scenes/case-study/CaseStudyScene'
import { FundamentalScene, type FundamentalMicroscene } from './scenes/fundamental/FundamentalScene'
import { HomeScene, type HomeMenuId } from './scenes/home/HomeScene'
import { SistemOrganScene, type SistemOrganMicroscene } from './scenes/sistem-organ-1/SistemOrganScene'
import { SistemOrgan2Scene } from './scenes/sistem-organ-2/SistemOrgan2Scene'
import { DigestionJourneyScene } from './scenes/sistem-organ-2/DigestionJourneyScene'
import { NerveImpulseScene } from './scenes/sistem-organ-2/NerveImpulseScene'
import { UrinaryJourneyScene } from './scenes/sistem-organ-2/UrinaryJourneyScene'
import { ThreeSystemsChallengeScene } from './scenes/sistem-organ-2/ThreeSystemsChallengeScene'
import { SplashScene } from './scenes/splash/SplashScene'
import './App.css'

type Route = 'splash' | 'home' | 'case-study' | 'fundamental' | 'sistem-organ' | 'sistem-organ-2' | 'digestion-journey' | 'nerve-impulse' | 'urinary-journey' | 'three-systems-challenge'

const DEV_JUMP_ROUTES: readonly Route[] = ['home', 'case-study', 'fundamental', 'sistem-organ', 'sistem-organ-2', 'digestion-journey', 'nerve-impulse', 'urinary-journey', 'three-systems-challenge']

/**
 * Dev-only testing shortcut (TASKS.md-external, not a product requirement): jump straight
 * into a scene on load via VITE_DEV_SCENE / VITE_DEV_MICROSCENE in .env.local. Stripped from
 * production builds by import.meta.env.DEV; unset/blank falls through to the normal splash flow.
 */
function readDevJumpRoute(): Route | undefined {
  if (!import.meta.env.DEV) return undefined
  const candidate = import.meta.env.VITE_DEV_SCENE?.trim()
  if (!candidate) return undefined
  return (DEV_JUMP_ROUTES as string[]).includes(candidate) ? (candidate as Route) : undefined
}

function readDevJumpMicroscene(): string | undefined {
  if (!import.meta.env.DEV) return undefined
  return import.meta.env.VITE_DEV_MICROSCENE?.trim() || undefined
}

function App() {
  const [route, setRoute] = useState<Route>(() => readDevJumpRoute() ?? 'splash')
  const [devMicroscene] = useState(readDevJumpMicroscene)

  const goHome = useCallback(() => setRoute('home'), [])

  const handleSelectMenu = useCallback((menuId: HomeMenuId) => {
    // Only SC-04 exists past Home so far (TASKS.md Phase 04); the other five
    // menus remain a no-op until their destination scenes are built.
    if (menuId === 'mulai_pembelajaran') setRoute('case-study')
  }, [])

  if (route === 'splash') {
    return <SplashScene onContinue={goHome} />
  }

  if (route === 'case-study') {
    return (
      <CaseStudyScene
        onBackToHome={goHome}
        onBack={goHome}
        onComplete={() => setRoute('fundamental')}
      />
    )
  }

  if (route === 'fundamental') {
    return (
      <FundamentalScene
        onBackToHome={goHome}
        onBack={() => setRoute('case-study')}
        onComplete={() => setRoute('sistem-organ')}
        initialMicroscene={devMicroscene as FundamentalMicroscene | undefined}
      />
    )
  }

  if (route === 'sistem-organ') {
    return (
      <SistemOrganScene
        onBackToHome={goHome}
        onBack={() => setRoute('fundamental')}
        onComplete={() => setRoute('sistem-organ-2')}
        initialMicroscene={devMicroscene as SistemOrganMicroscene | undefined}
      />
    )
  }

  if (route === 'sistem-organ-2') {
    return <SistemOrgan2Scene onBackToHome={goHome} onBack={() => setRoute('sistem-organ')} onComplete={() => setRoute('digestion-journey')} />
  }

  if (route === 'digestion-journey') {
    return <DigestionJourneyScene onBackToHome={goHome} onBack={() => setRoute('sistem-organ-2')} onComplete={() => setRoute('nerve-impulse')} />
  }

  if (route === 'nerve-impulse') {
    return <NerveImpulseScene onBackToHome={goHome} onBack={() => setRoute('digestion-journey')} onComplete={() => setRoute('urinary-journey')} />
  }

  if (route === 'urinary-journey') {
    return <UrinaryJourneyScene onBackToHome={goHome} onBack={() => setRoute('nerve-impulse')} onComplete={() => setRoute('three-systems-challenge')} />
  }

  if (route === 'three-systems-challenge') {
    return <ThreeSystemsChallengeScene onBackToHome={goHome} onBack={() => setRoute('urinary-journey')} onComplete={goHome} />
  }

  return <HomeScene onSelectMenu={handleSelectMenu} />
}

export default App
