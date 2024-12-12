import { XMarkIcon } from '@heroicons/react/24/outline'
import Analytics from './Analytics'

function StatisticsModal({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-[200]">
      <div className="bg-amber-50/95 dark:bg-slate-800/95 rounded-xl 
                    w-[95%] md:w-[800px] h-[90vh] md:h-[500px] 
                    relative p-4 md:p-8 mx-4 overflow-hidden">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-700 dark:text-amber-100 hover:opacity-70 z-[201]"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <h2 className="font-jetbrains text-xl md:text-2xl mb-4 md:mb-6 text-slate-700 dark:text-amber-100">
          Statistics
        </h2>

        <div className="h-[calc(90vh-120px)] md:h-[400px] overflow-y-auto">
          <Analytics />
        </div>
      </div>
    </div>
  )
}

export default StatisticsModal 