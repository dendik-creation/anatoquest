import { useCallback, useState } from 'react'

import { CaseStudyScene } from './scenes/case-study/CaseStudyScene'
import { FundamentalScene, type FundamentalMicroscene } from './scenes/fundamental/FundamentalScene'
import { HomeScene, type HomeMenuId } from './scenes/home/HomeScene'
import { MateriMenuScene, type MateriMenuTarget } from './scenes/materi-menu/MateriMenuScene'
import { MiniGamesScene } from './scenes/minigames/MiniGamesScene'
import { OrganFunctionScene } from './scenes/minigames/OrganFunctionScene'
import { DigestiveFlowScene } from './scenes/minigames/DigestiveFlowScene'
import { PlaceOrganScene } from './scenes/minigames/PlaceOrganScene'
import { PuzzleOrganScene } from './scenes/minigames/PuzzleOrganScene'
import { SistemOrganScene, type SistemOrganMicroscene } from './scenes/sistem-organ-1/SistemOrganScene'
import { SistemOrgan2Scene } from './scenes/sistem-organ-2/SistemOrgan2Scene'
import { DigestionJourneyScene } from './scenes/sistem-organ-2/DigestionJourneyScene'
import { NerveImpulseScene } from './scenes/sistem-organ-2/NerveImpulseScene'
import { UrinaryJourneyScene } from './scenes/sistem-organ-2/UrinaryJourneyScene'
import { ThreeSystemsChallengeScene } from './scenes/sistem-organ-2/ThreeSystemsChallengeScene'
import { SistemOrgan3Scene } from './scenes/sistem-organ-3/SistemOrgan3Scene'
import { SplashScene } from './scenes/splash/SplashScene'
import { SimulationMenuScene, type SimulationId } from './scenes/simulation-menu/SimulationMenuScene'
import { QuizScene } from './scenes/quiz/QuizScene'
import { GlossaryScene } from './scenes/glossary/GlossaryScene'
import { GlobalAudioProvider, useGlobalAudio } from './audio/GlobalAudio'
import { PetunjukScene } from './scenes/petunjuk/PetunjukScene'
import './App.css'

type Route = 'splash' | 'home' | 'petunjuk' | 'materi-menu' | 'simulation-menu' | 'quiz' | 'glossary' | 'mini-games' | 'puzzle-organ' | 'place-organ' | 'organ-function' | 'digestive-flow' | 'case-study' | 'fundamental' | 'sistem-organ' | 'sistem-organ-2' | 'digestion-journey' | 'nerve-impulse' | 'urinary-journey' | 'three-systems-challenge' | 'sistem-organ-3'

const DEV_JUMP_ROUTES: readonly Route[] = ['home', 'petunjuk', 'materi-menu', 'simulation-menu', 'quiz', 'glossary', 'mini-games', 'puzzle-organ', 'place-organ', 'organ-function', 'digestive-flow', 'case-study', 'fundamental', 'sistem-organ', 'sistem-organ-2', 'digestion-journey', 'nerve-impulse', 'urinary-journey', 'three-systems-challenge', 'sistem-organ-3']

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

function AppRouter() {
  const [route, setRoute] = useState<Route>(() => readDevJumpRoute() ?? 'splash')
  const [devMicroscene] = useState(readDevJumpMicroscene)
  const [simulation, setSimulation] = useState<SimulationId | null>(null)
  const { startAudio } = useGlobalAudio()

  const goHome = useCallback(() => { setSimulation(null); setRoute('home') }, [])

  const handleSelectMenu = useCallback((menuId: HomeMenuId) => {
    // Only SC-04 exists past Home so far (TASKS.md Phase 04); the other five
    // menus remain a no-op until their destination scenes are built.
    if (menuId === 'mulai_pembelajaran') setRoute('petunjuk')
    if (menuId === 'materi') setRoute('materi-menu')
    if (menuId === 'mini_game') setRoute('mini-games')
    if (menuId === 'simulasi_organ') setRoute('simulation-menu')
    if (menuId === 'kuis') setRoute('quiz')
    if (menuId === 'glosarium') setRoute('glossary')
  }, [])

  const returnToSimulationMenu = useCallback(() => setRoute('simulation-menu'), [])
  const selectSimulation = useCallback((id: SimulationId) => {
    setSimulation(id)
    setRoute(id === 'respiratory' || id === 'blood-flow' ? 'sistem-organ' : id === 'digestion' ? 'digestion-journey' : id === 'nerve-impulse' ? 'nerve-impulse' : id === 'urine-formation' ? 'urinary-journey' : 'sistem-organ-3')
  }, [])

  if (route === 'splash') {
    return <SplashScene onContinue={goHome} onStartAudio={startAudio} />
  }

  if (route === 'simulation-menu') return <SimulationMenuScene onBackToHome={goHome} onSelectSimulation={selectSimulation} />

  if (route === 'quiz') return <QuizScene onBackToHome={goHome} />

  if (route === 'glossary') return <GlossaryScene onBackToHome={goHome} />

  if (route === 'petunjuk') return <PetunjukScene onBackToHome={goHome} onComplete={() => setRoute('case-study')} />

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
        onComplete={() => setRoute('sistem-organ')}
        initialMicroscene={devMicroscene as FundamentalMicroscene | undefined}
      />
    )
  }

  if (route === 'sistem-organ') {
    return (
      <SistemOrganScene
        onBackToHome={goHome}
        onBack={simulation ? returnToSimulationMenu : () => setRoute('fundamental')}
        onComplete={simulation ? returnToSimulationMenu : () => setRoute('sistem-organ-2')}
        initialMicroscene={simulation === 'respiratory' ? '5.3' : simulation === 'blood-flow' ? '5.6' : devMicroscene as SistemOrganMicroscene | undefined}
        simulationMode={simulation === 'respiratory' || simulation === 'blood-flow'}
      />
    )
  }

  if (route === 'mini-games') return <MiniGamesScene onBackToHome={goHome} onSelectGame={(id) => { if (id === 'puzzle-organ') setRoute('puzzle-organ'); if (id === 'pasang-organ') setRoute('place-organ'); if (id === 'hubungkan-fungsi') setRoute('organ-function'); if (id === 'susun-alur-fisiologi') setRoute('digestive-flow') }} />

  if (route === 'puzzle-organ') return <PuzzleOrganScene onBackToHome={goHome} onBackToMenu={() => setRoute('mini-games')} />

  if (route === 'place-organ') return <PlaceOrganScene onBackToHome={goHome} onBackToMenu={() => setRoute('mini-games')} />

  if (route === 'organ-function') return <OrganFunctionScene onBackToHome={goHome} onBackToMenu={() => setRoute('mini-games')} />

  if (route === 'digestive-flow') return <DigestiveFlowScene onBackToHome={goHome} onBackToMenu={() => setRoute('mini-games')} />

  if (route === 'materi-menu') {
    return <MateriMenuScene onBackToHome={goHome} onSelectMaterial={(target: MateriMenuTarget) => setRoute(target === 'sistem-organ-1' ? 'sistem-organ' : target === 'sistem-organ-2' ? 'sistem-organ-2' : target === 'sistem-organ-3' ? 'sistem-organ-3' : target)} />
  }

  if (route === 'sistem-organ-2') {
    return <SistemOrgan2Scene onBackToHome={goHome} onBack={() => setRoute('sistem-organ')} onComplete={() => setRoute('digestion-journey')} />
  }

  if (route === 'digestion-journey') {
    return <DigestionJourneyScene onBackToHome={goHome} onBack={simulation ? returnToSimulationMenu : () => setRoute('sistem-organ-2')} onComplete={simulation ? returnToSimulationMenu : () => setRoute('nerve-impulse')} simulationMode={simulation === 'digestion'} />
  }

  if (route === 'nerve-impulse') {
    return <NerveImpulseScene onBackToHome={goHome} onBack={simulation ? returnToSimulationMenu : () => setRoute('digestion-journey')} onComplete={simulation ? returnToSimulationMenu : () => setRoute('urinary-journey')} simulationMode={simulation === 'nerve-impulse'} />
  }

  if (route === 'urinary-journey') {
    return <UrinaryJourneyScene onBackToHome={goHome} onBack={simulation ? returnToSimulationMenu : () => setRoute('nerve-impulse')} onComplete={simulation ? returnToSimulationMenu : () => setRoute('three-systems-challenge')} simulationMode={simulation === 'urine-formation'} />
  }

  if (route === 'three-systems-challenge') {
    return <ThreeSystemsChallengeScene onBackToHome={goHome} onBack={() => setRoute('urinary-journey')} onComplete={() => setRoute('sistem-organ-3')} />
  }

  if (route === 'sistem-organ-3') return <SistemOrgan3Scene onBackToHome={goHome} onBack={simulation ? returnToSimulationMenu : () => setRoute('three-systems-challenge')} onComplete={simulation ? returnToSimulationMenu : goHome} simulationMode={simulation === 'musculoskeletal' || simulation === 'sensory' || simulation === 'endocrine'} simulationTab={simulation === 'endocrine' ? 'endokrin' : 'indra'} initialMicroscene={simulation === 'musculoskeletal' ? '7.3' : simulation === 'sensory' || simulation === 'endocrine' ? '7.4' : devMicroscene === '7.5' ? '7.5' : devMicroscene === '7.4' ? '7.4' : devMicroscene === '7.3' ? '7.3' : devMicroscene === '7.2' ? '7.2' : '7.1'} />

  return <HomeScene onSelectMenu={handleSelectMenu} />
}

function App() {
  return <GlobalAudioProvider><AppRouter /></GlobalAudioProvider>
}

export default App
