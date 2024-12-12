import { useEffect, useState } from 'react'
import { PlayIcon, PauseIcon, ArrowPathIcon, PaintBrushIcon } from '@heroicons/react/24/outline'

function Clock({ visibility = { phaseText: true, timer: true, controls: true } }) {
  // Timer states
  const [timeLeft, setTimeLeft] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [timeDisplay, setTimeDisplay] = useState('')
  
  // Cycle states
  const [currentPhase, setCurrentPhase] = useState('study')
  const [cycleCount, setCycleCount] = useState(0)

  // Get settings from localStorage or use defaults
  const getSettings = () => {
    const saved = localStorage.getItem('pomodoroSettings')
    if (saved) {
      return JSON.parse(saved)
    }
    return {
      studyTime: 25 * 60,
      shortBreak: 5 * 60,
      longBreak: 15 * 60
    }
  }

  // Initialize timer based on current phase
  useEffect(() => {
    const settings = getSettings()
    let time
    switch (currentPhase) {
      case 'study':
        time = settings.studyTime
        break
      case 'shortBreak':
        time = settings.shortBreak
        break
      case 'longBreak':
        time = settings.longBreak
        break
      default:
        time = settings.studyTime
    }
    setTimeLeft(time)
  }, [currentPhase])

  // Timer logic
  useEffect(() => {
    let interval
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1)
      }, 1000)
    } else if (timeLeft === 0 && isRunning) {
      handlePhaseComplete()
    }
    return () => clearInterval(interval)
  }, [isRunning, timeLeft])

  const updateAnalytics = () => {
    const today = new Date().toISOString().split('T')[0]
    const savedAnalytics = localStorage.getItem('pomodoroAnalytics')
    const analytics = savedAnalytics ? JSON.parse(savedAnalytics) : {}
    
    analytics[today] = (analytics[today] || 0) + 1
    localStorage.setItem('pomodoroAnalytics', JSON.stringify(analytics))
  }

  const handlePhaseComplete = () => {
    if (currentPhase === 'study') {
      // Update analytics when a study session is completed
      updateAnalytics()
      
      const newCycleCount = cycleCount + 1
      setCycleCount(newCycleCount)
      
      if (newCycleCount % 4 === 0) {
        setCurrentPhase('longBreak')
      } else {
        setCurrentPhase('shortBreak')
      }
    } else {
      setCurrentPhase('study')
    }
  }

  // Format time display
  useEffect(() => {
    const formatTime = (seconds) => {
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = seconds % 60
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
    }
    setTimeDisplay(formatTime(timeLeft))
  }, [timeLeft])

  const handleStart = () => setIsRunning(true)
  const handlePause = () => setIsRunning(false)
  const handleReset = () => {
    setIsRunning(false);
    setCycleCount(0);
    setCurrentPhase('study');
    
    // Reset the timer to initial study time
    const settings = getSettings();
    setTimeLeft(settings.studyTime);
  }

  // Phase display text
  const phaseText = {
    study: 'Study Time',
    shortBreak: 'Short Break',
    longBreak: 'Long Break'
  }

  // Debug display for cycle count
  const cycleText = `Cycle ${Math.floor(cycleCount / 2) + 1} - ${cycleCount % 2 === 0 ? 'Study' : 'Break'}`

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-8 px-4 md:px-0 pointer-events-none">
      {visibility.phaseText && (
        <div className="font-jetbrains text-xl md:text-2xl text-center" style={{ color: 'var(--text-color)' }}>
          {phaseText[currentPhase]}
        </div>
      )}

      {visibility.timer && (
        <div className="font-jetbrains font-light text-6xl md:text-8xl tracking-wider" style={{ color: 'var(--clock-color)' }}>
          {timeDisplay}
        </div>
      )}

      {visibility.controls && (
        <div className="flex gap-4 md:gap-6 pointer-events-auto">
          {!isRunning ? (
            <button 
              onClick={handleStart}
              className="p-4 rounded-full transition-all duration-300
                       bg-amber-100/80 dark:bg-slate-800/80
                       hover:bg-amber-200/80 dark:hover:bg-slate-700/80
                       text-slate-700 dark:text-amber-100"
            >
              <PlayIcon className="w-8 h-8" />
            </button>
          ) : (
            <button 
              onClick={handlePause}
              className="p-4 rounded-full transition-all duration-300
                       bg-amber-100/80 dark:bg-slate-800/80
                       hover:bg-amber-200/80 dark:hover:bg-slate-700/80
                       text-slate-700 dark:text-amber-100"
            >
              <PauseIcon className="w-8 h-8" />
            </button>
          )}

          <button 
            onClick={handleReset}
            className="p-4 rounded-full transition-all duration-300
                     bg-amber-100/80 dark:bg-slate-800/80
                     hover:bg-amber-200/80 dark:hover:bg-slate-700/80
                     text-slate-700 dark:text-amber-100"
          >
            <ArrowPathIcon className="w-8 h-8" />
          </button>
        </div>
      )}
    </div>
  )
}

export default Clock
