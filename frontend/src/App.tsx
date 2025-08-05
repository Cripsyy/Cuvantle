import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Game from './pages/Game';
import Analysis from './pages/Analysis';
import { getStoredSettings, saveSettings } from './utils/settings';
import { GameSettings } from './types/game';

const App: React.FC = () => {
  const [settings, setSettings] = React.useState<GameSettings>(() => getStoredSettings());

  const handleDarkModeToggle = () => {
    const newSettings = { ...settings, isDarkMode: !settings.isDarkMode };
    setSettings(newSettings);
    saveSettings(newSettings);
    
    // Apply dark mode immediately
    if (newSettings.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Apply dark mode on app start
  React.useEffect(() => {
    if (settings.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            <Home 
              isDarkMode={settings.isDarkMode} 
              onDarkModeToggle={handleDarkModeToggle} 
            />
          } 
        />
        <Route path="/game/:wordLength" element={<Game />} />
        <Route path="/analysis" element={<Analysis />} />
      </Routes>
    </Router>
  );
};

export default App;
