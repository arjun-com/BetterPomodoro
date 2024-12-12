import { createContext, useContext, useState, useEffect } from 'react';

const ColorContext = createContext();

export function ColorProvider({ children }) {
  const [colors, setColors] = useState(() => {
    const settings = JSON.parse(localStorage.getItem('pomodoroSettings')) || {};
    return {
      bgColor1: settings.bgColor1 || '#0f172a',
      bgColor2: settings.bgColor2 || '#1e293b',
      bgColor3: settings.bgColor3 || '#334155',
      clockColor: settings.clockColor || '#94a3b8',
      textColor: settings.textColor || '#cbd5e1',
      sidebarColor: settings.sidebarColor || '#1e293b',
    };
  });

  const updateColors = (newColors) => {
    setColors(newColors);
    const root = document.documentElement;
    Object.entries(newColors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
    
    // Save to localStorage
    const settings = JSON.parse(localStorage.getItem('pomodoroSettings') || '{}');
    localStorage.setItem('pomodoroSettings', JSON.stringify({ ...settings, ...newColors }));
  };

  // Apply initial colors
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--bgColor1', colors.bgColor1);
    root.style.setProperty('--bgColor2', colors.bgColor2);
    root.style.setProperty('--bgColor3', colors.bgColor3);
    root.style.setProperty('--text-color', colors.textColor);
    root.style.setProperty('--clock-color', colors.clockColor);
  }, [colors]);

  return (
    <ColorContext.Provider value={{ colors, updateColors }}>
      {children}
    </ColorContext.Provider>
  );
}

export const useColors = () => useContext(ColorContext); 