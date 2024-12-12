import { useState } from 'react'
import { ChartBarIcon, Cog6ToothIcon } from '@heroicons/react/24/outline'
import { useColors } from '../contexts/ColorContext'
import Settings from './Settings'
import Stats from './StatisticsModal'

function Sidebar() {
	const { colors } = useColors();
	const [showSettings, setShowSettings] = useState(false)
	const [showStats, setShowStats] = useState(false)

	const handleSaveSettings = (settings) => {
		localStorage.setItem('pomodoroSettings', JSON.stringify(settings))
	}

	return (
		<>
			<section className="fixed top-4 right-4 z-[100]">
				<div 
					className="flex gap-2 p-2 rounded-xl backdrop-blur-md"
					style={{ backgroundColor: `${colors.sidebarColor}65` }}
				>
					<button 
						onClick={() => setShowStats(true)}
						className="p-2.5 rounded-lg transition-all duration-300 transform hover:scale-110 hover:shadow-lg 
									dark:hover:bg-blue-900/30 hover:bg-amber-100/80 cursor-pointer"
					>
						<ChartBarIcon className="w-5 h-5 dark:text-amber-100 text-slate-700" />
					</button>

					<button 
						onClick={() => setShowSettings(true)}
						className="p-2.5 rounded-lg transition-all duration-300 transform hover:scale-110 hover:shadow-lg 
									dark:hover:bg-blue-900/30 hover:bg-amber-100/80 cursor-pointer"
					>
						<Cog6ToothIcon className="w-5 h-5 dark:text-amber-100 text-slate-700" />
					</button>
				</div>
			</section>

			<Settings 
				isOpen={showSettings}
				onClose={() => setShowSettings(false)}
				onSave={handleSaveSettings}
			/>

			<Stats 
				isOpen={showStats}
				onClose={() => setShowStats(false)}
			/>
		</>
	)
}

export default Sidebar
