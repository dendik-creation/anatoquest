import { useEffect, useState, type CSSProperties } from 'react'
import { useGlobalAudio } from '../../audio/GlobalAudio'
import { ArrowLeft, ArrowRight, Check, Home, RotateCcw } from 'lucide-react'

import questions from './questions.json'
import backgroundArt from '../../assets/02_scene/04_fundamental/backgrounds/00_background.png'
import homeArt from '../../assets/01_reusable/buttons/btn_home.png'
import backArt from '../../assets/01_reusable/buttons/btn_back.png'
import bgmOnArt from '../../assets/01_reusable/buttons/btn_bgm_on.png'
import bgmOffArt from '../../assets/01_reusable/buttons/btn_bgm_off.png'
import guideArt from '../../assets/02_scene/11_kuis/01_icon_checklist_ide.png'
import trophyArt from '../../assets/02_scene/11_kuis/02_icon_trofi_penghargaan.png'
import retryArt from '../../assets/02_scene/11_kuis/03_icon_dokumen_sedih.png'
import listArt from '../../assets/02_scene/11_kuis/04_icon_app_list.png'
import starArt from '../../assets/02_scene/11_kuis/05_icon_app_bintang.png'
import badgeArt from '../../assets/02_scene/11_kuis/06_icon_app_lencana.png'
import playArt from '../../assets/02_scene/11_kuis/07_icon_app_play.png'
import lungsArt from '../../assets/02_scene/05_sistem_organ_1/micro_scenes/5.6/lungs.png'
import kidneyArt from '../../assets/02_scene/06_sistem_organ_2/6.1/kidney_bladder_green.png'
import { useStageCoverScale } from '../../hooks/useStageCoverScale'
import './QuizScene.css'

type Status = 'instruction' | 'countdown' | 'question' | 'result'
type Question = (typeof questions)[number]
type Props = { onBackToHome: () => void }
const COUNTDOWN = ['3', '2', '1', 'MULAI!'] as const

function shuffle<T>(items: readonly T[]) { const copy = [...items]; for (let index = copy.length - 1; index > 0; index -= 1) { const next = Math.floor(Math.random() * (index + 1)); [copy[index], copy[next]] = [copy[next], copy[index]] } return copy }

export function QuizScene({ onBackToHome }: Props) {
  const scale = useStageCoverScale(1920, 1080, 1860, 1046)
  const [status, setStatus] = useState<Status>('instruction')
  const [sessionQuestions, setSessionQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [currentIndex, setCurrentIndex] = useState(0)
  const [countdownIndex, setCountdownIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const { audioOn, toggleAudio } = useGlobalAudio()

  useEffect(() => {
    if (status !== 'countdown') return
    const delay = countdownIndex === COUNTDOWN.length - 1 ? 600 : 800
    const timer = window.setTimeout(() => {
      if (countdownIndex === COUNTDOWN.length - 1) setStatus('question')
      else setCountdownIndex((index) => index + 1)
    }, delay)
    return () => window.clearTimeout(timer)
  }, [countdownIndex, status])

  const beginSession = () => { setSessionQuestions(shuffle(questions)); setAnswers({}); setCurrentIndex(0); setScore(0); setCorrectCount(0); setCountdownIndex(0); setStatus('countdown') }
  const finishQuiz = () => { const correct = sessionQuestions.filter((question) => answers[question.id] === question.correctAnswer).length; setCorrectCount(correct); setScore(correct * 10); setStatus('result') }
  const question = sessionQuestions[currentIndex]

  return <main className="quiz" data-testid="quiz-scene" data-status={status} style={{ '--stage-scale': scale } as CSSProperties}><div className="quiz__stage">
    <img className="quiz__background" src={backgroundArt} alt="" aria-hidden="true" />
    {status !== 'countdown' && <><button className="quiz__icon quiz__home" type="button" aria-label="Kembali ke Beranda" onClick={onBackToHome}><img src={homeArt} alt="" /></button><button className="quiz__icon quiz__top-back" type="button" aria-label="Kembali ke Beranda" onClick={onBackToHome}><img src={backArt} alt="" /></button><p className="quiz__pill">Kuis - Uji Pemahamanmu</p><button className="quiz__icon quiz__audio" type="button" aria-label={audioOn ? 'Matikan musik latar' : 'Aktifkan musik latar'} aria-pressed={audioOn} onClick={() => toggleAudio()}><img src={audioOn ? bgmOnArt : bgmOffArt} alt="" /></button></>}
    {status === 'instruction' && <Instructions onBack={onBackToHome} onStart={beginSession} />}
    {status === 'countdown' && <div className="quiz__countdown" aria-live="assertive"><span key={COUNTDOWN[countdownIndex]}>{COUNTDOWN[countdownIndex]}</span></div>}
    {status === 'question' && question && <QuizQuestionCard key={question.id} question={question} index={currentIndex} answer={answers[question.id]} onSelect={(answer) => setAnswers((current) => ({ ...current, [question.id]: answer }))} onNext={() => currentIndex === sessionQuestions.length - 1 ? finishQuiz() : setCurrentIndex((index) => index + 1)} />}
    {status === 'result' && <Result score={score} correctCount={correctCount} onRetry={beginSession} onHome={onBackToHome} />}
  </div></main>
}

function Instructions({ onBack, onStart }: { onBack: () => void; onStart: () => void }) {
  const items = [[listArt, '10 Soal Pilihan Ganda', 'Pilih satu jawaban yang paling tepat pada setiap soal.'], [starArt, '10 Poin per Jawaban Benar', 'Jawaban benar mendapatkan 10 poin. Jawaban salah tidak menambah atau mengurangi nilai.'], [badgeArt, 'Nilai Minimal 70', 'Dapatkan nilai minimal 70 untuk memenuhi batas kelulusan kuis.'], [playArt, 'Kerjakan dengan Teliti', 'Perhatikan setiap pertanyaan dan pilihan jawaban sebelum melanjutkan.']] as const
  return <section className="quiz__instructions" aria-labelledby="quiz-guide-title"><img className="quiz__guide-art" src={guideArt} alt="" /><h1 id="quiz-guide-title">Petunjuk Kuis</h1><p>Baca petunjuk berikut sebelum memulai kuis.</p><div>{items.map(([icon, title, body]) => <article key={title}><img src={icon} alt="" /><span><strong>{title}</strong><small>{body}</small></span></article>)}</div><footer><button type="button" className="quiz__back-button" onClick={onBack}><ArrowLeft />Kembali</button><button type="button" className="quiz__primary" data-testid="quiz-start" onClick={onStart}>Mulai Kuis<ArrowRight /></button></footer></section>
}

function QuizQuestionCard({ question, index, answer, onSelect, onNext }: { question: Question; index: number; answer?: string; onSelect: (id: string) => void; onNext: () => void }) {
  const image = question.imageKey === 'lungs' ? lungsArt : question.imageKey === 'kidney' ? kidneyArt : undefined
  return <section className="quiz__question" key={question.id} data-question-id={question.id} aria-labelledby="quiz-question"><header><span>Soal {index + 1} dari 10</span><div><i style={{ width: `${(index + 1) * 10}%` }} /></div></header><article data-image={Boolean(image)}><div className="quiz__question-copy"><p>Pertanyaan {index + 1} dari 10</p><h1 id="quiz-question">{question.question}</h1>{image && <img className="quiz__organ" src={image} alt="Ilustrasi organ untuk pertanyaan" />}</div><div className="quiz__options" role="radiogroup" aria-label="Pilihan jawaban">{question.options.map((option, optionIndex) => <button key={option.id} type="button" role="radio" aria-checked={answer === option.id} data-selected={answer === option.id} onClick={() => onSelect(option.id)}><b>{String.fromCharCode(65 + optionIndex)}</b>{option.text}{answer === option.id && <Check aria-hidden="true" />}</button>)}</div></article><button className="quiz__next" type="button" disabled={!answer} onClick={onNext}>{index === 9 ? 'Selesaikan Kuis' : 'Selanjutnya'}<ArrowRight /></button></section>
}

function Result({ score, correctCount, onRetry, onHome }: { score: number; correctCount: number; onRetry: () => void; onHome: () => void }) {
  const passed = score >= 70
  return <section className={`quiz__result quiz__result--${passed ? 'pass' : 'retry'}`} aria-live="polite"><img src={passed ? trophyArt : retryArt} alt="" /><h1>{passed ? 'Selamat!' : 'Terus Berlatih!'}</h1><p>{passed ? 'Kamu berhasil menyelesaikan kuis dengan baik.' : 'Nilaimu belum mencapai batas minimum. Pelajari kembali materi dan coba lagi.'}</p><div className="quiz__score"><span>Nilai Akhir</span><strong>{score}/100</strong><small>{correctCount} dari 10 jawaban benar · Nilai minimal: 70</small></div><div className="quiz__result-status">{passed ? <Check /> : '!' } {passed ? 'Nilai minimum tercapai' : 'Nilai minimum belum tercapai'}</div><footer><button type="button" className="quiz__primary" onClick={onRetry}><RotateCcw />Coba Lagi</button><button type="button" onClick={onHome}><Home />Beranda</button></footer></section>
}
