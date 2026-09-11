import { useCallback, useState } from 'react'

import { HomeScene } from './scenes/home/HomeScene'
import { SplashScene } from './scenes/splash/SplashScene'
import './App.css'

type Route = 'splash' | 'home'

function App() {
  const [route, setRoute] = useState<Route>('splash')

  const goHome = useCallback(() => setRoute('home'), [])

  if (route === 'splash') {
    return <SplashScene onContinue={goHome} />
  }

  // Further destinations (Materi, Simulasi Organ, ...) are not built yet
  // (TASKS.md Phase 03+); menu selection is a no-op until they exist.
  return <HomeScene />
}

export default App
