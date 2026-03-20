
import { useEffect, useMemo, useState } from 'react'
import TheoryPage from './components/TheoryPage'
import VisualizerPage from './components/VisualizerPage'
import { EXPLAINS, LANGS, LANGUAGE_KEYS } from './data/languages'
import { buildSteps, decompose, pumped } from './utils/pumping'
import './App.css'

function App() {
  const [activePage, setActivePage] = useState('visualizer')
  const [langKey, setLangKey] = useState('firstlanguage')
  const [p, setP] = useState(3)
  const [input, setInput] = useState(LANGS.firstlanguage.suggest(3))
  const [error, setError] = useState('')
  const [x, setX] = useState('')
  const [y, setY] = useState('')
  const [z, setZ] = useState('')
  const [steps, setSteps] = useState([])
  const [stepIndex, setStepIndex] = useState(0)
  const [verdictRevealed, setVerdictRevealed] = useState(false)
  const [isAutoPlaying, setIsAutoPlaying] = useState(false)
  const [customI, setCustomI] = useState(4)
  const [useCustomI, setUseCustomI] = useState(false)

  const selectedLang = LANGS[langKey]
  const currentStep = steps[stepIndex]
  const walkthroughDone = steps.length > 0 && stepIndex === steps.length - 1
  const currentI = useCustomI && walkthroughDone
    ? Math.max(0, Number.parseInt(String(customI), 10) || 0)
    : typeof currentStep?.i === 'number'
      ? currentStep.i
      : 1

  useEffect(() => {
    if (!isAutoPlaying) return undefined
    if (stepIndex >= steps.length - 1) {
      setIsAutoPlaying(false)
      return undefined
    }

    const timer = window.setInterval(() => {
      setStepIndex((prev) => {
        if (prev >= steps.length - 1) {
          window.clearInterval(timer)
          setIsAutoPlaying(false)
          return prev
        }
        return prev + 1
      })
    }, 1500)

    return () => window.clearInterval(timer)
  }, [isAutoPlaying, stepIndex, steps.length])

  const pumpedPreview = useMemo(() => {
    if (!steps.length) return null
    const word = pumped(x, y, z, currentI)
    const ok = selectedLang.check(word)
    return { i: currentI, word, ok }
  }, [currentI, steps.length, selectedLang, x, y, z])

  function resetWalkthrough() {
    setSteps([])
    setStepIndex(0)
    setVerdictRevealed(false)
    setIsAutoPlaying(false)
    setUseCustomI(false)
    setCustomI(4)
  }

  function handleLanguageChange(next) {
    const nextP = Number.isFinite(p) && p > 0 ? p : 3
    setLangKey(next)
    setInput(LANGS[next].suggest(nextP))
    setError('')
    resetWalkthrough()
  }

  function runWalkthrough() {
    const normalized = input.trim()
    const parsedP = Number.parseInt(String(p), 10)

    if (!normalized) {
      setError('Please enter a string.')
      return
    }
    if (!parsedP || parsedP < 1) {
      setError('p must be at least 1.')
      return
    }
    if (!selectedLang.check(normalized)) {
      setError(`"${normalized}" is not in ${selectedLang.name}.`)
      return
    }
    if (normalized.length < parsedP) {
      setError(`|s| must be >= p. Here |s| = ${normalized.length} and p = ${parsedP}.`)
      return
    }

    const { xLen, yLen } = decompose(normalized, parsedP)
    const nextX = normalized.slice(0, xLen)
    const nextY = normalized.slice(xLen, xLen + yLen)
    const nextZ = normalized.slice(xLen + yLen)

    setX(nextX)
    setY(nextY)
    setZ(nextZ)
    setSteps(buildSteps({ x: nextX, y: nextY, z: nextZ, langKey, p: parsedP }))
    setStepIndex(0)
    setVerdictRevealed(false)
    setError('')
    setIsAutoPlaying(false)
    setUseCustomI(false)
    setCustomI(4)
  }

  return (
    <main className="page">
      <header className="hero">
        <p className="eyebrow">Pumping Lemma Visualizer</p>
        <h1>Learn It Step by Step</h1>
        <p className="lede">
          New to pumping lemma? Start here. This tool explains what each symbol means,
          how x, y, z are chosen, and why pumping gives a contradiction.
        </p>
      </header>

      <nav className="topNav card reveal-up" aria-label="Main">
        <button
          type="button"
          className={activePage === 'visualizer' ? 'navBtn active' : 'navBtn'}
          onClick={() => setActivePage('visualizer')}
        >
          Visualizer
        </button>
        <button
          type="button"
          className={activePage === 'theory' ? 'navBtn active' : 'navBtn'}
          onClick={() => setActivePage('theory')}
        >
          What is Pumping Lemma?
        </button>
      </nav>

      {activePage === 'visualizer' ? (
        <VisualizerPage
          langKey={langKey}
          p={p}
          input={input}
          error={error}
          selectedLang={selectedLang}
          languageKeys={LANGUAGE_KEYS}
          langs={LANGS}
          steps={steps}
          stepIndex={stepIndex}
          isAutoPlaying={isAutoPlaying}
          verdictRevealed={verdictRevealed}
          walkthroughDone={walkthroughDone}
          currentStep={currentStep}
          pumpedPreview={pumpedPreview}
          x={x}
          y={y}
          z={z}
          customI={customI}
          onLanguageChange={handleLanguageChange}
          onPChange={(value) => setP(Number.parseInt(value, 10))}
          onInputChange={(value) => {
            setInput(value)
            setError('')
          }}
          onStart={runWalkthrough}
          onSuggest={() => {
            setInput(selectedLang.suggest(p || 3))
            setError('')
          }}
          onPrevStep={() => setStepIndex((v) => Math.max(v - 1, 0))}
          onNextStep={() => setStepIndex((v) => Math.min(v + 1, steps.length - 1))}
          onToggleAuto={() => setIsAutoPlaying((v) => !v)}
          onReveal={() => setVerdictRevealed(true)}
          onCustomIChange={(value) => {
            setCustomI(value)
            setUseCustomI(true)
          }}
          onUseCustomI={() => setUseCustomI(true)}
          onUseStepI={() => setUseCustomI(false)}
          explainText={EXPLAINS[langKey]}
        />
      ) : (
        <TheoryPage />
      )}
    </main>
  )
}

export default App
