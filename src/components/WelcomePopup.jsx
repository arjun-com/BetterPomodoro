import { useState, useEffect } from 'react'
import { XMarkIcon, ChartBarIcon, Cog6ToothIcon, PlayIcon, EyeIcon } from '@heroicons/react/24/outline'

function WelcomePopup() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Check if it's the user's first visit
    const hasVisited = localStorage.getItem('hasVisitedBefore')
    if (!hasVisited) {
      setIsOpen(true)
      localStorage.setItem('hasVisitedBefore', 'true')
    }
  }, [])

  if (!isOpen) return null

  const features = [
    {
      icon: <PlayIcon className="w-5 h-5" />,
      title: "Timer Controls",
      description: "Start, pause, and reset your Pomodoro sessions with simple controls"
    },
    {
      icon: <ChartBarIcon className="w-5 h-5" />,
      title: "Statistics",
      description: "Track your progress with daily Pomodoro completion stats"
    },
    {
      icon: <Cog6ToothIcon className="w-5 h-5" />,
      title: "Customization",
      description: "Personalize colors and timer durations to match your preferences"
    },
    {
      icon: <EyeIcon className="w-5 h-5" />,
      title: "Zen Mode",
      description: "Enter fullscreen for a distraction-free focus environment"
    }
  ]

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-[300] p-4">
      <div className="bg-amber-50/95 dark:bg-slate-800/95 rounded-xl 
                    w-full max-w-md relative p-6 max-h-[90vh] overflow-y-auto">
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-slate-700 dark:text-amber-100 hover:opacity-70"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <h2 className="font-jetbrains text-xl md:text-2xl mb-6 text-slate-700 dark:text-amber-100">
          Welcome to BetterPomodoro! 🍅
        </h2>

        <div className="space-y-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="flex items-start gap-4 text-slate-700 dark:text-amber-100"
            >
              <div className="p-2 bg-amber-100/50 dark:bg-slate-700/50 rounded-lg">
                {feature.icon}
              </div>
              <div>
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-slate-600 dark:text-amber-100/70">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => setIsOpen(false)}
          className="w-full mt-6 px-4 py-2 bg-amber-100/80 dark:bg-slate-700/80 
                   rounded-lg text-slate-700 dark:text-amber-100 
                   hover:bg-amber-200/80 dark:hover:bg-slate-600/80 
                   transition-colors font-medium"
        >
          Get Started
        </button>
      </div>
    </div>
  )
}

export default WelcomePopup 