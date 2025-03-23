import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Leaderboard } from './leaderboard';
import { Play } from './play';
import { About } from './about';
import { Components } from './components';
import { Home } from './home';
import './app.module.css';

export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-bg text-text flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/play" element={<Play />} />
            <Route path="/about" element={<About />} />
            <Route path="/components" element={<Components />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
