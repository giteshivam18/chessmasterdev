import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import GameSelection from './components/GameSelection';
import GameInterface from './components/GameInterface';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/game-selection" element={<GameSelection />} />
          <Route path="/game" element={<GameInterface />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
