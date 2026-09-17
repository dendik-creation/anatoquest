import { useCallback, useState } from 'react'

import { CaseStudyScene } from './scenes/case-study/CaseStudyScene'
import { FundamentalScene, type FundamentalMicroscene } from './scenes/fundamental/FundamentalScene'
import { HomeScene, type HomeMenuId } from './scenes/home/HomeScene'
import { SistemOrganScene, type SistemOrganMicroscene } from './scenes/sistem-organ-1/SistemOrganScene'
import { SplashScene } from './scenes/splash/SplashScene'
import './App.css'

type Route = 'splash' | 'home' | 'case-study' | 'fundamental' | 'sistem-organ'

const DEV_JUMP_ROUTES: readonly Route[] = ['home', 'case-study', 'fundamental', 'sistem-organ']

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
      <CaseStudyScene onBackToHome={goHome} onComplete={() => setRoute('fundamental')} />
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
    // SC-07 does not exist yet (TASKS.md Phase 07+); "Lanjutkan" returns to
    // Home rather than dead-ending the learner. "Kembali" returns to SC-05.
    return (
      <SistemOrganScene
        onBackToHome={goHome}
        onBack={() => setRoute('fundamental')}
        onComplete={goHome}
        initialMicroscene={devMicroscene as SistemOrganMicroscene | undefined}
      />
    )
  }

  return <HomeScene onSelectMenu={handleSelectMenu} />
}

export default App
