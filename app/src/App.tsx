import { useCallback, useState } from 'react'

import { CaseStudyScene } from './scenes/case-study/CaseStudyScene'
import { FundamentalScene } from './scenes/fundamental/FundamentalScene'
import { HomeScene, type HomeMenuId } from './scenes/home/HomeScene'
import { SplashScene } from './scenes/splash/SplashScene'
import './App.css'

type Route = 'splash' | 'home' | 'case-study' | 'fundamental'

function App() {
  const [route, setRoute] = useState<Route>('splash')

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
    // SC-06 does not exist yet (TASKS.md Phase 06); "Lanjutkan" returns to
    // Home rather than dead-ending the learner. "Kembali" returns to SC-04.
    return (
      <FundamentalScene
        onBackToHome={goHome}
        onBack={() => setRoute('case-study')}
        onComplete={goHome}
      />
    )
  }

  return <HomeScene onSelectMenu={handleSelectMenu} />
}

export default App
