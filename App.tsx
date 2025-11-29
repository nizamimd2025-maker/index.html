import React, { useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import InputHandler from './pages/InputHandler';
import QuizPlayer from './pages/QuizPlayer';
import SolutionResult from './pages/SolutionResult';
import ChatTutor from './pages/ChatTutor';
import History from './pages/History';
import Settings from './pages/Settings';
import { getStoredTheme } from './services/storageService';

const App: React.FC = () => {
  
  useEffect(() => {
    // Initial theme setup
    const theme = getStoredTheme();
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="input" element={<InputHandler />} />
          <Route path="quiz/:id" element={<QuizPlayer />} />
          <Route path="solution/:id" element={<SolutionResult />} />
          <Route path="tutor" element={<ChatTutor />} />
          <Route path="history" element={<History />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;