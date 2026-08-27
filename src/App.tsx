import { useCallback, useEffect, useMemo, useState } from 'react'
import AnalogClock from './AnalogClock'
import {
  type ClockTime,
  type Level,
  makeOptions,
  randomTime,
  toDigital,
  toNorwegian,
} from './time'
import './App.css'

type Mode = 'ov' | 'quiz'

const LEVELS: { id: Level; label: string }[] = [
  { id: 'hele', label: 'Hele timer' },
  { id: 'halve', label: 'Halve timer' },
  { id: 'kvarter', label: 'Kvarter' },
  { id: 'fem', label: 'Fem minutter' },
]

export default function App() {
  const [mode, setMode] = useState<Mode>('ov')
  const [level, setLevel] = useState<Level>('halve')

  return (
    <div className="app">
      <div className="scanlines" aria-hidden="true" />
      <header className="header">
        <h1 className="title">RETRO KLOKKE</h1>
        <p className="subtitle">Lær å lese den analoge klokka</p>
      </header>

      <nav className="tabs">
        <button
          className={`tab ${mode === 'ov' ? 'active' : ''}`}
          onClick={() => setMode('ov')}
        >
          Øv
        </button>
        <button
          className={`tab ${mode === 'quiz' ? 'active' : ''}`}
          onClick={() => setMode('quiz')}
        >
          Quiz
        </button>
      </nav>

      <div className="levels">
        {LEVELS.map((l) => (
          <button
            key={l.id}
            className={`chip ${level === l.id ? 'active' : ''}`}
            onClick={() => setLevel(l.id)}
          >
            {l.label}
          </button>
        ))}
      </div>

      {mode === 'ov' ? (
        <PracticeMode level={level} />
      ) : (
        <QuizMode level={level} />
      )}

      <footer className="footer">
        Laget for å øve på klokka · norsk bokmål
      </footer>
    </div>
  )
}

function PracticeMode({ level }: { level: Level }) {
  const [time, setTime] = useState<ClockTime>(() => randomTime(level))
  const [revealed, setRevealed] = useState(false)

  const newClock = useCallback(() => {
    setTime(randomTime(level))
    setRevealed(false)
  }, [level])

  // Regenerate when the difficulty level changes.
  useEffect(() => {
    newClock()
  }, [newClock])

  return (
    <main className="card">
      <AnalogClock time={time} />

      <div className="answer-area">
        {revealed ? (
          <>
            <p className="phrase">«klokka er {toNorwegian(time)}»</p>
            <p className="digital">{toDigital(time)}</p>
          </>
        ) : (
          <p className="hint">Hva er klokka? Trykk for å se svaret.</p>
        )}
      </div>

      <div className="controls">
        <button
          className="btn btn-primary"
          onClick={() => setRevealed((r) => !r)}
        >
          {revealed ? 'Skjul svar' : 'Vis svar'}
        </button>
        <button className="btn" onClick={newClock}>
          Ny klokke
        </button>
      </div>
    </main>
  )
}

interface Question {
  time: ClockTime
  options: ClockTime[]
}

function QuizMode({ level }: { level: Level }) {
  const [question, setQuestion] = useState<Question>(() => {
    const time = randomTime(level)
    return { time, options: makeOptions(time, level) }
  })
  const [picked, setPicked] = useState<ClockTime | null>(null)
  const [score, setScore] = useState(0)
  const [asked, setAsked] = useState(0)
  const [streak, setStreak] = useState(0)
  const [best, setBest] = useState(0)

  const nextQuestion = useCallback(() => {
    const time = randomTime(level)
    setQuestion({ time, options: makeOptions(time, level) })
    setPicked(null)
  }, [level])

  // New question set whenever the difficulty level changes.
  useEffect(() => {
    nextQuestion()
  }, [nextQuestion])

  const correctPhrase = useMemo(() => toNorwegian(question.time), [question])

  const handlePick = (opt: ClockTime) => {
    if (picked) return
    setPicked(opt)
    setAsked((a) => a + 1)
    const isCorrect = toNorwegian(opt) === correctPhrase
    if (isCorrect) {
      setScore((s) => s + 1)
      setStreak((st) => {
        const next = st + 1
        setBest((b) => Math.max(b, next))
        return next
      })
    } else {
      setStreak(0)
    }
  }

  const answered = picked !== null
  const gotItRight = answered && toNorwegian(picked) === correctPhrase

  return (
    <main className="card">
      <div className="scoreboard">
        <span className="score-item">Poeng: {score}/{asked}</span>
        <span className="score-item">Rekke: {streak}</span>
        <span className="score-item">Best: {best}</span>
      </div>

      <AnalogClock time={question.time} />

      <p className="quiz-prompt">Hva er klokka?</p>

      <div className="options">
        {question.options.map((opt, i) => {
          const phrase = toNorwegian(opt)
          const isCorrectOption = phrase === correctPhrase
          const isPicked = answered && toNorwegian(picked!) === phrase
          let cls = 'option'
          if (answered && isCorrectOption) cls += ' correct'
          else if (isPicked && !isCorrectOption) cls += ' wrong'
          return (
            <button
              key={i}
              className={cls}
              disabled={answered}
              onClick={() => handlePick(opt)}
            >
              klokka er {phrase}
            </button>
          )
        })}
      </div>

      <div className="feedback-area">
        {answered && (
          <p className={`feedback ${gotItRight ? 'ok' : 'bad'}`}>
            {gotItRight
              ? 'Riktig! Bra jobba! ★'
              : `Nesten! Klokka er ${correctPhrase} (${toDigital(question.time)})`}
          </p>
        )}
      </div>

      <div className="controls">
        <button
          className="btn btn-primary"
          onClick={nextQuestion}
          disabled={!answered}
        >
          Neste →
        </button>
      </div>
    </main>
  )
}
