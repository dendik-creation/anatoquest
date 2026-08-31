import { useCallback, useState } from 'react'

import { SplashScene } from './scenes/splash/SplashScene'
import './App.css'

type Route = 'splash' | 'home'

function App() {
  const [route, setRoute] = useState<Route>('splash')

  const goHome = useCallback(() => setRoute('home'), [])

  if (route === 'splash') {
    return <SplashScene onContinue={goHome} />
  }

  // SC-02 Home is not built yet (TASKS.md Phase 02); hold a blank stage.
  return <div className="route-placeholder" data-testid="home-placeholder" />
}

export default App
