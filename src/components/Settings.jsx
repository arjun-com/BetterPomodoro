import { useState, useRef, useEffect } from 'react'
import { XMarkIcon, ClockIcon, CodeBracketIcon, PaintBrushIcon, EyeIcon, ArrowsPointingOutIcon, ArrowsPointingInIcon } from '@heroicons/react/24/outline'
import { useColors } from '../contexts/ColorContext';
import { HexColorPicker } from 'react-colorful';

function ColorPickerPopover({ color, onChange, label }) {
  const [isOpen, setIsOpen] = useState(false);
  const [pickerPosition, setPickerPosition] = useState('bottom');
  const buttonRef = useRef(null);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const pickerHeight = 200; // Approximate height of the color picker

      // If there's not enough space below, show it above
      if (rect.bottom + pickerHeight > windowHeight) {
        setPickerPosition('top');
      } else {
        setPickerPosition('bottom');
      }
    }
  }, [isOpen]);

  return (
    <div className="relative">
      <label className="block text-slate-700 dark:text-amber-100 mb-2">{label}</label>
      <div className="flex items-center gap-3">
        <button
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 rounded-lg border-2 border-slate-200 dark:border-slate-600 cursor-pointer transition-transform hover:scale-105"
          style={{ backgroundColor: color }}
        />
        <input
          type="text"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="bg-slate-100 dark:bg-slate-700 px-3 py-2 rounded-lg text-slate-700 dark:text-amber-100 w-32"
        />
      </div>
      
      {isOpen && (
        <div 
          className={`absolute z-10 ${
            pickerPosition === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
          } left-0`}
        >
          <div className="fixed inset-0" onClick={() => setIsOpen(false)} />
          <div className="relative">
            <HexColorPicker
              color={color}
              onChange={onChange}
              className="shadow-xl rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function ColorPresets({ onSelect }) {
  const presets = [
    {
      name: 'Ocean Breeze',
      colors: {
        bgColor1: '#1a4b6e',
        bgColor2: '#2d7da6',
        bgColor3: '#41b0d6',
        sidebarColor: '#f8fafc',
        clockColor: '#e2e8f0',
        textColor: '#cbd5e1'
      }
    },
    {
      name: 'Sunset Glow',
      colors: {
        bgColor1: '#7c2d12',
        bgColor2: '#9a3412',
        bgColor3: '#c2410c',
        sidebarColor: '#fff7ed',
        clockColor: '#fed7aa',
        textColor: '#ffedd5'
      }
    },
    {
      name: 'Forest Mist',
      colors: {
        bgColor1: '#14532d',
        bgColor2: '#166534',
        bgColor3: '#15803d',
        sidebarColor: '#f0fdf4',
        clockColor: '#bbf7d0',
        textColor: '#dcfce7'
      }
    },
    {
      name: 'Lavender Dreams',
      colors: {
        bgColor1: '#581c87',
        bgColor2: '#7e22ce',
        bgColor3: '#9333ea',
        sidebarColor: '#faf5ff',
        clockColor: '#e9d5ff',
        textColor: '#f3e8ff'
      }
    },
    {
      name: 'Midnight Blue',
      colors: {
        bgColor1: '#0f172a',
        bgColor2: '#1e293b',
        bgColor3: '#334155',
        sidebarColor: '#f8fafc',
        clockColor: '#94a3b8',
        textColor: '#cbd5e1'
      }
    },
    {
      name: 'Cherry Blossom',
      colors: {
        bgColor1: '#831843',
        bgColor2: '#9d174d',
        bgColor3: '#be185d',
        sidebarColor: '#fdf2f8',
        clockColor: '#fbcfe8',
        textColor: '#fce7f3'
      }
    }
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-slate-700 dark:text-amber-100 font-medium">Color Presets</h3>
      <div className="grid grid-cols-2 gap-3">
        {presets.map((preset, index) => (
          <button
            key={index}
            onClick={() => onSelect(preset.colors)}
            className="p-3 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors group"
          >
            <div className="flex gap-1 mb-2">
              <div className="flex-grow h-6 rounded-l-md" style={{ backgroundColor: preset.colors.bgColor1 }} />
              <div className="flex-grow h-6" style={{ backgroundColor: preset.colors.bgColor2 }} />
              <div className="flex-grow h-6 rounded-r-md" style={{ backgroundColor: preset.colors.bgColor3 }} />
            </div>
            <div className="flex gap-1 mb-2">
              <div className="flex-grow h-3 rounded-l-md" style={{ backgroundColor: preset.colors.clockColor }} />
              <div className="flex-grow h-3" style={{ backgroundColor: preset.colors.textColor }} />
              <div className="flex-grow h-3 rounded-r-md" style={{ backgroundColor: preset.colors.sidebarColor }} />
            </div>
            <span 
              className="text-sm group-hover:font-medium"
              style={{ color: preset.colors.textColor }}
            >
              {preset.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Settings({ isOpen, onClose, onSave }) {
  const { colors, updateColors } = useColors();
  const [activeTab, setActiveTab] = useState('timer')
  const [studyTime, setStudyTime] = useState(25)
  const [shortBreak, setShortBreak] = useState(5)
  const [longBreak, setLongBreak] = useState(15)
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Load settings when modal opens
  useEffect(() => {
    if (isOpen) {
      const savedSettings = localStorage.getItem('pomodoroSettings')
      if (savedSettings) {
        const settings = JSON.parse(savedSettings)
        setStudyTime(settings.studyTime / 60) // Convert seconds back to minutes
        setShortBreak(settings.shortBreak / 60)
        setLongBreak(settings.longBreak / 60)
      } else {
        // Set default values if no settings exist
        setStudyTime(25)
        setShortBreak(5)
        setLongBreak(15)
      }
    }
  }, [isOpen])

  // Track fullscreen state
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const enterZenMode = async () => {
    try {
      await document.documentElement.requestFullscreen();
    } catch (err) {
      console.error('Error attempting to enable fullscreen:', err);
    }
  };

  const exitZenMode = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error('Error attempting to exit fullscreen:', err);
    }
  };

  const handleSave = () => {
    const settings = {
      studyTime: studyTime * 60,
      shortBreak: shortBreak * 60,
      longBreak: longBreak * 60,
      ...colors // Include current colors in settings
    };
    localStorage.setItem('pomodoroSettings', JSON.stringify(settings));
    onSave(settings);
    onClose();
  }

  const handleColorChange = (colorKey, value) => {
    const newColors = { ...colors, [colorKey]: value };
    updateColors(newColors);
  };

  const handlePresetSelect = (presetColors) => {
    updateColors(presetColors);
  };

  const tabs = [
    { id: 'timer', name: 'Timer', icon: ClockIcon },
    { id: 'appearance', name: 'Appearance', icon: PaintBrushIcon },
    { id: 'zen', name: 'Zen Mode', icon: EyeIcon },
    { id: 'github', name: 'GitHub', icon: CodeBracketIcon },
  ]

  const renderPanel = () => {
    switch (activeTab) {
      case 'timer':
        return (
          <div className="space-y-6 max-h-[60vh] overflow-y-auto px-2">
            <div className="space-y-2">
              <label className="block text-slate-700 dark:text-amber-100">Study Time (minutes)</label>
              <input
                type="number"
                min="1"
                max="60"
                value={studyTime}
                onChange={(e) => setStudyTime(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-amber-100/50 dark:bg-slate-700/50
                         text-slate-700 dark:text-amber-100
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-slate-700 dark:text-amber-100">Short Break (minutes)</label>
              <input
                type="number"
                min="1"
                max="60"
                value={shortBreak}
                onChange={(e) => setShortBreak(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-amber-100/50 dark:bg-slate-700/50
                         text-slate-700 dark:text-amber-100
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-slate-700 dark:text-amber-100">Long Break (minutes)</label>
              <input
                type="number"
                min="1"
                max="60"
                value={longBreak}
                onChange={(e) => setLongBreak(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-amber-100/50 dark:bg-slate-700/50
                         text-slate-700 dark:text-amber-100
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6 max-h-[60vh] overflow-y-auto px-2">
            <ColorPresets onSelect={handlePresetSelect} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ColorPickerPopover
                label="Background Color 1"
                color={colors.bgColor1}
                onChange={(color) => handleColorChange('bgColor1', color)}
              />
              <ColorPickerPopover
                label="Background Color 2"
                color={colors.bgColor2}
                onChange={(color) => handleColorChange('bgColor2', color)}
              />
              <ColorPickerPopover
                label="Background Color 3"
                color={colors.bgColor3}
                onChange={(color) => handleColorChange('bgColor3', color)}
              />
              <ColorPickerPopover
                label="Sidebar Color"
                color={colors.sidebarColor}
                onChange={(color) => handleColorChange('sidebarColor', color)}
              />
              <ColorPickerPopover
                label="Clock Color"
                color={colors.clockColor}
                onChange={(color) => handleColorChange('clockColor', color)}
              />
              <ColorPickerPopover
                label="Text Color"
                color={colors.textColor}
                onChange={(color) => handleColorChange('textColor', color)}
              />
            </div>
          </div>
        );

      case 'zen':
        return (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto px-2">
            <p className="text-slate-700 dark:text-amber-100">
              Zen Mode provides a distraction-free environment by hiding all UI elements except the timer.
            </p>
            <div className="flex items-center gap-4">
              {!isFullscreen ? (
                <button
                  onClick={enterZenMode}
                  className="px-4 py-2 bg-amber-100/80 dark:bg-slate-700/80 
                           rounded-lg text-slate-700 dark:text-amber-100 
                           hover:bg-amber-200/80 dark:hover:bg-slate-600/80 
                           transition-colors flex items-center gap-2"
                >
                  <ArrowsPointingOutIcon className="w-5 h-5" />
                  Enter Zen Mode
                </button>
              ) : (
                <button
                  onClick={exitZenMode}
                  className="px-4 py-2 bg-amber-100/80 dark:bg-slate-700/80 
                           rounded-lg text-slate-700 dark:text-amber-100 
                           hover:bg-amber-200/80 dark:hover:bg-slate-600/80 
                           transition-colors flex items-center gap-2"
                >
                  <ArrowsPointingInIcon className="w-5 h-5" />
                  Exit Zen Mode
                </button>
              )}
            </div>
          </div>
        );

      case 'github':
        return (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto px-2">
            <p className="text-slate-700 dark:text-amber-100">
              View the source code on GitHub
            </p>
            <a
              href="https://github.com/arjun-com/betterpomodoro"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600"
            >
              GitHub Repository
            </a>
          </div>
        );
    }
  };

  const handleClickOutside = (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center modal-overlay z-[200]"
      onClick={handleClickOutside}
    >
      <div className="bg-amber-50/95 dark:bg-slate-800/95 rounded-xl 
                    w-[95%] md:w-[500px] max-h-[90vh] overflow-y-auto
                    relative p-4 md:p-8 mx-4">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-700 dark:text-amber-100 hover:opacity-70 z-[201]"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <h2 className="font-jetbrains text-xl md:text-2xl mb-4 md:mb-6 text-slate-700 dark:text-amber-100">
          Settings
        </h2>

        <div className="flex flex-wrap gap-2 md:gap-4 mb-4 md:mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg transition-colors text-sm md:text-base ${
                activeTab === tab.id
                  ? 'bg-amber-100/80 dark:bg-slate-700/80 text-slate-700 dark:text-amber-100'
                  : 'text-slate-500 dark:text-amber-100/70 hover:bg-amber-100/60 dark:hover:bg-slate-700/60'
              }`}
            >
              <tab.icon className="w-4 h-4 md:w-5 md:h-5" />
              {tab.name}
            </button>
          ))}
        </div>

        {renderPanel()}

        <div className="mt-6 md:mt-8 flex justify-end">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-amber-100/80 dark:bg-slate-700/80 rounded-lg text-slate-700 dark:text-amber-100 hover:bg-amber-200/80 dark:hover:bg-slate-600/80 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings 