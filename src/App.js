import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ForecastPage from './pages/ForecastPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="nav-container">
            <Link to="/" className="nav-logo">🌦️ Weather</Link>
            <div className="nav-info">
              <span className="nav-tagline">Прогноз погоды</span>
            </div>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/forecast/:city" element={<ForecastPage />} />
          </Routes>
        </main>

        <footer className="footer">
          <p>Проектирование и разработка ИС</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;