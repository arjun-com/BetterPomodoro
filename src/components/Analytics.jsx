import { useEffect, useState } from 'react'
import { ChartBarIcon } from '@heroicons/react/24/outline'

function Analytics() {
  const [analytics, setAnalytics] = useState({})
  const [totalPomodoros, setTotalPomodoros] = useState(0)

  // Load analytics data and set up refresh interval
  useEffect(() => {
    const loadAnalytics = () => {
      const savedAnalytics = localStorage.getItem('pomodoroAnalytics')
      if (savedAnalytics) {
        const data = JSON.parse(savedAnalytics)
        setAnalytics(data)
        const total = Object.values(data).reduce((sum, count) => sum + count, 0)
        setTotalPomodoros(total)
      }
    }

    loadAnalytics()
    const interval = setInterval(loadAnalytics, 1000)
    return () => clearInterval(interval)
  }, [])

  // Get last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)
    return date.toISOString().split('T')[0]
  }).reverse()

  // Get counts for each day
  const dayCounts = last7Days.map(date => analytics[date] || 0)
  const maxCount = Math.max(...dayCounts, 4) // Set minimum scale to 4

  // SVG dimensions and padding
  const width = 700
  const height = 300
  const padding = 40
  const graphWidth = width - (padding * 2)
  const graphHeight = height - (padding * 2)

  // Calculate point coordinates
  const points = dayCounts.map((count, index) => ({
    x: padding + (index * (graphWidth / (dayCounts.length - 1))),
    y: height - padding - (count / maxCount * graphHeight)
  }))

  // Create SVG path
  const linePath = points.reduce((path, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`
    return `${path} L ${point.x} ${point.y}`
  }, '')

  // Create gradient path (filled area under the line)
  const gradientPath = `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`

  return (
    <div className="w-full h-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-700 dark:text-amber-100">
          <ChartBarIcon className="w-5 h-5" />
          <span>Completed Pomodoros - Last 7 Days</span>
        </div>
        <div className="text-slate-600 dark:text-amber-100/70">
          Total: {totalPomodoros}
        </div>
      </div>

      <div className="flex-1 relative">
        <svg width={width} height={height} className="w-full h-full">
          {/* Y-axis grid lines and labels */}
          {Array.from({ length: 5 }, (_, i) => {
            const y = padding + (i * (graphHeight / 4))
            const value = Math.round(maxCount - (i * (maxCount / 4)))
            return (
              <g key={i}>
                <line
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  className="stroke-slate-200 dark:stroke-slate-700"
                  strokeDasharray="4 4"
                />
                <text
                  x={padding - 10}
                  y={y}
                  className="text-xs fill-slate-500 dark:fill-amber-100/50"
                  textAnchor="end"
                  dominantBaseline="middle"
                >
                  {value}
                </text>
              </g>
            )
          })}

          {/* Gradient fill under the line */}
          <path
            d={gradientPath}
            className="fill-amber-100/20 dark:fill-slate-700/20"
          />

          {/* Line graph */}
          <path
            d={linePath}
            className="stroke-amber-500 dark:stroke-amber-300 fill-none"
            strokeWidth="2"
          />

          {/* Data points */}
          {points.map((point, index) => (
            <g key={index}>
              <circle
                cx={point.x}
                cy={point.y}
                r="4"
                className="fill-amber-500 dark:fill-amber-300"
              />
              {/* Hover target (larger invisible circle) */}
              <circle
                cx={point.x}
                cy={point.y}
                r="12"
                className="fill-transparent cursor-pointer"
                onMouseEnter={(e) => {
                  const tooltip = e.target.nextElementSibling
                  tooltip.classList.remove('opacity-0')
                }}
                onMouseLeave={(e) => {
                  const tooltip = e.target.nextElementSibling
                  tooltip.classList.add('opacity-0')
                }}
              />
              {/* Tooltip */}
              <g 
                className="opacity-0 transition-opacity duration-200"
                transform={`translate(${point.x}, ${point.y - 20})`}
              >
                <rect
                  x="-20"
                  y="-20"
                  width="40"
                  height="20"
                  rx="4"
                  className="fill-slate-800 dark:fill-amber-100"
                />
                <text
                  className="text-xs fill-white dark:fill-slate-800"
                  textAnchor="middle"
                  y="-7"
                >
                  {dayCounts[index]}
                </text>
              </g>
              {/* X-axis labels */}
              <text
                x={point.x}
                y={height - padding + 20}
                className="text-xs fill-slate-500 dark:fill-amber-100/50"
                textAnchor="middle"
              >
                {new Date(last7Days[index]).toLocaleDateString('en-US', { weekday: 'short' })}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  )
}

export default Analytics 