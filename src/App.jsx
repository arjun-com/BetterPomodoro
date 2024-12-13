import './App.css'
import Clock from './components/Clock'
import Sidebar from './components/Sidebar'
import WelcomePopup from './components/WelcomePopup'
import { ColorProvider } from './contexts/ColorContext'

function App() {
	return (
		<ColorProvider>
			<div className="w-screen h-screen overflow-hidden" style={{
				background: `linear-gradient(to bottom right, var(--bgColor1, #0f2027), var(--bgColor2, #203a43), var(--bgColor3, #2c5364))`
			}}>
				<Sidebar />
				<Clock visibility={{ phaseText: true, timer: true, controls: true }} />
				<WelcomePopup />
			</div>
		</ColorProvider>
	)
}

export default App
